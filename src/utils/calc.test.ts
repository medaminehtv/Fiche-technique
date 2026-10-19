import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateItemRealQuantity,
  calculateItemTotalCost,
  calculateLaborOperationCost,
  calculateOverheadCost,
  calculateSellingPrice,
  computeTechnicalSheetCosts,
  convertUnit,
} from './calc.ts';
import type { TechnicalSheet } from '../types/index.ts';

test('calculateItemRealQuantity computes theoretical quantity with waste percentage', () => {
  // Test case from prompt: 2m with 5% waste -> 2.10m
  const resPrompt = calculateItemRealQuantity(2, 5);
  assert.equal(resPrompt, 2.1);

  // 2.5m with 5% waste -> 2.625m
  const resTunic = calculateItemRealQuantity(2.5, 5);
  assert.equal(resTunic, 2.625);

  // 0% waste
  assert.equal(calculateItemRealQuantity(10, 0), 10);

  // 0 or negative theoretical quantity
  assert.equal(calculateItemRealQuantity(0, 10), 0);
  assert.equal(calculateItemRealQuantity(-5, 10), 0);
});

test('calculateItemTotalCost computes realQty * unitPrice', () => {
  assert.equal(calculateItemTotalCost(2.1, 15), 31.5);
  assert.equal(calculateItemTotalCost(2.625, 18), 47.25);
  assert.equal(calculateItemTotalCost(0, 50), 0);
});

test('convertUnit performs standard conversions', () => {
  assert.equal(convertUnit(2.5, 'm', 'cm'), 250);
  assert.equal(convertUnit(250, 'cm', 'm'), 2.5);
  assert.equal(convertUnit(1.5, 'kg', 'g'), 1500);
  assert.equal(convertUnit(500, 'g', 'kg'), 0.5);
  assert.equal(convertUnit(2, 'heure', 'minute'), 120);
  assert.equal(convertUnit(90, 'minute', 'heure'), 1.5);
});

test('calculateLaborOperationCost calculates hourly and piece rates correctly', () => {
  // Hourly: 30 minutes at 12 TND/hour with 1 operator -> 6 TND
  const opHourly = {
    id: '1',
    name: 'Coupe',
    timeMinutes: 30,
    hourlyRate: 12,
    costType: 'hourly' as const,
    operatorsCount: 1,
    totalCost: 0,
  };
  assert.equal(calculateLaborOperationCost(opHourly, 1), 6);

  // Hourly: 45 minutes at 16 TND/hour with 2 operators -> (0.75 * 16 * 2) = 24 TND
  const opTwoOperators = {
    ...opHourly,
    timeMinutes: 45,
    hourlyRate: 16,
    operatorsCount: 2,
  };
  assert.equal(calculateLaborOperationCost(opTwoOperators, 1), 24);

  // Piece rate: 3.5 TND per piece for batch of 10
  const opPiece = {
    id: '2',
    name: 'Boutonnage',
    timeMinutes: 0,
    hourlyRate: 0,
    costType: 'piece' as const,
    pieceRate: 3.5,
    operatorsCount: 1,
    totalCost: 0,
  };
  assert.equal(calculateLaborOperationCost(opPiece, 10), 35);
});

test('calculateOverheadCost evaluates different allocation methods', () => {
  const context = {
    directMaterialsCost: 100,
    laborCost: 50,
    totalLaborHours: 2.5,
    batchQuantity: 5,
  };

  // % of material: 10% of 100 TND = 10 TND
  const ovMat = {
    id: '1',
    name: 'Frais matière',
    allocationMethod: 'percent_material' as const,
    rateOrAmount: 10,
    isActive: true,
  };
  assert.equal(calculateOverheadCost(ovMat, context), 10);

  // % of labor: 20% of 50 TND = 10 TND
  const ovLab = {
    id: '2',
    name: 'Frais atelier main-d’œuvre',
    allocationMethod: 'percent_labor' as const,
    rateOrAmount: 20,
    isActive: true,
  };
  assert.equal(calculateOverheadCost(ovLab, context), 10);

  // Fixed per unit: 2 TND * 5 units = 10 TND
  const ovUnit = {
    id: '3',
    name: 'Amortissement unitaire',
    allocationMethod: 'fixed_per_unit' as const,
    rateOrAmount: 2,
    isActive: true,
  };
  assert.equal(calculateOverheadCost(ovUnit, context), 10);

  // Hourly rate: 4 TND/hour * 2.5 hours = 10 TND
  const ovHourly = {
    id: '4',
    name: 'Énergie horaire',
    allocationMethod: 'hourly_rate' as const,
    rateOrAmount: 4,
    isActive: true,
  };
  assert.equal(calculateOverheadCost(ovHourly, context), 10);

  // Inactive overhead returns 0
  assert.equal(calculateOverheadCost({ ...ovHourly, isActive: false }, context), 0);
});

test('calculateSellingPrice correctly distinguishes target margin on sales vs markup on cost', () => {
  const cost = 100;

  // Target margin on sales: 35% margin -> 100 / (1 - 0.35) = 153.846 TND
  const priceTarget = calculateSellingPrice(cost, 'target_margin', 35);
  assert.equal(priceTarget, 153.846);

  // Markup on cost: 35% markup -> 100 * (1 + 0.35) = 135 TND
  const priceMarkup = calculateSellingPrice(cost, 'cost_markup', 35);
  assert.equal(priceMarkup, 135);

  // Safeguard against >= 100% margin on sales
  const priceExtreme = calculateSellingPrice(cost, 'target_margin', 100);
  assert.ok(priceExtreme > 0 && Number.isFinite(priceExtreme));
});

test('computeTechnicalSheetCosts full end-to-end integration test with Tunisian Artisan Tunic', () => {
  const tunicSheet: TechnicalSheet = {
    id: 'tunic-1',
    reference: 'TUN-2026-001',
    name: 'Tunique Traditionnelle Brodée',
    category: 'Vêtements traditionnels',
    description: 'Tunique avec broderie artisanale au fil de soie',
    version: 1,
    createdAt: '2026-10-19',
    updatedAt: '2026-10-19',
    status: 'validee',
    batchQuantity: 1,
    productionUnit: 'pièce',
    productionYieldRate: 100,
    items: [
      {
        id: 'i1',
        componentId: 'c1',
        componentCode: 'TIS-01',
        componentName: 'Tissu Lin Pur',
        category: 'matiere_premiere',
        theoreticalQty: 2.5,
        unit: 'm',
        wastePercentage: 5, // real: 2.625m
        realQty: 2.625,
        unitPrice: 18, // 47.25 TND
        totalCost: 47.25,
      },
      {
        id: 'i2',
        componentId: 'c2',
        componentCode: 'DOU-01',
        componentName: 'Doublure Coton',
        category: 'matiere_premiere',
        theoreticalQty: 0.8,
        unit: 'm',
        wastePercentage: 5, // real: 0.84m
        realQty: 0.84,
        unitPrice: 8, // 6.72 TND
        totalCost: 6.72,
      },
      {
        id: 'i3',
        componentId: 'c3',
        componentCode: 'ACC-01',
        componentName: 'Boutons Artisanaux',
        category: 'fourniture_accessoire',
        theoreticalQty: 6,
        unit: 'piece',
        wastePercentage: 0,
        realQty: 6,
        unitPrice: 0.5, // 3.00 TND
        totalCost: 3.0,
      },
      {
        id: 'i4',
        componentId: 'c4',
        componentCode: 'EMB-01',
        componentName: 'Housse & Sachet',
        category: 'emballage',
        theoreticalQty: 1,
        unit: 'piece',
        wastePercentage: 0,
        realQty: 1,
        unitPrice: 2.0, // 2.00 TND
        totalCost: 2.0,
      },
    ],
    laborOperations: [
      {
        id: 'l1',
        name: 'Patronage & Découpe',
        timeMinutes: 30, // 0.5h
        hourlyRate: 12, // 6 TND
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 6,
      },
      {
        id: 'l2',
        name: 'Broderie main',
        timeMinutes: 90, // 1.5h
        hourlyRate: 14, // 21 TND
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 21,
      },
    ],
    overheads: [
      {
        id: 'o1',
        name: 'Énergie & machines',
        allocationMethod: 'fixed_per_unit',
        rateOrAmount: 4.5,
        isActive: true,
      },
    ],
    marginStrategy: 'target_margin',
    targetMarginRate: 30, // 30% margin on sales
    vatRate: 19,
    versionsHistory: [],
  };

  const summary = computeTechnicalSheetCosts(tunicSheet);

  // Raw materials: 47.25 + 6.72 = 53.97
  assert.equal(summary.rawMaterialsCost, 53.97);
  // Supplies: 3.00
  assert.equal(summary.suppliesCost, 3.0);
  // Packaging: 2.00
  assert.equal(summary.packagingCost, 2.0);
  // Total direct materials: 53.97 + 3.00 + 2.00 = 58.97
  assert.equal(summary.totalDirectMaterialsCost, 58.97);

  // Labor: 6 (coupe) + 21 (broderie) = 27 TND
  assert.equal(summary.laborCost, 27.0);

  // Overheads: 4.5 TND
  assert.equal(summary.overheadsCost, 4.5);

  // Total batch cost = 58.97 + 27.00 + 4.50 = 90.47 TND
  assert.equal(summary.totalBatchCost, 90.47);
  assert.equal(summary.unitCostPrice, 90.47);

  // Sales price with 30% target margin on selling price: 90.47 / 0.70 = 129.243 TND HT
  assert.equal(summary.suggestedSellingPriceHT, 129.243);

  // Previsional gross margin = 129.243 - 90.47 = 38.773 TND
  assert.equal(summary.previsionalGrossMarginUnit, 38.773);

  // Margin on sales rate ~ 30%
  assert.equal(summary.actualMarginOnSalesRate, 30.0);
});
