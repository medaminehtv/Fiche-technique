import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Building,
} from 'lucide-react';
import type { Supplier } from '../types';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onSaveSupplier: (supplier: Supplier) => void;
  onDeleteSupplier: (id: string) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onSaveSupplier,
  onDeleteSupplier,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const filteredSuppliers = suppliers.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.city && s.city.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleOpenNew = () => {
    const newSup: Supplier = {
      id: 'sup-' + Date.now(),
      code: 'FRS-' + (suppliers.length + 1).toString().padStart(3, '0'),
      name: '',
      contactPerson: '',
      phone: '+216 ',
      email: '',
      city: 'Tunis',
      notes: '',
    };
    setEditingSupplier(newSup);
    setIsModalOpen(true);
  };

  const handleEdit = (sup: Supplier) => {
    setEditingSupplier({ ...sup });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupplier) return;
    onSaveSupplier(editingSupplier);
    setIsModalOpen(false);
    setEditingSupplier(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <Users className="w-5 h-5 mr-2 text-amber-600" />
            Répertoire des Fournisseurs & Sous-traitants
          </h1>
          <p className="text-xs text-slate-500">
            Filatures, tanneries, négociants d&apos;accessoires, quincailleries et ateliers partenaires
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="flex items-center px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm shadow transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Ajouter un Fournisseur
        </button>
      </div>

      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom, ville, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((sup) => (
          <div
            key={sup.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-amber-300 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-600">
                    {sup.code}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base mt-1">
                    {sup.name}
                  </h3>
                  {sup.contactPerson && (
                    <p className="text-xs text-slate-500 font-medium">
                      Contact : {sup.contactPerson}
                    </p>
                  )}
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => handleEdit(sup)}
                    className="p-1.5 text-slate-400 hover:text-amber-600 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSupplier(sup.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                {sup.phone && (
                  <div className="flex items-center">
                    <Phone className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    <span>{sup.phone}</span>
                  </div>
                )}
                {sup.email && (
                  <div className="flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    <span className="truncate">{sup.email}</span>
                  </div>
                )}
                {sup.city && (
                  <div className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
                    <span>{sup.city}</span>
                  </div>
                )}
              </div>

              {sup.notes && (
                <div className="p-2 rounded bg-slate-50 border border-slate-100 text-[11px] text-slate-500 italic">
                  {sup.notes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && editingSupplier && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base mb-3">
              Fiche Fournisseur
            </h3>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Code Fournisseur
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSupplier.code}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        code: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300 font-mono"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Ville
                  </label>
                  <input
                    type="text"
                    value={editingSupplier.city || ''}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        city: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Raison Sociale / Nom *
                </label>
                <input
                  type="text"
                  required
                  value={editingSupplier.name}
                  onChange={(e) =>
                    setEditingSupplier({
                      ...editingSupplier,
                      name: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border border-slate-300 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Contact / Responsable
                  </label>
                  <input
                    type="text"
                    value={editingSupplier.contactPerson || ''}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        contactPerson: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={editingSupplier.phone || ''}
                    onChange={(e) =>
                      setEditingSupplier({
                        ...editingSupplier,
                        phone: e.target.value,
                      })
                    }
                    className="w-full p-2 rounded border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editingSupplier.email || ''}
                  onChange={(e) =>
                    setEditingSupplier({
                      ...editingSupplier,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border border-slate-300"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Notes & Spécialités
                </label>
                <textarea
                  rows={2}
                  value={editingSupplier.notes || ''}
                  onChange={(e) =>
                    setEditingSupplier({
                      ...editingSupplier,
                      notes: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded border border-slate-300"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold shadow"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
