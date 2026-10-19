import React, { useState } from 'react';
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Scale,
  RefreshCw,
  Sliders,
  DollarSign,
} from 'lucide-react';
import type { CompanySettings, TechnicalSheet } from '../types';
import { computeTechnicalSheetCosts } from '../utils/calc';

interface CostSimulatorProps {
  sheets: TechnicalSheet[];
  settings: CompanySettings;
}

export const CostSimulator: React.FC<CostSimulatorProps> = ({
  sheets,
  settings,
}) => {
  const [selectedSheetId, setSelectedSheetId] = useState<string>(
    sheets[0]?.id || ''
  );

  // Simulation Sliders / Modifiers
  const [materialPriceDeltaPct, setMaterialPriceDeltaPct] = useState<number>(0);
  const [wasteDeltaPct, setWasteDeltaPct] = useState<number>(0);
  const [laborRateDeltaPct, setLaborRateDeltaPct] = useState<number>(0);
  const [overheadsDeltaPct, setOverheadsDeltaPct] = useState<number>(0);
  const [simulatedBatchQty, setSimulatedBatchQty] = useState<number>(1);
  const [simulatedTargetMargin, setSimulatedTargetMargin] = useState<number>(35);

  const baseSheet = sheets.find((s) => s.id === selectedSheetId);

  // When sheet changes, initialize batch qty & target margin
  React.useEffect(() => {
    if (baseSheet) {
      setSimulatedBatchQty(baseSheet.batchQuantity);
      setSimulatedTargetMargin(baseSheet.targetMarginRate);
    }
  }, [baseSheet]);

  if (!baseSheet) {
    return (
      <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
        <Calculator className="w-12 h-12 mx-auto text-slate-300 mb-2" />
        <p className="text-slate-500">Aucune fiche technique disponible pour la simulation.</p>
      </div>
    );
  }

  // Calculate Base Costs
  const baseCosts = computeTechnicalSheetCosts(baseSheet);

  // Build Simulated Sheet Clone
  const simulatedSheet: TechnicalSheet = {
    ...baseSheet,
    batchQuantity: simulatedBatchQty,
    targetMarginRate: simulatedTargetMargin,
    items: baseSheet.items.map((item) => {
      const priceMultiplier = 1 + materialPriceDeltaPct / 100;
      const simPrice = Number((item.unitPrice * priceMultiplier).toFixed(3));
      const simWaste = Math.max(0, item.wastePercentage + wasteDeltaPct);
      const simRealQty = Number(
        (item.theoreticalQty * (1 + simWaste / 100)).toFixed(4)
      );
      const simCost = Number((simRealQty * simPrice).toFixed(3));
      return {
        ...item,
        unitPrice: simPrice,
        wastePercentage: simWaste,
        realQty: simRealQty,
        totalCost: simCost,
      };
    }),
    laborOperations: baseSheet.laborOperations.map((op) => {
      const laborMultiplier = 1 + laborRateDeltaPct / 100;
      return {
        ...op,
        hourlyRate: Number((op.hourlyRate * laborMultiplier).toFixed(2)),
        pieceRate: op.pieceRate
          ? Number((op.pieceRate * laborMultiplier).toFixed(2))
          : undefined,
      };
    }),
    overheads: baseSheet.overheads.map((ov) => {
      const overheadMultiplier = 1 + overheadsDeltaPct / 100;
      return {
        ...ov,
        rateOrAmount: Number((ov.rateOrAmount * overheadMultiplier).toFixed(2)),
      };
    }),
  };

  const simCosts = computeTechnicalSheetCosts(simulatedSheet);

  // Compute Variances
  const costDelta = simCosts.unitCostPrice - baseCosts.unitCostPrice;
  const costDeltaPct =
    baseCosts.unitCostPrice > 0
      ? (costDelta / baseCosts.unitCostPrice) * 100
      : 0;

  const priceDelta =
    simCosts.suggestedSellingPriceHT - baseCosts.suggestedSellingPriceHT;

  const resetSimulation = () => {
    setMaterialPriceDeltaPct(0);
    setWasteDeltaPct(0);
    setLaborRateDeltaPct(0);
    setOverheadsDeltaPct(0);
    if (baseSheet) {
      setSimulatedBatchQty(baseSheet.batchQuantity);
      setSimulatedTargetMargin(baseSheet.targetMarginRate);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center">
            <Calculator className="w-5 h-5 mr-2 text-indigo-600" />
            Simulateur & Analyse de Sensibilité des Coûts (&quot;What-If&quot;)
          </h1>
          <p className="text-xs text-slate-500">
            Anticipez l&apos;impact des hausses de matières premières, des salaires ou des changements de taille de lot sur votre marge.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-semibold text-slate-600">Produit testé :</label>
          <select
            value={selectedSheetId}
            onChange={(e) => setSelectedSheetId(e.target.value)}
            className="py-1.5 px-3 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
          >
            {sheets.map((s) => (
              <option key={s.id} value={s.id}>
                {s.reference} - {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Sliders & Variables */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-sm flex items-center">
              <Sliders className="w-4 h-4 mr-1.5 text-amber-600" />
              Variables de Simulation
            </h2>
            <button
              onClick={resetSimulation}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center"
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Réinitialiser
            </button>
          </div>

          {/* Slider 1: Material Price Change */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-slate-700">Variation prix matières premières :</span>
              <span
                className={`font-mono font-bold ${
                  materialPriceDeltaPct > 0
                    ? 'text-rose-600'
                    : materialPriceDeltaPct < 0
                    ? 'text-emerald-600'
                    : 'text-slate-800'
                }`}
              >
                {materialPriceDeltaPct > 0 ? `+${materialPriceDeltaPct}` : materialPriceDeltaPct}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              step="5"
              value={materialPriceDeltaPct}
              onChange={(e) => setMaterialPriceDeltaPct(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-20% (Baisse)</span>
              <span>0% (Actuel)</span>
              <span>+50% (Inflation)</span>
            </div>
          </div>

          {/* Slider 2: Waste Rate Delta */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-slate-700">Variation taux de perte (% pts) :</span>
              <span
                className={`font-mono font-bold ${
                  wasteDeltaPct > 0 ? 'text-rose-600' : 'text-slate-800'
                }`}
              >
                {wasteDeltaPct > 0 ? `+${wasteDeltaPct}` : wasteDeltaPct}%
              </span>
            </div>
            <input
              type="range"
              min="-5"
              max="15"
              step="1"
              value={wasteDeltaPct}
              onChange={(e) => setWasteDeltaPct(parseInt(e.target.value, 10))}
              className="w-full accent-amber-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>-5% (Optimisation)</span>
              <span>0%</span>
              <span>+15% (Chutes importantes)</span>
            </div>
          </div>

          {/* Slider 3: Labor Hourly Rate Delta */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-slate-700">Variation coût horaire main-d&apos;œuvre :</span>
              <span
                className={`font-mono font-bold ${
                  laborRateDeltaPct > 0 ? 'text-indigo-600' : 'text-slate-800'
                }`}
              >
                {laborRateDeltaPct > 0 ? `+${laborRateDeltaPct}` : laborRateDeltaPct}%
              </span>
            </div>
            <input
              type="range"
              min="-10"
              max="40"
              step="5"
              value={laborRateDeltaPct}
              onChange={(e) => setLaborRateDeltaPct(parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Slider 4: Overheads Delta */}
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between font-medium">
              <span className="text-slate-700">Variation frais atelier & indirects :</span>
              <span className="font-mono font-bold text-slate-800">
                {overheadsDeltaPct > 0 ? `+${overheadsDeltaPct}` : overheadsDeltaPct}%
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="40"
              step="5"
              value={overheadsDeltaPct}
              onChange={(e) => setOverheadsDeltaPct(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600"
            />
          </div>

          {/* Number Input: Batch Quantity */}
          <div className="space-y-1 text-xs pt-2 border-t border-slate-100">
            <label className="font-semibold text-slate-700 block">
              Taille du Lot de Fabrication Simulée
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="5000"
                value={simulatedBatchQty}
                onChange={(e) =>
                  setSimulatedBatchQty(
                    Math.max(1, parseInt(e.target.value, 10) || 1)
                  )
                }
                className="w-24 p-1.5 rounded border border-slate-300 font-mono font-bold"
              />
              <span className="text-slate-500">
                {baseSheet.productionUnit}s (Base : {baseSheet.batchQuantity})
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Permet de constater l&apos;impact de l&apos;amortissement des frais fixes sur le coût unitaire.
            </p>
          </div>

          {/* Number Input: Target Margin Rate */}
          <div className="space-y-1 text-xs">
            <label className="font-semibold text-slate-700 block">
              Taux de Marge Cible (%)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="0"
                max="90"
                value={simulatedTargetMargin}
                onChange={(e) =>
                  setSimulatedTargetMargin(
                    Math.min(90, Math.max(0, parseFloat(e.target.value) || 0))
                  )
                }
                className="w-24 p-1.5 rounded border border-slate-300 font-mono font-bold"
              />
              <span className="text-slate-500">% sur vente HT</span>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Side-by-Side Scenario Comparison */}
        <div className="lg:col-span-2 space-y-5">
          {/* Main Comparison Header Cards */}
          <div className="grid grid-cols-2 gap-4">
            {/* Base Scenario Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Scénario Actuel (Référence)
              </div>
              <div className="text-xs text-slate-500">
                Lot de {baseCosts.batchQuantity} {baseSheet.productionUnit}
              </div>
              <div className="pt-2">
                <span className="text-xs text-slate-500 block">Coût de Revient Unitaire</span>
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {baseCosts.unitCostPrice.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Prix Vente HT Conseillé</span>
                <span className="text-lg font-bold font-mono text-slate-700">
                  {baseCosts.suggestedSellingPriceHT.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>
            </div>

            {/* Simulated Scenario Card */}
            <div
              className={`rounded-xl border p-4 shadow-sm space-y-2 transition ${
                costDelta > 0
                  ? 'bg-rose-50/50 border-rose-200'
                  : costDelta < 0
                  ? 'bg-emerald-50/50 border-emerald-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider">
                  Scénario Simulé
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold flex items-center ${
                    costDelta > 0
                      ? 'bg-rose-100 text-rose-700'
                      : costDelta < 0
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {costDelta > 0 ? (
                    <TrendingUp className="w-3.5 h-3.5 mr-1" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 mr-1" />
                  )}
                  {costDelta > 0 ? `+${costDeltaPct.toFixed(1)}%` : `${costDeltaPct.toFixed(1)}%`}
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Lot de {simCosts.batchQuantity} {baseSheet.productionUnit}
              </div>
              <div className="pt-2">
                <span className="text-xs text-slate-500 block">Nouveau Coût Unitaire</span>
                <span
                  className={`text-2xl font-bold font-mono ${
                    costDelta > 0 ? 'text-rose-700' : 'text-emerald-700'
                  }`}
                >
                  {simCosts.unitCostPrice.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Nouveau Prix Conseillé HT</span>
                <span className="text-lg font-bold font-mono text-emerald-800">
                  {simCosts.suggestedSellingPriceHT.toFixed(3)} {settings.currencySymbol}
                </span>
              </div>
            </div>
          </div>

          {/* Breakdown Comparison Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
            <h3 className="font-bold text-slate-800 text-sm mb-3">
              Décomposition Détaillée & Analyse d&apos;Écart
            </h3>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Poste de Charge</th>
                    <th className="py-2.5 px-3 text-right">Actuel ({settings.currencySymbol})</th>
                    <th className="py-2.5 px-3 text-right">Simulé ({settings.currencySymbol})</th>
                    <th className="py-2.5 px-3 text-right font-bold">Écart (TND)</th>
                    <th className="py-2.5 px-3 text-right font-bold">Écart (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-700">
                      Matières Premières
                    </td>
                    <td className="py-2 px-3 text-right">{baseCosts.rawMaterialsCost.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right">{simCosts.rawMaterialsCost.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right">
                      {(simCosts.rawMaterialsCost - baseCosts.rawMaterialsCost).toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {baseCosts.rawMaterialsCost > 0
                        ? (
                            ((simCosts.rawMaterialsCost - baseCosts.rawMaterialsCost) /
                              baseCosts.rawMaterialsCost) *
                            100
                          ).toFixed(1) + '%'
                        : '0%'}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-700">
                      Coût des Pertes / Chutes
                    </td>
                    <td className="py-2 px-3 text-right text-amber-700">{baseCosts.wasteCost.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right text-amber-700">{simCosts.wasteCost.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right">
                      {(simCosts.wasteCost - baseCosts.wasteCost).toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {baseCosts.wasteCost > 0
                        ? (
                            ((simCosts.wasteCost - baseCosts.wasteCost) /
                              baseCosts.wasteCost) *
                            100
                          ).toFixed(1) + '%'
                        : '0%'}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-700">
                      Main-d&apos;œuvre Totale
                    </td>
                    <td className="py-2 px-3 text-right">{baseCosts.laborCost.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right">{simCosts.laborCost.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right">
                      {(simCosts.laborCost - baseCosts.laborCost).toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {baseCosts.laborCost > 0
                        ? (
                            ((simCosts.laborCost - baseCosts.laborCost) /
                              baseCosts.laborCost) *
                            100
                          ).toFixed(1) + '%'
                        : '0%'}
                    </td>
                  </tr>

                  <tr>
                    <td className="py-2 px-3 font-sans font-medium text-slate-700">
                      Frais Indirects / Atelier
                    </td>
                    <td className="py-2 px-3 text-right">{baseCosts.overheadsCost.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right">{simCosts.overheadsCost.toFixed(3)}</td>
                    <td className="py-2 px-3 text-right">
                      {(simCosts.overheadsCost - baseCosts.overheadsCost).toFixed(3)}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {baseCosts.overheadsCost > 0
                        ? (
                            ((simCosts.overheadsCost - baseCosts.overheadsCost) /
                              baseCosts.overheadsCost) *
                            100
                          ).toFixed(1) + '%'
                        : '0%'}
                    </td>
                  </tr>

                  <tr className="bg-slate-50/70 font-bold">
                    <td className="py-2.5 px-3 font-sans text-slate-900">
                      Coût de Revient Unitaire
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-900">
                      {baseCosts.unitCostPrice.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-900">
                      {simCosts.unitCostPrice.toFixed(3)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right ${
                        costDelta > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {costDelta > 0 ? `+${costDelta.toFixed(3)}` : costDelta.toFixed(3)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right ${
                        costDelta > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {costDeltaPct > 0 ? `+${costDeltaPct.toFixed(1)}%` : `${costDeltaPct.toFixed(1)}%`}
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/50 font-bold">
                    <td className="py-2.5 px-3 font-sans text-emerald-900">
                      Marge Brute Prévue / Unité
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-800">
                      {baseCosts.previsionalGrossMarginUnit.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-800">
                      {simCosts.previsionalGrossMarginUnit.toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">
                      {(
                        simCosts.previsionalGrossMarginUnit -
                        baseCosts.previsionalGrossMarginUnit
                      ).toFixed(3)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-700">
                      {baseCosts.previsionalGrossMarginUnit > 0
                        ? (
                            ((simCosts.previsionalGrossMarginUnit -
                              baseCosts.previsionalGrossMarginUnit) /
                              baseCosts.previsionalGrossMarginUnit) *
                            100
                          ).toFixed(1) + '%'
                        : '0%'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
