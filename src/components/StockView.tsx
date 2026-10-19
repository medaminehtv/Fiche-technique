import React, { useState } from 'react';
import {
  Boxes,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertTriangle,
  Plus,
  Play,
  CheckCircle,
  FileSpreadsheet,
  Calendar,
} from 'lucide-react';
import type {
  CompanySettings,
  ComponentItem,
  ProductionBatchOrder,
  StockMovement,
  TechnicalSheet,
} from '../types';

interface StockViewProps {
  components: ComponentItem[];
  stockMovements: StockMovement[];
  sheets: TechnicalSheet[];
  batchOrders: ProductionBatchOrder[];
  settings: CompanySettings;
  onNewMovement: (mov: StockMovement) => void;
  onLaunchProductionBatch: (
    sheet: TechnicalSheet,
    batchCode: string,
    plannedQty: number,
    deductStockNow: boolean
  ) => void;
}

export const StockView: React.FC<StockViewProps> = ({
  components,
  stockMovements,
  sheets,
  batchOrders,
  settings,
  onNewMovement,
  onLaunchProductionBatch,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'movements' | 'production'>('status');
  const [searchTerm, setSearchTerm] = useState('');
  const [isManualMovementOpen, setIsManualMovementOpen] = useState(false);
  const [isLaunchBatchOpen, setIsLaunchBatchOpen] = useState(false);

  // Manual movement form state
  const [movementComponentId, setMovementComponentId] = useState(
    components[0]?.id || ''
  );
  const [movementType, setMovementType] = useState<
    'in' | 'out' | 'adjustment'
  >('in');
  const [movementQty, setMovementQty] = useState<number>(10);
  const [movementPrice, setMovementPrice] = useState<number>(0);
  const [movementRefDoc, setMovementRefDoc] = useState<string>('');
  const [movementNotes, setMovementNotes] = useState<string>('');

  // Production batch launch state
  const [batchSheetId, setBatchSheetId] = useState(sheets[0]?.id || '');
  const [batchCode, setBatchCode] = useState(
    'OF-' + new Date().getFullYear() + '-' + (batchOrders.length + 1).toString().padStart(3, '0')
  );
  const [batchPlannedQty, setBatchPlannedQty] = useState<number>(10);
  const [batchDeductStock, setBatchDeductStock] = useState<boolean>(true);

  const selectedBatchSheet = sheets.find((s) => s.id === batchSheetId);

  // Pre-calculate needed components for the proposed batch
  const neededComponents = selectedBatchSheet
    ? selectedBatchSheet.items.map((item) => {
        const comp = components.find((c) => c.id === item.componentId);
        // Quantity needed for batch = (realQty per unit / batchQty of sheet) * batchPlannedQty
        const multiplier =
          batchPlannedQty / Math.max(1, selectedBatchSheet.batchQuantity);
        const qtyNeeded = Number((item.realQty * multiplier).toFixed(3));
        const currentStock = comp ? comp.stockQty : 0;
        const isSufficient = !comp?.stockEnabled || currentStock >= qtyNeeded;

        return {
          item,
          comp,
          qtyNeeded,
          currentStock,
          isSufficient,
        };
      })
    : [];

  const hasMissingStock = neededComponents.some((n) => !n.isSufficient);

  const handleSaveMovement = (e: React.FormEvent) => {
    e.preventDefault();
    const comp = components.find((c) => c.id === movementComponentId);
    if (!comp) return;

    const newMov: StockMovement = {
      id: 'mov-' + Date.now(),
      componentId: comp.id,
      componentCode: comp.code,
      componentName: comp.name,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: movementType,
      quantity:
        movementType === 'out'
          ? -Math.abs(movementQty)
          : Math.abs(movementQty),
      unitPrice: movementPrice || comp.unitPrice,
      referenceDoc: movementRefDoc || 'MVT-MANUEL',
      notes: movementNotes,
    };

    onNewMovement(newMov);
    setIsManualMovementOpen(false);
    setMovementRefDoc('');
    setMovementNotes('');
  };

  const handleConfirmBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBatchSheet) return;
    onLaunchProductionBatch(
      selectedBatchSheet,
      batchCode,
      batchPlannedQty,
      batchDeductStock
    );
    setIsLaunchBatchOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <Boxes className="w-5 h-5 mr-2 text-sky-600" />
            Gestion des Stocks & Sorties de Fabrication
          </h1>
          <p className="text-xs text-slate-500">
            Suivi des disponibilités, alertes de seuil minimal, entrées/sorties et déstockage contrôlé par lot de fabrication
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsManualMovementOpen(true)}
            className="flex items-center px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Mouvement Manuel
          </button>
          <button
            onClick={() => setIsLaunchBatchOpen(true)}
            className="flex items-center px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow transition"
          >
            <Play className="w-3.5 h-3.5 mr-1" />
            Lancer un Ordre de Fabrication (OF)
          </button>
        </div>
      </div>

      {/* Navigation sub-tabs */}
      <div className="flex space-x-2 border-b border-slate-200 bg-white p-1 rounded-xl shadow-sm">
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            activeTab === 'status'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Niveaux de Stocks ({components.filter((c) => c.stockEnabled).length})
        </button>
        <button
          onClick={() => setActiveTab('production')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            activeTab === 'production'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Ordres de Fabrication ({batchOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`px-4 py-2 rounded-lg text-xs font-medium transition ${
            activeTab === 'movements'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Journal des Mouvements ({stockMovements.length})
        </button>
      </div>

      {/* TAB 1: CURRENT STOCK STATUS */}
      {activeTab === 'status' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between">
            <input
              type="text"
              placeholder="Filtrer un composant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-1 px-3 rounded-lg border border-slate-300 text-xs w-64"
            />
            <span className="text-xs text-slate-500">
              Valorisation des stocks au Coût Moyen Unitaire Pondéré (CMUP)
            </span>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Désignation</th>
                  <th className="py-2.5 px-3">Unité</th>
                  <th className="py-2.5 px-3 text-right">Prix Moyen ({settings.currencySymbol})</th>
                  <th className="py-2.5 px-3 text-right">Seuil Mini</th>
                  <th className="py-2.5 px-3 text-right">Disponible</th>
                  <th className="py-2.5 px-3 text-right font-bold text-slate-900">Valeur Totale ({settings.currencySymbol})</th>
                  <th className="py-2.5 px-3 text-center">État Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {components
                  .filter((c) => c.stockEnabled)
                  .filter((c) =>
                    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.code.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((comp) => {
                    const isLow = comp.stockQty <= comp.stockMin;
                    const totalVal = comp.stockQty * comp.unitPrice;
                    return (
                      <tr key={comp.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 font-bold text-slate-700">{comp.code}</td>
                        <td className="py-2.5 px-3 font-sans font-medium text-slate-900">{comp.name}</td>
                        <td className="py-2.5 px-3 font-sans text-slate-500">{comp.unit}</td>
                        <td className="py-2.5 px-3 text-right">{comp.unitPrice.toFixed(3)}</td>
                        <td className="py-2.5 px-3 text-right text-slate-500">{comp.stockMin}</td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {comp.stockQty}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                          {totalVal.toFixed(3)}
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          {isLow ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                              Alerte Seuil Bas
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              Normal
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTION BATCH ORDERS */}
      {activeTab === 'production' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">
              Ordres de Fabrication (OF) & Traçabilité de Consommation
            </h3>
            <button
              onClick={() => setIsLaunchBatchOpen(true)}
              className="text-xs font-semibold text-sky-600 hover:text-sky-700"
            >
              + Nouvel Ordre
            </button>
          </div>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">N° Ordre (OF)</th>
                  <th className="py-2.5 px-3">Réf. Produit</th>
                  <th className="py-2.5 px-3">Désignation</th>
                  <th className="py-2.5 px-3 text-right">Qté Prévue</th>
                  <th className="py-2.5 px-3">Date Lancement</th>
                  <th className="py-2.5 px-3 text-center">Déstockage</th>
                  <th className="py-2.5 px-3 text-center">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {batchOrders.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {batch.batchCode}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {batch.productReference}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-900">
                      {batch.productName}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      {batch.plannedQty}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">{batch.startDate}</td>
                    <td className="py-2.5 px-3 text-center">
                      {batch.stockDeducted ? (
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                          Stock Déduit ✓
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          batch.status === 'completed'
                            ? 'bg-slate-100 text-slate-700'
                            : 'bg-sky-100 text-sky-700'
                        }`}
                      >
                        {batch.status === 'completed'
                          ? 'Terminé'
                          : batch.status === 'in_progress'
                          ? 'En Atelier'
                          : 'Planifié'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: STOCK MOVEMENTS JOURNAL */}
      {activeTab === 'movements' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Composant</th>
                  <th className="py-2.5 px-3 text-right">Quantité</th>
                  <th className="py-2.5 px-3">Réf. Pièce</th>
                  <th className="py-2.5 px-3">Observations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stockMovements.map((mov) => (
                  <tr key={mov.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-2.5 px-3 text-slate-500 whitespace-nowrap">
                      {mov.date}
                    </td>
                    <td className="py-2.5 px-3">
                      {mov.type === 'in' ? (
                        <span className="flex items-center text-emerald-700 font-semibold">
                          <ArrowDownLeft className="w-3.5 h-3.5 mr-1" /> Entrée BL
                        </span>
                      ) : mov.type === 'production_batch' ? (
                        <span className="flex items-center text-amber-700 font-semibold">
                          <ArrowUpRight className="w-3.5 h-3.5 mr-1" /> Sortie OF
                        </span>
                      ) : (
                        <span className="flex items-center text-slate-700 font-semibold">
                          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Ajustement
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">
                      {mov.componentCode} - {mov.componentName}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-mono font-bold ${
                        mov.quantity > 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {mov.quantity > 0 ? `+${mov.quantity}` : mov.quantity}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {mov.referenceDoc}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 truncate max-w-xs">
                      {mov.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: MANUAL STOCK MOVEMENT */}
      {isManualMovementOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">
              Enregistrer un Mouvement Manuel de Stock
            </h3>

            <form onSubmit={handleSaveMovement} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Composant
                </label>
                <select
                  value={movementComponentId}
                  onChange={(e) => setMovementComponentId(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300 bg-white"
                >
                  {components
                    .filter((c) => c.stockEnabled)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name} (Dispo : {c.stockQty} {c.unit})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Type d&apos;Opération
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) =>
                      setMovementType(
                        e.target.value as 'in' | 'out' | 'adjustment'
                      )
                    }
                    className="w-full p-2 rounded border border-slate-300 bg-white font-medium"
                  >
                    <option value="in">Entrée de Stock (+)</option>
                    <option value="out">Sortie Manuelle (-)</option>
                    <option value="adjustment">Régularisation Inventaire</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={movementQty}
                    onChange={(e) =>
                      setMovementQty(parseFloat(e.target.value) || 0)
                    }
                    className="w-full p-2 rounded border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  N° de Document / BL Fournisseur
                </label>
                <input
                  type="text"
                  value={movementRefDoc}
                  onChange={(e) => setMovementRefDoc(e.target.value)}
                  placeholder="ex: BL-2026-904"
                  className="w-full p-2 rounded border border-slate-300 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Motif / Observations
                </label>
                <textarea
                  rows={2}
                  value={movementNotes}
                  onChange={(e) => setMovementNotes(e.target.value)}
                  className="w-full p-2 rounded border border-slate-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsManualMovementOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow"
                >
                  Valider le Mouvement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LAUNCH PRODUCTION BATCH (OF) */}
      {isLaunchBatchOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Lancement d&apos;un Ordre de Fabrication (OF) & Déstockage
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Vérifiez la disponibilité de toutes les matières avant de valider la sortie de stock prévisionnelle.
            </p>

            <form onSubmit={handleConfirmBatch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Fiche Technique / Modèle à Fabriquer
                  </label>
                  <select
                    value={batchSheetId}
                    onChange={(e) => setBatchSheetId(e.target.value)}
                    className="w-full p-2 rounded border border-slate-300 bg-white"
                  >
                    {sheets.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.reference} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Quantité Prévue à Confectionner
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={batchPlannedQty}
                    onChange={(e) =>
                      setBatchPlannedQty(parseInt(e.target.value, 10) || 1)
                    }
                    className="w-full p-2 rounded border border-slate-300 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Components Consumption Preview Table */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="bg-slate-50 p-2.5 border-b border-slate-200 font-semibold text-slate-700">
                  Composants Nécessaires pour le Lot ({batchPlannedQty} pièces) :
                </div>

                <div className="max-h-52 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-100/60 text-slate-500 border-b border-slate-200">
                        <th className="p-2">Composant</th>
                        <th className="p-2 text-right">Qté Requise (avec perte)</th>
                        <th className="p-2 text-right">Stock Disponible</th>
                        <th className="p-2 text-center">Disponibilité</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {neededComponents.map((nc, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-medium text-slate-800">
                            {nc.item.componentCode} - {nc.item.componentName}
                          </td>
                          <td className="p-2 text-right font-mono font-bold text-slate-900">
                            {nc.qtyNeeded} {nc.item.unit}
                          </td>
                          <td className="p-2 text-right font-mono text-slate-600">
                            {nc.currentStock} {nc.item.unit}
                          </td>
                          <td className="p-2 text-center font-bold">
                            {nc.isSufficient ? (
                              <span className="text-emerald-600">✓ En stock</span>
                            ) : (
                              <span className="text-rose-600 animate-pulse">
                                ⚠ Insuffisant
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {hasMissingStock && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center text-amber-800 text-xs">
                  <AlertTriangle className="w-4 h-4 mr-2 shrink-0 text-amber-600" />
                  Attention : Certains composants sont en quantité insuffisante dans votre stock d&apos;atelier.
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <label className="flex items-center space-x-2 font-bold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={batchDeductStock}
                    onChange={(e) => setBatchDeductStock(e.target.checked)}
                    className="rounded text-sky-600"
                  />
                  <span>
                    Déduire automatiquement les composants consommés du stock dès la validation
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 ml-5 mt-0.5">
                  Action contrôlée pour éviter toute sortie de stock accidentelle.
                </p>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsLaunchBatchOpen(false)}
                  className="px-4 py-2 rounded text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow"
                >
                  Confirmer le Lancement de Fabrication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
