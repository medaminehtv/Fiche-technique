import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Building2,
  Percent,
} from 'lucide-react';
import type {
  CompanySettings,
  ComponentCategory,
  ComponentItem,
  Supplier,
  UnitType,
} from '../types';

interface ComponentsCatalogProps {
  components: ComponentItem[];
  suppliers: Supplier[];
  settings: CompanySettings;
  onSaveComponent: (component: ComponentItem) => void;
  onDeleteComponent: (id: string) => void;
}

export const ComponentsCatalog: React.FC<ComponentsCatalogProps> = ({
  components,
  suppliers,
  settings,
  onSaveComponent,
  onDeleteComponent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [editingItem, setEditingItem] = useState<ComponentItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredComponents = components.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.supplierName &&
        item.supplierName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;

    const matchesLowStock = !onlyLowStock || item.stockQty <= item.stockMin;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleOpenNew = () => {
    const newItem: ComponentItem = {
      id: 'comp-' + Date.now(),
      code: 'MAT-' + (components.length + 1).toString().padStart(3, '0'),
      name: '',
      category: 'matiere_premiere',
      description: '',
      unit: 'm',
      unitPrice: 0,
      supplierId: suppliers[0]?.id || '',
      supplierName: suppliers[0]?.name || '',
      lastPriceDate: new Date().toISOString().split('T')[0],
      stockEnabled: true,
      stockQty: 0,
      stockMin: 10,
      defaultWastePercentage: 5,
      isActive: true,
    };
    setEditingItem(newItem);
    setIsModalOpen(true);
  };

  const handleEdit = (item: ComponentItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    onSaveComponent(editingItem);
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const getCategoryBadge = (cat: ComponentCategory) => {
    switch (cat) {
      case 'matiere_premiere':
        return (
          <span className="bg-amber-100 text-amber-800 text-[11px] px-2 py-0.5 rounded font-medium">
            Matière Première
          </span>
        );
      case 'fourniture_accessoire':
        return (
          <span className="bg-sky-100 text-sky-800 text-[11px] px-2 py-0.5 rounded font-medium">
            Fourniture / Acc.
          </span>
        );
      case 'consommable':
        return (
          <span className="bg-purple-100 text-purple-800 text-[11px] px-2 py-0.5 rounded font-medium">
            Consommable
          </span>
        );
      case 'emballage':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded font-medium">
            Emballage
          </span>
        );
      default:
        return (
          <span className="bg-slate-100 text-slate-800 text-[11px] px-2 py-0.5 rounded font-medium">
            Autre
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <Package className="w-5 h-5 mr-2 text-amber-600" />
            Catalogue Centralisé des Matières & Composants
          </h1>
          <p className="text-xs text-slate-500">
            Gestion des matières premières, fournitures, consommables d&apos;atelier et emballages
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center justify-center px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Ajouter un Composant
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-sm">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par référence, désignation, fournisseur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 text-sm"
          >
            <option value="all">Toutes catégories</option>
            <option value="matiere_premiere">Matières Premières</option>
            <option value="fourniture_accessoire">Fournitures & Accessoires</option>
            <option value="consommable">Consommables d&apos;atelier</option>
            <option value="emballage">Emballages</option>
          </select>
        </div>

        <div className="flex items-center">
          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="rounded text-amber-600"
            />
            <span className="text-rose-600">Sous seuil minimal uniquement</span>
          </label>
        </div>
      </div>

      {/* Components Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="py-3 px-3">Code</th>
                <th className="py-3 px-3">Désignation</th>
                <th className="py-3 px-3">Catégorie</th>
                <th className="py-3 px-3">Unité</th>
                <th className="py-3 px-3 text-right">Prix Unitaire</th>
                <th className="py-3 px-3">Fournisseur</th>
                <th className="py-3 px-3 text-right">Perte Défaut</th>
                <th className="py-3 px-3 text-right">Stock Dispo</th>
                <th className="py-3 px-3 text-center">Statut</th>
                <th className="py-3 px-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredComponents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    Aucun composant ne correspond à vos filtres.
                  </td>
                </tr>
              ) : (
                filteredComponents.map((item) => {
                  const isLow = item.stockEnabled && item.stockQty <= item.stockMin;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition group"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        {item.code}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs">
                        <div>{item.name}</div>
                        {item.description && (
                          <div className="text-[11px] text-slate-400 truncate">
                            {item.description}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3">{getCategoryBadge(item.category)}</td>
                      <td className="py-2.5 px-3 text-slate-600 font-medium">
                        {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">
                        {item.unitPrice.toFixed(3)} {settings.currencySymbol}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">
                        {item.supplierName || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                        {item.defaultWastePercentage}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        {item.stockEnabled ? (
                          <span
                            className={`px-2 py-0.5 rounded font-bold ${
                              isLow
                                ? 'bg-rose-100 text-rose-700 animate-pulse'
                                : 'text-slate-800'
                            }`}
                          >
                            {item.stockQty} {item.unit}
                          </span>
                        ) : (
                          <span className="text-slate-300">Non géré</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            item.isActive
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-400'
                          }`}
                        >
                          {item.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-slate-500 hover:text-amber-600 rounded transition"
                          title="Modifier le composant"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteComponent(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition ml-1"
                          title="Supprimer du catalogue"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base">
                {editingItem.id.startsWith('comp-') && !components.some((c) => c.id === editingItem.id)
                  ? 'Nouveau Composant de Fabrication'
                  : 'Modifier la Fiche Composant'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4 text-xs mt-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Code Unique *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.code}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, code: e.target.value })
                    }
                    className="w-full p-2 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Catégorie *
                  </label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value as ComponentCategory,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300 bg-white"
                  >
                    <option value="matiere_premiere">Matière Première</option>
                    <option value="fourniture_accessoire">Fourniture / Accessoire</option>
                    <option value="consommable">Consommable de Fabrication</option>
                    <option value="emballage">Emballage</option>
                    <option value="autre">Autre composant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Désignation du Composant *
                </label>
                <input
                  type="text"
                  required
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  placeholder="ex: Tissu Lin Naturel 240g, Bouton nacre..."
                  className="w-full p-2 rounded border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Unité de Mesure *
                  </label>
                  <select
                    value={editingItem.unit}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        unit: e.target.value as UnitType,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300 bg-white"
                  >
                    <option value="m">mètre (m)</option>
                    <option value="cm">centimètre (cm)</option>
                    <option value="m2">mètre² (m²)</option>
                    <option value="kg">kilogramme (kg)</option>
                    <option value="g">gramme (g)</option>
                    <option value="l">litre (L)</option>
                    <option value="ml">millilitre (ml)</option>
                    <option value="piece">pièce</option>
                    <option value="rouleau">rouleau</option>
                    <option value="paquet">paquet</option>
                    <option value="boite">boîte</option>
                    <option value="heure">heure</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Prix Achat Unit. ({settings.currencySymbol}) *
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={editingItem.unitPrice}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Taux Perte Défaut (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="100"
                    value={editingItem.defaultWastePercentage}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        defaultWastePercentage: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Fournisseur
                  </label>
                  <select
                    value={editingItem.supplierId || ''}
                    onChange={(e) => {
                      const sup = suppliers.find((s) => s.id === e.target.value);
                      setEditingItem({
                        ...editingItem,
                        supplierId: e.target.value,
                        supplierName: sup ? sup.name : '',
                      });
                    }}
                    className="w-full p-2 rounded border border-slate-300 bg-white"
                  >
                    <option value="">Sélectionner un fournisseur</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Date du Dernier Prix
                  </label>
                  <input
                    type="date"
                    value={editingItem.lastPriceDate}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        lastPriceDate: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              {/* Stock Management Fields */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <label className="flex items-center space-x-2 font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={editingItem.stockEnabled}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        stockEnabled: e.target.checked,
                      })
                    }
                    className="rounded text-amber-600"
                  />
                  <span>Activer le suivi de stock pour ce composant</span>
                </label>

                {editingItem.stockEnabled && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5">
                        Quantité Actuelle en Stock
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingItem.stockQty}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            stockQty: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-1.5 rounded border border-slate-300 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 block mb-0.5">
                        Seuil Minimal d&apos;Alerte
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingItem.stockMin}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            stockMin: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full p-1.5 rounded border border-slate-300 font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Description & Observations
                </label>
                <textarea
                  rows={2}
                  value={editingItem.description || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border border-slate-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow"
                >
                  Enregistrer le Composant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
