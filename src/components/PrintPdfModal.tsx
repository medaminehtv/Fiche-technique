import React, { useState } from 'react';
import {
  Printer,
  Download,
  Eye,
  Shield,
  FileSpreadsheet,
  X,
  Check,
  Building,
} from 'lucide-react';
import type { CompanySettings, TechnicalSheet } from '../types';
import { computeTechnicalSheetCosts } from '../utils/calc';

interface PrintPdfModalProps {
  sheet: TechnicalSheet;
  settings: CompanySettings;
  onClose: () => void;
}

export const PrintPdfModal: React.FC<PrintPdfModalProps> = ({
  sheet,
  settings,
  onClose,
}) => {
  // 'atelier' = Workshop production sheet (hides confidential prices)
  // 'gestion' = Management cost sheet (includes all financials and margins)
  const [docType, setDocType] = useState<'atelier' | 'gestion'>('gestion');

  const costs = computeTechnicalSheetCosts(sheet);
  const printDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[95vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden print:max-w-none print:w-full print:border-none print:shadow-none print:max-h-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 print:hidden">
          <div className="flex items-center space-x-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm sm:text-base">
              Aperçu & Impression Fiche Technique A4
            </h2>
          </div>

          {/* Toggle Doc Type */}
          <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
            <button
              onClick={() => setDocType('gestion')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                docType === 'gestion'
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Fiche Direction & Coûts de Revient
            </button>
            <button
              onClick={() => setDocType('atelier')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                docType === 'atelier'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Fiche Atelier / Confection (Confidentiel masqué)
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition"
            >
              <Printer className="w-4 h-4 mr-1.5" />
              Imprimer / Sauvegarder en PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Body (A4 Style) */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-slate-900 bg-white print:p-0 print:overflow-visible text-xs">
          {/* Header with Company Logo & Info */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div>
              <h1 className="text-xl font-black uppercase tracking-wider text-slate-900">
                {settings.companyName}
              </h1>
              <p className="text-slate-600 font-medium">{settings.address}</p>
              <p className="text-slate-500">
                Tél : {settings.phone} | Email : {settings.email}
              </p>
              <p className="text-slate-500 font-mono">
                Matricule Fiscal : {settings.registrationNumber}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded font-bold text-xs uppercase mb-1 ${
                  docType === 'gestion'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-sky-100 text-sky-900 border border-sky-300'
                }`}
              >
                {docType === 'gestion'
                  ? 'Fiche de Revient & Gestion Financière'
                  : 'Fiche Technique de Fabrication Atelier'}
              </span>
              <div className="font-mono text-slate-500">
                Date édition : {printDate}
              </div>
              <div className="font-bold text-slate-700">
                Version de la fiche : v{sheet.version}
              </div>
            </div>
          </div>

          {/* Product Overview Section */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="col-span-2 space-y-1.5">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-900 text-white font-bold">
                  RÉF: {sheet.reference}
                </span>
                <span className="font-semibold text-slate-600">
                  {sheet.category}
                </span>
                <span className="text-emerald-700 font-bold">
                  Statut: {sheet.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-950">{sheet.name}</h2>
              <p className="text-slate-600 italic">{sheet.description}</p>
              <div className="pt-1 text-slate-700 font-medium">
                Lot de référence : <strong>{sheet.batchQuantity} {sheet.productionUnit}</strong> | Taux de rendement atelier : <strong>{sheet.productionYieldRate}%</strong>
              </div>
            </div>

            {sheet.imageUrl && (
              <div className="flex justify-end">
                <img
                  src={sheet.imageUrl}
                  alt={sheet.name}
                  className="w-28 h-28 object-cover rounded border border-slate-300 shadow-sm"
                />
              </div>
            )}
          </div>

          {/* SECTION 1: NOMENCLATURE MATIÈRES & FOURNITURES */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
              1. Nomenclature des Matières & Fournitures (BOM)
            </h3>
            <table className="w-full text-left border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Réf.</th>
                  <th className="p-2 border-r border-slate-300">Désignation</th>
                  <th className="p-2 text-right border-r border-slate-300">Qté Théorique</th>
                  <th className="p-2 border-r border-slate-300">Unité</th>
                  <th className="p-2 text-right border-r border-slate-300">Perte %</th>
                  <th className="p-2 text-right border-r border-slate-300">Qté Réelle Prévue</th>
                  {docType === 'gestion' && (
                    <>
                      <th className="p-2 text-right border-r border-slate-300">P.U. ({settings.currencySymbol})</th>
                      <th className="p-2 text-right">Total ({settings.currencySymbol})</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sheet.items.map((item) => (
                  <tr key={item.id}>
                    <td className="p-1.5 font-mono border-r border-slate-200">
                      {item.componentCode}
                    </td>
                    <td className="p-1.5 font-medium border-r border-slate-200">
                      {item.componentName}
                    </td>
                    <td className="p-1.5 text-right font-mono border-r border-slate-200">
                      {item.theoreticalQty}
                    </td>
                    <td className="p-1.5 border-r border-slate-200">{item.unit}</td>
                    <td className="p-1.5 text-right font-mono border-r border-slate-200">
                      {item.wastePercentage}%
                    </td>
                    <td className="p-1.5 text-right font-mono font-bold border-r border-slate-200">
                      {item.realQty}
                    </td>
                    {docType === 'gestion' && (
                      <>
                        <td className="p-1.5 text-right font-mono border-r border-slate-200">
                          {item.unitPrice.toFixed(3)}
                        </td>
                        <td className="p-1.5 text-right font-mono font-bold">
                          {item.totalCost.toFixed(3)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              {docType === 'gestion' && (
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <td colSpan={7} className="p-2 text-right">
                      Total Matières Directes (avec pertes) :
                    </td>
                    <td className="p-2 text-right font-mono text-slate-900">
                      {costs.totalDirectMaterialsCost.toFixed(3)} {settings.currencySymbol}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* SECTION 2: MAIN-D'ŒUVRE ET GAMME OPÉRATOIRE */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
              2. Gamme Opératoire & Main-d&apos;œuvre de Fabrication
            </h3>
            <table className="w-full text-left border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300">Ordre</th>
                  <th className="p-2 border-r border-slate-300">Opération / Poste</th>
                  <th className="p-2 text-right border-r border-slate-300">Temps Alloué</th>
                  <th className="p-2 text-center border-r border-slate-300">Opérateurs</th>
                  {docType === 'gestion' && (
                    <>
                      <th className="p-2 text-right border-r border-slate-300">Taux / Pièce</th>
                      <th className="p-2 text-right">Coût Total ({settings.currencySymbol})</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {sheet.laborOperations.map((op, idx) => (
                  <tr key={op.id}>
                    <td className="p-1.5 font-mono border-r border-slate-200 text-center">
                      {idx + 1}
                    </td>
                    <td className="p-1.5 font-medium border-r border-slate-200">
                      {op.name}
                    </td>
                    <td className="p-1.5 text-right font-mono border-r border-slate-200">
                      {op.timeMinutes} min
                    </td>
                    <td className="p-1.5 text-center font-mono border-r border-slate-200">
                      {op.operatorsCount}
                    </td>
                    {docType === 'gestion' && (
                      <>
                        <td className="p-1.5 text-right font-mono border-r border-slate-200">
                          {op.costType === 'hourly'
                            ? `${op.hourlyRate} ${settings.currencySymbol}/h`
                            : `${op.pieceRate} ${settings.currencySymbol}/pce`}
                        </td>
                        <td className="p-1.5 text-right font-mono font-bold">
                          {op.totalCost.toFixed(3)}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
              {docType === 'gestion' && (
                <tfoot>
                  <tr className="bg-slate-100 font-bold border-t-2 border-slate-300">
                    <td colSpan={5} className="p-2 text-right">
                      Total Main-d&apos;œuvre ({costs.totalLaborHours} h) :
                    </td>
                    <td className="p-2 text-right font-mono text-slate-900">
                      {costs.laborCost.toFixed(3)} {settings.currencySymbol}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>

          {/* SECTION 3: FINANCIAL SYNTHESIS (ONLY IN GESTION MODE) */}
          {docType === 'gestion' && (
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1 uppercase tracking-wide">
                3. Synthèse des Coûts de Revient & Tarification Commerciale
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-300 p-3 rounded space-y-1.5">
                  <div className="flex justify-between font-medium">
                    <span>Matières premières :</span>
                    <span className="font-mono">{costs.rawMaterialsCost.toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Fournitures & accessoires :</span>
                    <span className="font-mono">{costs.suppliesCost.toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Consommables & Emballages :</span>
                    <span className="font-mono">{(costs.consumablesCost + costs.packagingCost).toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Main-d&apos;œuvre de confection :</span>
                    <span className="font-mono">{costs.laborCost.toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Frais d&apos;atelier & charges indirectes :</span>
                    <span className="font-mono">{costs.overheadsCost.toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-slate-900">
                    <span>Coût Total du Lot :</span>
                    <span className="font-mono">{costs.totalBatchCost.toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                </div>

                <div className="border-2 border-slate-900 p-3 rounded bg-slate-50 space-y-2">
                  <div className="flex justify-between font-bold text-sm">
                    <span>COÛT DE REVIENT UNITAIRE :</span>
                    <span className="font-mono text-amber-700">{costs.unitCostPrice.toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                  <div className="flex justify-between font-semibold">
                    <span>Prix Vente Conseillé HT :</span>
                    <span className="font-mono text-emerald-800">{costs.suggestedSellingPriceHT.toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                  <div className="flex justify-between font-medium text-slate-600">
                    <span>TVA ({sheet.vatRate}%) / Prix TTC :</span>
                    <span className="font-mono">{costs.suggestedSellingPriceTTC.toFixed(3)} {settings.currencySymbol}</span>
                  </div>
                  <div className="border-t border-slate-300 pt-1 flex justify-between font-bold text-emerald-700">
                    <span>Marge Brute Prévue / Pièce :</span>
                    <span className="font-mono">+{costs.previsionalGrossMarginUnit.toFixed(3)} {settings.currencySymbol} ({costs.actualMarginOnSalesRate}%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Observations & Signatures Footer */}
          <div className="border-t border-slate-200 pt-4 grid grid-cols-2 gap-8 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-800 block mb-1">Observations d&apos;Atelier :</span>
              <p className="italic bg-slate-50 p-2 rounded border border-slate-200">
                {sheet.observations || 'Aucune consigne particulière.'}
              </p>
            </div>

            <div className="flex justify-between text-center pt-2">
              <div>
                <p className="font-bold text-slate-800">Visa Responsable Atelier</p>
                <div className="h-14 border-b border-dashed border-slate-400 mt-2"></div>
              </div>
              <div>
                <p className="font-bold text-slate-800">Visa Contrôle de Gestion</p>
                <div className="h-14 border-b border-dashed border-slate-400 mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
