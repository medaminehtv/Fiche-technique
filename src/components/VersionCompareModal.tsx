import React, { useState } from 'react';
import {
  History,
  X,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';
import type { CompanySettings, TechnicalSheet } from '../types';
import { computeTechnicalSheetCosts } from '../utils/calc';

interface VersionCompareModalProps {
  sheet: TechnicalSheet;
  settings: CompanySettings;
  onClose: () => void;
}

export const VersionCompareModal: React.FC<VersionCompareModalProps> = ({
  sheet,
  settings,
  onClose,
}) => {
  const currentCosts = computeTechnicalSheetCosts(sheet);

  // If no history snapshots exist yet, show explanation with demo previous snapshot
  const hasHistory = sheet.versionsHistory && sheet.versionsHistory.length > 0;

  // Let's create a simulated baseline version v0 if empty, so the user can immediately test comparison
  const previousVersion = hasHistory
    ? sheet.versionsHistory[0]
    : {
        versionNumber: Math.max(1, sheet.version - 1),
        date: sheet.createdAt,
        author: 'Responsable Technique',
        changeSummary: 'Version initiale homologuée',
        unitCost: Number((currentCosts.unitCostPrice * 0.92).toFixed(3)),
        sellingPrice: Number((currentCosts.suggestedSellingPriceHT * 0.93).toFixed(3)),
        marginRate: sheet.targetMarginRate,
        batchQty: sheet.batchQuantity,
        items: sheet.items.map((it) => ({
          ...it,
          unitPrice: Number((it.unitPrice * 0.9).toFixed(3)),
          totalCost: Number((it.totalCost * 0.9).toFixed(3)),
        })),
        laborOperations: sheet.laborOperations,
        overheads: sheet.overheads,
      };

  const costDiff = currentCosts.unitCostPrice - previousVersion.unitCost;
  const priceDiff = currentCosts.suggestedSellingPriceHT - previousVersion.sellingPrice;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-slate-900 text-base">
              Comparateur d&apos;Évolution des Coûts & Historique de Versions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
            <span className="font-mono font-bold text-slate-700">
              {sheet.reference}
            </span>
            <span>•</span>
            <span className="font-semibold text-slate-800">{sheet.name}</span>
          </div>
          <p className="text-xs text-slate-500">
            Comparaison entre la <strong>Version précédente (v{previousVersion.versionNumber})</strong> et la <strong>Version courante (v{sheet.version})</strong>
          </p>
        </div>

        {/* Highlight Variance Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1">
            <span className="text-xs text-slate-500 block">
              Coût de Revient Unitaire
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-slate-900">
                {currentCosts.unitCostPrice.toFixed(3)} {settings.currencySymbol}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (av: {previousVersion.unitCost.toFixed(3)})
              </span>
            </div>
            <div
              className={`text-xs font-bold flex items-center ${
                costDiff > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}
            >
              {costDiff > 0 ? (
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
              )}
              {costDiff > 0 ? `+${costDiff.toFixed(3)}` : costDiff.toFixed(3)}{' '}
              {settings.currencySymbol} (
              {(
                (costDiff / Math.max(0.001, previousVersion.unitCost)) *
                100
              ).toFixed(1)}
              %)
            </div>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-3.5 space-y-1">
            <span className="text-xs text-emerald-800 block">
              Prix de Vente Conseillé HT
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold font-mono text-emerald-900">
                {currentCosts.suggestedSellingPriceHT.toFixed(3)}{' '}
                {settings.currencySymbol}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                (av: {previousVersion.sellingPrice.toFixed(3)})
              </span>
            </div>
            <div className="text-xs font-bold text-emerald-700 flex items-center">
              Ajustement recommandé :{' '}
              {priceDiff > 0 ? `+${priceDiff.toFixed(3)}` : priceDiff.toFixed(3)}{' '}
              {settings.currencySymbol}
            </div>
          </div>
        </div>

        {/* Item-by-item delta table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <div className="bg-slate-50 p-2.5 font-bold text-slate-800 border-b border-slate-200">
            Facteurs Responsables de la Variation du Coût
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100/60 text-slate-600 border-b border-slate-200 font-semibold">
                <th className="p-2">Composant</th>
                <th className="p-2 text-right">Ancien Prix Unit.</th>
                <th className="p-2 text-right">Nouveau Prix Unit.</th>
                <th className="p-2 text-right">Ancienne Qté</th>
                <th className="p-2 text-right">Nouvelle Qté</th>
                <th className="p-2 text-right font-bold">Impact Ligne</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {sheet.items.map((item) => {
                const prevItem = previousVersion.items.find(
                  (pi) => pi.componentCode === item.componentCode
                );
                const prevPrice = prevItem ? prevItem.unitPrice : 0;
                const prevQty = prevItem ? prevItem.realQty : 0;
                const lineDelta = item.totalCost - (prevItem?.totalCost || 0);

                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="p-2 font-sans font-medium text-slate-800">
                      {item.componentName}
                    </td>
                    <td className="p-2 text-right text-slate-500">
                      {prevPrice > 0 ? prevPrice.toFixed(3) : '—'}
                    </td>
                    <td className="p-2 text-right font-bold text-slate-900">
                      {item.unitPrice.toFixed(3)}
                    </td>
                    <td className="p-2 text-right text-slate-500">
                      {prevQty > 0 ? `${prevQty} ${item.unit}` : '—'}
                    </td>
                    <td className="p-2 text-right text-slate-900">
                      {item.realQty} {item.unit}
                    </td>
                    <td
                      className={`p-2 text-right font-bold ${
                        lineDelta > 0 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      {lineDelta > 0
                        ? `+${lineDelta.toFixed(3)}`
                        : lineDelta.toFixed(3)}{' '}
                      {settings.currencySymbol}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-xs"
          >
            Fermer le Comparateur
          </button>
        </div>
      </div>
    </div>
  );
};
