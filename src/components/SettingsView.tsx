import React, { useState } from 'react';
import {
  Settings,
  Building,
  Coins,
  Download,
  Upload,
  RefreshCw,
  Check,
  AlertTriangle,
} from 'lucide-react';
import type { CompanySettings } from '../types';

interface SettingsViewProps {
  settings: CompanySettings;
  onSaveSettings: (settings: CompanySettings) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonString: string) => void;
  onResetAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings: initialSettings,
  onSaveSettings,
  onExportBackup,
  onImportBackup,
  onResetAll,
}) => {
  const [settings, setSettings] = useState<CompanySettings>({
    ...initialSettings,
  });
  const [saveMsg, setSaveMsg] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(settings);
    setSaveMsg('Paramètres enregistrés avec succès !');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportBackup(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-amber-600" />
            Paramètres Généraux & Sauvegardes Locales
          </h1>
          <p className="text-xs text-slate-500">
            Coordonnées de l&apos;entreprise pour l&apos;impression des fiches, devise (TND), TVA et export/import de base de données
          </p>
        </div>

        {saveMsg && (
          <span className="text-xs text-emerald-600 font-bold flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <Check className="w-4 h-4 mr-1" /> {saveMsg}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Coordinates */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <h2 className="font-bold text-slate-800 text-sm flex items-center border-b pb-2">
            <Building className="w-4 h-4 mr-1.5 text-slate-500" />
            Informations Entreprise (Affichées sur les fiches PDF A4)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Raison Sociale / Nom de l&apos;Atelier
              </label>
              <input
                type="text"
                required
                value={settings.companyName}
                onChange={(e) =>
                  setSettings({ ...settings, companyName: e.target.value })
                }
                className="w-full p-2 rounded border border-slate-300 font-medium"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Matricule Fiscal / N° d&apos;Enregistrement
              </label>
              <input
                type="text"
                required
                value={settings.registrationNumber}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    registrationNumber: e.target.value,
                  })
                }
                className="w-full p-2 rounded border border-slate-300 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                Adresse Complète de l&apos;Atelier
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full p-2 rounded border border-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Téléphone de Contact
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full p-2 rounded border border-slate-300"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Email Commercial
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full p-2 rounded border border-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Financial & Currency Defaults */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <h2 className="font-bold text-slate-800 text-sm flex items-center border-b pb-2">
            <Coins className="w-4 h-4 mr-1.5 text-amber-600" />
            Paramètres Financiers & Monétaires par Défaut
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Devise Principale
              </label>
              <input
                type="text"
                value={settings.currency}
                onChange={(e) =>
                  setSettings({ ...settings, currency: e.target.value })
                }
                className="w-full p-2 rounded border border-slate-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Symbole Monétaire
              </label>
              <input
                type="text"
                value={settings.currencySymbol}
                onChange={(e) =>
                  setSettings({ ...settings, currencySymbol: e.target.value })
                }
                className="w-full p-2 rounded border border-slate-300 font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Taux TVA par Défaut (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings.defaultVatRate}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    defaultVatRate: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full p-2 rounded border border-slate-300 font-mono font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow transition"
            >
              Enregistrer les Paramètres
            </button>
          </div>
        </div>
      </form>

      {/* Database Backup & Restore */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
        <h2 className="font-bold text-slate-800 text-sm flex items-center border-b pb-2">
          <Download className="w-4 h-4 mr-1.5 text-sky-600" />
          Sauvegarde & Restauration de la Base de Données (Hors-ligne)
        </h2>
        <p className="text-slate-500">
          Exportez l&apos;intégralité de vos fiches techniques, matières, mouvements de stocks et commandes pour sauvegarde ou transfert sur un autre poste Windows.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={onExportBackup}
            className="flex items-center px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow transition"
          >
            <Download className="w-4 h-4 mr-1.5 text-amber-400" />
            Exporter Sauvegarde Complète (JSON)
          </button>

          <label className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs border border-slate-300 cursor-pointer transition">
            <Upload className="w-4 h-4 mr-1.5 text-sky-600" />
            Restaurer un fichier JSON
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setConfirmReset(true)}
            className="flex items-center px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-semibold text-xs border border-rose-200 transition ml-auto"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Réinitialiser Données Démo
          </button>
        </div>

        {confirmReset && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg space-y-2 mt-2">
            <div className="flex items-center text-rose-800 font-bold">
              <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-600" />
              Confirmation de réinitialisation
            </div>
            <p className="text-rose-700 text-[11px]">
              Cette action rechargera les données de démonstration initiales (Tunique, Cabas, Chéchia, Catalogue complet).
            </p>
            <div className="flex space-x-2 pt-1">
              <button
                onClick={() => {
                  onResetAll();
                  setConfirmReset(false);
                }}
                className="px-3 py-1 bg-rose-600 text-white rounded font-bold text-xs"
              >
                Confirmer la réinitialisation
              </button>
              <button
                onClick={() => setConfirmReset(false)}
                className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded font-semibold text-xs"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
