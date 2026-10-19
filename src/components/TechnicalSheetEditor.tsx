import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Copy,
  Printer,
  History,
  AlertCircle,
  HelpCircle,
  Layers,
  Clock,
  Coins,
  Package,
  Scissors,
  Check,
} from 'lucide-react';
import type {
  CompanySettings,
  ComponentCategory,
  ComponentItem,
  LaborOperation,
  OverheadCost,
  TechnicalSheet,
  TechnicalSheetItem,
  UnitType,
} from '../types';
import {
  calculateItemRealQuantity,
  calculateItemTotalCost,
  calculateLaborOperationCost,
  computeTechnicalSheetCosts,
  updateSheetItem,
} from '../utils/calc';

interface TechnicalSheetEditorProps {
  sheet: TechnicalSheet;
  componentsCatalog: ComponentItem[];
  settings: CompanySettings;
  onSave: (updatedSheet: TechnicalSheet, createNewVersion: boolean) => void;
  onCancel: () => void;
  onPrint: (sheet: TechnicalSheet) => void;
}

export const TechnicalSheetEditor: React.FC<TechnicalSheetEditorProps> = ({
  sheet: initialSheet,
  componentsCatalog,
  settings,
  onSave,
  onCancel,
  onPrint,
}) => {
  const [sheet, setSheet] = useState<TechnicalSheet>({ ...initialSheet });
  const [activeSection, setActiveSection] = useState<
    'bom' | 'labor' | 'overheads' | 'general' | 'pricing'
  >('bom');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [versionBumpModal, setVersionBumpModal] = useState(false);

  // Live recalculate costs
  const costs = computeTechnicalSheetCosts(sheet);

  // Update sheet general fields
  const handleGeneralChange = <K extends keyof TechnicalSheet>(
    field: K,
    value: TechnicalSheet[K]
  ) => {
    setSheet((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString().split('T')[0],
    }));
  };

  // Add Item to BOM
  const handleAddItem = (category: ComponentCategory = 'matiere_premiere') => {
    const newItem: TechnicalSheetItem = {
      id: 'tsi-' + Date.now(),
      componentId: '',
      componentCode: 'COMP-' + (sheet.items.length + 1).toString().padStart(2, '0'),
      componentName: 'Nouveau composant',
      category,
      theoreticalQty: 1,
      unit: 'piece',
      wastePercentage: 0,
      realQty: 1,
      unitPrice: 0,
      totalCost: 0,
    };
    setSheet((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  // Select component from catalog
  const handleSelectComponentFromCatalog = (
    index: number,
    componentId: string
  ) => {
    const found = componentsCatalog.find((c) => c.id === componentId);
    if (!found) return;

    setSheet((prev) => {
      const items = [...prev.items];
      const target = items[index];
      const updated = updateSheetItem(target, {
        componentId: found.id,
        componentCode: found.code,
        componentName: found.name,
        category: found.category,
        unit: found.unit,
        unitPrice: found.unitPrice,
        wastePercentage: found.defaultWastePercentage || 0,
      });
      items[index] = updated;
      return { ...prev, items };
    });
  };

  // Update item field
  const handleItemChange = (
    index: number,
    field: keyof TechnicalSheetItem,
    value: unknown
  ) => {
    setSheet((prev) => {
      const items = [...prev.items];
      const target = items[index];
      const updates: Partial<TechnicalSheetItem> = { [field]: value };
      const updated = updateSheetItem(target, updates);
      items[index] = updated;
      return { ...prev, items };
    });
  };

  // Duplicate item
  const handleDuplicateItem = (index: number) => {
    setSheet((prev) => {
      const items = [...prev.items];
      const target = items[index];
      const copy: TechnicalSheetItem = {
        ...target,
        id: 'tsi-' + Date.now(),
        componentName: `${target.componentName} (Copie)`,
      };
      items.splice(index + 1, 0, copy);
      return { ...prev, items };
    });
  };

  // Remove item
  const handleRemoveItem = (index: number) => {
    setSheet((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  // Labor Operations Handlers
  const handleAddLaborOperation = () => {
    const newOp: LaborOperation = {
      id: 'lop-' + Date.now(),
      name: 'Nouvelle opération de confection',
      timeMinutes: 30,
      hourlyRate: 12.0,
      costType: 'hourly',
      operatorsCount: 1,
      totalCost: 6.0,
    };
    setSheet((prev) => ({
      ...prev,
      laborOperations: [...prev.laborOperations, newOp],
    }));
  };

  const handleLaborChange = (
    index: number,
    field: keyof LaborOperation,
    value: unknown
  ) => {
    setSheet((prev) => {
      const ops = [...prev.laborOperations];
      const target = { ...ops[index], [field]: value };
      target.totalCost = calculateLaborOperationCost(
        target,
        prev.batchQuantity
      );
      ops[index] = target;
      return { ...prev, laborOperations: ops };
    });
  };

  const handleRemoveLabor = (index: number) => {
    setSheet((prev) => ({
      ...prev,
      laborOperations: prev.laborOperations.filter((_, i) => i !== index),
    }));
  };

  // Overheads Handlers
  const handleAddOverhead = () => {
    const newOv: OverheadCost = {
      id: 'ov-' + Date.now(),
      name: 'Charge d’atelier additionnelle',
      allocationMethod: 'percent_labor',
      rateOrAmount: 10,
      isActive: true,
    };
    setSheet((prev) => ({
      ...prev,
      overheads: [...prev.overheads, newOv],
    }));
  };

  const handleOverheadChange = (
    index: number,
    field: keyof OverheadCost,
    value: unknown
  ) => {
    setSheet((prev) => {
      const ovs = [...prev.overheads];
      ovs[index] = { ...ovs[index], [field]: value };
      return { ...prev, overheads: ovs };
    });
  };

  const handleRemoveOverhead = (index: number) => {
    setSheet((prev) => ({
      ...prev,
      overheads: prev.overheads.filter((_, i) => i !== index),
    }));
  };

  // Trigger Save
  const handleSaveConfirmed = (bumpVersion: boolean) => {
    const updatedSheet: TechnicalSheet = {
      ...sheet,
      version: bumpVersion ? sheet.version + 1 : sheet.version,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    onSave(updatedSheet, bumpVersion);
    setVersionBumpModal(false);
    setSaveSuccessMsg('Fiche technique enregistrée avec succès !');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="space-y-5">
      {/* Top Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sticky top-16 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
            title="Retour à la liste des fiches"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                {sheet.reference}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Version {sheet.version}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  sheet.status === 'validee'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {sheet.status === 'validee' ? 'Validée' : 'Brouillon'}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-0.5">
              {sheet.name || 'Fiche Technique sans titre'}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          {saveSuccessMsg && (
            <span className="text-xs text-emerald-600 font-medium flex items-center mr-2 animate-fade-in">
              <Check className="w-4 h-4 mr-1" /> {saveSuccessMsg}
            </span>
          )}
          <button
            onClick={() => onPrint(sheet)}
            className="flex items-center px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition"
          >
            <Printer className="w-4 h-4 mr-1.5" />
            Imprimer / PDF
          </button>
          <button
            onClick={() => setVersionBumpModal(true)}
            className="flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-semibold shadow transition"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Enregistrer
          </button>
        </div>
      </div>

      {/* Main Grid: 2/3 Content Editor + 1/3 Live Cost Breakdown Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Tables */}
        <div className="lg:col-span-2 space-y-5">
          {/* Section Navigation Tabs */}
          <div className="flex space-x-1 border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm overflow-x-auto text-xs sm:text-sm">
            <button
              onClick={() => setActiveSection('bom')}
              className={`flex items-center px-3.5 py-2 rounded-lg font-medium transition ${
                activeSection === 'bom'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4 mr-1.5" />
              Nomenclature Matières ({sheet.items.length})
            </button>
            <button
              onClick={() => setActiveSection('labor')}
              className={`flex items-center px-3.5 py-2 rounded-lg font-medium transition ${
                activeSection === 'labor'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Scissors className="w-4 h-4 mr-1.5" />
              Main-d&apos;œuvre ({sheet.laborOperations.length})
            </button>
            <button
              onClick={() => setActiveSection('overheads')}
              className={`flex items-center px-3.5 py-2 rounded-lg font-medium transition ${
                activeSection === 'overheads'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4 mr-1.5" />
              Frais d&apos;Atelier ({sheet.overheads.length})
            </button>
            <button
              onClick={() => setActiveSection('pricing')}
              className={`flex items-center px-3.5 py-2 rounded-lg font-medium transition ${
                activeSection === 'pricing'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Coins className="w-4 h-4 mr-1.5" />
              Marges & Prix
            </button>
            <button
              onClick={() => setActiveSection('general')}
              className={`flex items-center px-3.5 py-2 rounded-lg font-medium transition ${
                activeSection === 'general'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Infos Produit
            </button>
          </div>

          {/* SECTION A: BOM NOMENCLATURE */}
          {activeSection === 'bom' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-bold text-slate-800 text-base flex items-center">
                    <Package className="w-5 h-5 mr-2 text-amber-600" />
                    Nomenclature Complète & Pertes Matières
                  </h2>
                  <p className="text-xs text-slate-500">
                    Formule : Qté Réelle = Qté Théorique × (1 + Taux Perte %) | Coût Ligne = Qté Réelle × Prix Unitaire
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleAddItem('matiere_premiere')}
                    className="flex items-center px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold border border-amber-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    + Matière
                  </button>
                  <button
                    onClick={() => handleAddItem('fourniture_accessoire')}
                    className="flex items-center px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-semibold border border-sky-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    + Fourniture
                  </button>
                  <button
                    onClick={() => handleAddItem('emballage')}
                    className="flex items-center px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold border border-indigo-200 transition"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    + Emballage
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-2">Catégorie</th>
                      <th className="py-2.5 px-2">Composant / Matière</th>
                      <th className="py-2.5 px-2 text-right">Qté Théorique</th>
                      <th className="py-2.5 px-2">Unité</th>
                      <th className="py-2.5 px-2 text-right">Perte %</th>
                      <th className="py-2.5 px-2 text-right text-amber-700">Qté Réelle</th>
                      <th className="py-2.5 px-2 text-right">Prix Unit. ({settings.currencySymbol})</th>
                      <th className="py-2.5 px-2 text-right text-slate-900 font-bold">Total ({settings.currencySymbol})</th>
                      <th className="py-2.5 px-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheet.items.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="py-8 text-center text-slate-400 italic"
                        >
                          Aucun composant dans la nomenclature. Cliquez sur un des boutons ci-dessus pour ajouter des matières.
                        </td>
                      </tr>
                    ) : (
                      sheet.items.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition">
                          {/* Category */}
                          <td className="py-2 px-1">
                            <select
                              value={item.category}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  'category',
                                  e.target.value as ComponentCategory
                                )
                              }
                              className="py-1 px-1.5 rounded border border-slate-200 text-[11px] bg-white focus:ring-1 focus:ring-amber-500"
                            >
                              <option value="matiere_premiere">Matière 1ère</option>
                              <option value="fourniture_accessoire">Fourniture / Acc.</option>
                              <option value="consommable">Consommable</option>
                              <option value="emballage">Emballage</option>
                            </select>
                          </td>

                          {/* Component Selector & Name */}
                          <td className="py-2 px-1 min-w-[200px]">
                            <div className="space-y-1">
                              {/* Quick catalog dropdown */}
                              <select
                                value={item.componentId}
                                onChange={(e) =>
                                  handleSelectComponentFromCatalog(
                                    idx,
                                    e.target.value
                                  )
                                }
                                className="w-full py-0.5 px-1.5 rounded border border-slate-200 text-[11px] text-slate-500 bg-slate-50/50"
                              >
                                <option value="">Choisir depuis catalogue...</option>
                                {componentsCatalog
                                  .filter((c) => c.category === item.category)
                                  .map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.code} - {c.name} ({c.unitPrice} {settings.currencySymbol}/{c.unit})
                                    </option>
                                  ))}
                              </select>
                              <input
                                type="text"
                                value={item.componentName}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    'componentName',
                                    e.target.value
                                  )
                                }
                                placeholder="Désignation"
                                className="w-full py-1 px-1.5 rounded border border-slate-300 font-medium text-slate-800"
                              />
                            </div>
                          </td>

                          {/* Theoretical Qty */}
                          <td className="py-2 px-1 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={item.theoreticalQty}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  'theoreticalQty',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-16 py-1 px-1.5 rounded border border-slate-300 text-right font-mono"
                            />
                          </td>

                          {/* Unit */}
                          <td className="py-2 px-1">
                            <select
                              value={item.unit}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  'unit',
                                  e.target.value as UnitType
                                )
                              }
                              className="py-1 px-1 rounded border border-slate-200 text-[11px]"
                            >
                              <option value="m">mètre (m)</option>
                              <option value="cm">cm</option>
                              <option value="m2">mètre² (m²)</option>
                              <option value="kg">kilo (kg)</option>
                              <option value="g">gramme (g)</option>
                              <option value="l">litre (L)</option>
                              <option value="ml">ml</option>
                              <option value="piece">pièce</option>
                              <option value="rouleau">rouleau</option>
                              <option value="paquet">paquet</option>
                              <option value="boite">boîte</option>
                              <option value="heure">heure</option>
                            </select>
                          </td>

                          {/* Waste % */}
                          <td className="py-2 px-1 text-right">
                            <div className="flex items-center justify-end space-x-1">
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                max="100"
                                value={item.wastePercentage}
                                onChange={(e) =>
                                  handleItemChange(
                                    idx,
                                    'wastePercentage',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-14 py-1 px-1 rounded border border-slate-300 text-right font-mono"
                              />
                              <span className="text-slate-400 text-[11px]">%</span>
                            </div>
                          </td>

                          {/* Real Qty (Computed) */}
                          <td className="py-2 px-1 text-right font-mono font-semibold text-amber-700 bg-amber-50/40 rounded">
                            {item.realQty}
                          </td>

                          {/* Unit Price */}
                          <td className="py-2 px-1 text-right">
                            <input
                              type="number"
                              step="0.001"
                              min="0"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleItemChange(
                                  idx,
                                  'unitPrice',
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className="w-20 py-1 px-1.5 rounded border border-slate-300 text-right font-mono"
                            />
                          </td>

                          {/* Total Cost Line */}
                          <td className="py-2 px-1 text-right font-mono font-bold text-slate-900">
                            {item.totalCost.toFixed(3)}
                          </td>

                          {/* Actions */}
                          <td className="py-2 px-1 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleDuplicateItem(idx)}
                              className="p-1 text-slate-400 hover:text-sky-600 rounded"
                              title="Dupliquer la ligne"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleRemoveItem(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded ml-1"
                              title="Supprimer la ligne"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION B: LABOR OPERATIONS */}
          {activeSection === 'labor' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-bold text-slate-800 text-base flex items-center">
                    <Scissors className="w-5 h-5 mr-2 text-indigo-600" />
                    Opérations de Fabrication & Main-d&apos;œuvre
                  </h2>
                  <p className="text-xs text-slate-500">
                    Calcul horaire (Temps / 60 × Taux horaire × Opérateurs) ou tarif forfaitaire par pièce
                  </p>
                </div>

                <button
                  onClick={handleAddLaborOperation}
                  className="flex items-center px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow transition"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Ajouter une Opération
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-2">Poste / Opération</th>
                      <th className="py-2.5 px-2">Type Coût</th>
                      <th className="py-2.5 px-2 text-right">Temps (min)</th>
                      <th className="py-2.5 px-2 text-right">Taux Horaire / Pièce ({settings.currencySymbol})</th>
                      <th className="py-2.5 px-2 text-center">Opérateurs</th>
                      <th className="py-2.5 px-2 text-right font-bold text-slate-900">Coût Total ({settings.currencySymbol})</th>
                      <th className="py-2.5 px-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sheet.laborOperations.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-8 text-center text-slate-400 italic"
                        >
                          Aucune opération de main-d&apos;œuvre enregistrée.
                        </td>
                      </tr>
                    ) : (
                      sheet.laborOperations.map((op, idx) => (
                        <tr key={op.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-2 px-2 min-w-[200px]">
                            <input
                              type="text"
                              value={op.name}
                              onChange={(e) =>
                                handleLaborChange(idx, 'name', e.target.value)
                              }
                              placeholder="ex: Coupe, Broderie, Assemblage..."
                              className="w-full py-1 px-2 rounded border border-slate-300 font-medium"
                            />
                          </td>

                          <td className="py-2 px-1">
                            <select
                              value={op.costType}
                              onChange={(e) =>
                                handleLaborChange(
                                  idx,
                                  'costType',
                                  e.target.value as 'hourly' | 'piece'
                                )
                              }
                              className="py-1 px-1.5 rounded border border-slate-200 text-[11px]"
                            >
                              <option value="hourly">Taux Horaire</option>
                              <option value="piece">Au Pièce / Forfait</option>
                            </select>
                          </td>

                          <td className="py-2 px-1 text-right">
                            {op.costType === 'hourly' ? (
                              <input
                                type="number"
                                min="0"
                                value={op.timeMinutes}
                                onChange={(e) =>
                                  handleLaborChange(
                                    idx,
                                    'timeMinutes',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-16 py-1 px-1.5 rounded border border-slate-300 text-right font-mono"
                              />
                            ) : (
                              <span className="text-slate-400 italic">N/A</span>
                            )}
                          </td>

                          <td className="py-2 px-1 text-right">
                            {op.costType === 'hourly' ? (
                              <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={op.hourlyRate}
                                onChange={(e) =>
                                  handleLaborChange(
                                    idx,
                                    'hourlyRate',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-20 py-1 px-1.5 rounded border border-slate-300 text-right font-mono"
                              />
                            ) : (
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={op.pieceRate || 0}
                                onChange={(e) =>
                                  handleLaborChange(
                                    idx,
                                    'pieceRate',
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className="w-20 py-1 px-1.5 rounded border border-slate-300 text-right font-mono"
                              />
                            )}
                          </td>

                          <td className="py-2 px-1 text-center">
                            <input
                              type="number"
                              min="1"
                              value={op.operatorsCount}
                              onChange={(e) =>
                                handleLaborChange(
                                  idx,
                                  'operatorsCount',
                                  parseInt(e.target.value, 10) || 1
                                )
                              }
                              className="w-12 py-1 px-1 rounded border border-slate-300 text-center font-mono"
                            />
                          </td>

                          <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                            {calculateLaborOperationCost(
                              op,
                              sheet.batchQuantity
                            ).toFixed(3)}
                          </td>

                          <td className="py-2 px-1 text-center">
                            <button
                              onClick={() => handleRemoveLabor(idx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION C: OVERHEADS */}
          {activeSection === 'overheads' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h2 className="font-bold text-slate-800 text-base flex items-center">
                    <Layers className="w-5 h-5 mr-2 text-teal-600" />
                    Frais Indirects & Charges d&apos;Atelier
                  </h2>
                  <p className="text-xs text-slate-500">
                    Électricité, loyer atelier, maintenance des machines, amortissements ou clés configurables
                  </p>
                </div>

                <button
                  onClick={handleAddOverhead}
                  className="flex items-center px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow transition"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Ajouter une Charge
                </button>
              </div>

              <div className="space-y-3">
                {sheet.overheads.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 italic">
                    Aucun frais indirect configuré pour ce produit.
                  </div>
                ) : (
                  sheet.overheads.map((ov, idx) => (
                    <div
                      key={ov.id}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={ov.isActive}
                            onChange={(e) =>
                              handleOverheadChange(
                                idx,
                                'isActive',
                                e.target.checked
                              )
                            }
                            className="rounded text-amber-600"
                          />
                          <input
                            type="text"
                            value={ov.name}
                            onChange={(e) =>
                              handleOverheadChange(idx, 'name', e.target.value)
                            }
                            placeholder="Nom de la charge (ex: Électricité, Entretien)"
                            className="flex-1 py-1 px-2 rounded border border-slate-300 font-semibold text-slate-800"
                          />
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div>
                          <label className="text-[11px] text-slate-500 block">
                            Méthode de Répartition
                          </label>
                          <select
                            value={ov.allocationMethod}
                            onChange={(e) =>
                              handleOverheadChange(
                                idx,
                                'allocationMethod',
                                e.target.value
                              )
                            }
                            className="py-1 px-2 rounded border border-slate-300 bg-white"
                          >
                            <option value="percent_material">% du coût matières</option>
                            <option value="percent_labor">% du coût main-d&apos;œuvre</option>
                            <option value="fixed_per_unit">Montant fixe par unité</option>
                            <option value="hourly_rate">Par heure de confection</option>
                            <option value="batch_spread">Forfait global sur le lot</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] text-slate-500 block">
                            Valeur (% ou {settings.currencySymbol})
                          </label>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={ov.rateOrAmount}
                            onChange={(e) =>
                              handleOverheadChange(
                                idx,
                                'rateOrAmount',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-20 py-1 px-2 rounded border border-slate-300 text-right font-mono"
                          />
                        </div>

                        <button
                          onClick={() => handleRemoveOverhead(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded self-end mb-0.5"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* SECTION D: PRICING & MARGINS */}
          {activeSection === 'pricing' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-base flex items-center">
                  <Coins className="w-5 h-5 mr-2 text-emerald-600" />
                  Stratégie de Marges Commerciales & Prix de Vente
                </h2>
                <p className="text-xs text-slate-500">
                  Définissez votre politique tarifaire : marge sur le prix de vente ou majoration sur le coût.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                  <label className="text-xs font-bold text-slate-700 block">
                    Méthode de Calcul du Prix de Vente
                  </label>
                  <div className="space-y-2 text-xs">
                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="marginStrategy"
                        value="target_margin"
                        checked={sheet.marginStrategy === 'target_margin'}
                        onChange={() =>
                          handleGeneralChange('marginStrategy', 'target_margin')
                        }
                        className="mt-0.5 text-amber-600"
                      />
                      <div>
                        <span className="font-semibold text-slate-800">
                          Marge cible sur le prix de vente (Taux de marque)
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Formule : Prix = Coût / (1 − Taux de marge)
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="marginStrategy"
                        value="cost_markup"
                        checked={sheet.marginStrategy === 'cost_markup'}
                        onChange={() =>
                          handleGeneralChange('marginStrategy', 'cost_markup')
                        }
                        className="mt-0.5 text-amber-600"
                      />
                      <div>
                        <span className="font-semibold text-slate-800">
                          Majoration appliquée sur le coût (Taux de marge)
                        </span>
                        <p className="text-[11px] text-slate-500">
                          Formule : Prix = Coût × (1 + Majoration)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Taux de Marge Cible (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="99"
                        value={sheet.targetMarginRate}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value) || 0;
                          handleGeneralChange(
                            'targetMarginRate',
                            Math.min(99, Math.max(0, val))
                          );
                        }}
                        className="w-24 py-1.5 px-2.5 rounded border border-slate-300 font-mono font-bold text-slate-900 text-sm"
                      />
                      <span className="text-slate-500 text-sm font-semibold">%</span>
                    </div>
                    {sheet.targetMarginRate >= 80 && (
                      <p className="text-[11px] text-amber-600 mt-1 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Taux élevé : vérifiez l’acceptabilité sur votre marché.
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Taux de TVA (%)
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        step="1"
                        min="0"
                        max="100"
                        value={sheet.vatRate}
                        onChange={(e) =>
                          handleGeneralChange(
                            'vatRate',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-24 py-1.5 px-2.5 rounded border border-slate-300 font-mono font-bold text-slate-900 text-sm"
                      />
                      <span className="text-slate-500 text-sm font-semibold">%</span>
                      <span className="text-xs text-slate-400">
                        (Régime Tunisie : 19% standard, 7% ou exonéré)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION E: GENERAL PRODUCT INFO */}
          {activeSection === 'general' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-base">
                  Informations Générales & Spécifications Produit
                </h2>
                <p className="text-xs text-slate-500">
                  Caractéristiques du produit, lot de fabrication de référence et statut
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Référence Produit
                  </label>
                  <input
                    type="text"
                    value={sheet.reference}
                    onChange={(e) => handleGeneralChange('reference', e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Désignation / Nom du Produit
                  </label>
                  <input
                    type="text"
                    value={sheet.name}
                    onChange={(e) => handleGeneralChange('name', e.target.value)}
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300 font-medium"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Catégorie de Produit
                  </label>
                  <input
                    type="text"
                    value={sheet.category}
                    onChange={(e) => handleGeneralChange('category', e.target.value)}
                    placeholder="ex: Vêtements traditionnels, Maroquinerie..."
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Statut de la Fiche
                  </label>
                  <select
                    value={sheet.status}
                    onChange={(e) =>
                      handleGeneralChange(
                        'status',
                        e.target.value as 'brouillon' | 'validee' | 'archivee'
                      )
                    }
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="brouillon">Brouillon</option>
                    <option value="validee">Validée pour Production</option>
                    <option value="archivee">Archivée</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Quantité de Référence pour Fabrication (Lot)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sheet.batchQuantity}
                    onChange={(e) =>
                      handleGeneralChange(
                        'batchQuantity',
                        parseInt(e.target.value, 10) || 1
                      )
                    }
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Unité de Production & Rendement Réel (%)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={sheet.productionUnit}
                      onChange={(e) =>
                        handleGeneralChange('productionUnit', e.target.value)
                      }
                      placeholder="pièce, lot..."
                      className="py-1.5 px-2.5 rounded border border-slate-300"
                    />
                    <div className="flex items-center space-x-1">
                      <input
                        type="number"
                        min="50"
                        max="100"
                        value={sheet.productionYieldRate}
                        onChange={(e) =>
                          handleGeneralChange(
                            'productionYieldRate',
                            parseFloat(e.target.value) || 100
                          )
                        }
                        className="w-full py-1.5 px-2 rounded border border-slate-300 font-mono text-right"
                      />
                      <span className="text-slate-400">%</span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    URL du Visuel / Photo Produit
                  </label>
                  <input
                    type="text"
                    value={sheet.imageUrl || ''}
                    onChange={(e) => handleGeneralChange('imageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full py-1.5 px-2.5 rounded border border-slate-300 text-xs text-slate-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Description & Observations Techniques
                  </label>
                  <textarea
                    rows={3}
                    value={sheet.description}
                    onChange={(e) =>
                      handleGeneralChange('description', e.target.value)
                    }
                    placeholder="Spécifications, finitions, recommandations de lavage ou de manipulation..."
                    className="w-full p-2.5 rounded border border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Sticky Cost Engine Calculation Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sticky top-36 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                Calculateur Automatique
              </span>
              <h3 className="font-bold text-slate-900 text-base">
                Synthèse Financière & Coûts
              </h3>
              <p className="text-xs text-slate-400">
                Lot de {sheet.batchQuantity} {sheet.productionUnit} ({costs.goodUnitsObtained} pièce(s) bonne(s))
              </p>
            </div>

            {/* Direct Materials Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Matières premières :</span>
                <span className="font-mono font-medium">
                  {costs.rawMaterialsCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Fournitures & accessoires :</span>
                <span className="font-mono font-medium">
                  {costs.suppliesCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Consommables :</span>
                <span className="font-mono font-medium">
                  {costs.consumablesCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Emballages :</span>
                <span className="font-mono font-medium">
                  {costs.packagingCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>

              {/* Scrap waste cost alert */}
              <div className="p-2 rounded bg-amber-50/60 border border-amber-200/60 flex justify-between text-amber-800 text-[11px]">
                <span>Incidence des pertes matières :</span>
                <span className="font-mono font-bold">
                  +{costs.wasteCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>

              <div className="border-t border-slate-100 pt-1.5 flex justify-between font-semibold text-slate-800">
                <span>Total matières directes :</span>
                <span className="font-mono">
                  {costs.totalDirectMaterialsCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>

              {/* Labor */}
              <div className="flex justify-between text-slate-600">
                <span>Main-d&apos;œuvre ({costs.totalLaborHours} h) :</span>
                <span className="font-mono font-medium">
                  {costs.laborCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>

              {/* Overheads */}
              <div className="flex justify-between text-slate-600">
                <span>Frais d&apos;atelier & indirects :</span>
                <span className="font-mono font-medium">
                  {costs.overheadsCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>

              {/* Total Batch Cost */}
              <div className="border-t border-slate-200 pt-2 flex justify-between text-slate-700 font-bold">
                <span>Coût Total du Lot :</span>
                <span className="font-mono">
                  {costs.totalBatchCost.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>
            </div>

            {/* KEY RESULT: UNIT COST PRICE */}
            <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-1">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Coût de Revient Unitaire
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400">
                {costs.unitCostPrice.toFixed(3)} {settings.currencySymbol}
              </div>
              <div className="text-[11px] text-slate-400">
                Rendement de fabrication : {sheet.productionYieldRate}%
              </div>
            </div>

            {/* COMMERCIAL PRICING BOX */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-emerald-900">
                  Prix de Vente Conseillé HT
                </span>
                <span className="font-bold font-mono text-base text-emerald-800">
                  {costs.suggestedSellingPriceHT.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Prix de Vente TTC (TVA {sheet.vatRate}%) :</span>
                <span className="font-mono font-semibold text-slate-800">
                  {costs.suggestedSellingPriceTTC.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>

              <div className="border-t border-emerald-200/80 pt-2 flex justify-between text-emerald-800 font-medium">
                <span>Marge Brute Unitaire :</span>
                <span className="font-mono font-bold">
                  +{costs.previsionalGrossMarginUnit.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                <div className="bg-white p-1.5 rounded border border-emerald-200 text-center">
                  <div className="text-slate-500">Taux de Marque</div>
                  <div className="font-bold text-emerald-700">
                    {costs.actualMarginOnSalesRate}%
                  </div>
                </div>
                <div className="bg-white p-1.5 rounded border border-emerald-200 text-center">
                  <div className="text-slate-500">Taux de Marge</div>
                  <div className="font-bold text-emerald-700">
                    {costs.actualMarkupOnCostRate}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Version Bump Modal Dialog */}
      {versionBumpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Confirmation de Sauvegarde de la Fiche
            </h3>
            <p className="text-xs text-slate-600">
              Souhaitez-vous enregistrer les modifications en incrémentant le numéro de version (créant un historique d&apos;archivage pour comparatif) ou mettre à jour la version courante (v{sheet.version}) ?
            </p>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1">
              <div><strong>Nouveau coût unitaire :</strong> {costs.unitCostPrice.toFixed(3)} {settings.currencySymbol}</div>
              <div><strong>Prix de vente conseillé :</strong> {costs.suggestedSellingPriceHT.toFixed(3)} {settings.currencySymbol}</div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setVersionBumpModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => handleSaveConfirmed(false)}
                className="px-3 py-1.5 text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg"
              >
                Mettre à jour v{sheet.version}
              </button>
              <button
                onClick={() => handleSaveConfirmed(true)}
                className="px-3.5 py-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg shadow"
              >
                Créer Version {sheet.version + 1}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
