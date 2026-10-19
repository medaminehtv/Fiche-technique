import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Edit,
  Printer,
  History,
  CheckCircle,
  Clock,
  ArrowUpDown,
} from 'lucide-react';
import type { CompanySettings, TechnicalSheet } from '../types';
import { computeTechnicalSheetCosts } from '../utils/calc';

interface TechnicalSheetsViewProps {
  sheets: TechnicalSheet[];
  settings: CompanySettings;
  onSelectSheet: (sheet: TechnicalSheet) => void;
  onNewSheet: () => void;
  onDuplicateSheet: (sheetId: string) => void;
  onDeleteSheet: (sheetId: string) => void;
  onPrintSheet: (sheet: TechnicalSheet) => void;
  onCompareVersions: (sheet: TechnicalSheet) => void;
}

export const TechnicalSheetsView: React.FC<TechnicalSheetsViewProps> = ({
  sheets,
  settings,
  onSelectSheet,
  onNewSheet,
  onDuplicateSheet,
  onDeleteSheet,
  onPrintSheet,
  onCompareVersions,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories = Array.from(
    new Set(sheets.map((s) => s.category).filter(Boolean))
  );

  const filteredSheets = sheets.filter((sheet) => {
    const matchesSearch =
      sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || sheet.category === selectedCategory;

    const matchesStatus =
      selectedStatus === 'all' || sheet.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-amber-600" />
            Fiches Techniques & Nomenclatures (BOM)
          </h1>
          <p className="text-xs text-slate-500">
            Dossier technique de confection, liste complète des composants, main-d&apos;œuvre et coûts de revient
          </p>
        </div>

        <button
          onClick={onNewSheet}
          className="flex items-center justify-center px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm shadow transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Nouvelle Fiche Technique
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-sm">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par référence, nom..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status filter */}
        <div className="flex items-center space-x-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full py-1.5 px-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
          >
            <option value="all">Tous les statuts</option>
            <option value="validee">Validée</option>
            <option value="brouillon">Brouillon</option>
            <option value="archivee">Archivée</option>
          </select>
        </div>
      </div>

      {/* Sheets Grid */}
      {filteredSheets.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
          <FileSpreadsheet className="w-12 h-12 mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-semibold text-slate-700">
            Aucune fiche technique correspondante
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Modifiez vos filtres de recherche ou créez une nouvelle fiche produit.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSheets.map((sheet) => {
            const costs = computeTechnicalSheetCosts(sheet);
            return (
              <div
                key={sheet.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image & Status Tag */}
                  <div className="relative h-44 bg-slate-100 overflow-hidden border-b border-slate-100">
                    {sheet.imageUrl ? (
                      <img
                        src={sheet.imageUrl}
                        alt={sheet.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <FileSpreadsheet className="w-10 h-10 mb-1 opacity-40" />
                        <span className="text-xs">Aucun visuel</span>
                      </div>
                    )}

                    <div className="absolute top-2 left-2 flex items-center space-x-1">
                      <span className="bg-slate-900/80 backdrop-blur-sm text-white font-mono text-xs font-semibold px-2 py-0.5 rounded shadow">
                        {sheet.reference}
                      </span>
                      <span className="bg-amber-500/90 text-white text-[11px] font-bold px-1.5 py-0.5 rounded shadow">
                        v{sheet.version}
                      </span>
                    </div>

                    <div className="absolute top-2 right-2">
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold shadow-sm backdrop-blur-sm ${
                          sheet.status === 'validee'
                            ? 'bg-emerald-500/90 text-white'
                            : sheet.status === 'brouillon'
                            ? 'bg-amber-500/90 text-white'
                            : 'bg-slate-500/90 text-white'
                        }`}
                      >
                        {sheet.status === 'validee'
                          ? 'Validée'
                          : sheet.status === 'brouillon'
                          ? 'Brouillon'
                          : 'Archivée'}
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-sm text-slate-200 text-[11px] px-2 py-0.5 rounded font-medium">
                      Lot de {sheet.batchQuantity} {sheet.productionUnit}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                        {sheet.category}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1.5 line-clamp-1">
                        {sheet.name}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {sheet.description}
                      </p>
                    </div>

                    {/* Breakdown Cost Metrics */}
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Matières & Pertes:</span>
                        <span className="font-medium text-slate-800">
                          {costs.totalDirectMaterialsCost.toFixed(3)} {settings.currencySymbol}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Main-d&apos;œuvre:</span>
                        <span className="font-medium text-slate-800">
                          {costs.laborCost.toFixed(3)} {settings.currencySymbol} ({costs.totalLaborHours}h)
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Frais d&apos;Atelier:</span>
                        <span className="font-medium text-slate-800">
                          {costs.overheadsCost.toFixed(3)} {settings.currencySymbol}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between font-bold">
                        <span className="text-slate-800">Coût de Revient Unitaire:</span>
                        <span className="text-slate-900 text-sm">
                          {costs.unitCostPrice.toFixed(3)} {settings.currencySymbol}
                        </span>
                      </div>
                    </div>

                    {/* Commercial Pricing Box */}
                    <div className="bg-emerald-50/60 rounded-lg p-2.5 border border-emerald-100 flex items-center justify-between text-xs">
                      <div>
                        <div className="text-emerald-800 font-semibold text-xs">
                          Prix Conseillé HT
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Taux marque : {costs.actualMarginOnSalesRate}%
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-emerald-700">
                          {costs.suggestedSellingPriceHT.toFixed(3)} {settings.currencySymbol}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">
                          Marge: +{costs.previsionalGrossMarginUnit.toFixed(2)} {settings.currencySymbol}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onPrintSheet(sheet)}
                      className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-slate-200 rounded transition"
                      title="Générer & Imprimer la Fiche PDF (Atelier ou Direction)"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onCompareVersions(sheet)}
                      className="p-1.5 text-slate-600 hover:text-sky-700 hover:bg-slate-200 rounded transition"
                      title="Historique & Comparateur de versions"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicateSheet(sheet.id)}
                      className="p-1.5 text-slate-600 hover:text-indigo-700 hover:bg-slate-200 rounded transition"
                      title="Dupliquer cette fiche technique"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteSheet(sheet.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="Supprimer la fiche"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={() => onSelectSheet(sheet)}
                    className="flex items-center px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium shadow-sm transition"
                  >
                    <Edit className="w-3.5 h-3.5 mr-1" />
                    Modifier / BOM
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
