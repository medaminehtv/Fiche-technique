import React from 'react';
import {
  FileSpreadsheet,
  Package,
  AlertTriangle,
  TrendingUp,
  PlusCircle,
  Eye,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Calculator,
} from 'lucide-react';
import type { CompanySettings, ComponentItem, TechnicalSheet } from '../types';
import { computeTechnicalSheetCosts } from '../utils/calc';

interface DashboardProps {
  sheets: TechnicalSheet[];
  components: ComponentItem[];
  settings: CompanySettings;
  onOpenSheet: (sheetId: string) => void;
  onNewSheet: () => void;
  onOpenComponents: () => void;
  onOpenDossier: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  sheets,
  components,
  settings,
  onOpenSheet,
  onNewSheet,
  onOpenComponents,
  onOpenDossier,
}) => {
  // Compute low stock items
  const lowStockComponents = components.filter(
    (c) => c.stockEnabled && c.stockQty <= c.stockMin
  );

  // Compute stats across all sheets
  const calculatedSheets = sheets.map((sheet) => {
    const summary = computeTechnicalSheetCosts(sheet);
    return {
      sheet,
      summary,
    };
  });

  const totalSheets = sheets.length;
  const validatedSheets = sheets.filter((s) => s.status === 'validee').length;
  const draftSheets = sheets.filter((s) => s.status === 'brouillon').length;

  const avgMargin =
    calculatedSheets.length > 0
      ? (
          calculatedSheets.reduce(
            (acc, curr) => acc + curr.summary.actualMarginOnSalesRate,
            0
          ) / calculatedSheets.length
        ).toFixed(1)
      : '0';

  return (
    <div className="space-y-6">
      {/* Top Banner with Phase 1 Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Phase 1 & Système Expert Activé
            </span>
            <span className="text-xs text-slate-400">
              Confection Textile, Cuir & Artisanat Tunisien
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-1 text-slate-100">
            Gestion des Fiches Techniques & Coûts de Revient
          </h1>
          <p className="text-sm text-slate-300 max-w-2xl mt-1">
            Calculateur dynamique centralisé, gestion fine des pertes matières,
            opérations de main-d&apos;œuvre, frais indirects configurables et valorisation
            automatique en Dinars Tunisiens ({settings.currencySymbol}).
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenDossier}
            className="flex items-center px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-sm font-medium transition"
          >
            <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" />
            Consulter le Dossier Phase 1
          </button>
          <button
            onClick={onNewSheet}
            className="flex items-center px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm shadow transition"
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            Créer une Fiche Produit
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sheets */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Fiches Techniques
            </span>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-800">{totalSheets}</span>
            <span className="text-xs text-emerald-600 font-medium">
              {validatedSheets} validée(s)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {draftSheets} en cours de rédaction (brouillon)
          </p>
        </div>

        {/* Components in Catalog */}
        <div
          onClick={onOpenComponents}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Nomenclature & Matières
            </span>
            <span className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <Package className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-800">
              {components.length}
            </span>
            <span className="text-xs text-slate-500">composants actifs</span>
          </div>
          <p className="text-xs text-sky-600 mt-1 flex items-center">
            Voir le catalogue complet <ArrowRight className="w-3 h-3 ml-1" />
          </p>
        </div>

        {/* Stock Alerts */}
        <div
          onClick={onOpenComponents}
          className={`border rounded-xl p-4 shadow-sm transition cursor-pointer ${
            lowStockComponents.length > 0
              ? 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Alertes de Stock
            </span>
            <span
              className={`p-2 rounded-lg ${
                lowStockComponents.length > 0
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span
              className={`text-2xl font-bold ${
                lowStockComponents.length > 0 ? 'text-rose-700' : 'text-slate-800'
              }`}
            >
              {lowStockComponents.length}
            </span>
            <span className="text-xs text-slate-500">sous le seuil mini</span>
          </div>
          <p
            className={`text-xs mt-1 ${
              lowStockComponents.length > 0
                ? 'text-rose-600 font-medium'
                : 'text-emerald-600'
            }`}
          >
            {lowStockComponents.length > 0
              ? 'Réapprovisionnement requis'
              : 'Niveau des stocks satisfaisant'}
          </p>
        </div>

        {/* Target Margin Average */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:border-slate-300 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Taux de Marque Moyen
            </span>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-slate-800">{avgMargin}%</span>
            <span className="text-xs text-emerald-600 font-medium">sur vente HT</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Devise de référence : {settings.currency} ({settings.currencySymbol})
          </p>
        </div>
      </div>

      {/* Main Content Grid: Recent Technical Sheets + Stock alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Products & Real-time Costs */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="font-semibold text-slate-800 text-base">
                Fiches Techniques & Coûts Calculés en Temps Réel
              </h2>
              <p className="text-xs text-slate-500">
                Coût de revient unitaire, matières avec pertes, main-d&apos;œuvre et prix de vente conseillé
              </p>
            </div>
            <button
              onClick={onNewSheet}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center"
            >
              + Nouveau produit
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {calculatedSheets.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <FileSpreadsheet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Aucune fiche technique enregistrée pour le moment.</p>
              </div>
            ) : (
              calculatedSheets.map(({ sheet, summary }) => (
                <div
                  key={sheet.id}
                  className="p-4 hover:bg-slate-50/80 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center space-x-3">
                    {sheet.imageUrl ? (
                      <img
                        src={sheet.imageUrl}
                        alt={sheet.name}
                        className="w-14 h-14 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                          {sheet.reference}
                        </span>
                        <span
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                            sheet.status === 'validee'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {sheet.status === 'validee' ? 'Validée' : 'Brouillon'}
                        </span>
                        <span className="text-xs text-slate-400">
                          v{sheet.version}
                        </span>
                      </div>
                      <h3 className="font-semibold text-slate-900 mt-1 text-sm sm:text-base">
                        {sheet.name}
                      </h3>
                      <div className="flex items-center space-x-3 text-xs text-slate-500 mt-0.5">
                        <span>{sheet.category}</span>
                        <span>•</span>
                        <span>{sheet.items.length} composant(s)</span>
                        <span>•</span>
                        <span>{sheet.laborOperations.length} opération(s) MO</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Coût de Revient</div>
                      <div className="font-bold text-slate-900 text-sm sm:text-base">
                        {summary.unitCostPrice.toFixed(3)} {settings.currencySymbol}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Matières : {summary.totalDirectMaterialsCost.toFixed(2)} | MO : {summary.laborCost.toFixed(2)}
                      </div>
                    </div>

                    <div className="text-right border-l pl-4 border-slate-200">
                      <div className="text-xs text-emerald-600 font-medium">Prix Vente HT</div>
                      <div className="font-bold text-emerald-700 text-sm sm:text-base">
                        {summary.suggestedSellingPriceHT.toFixed(3)} {settings.currencySymbol}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium">
                        Marge : +{summary.previsionalGrossMarginUnit.toFixed(2)} {settings.currencySymbol} ({summary.actualMarginOnSalesRate}%)
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenSheet(sheet.id)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-700 transition"
                      title="Ouvrir la fiche technique détaillée"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right 1 Col: Low stock alerts & Quick guides */}
        <div className="space-y-6">
          {/* Stock Alerts Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-800 text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1.5 text-rose-500" />
                Composants en Alerte Stock
              </h3>
              <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                {lowStockComponents.length}
              </span>
            </div>

            {lowStockComponents.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                Tous les niveaux de stocks sont actuellement supérieurs au seuil minimal.
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockComponents.map((comp) => (
                  <div
                    key={comp.id}
                    className="p-2.5 rounded-lg border border-rose-100 bg-rose-50/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-slate-800">{comp.name}</div>
                      <div className="text-slate-500 text-[11px]">
                        Réf: {comp.code} • Seuil mini: {comp.stockMin} {comp.unit}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-rose-600 text-sm">
                        {comp.stockQty} {comp.unit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Formulas Quick Reference Card */}
          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 shadow-sm border border-slate-800 text-xs">
            <h3 className="font-bold text-amber-400 text-sm flex items-center mb-2">
              <Calculator className="w-4 h-4 mr-1.5" />
              Moteur Mathématique Conforme
            </h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start">
                <span className="text-amber-400 mr-1.5">•</span>
                <span>
                  <strong className="text-white">Qté Réelle :</strong> Qté Théorique × (1 + Taux Perte %)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-1.5">•</span>
                <span>
                  <strong className="text-white">Coût Total :</strong> Matières + Fournitures + Consommables + Emballages + MO + Frais Indirects
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-1.5">•</span>
                <span>
                  <strong className="text-white">Prix Vente (Marge cible) :</strong> Coût unitaire / (1 − Taux Marque)
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-amber-400 mr-1.5">•</span>
                <span>
                  <strong className="text-white">Taux de Marque :</strong> (Prix Vente HT − Coût) / Prix Vente HT × 100
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
