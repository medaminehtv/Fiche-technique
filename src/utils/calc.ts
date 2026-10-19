import type {
  CostCalculationSummary,
  LaborOperation,
  OverheadCost,
  TechnicalSheet,
  TechnicalSheetItem,
  UnitType,
} from '../types/index.ts';

/**
 * Standard unit conversion factors to base SI/standard unit
 */
export function convertUnit(value: number, from: UnitType, to: UnitType): number {
  if (from === to) return value;

  // Length
  if (from === 'm' && to === 'cm') return value * 100;
  if (from === 'cm' && to === 'm') return value / 100;

  // Weight
  if (from === 'kg' && to === 'g') return value * 1000;
  if (from === 'g' && to === 'kg') return value / 1000;

  // Volume
  if (from === 'l' && to === 'ml') return value * 1000;
  if (from === 'ml' && to === 'l') return value / 1000;

  // Time
  if (from === 'heure' && to === 'minute') return value * 60;
  if (from === 'minute' && to === 'heure') return value / 60;

  // Defaults if non-convertible
  return value;
}

/**
 * Calculates real required quantity including waste/scrap percentage:
 * Quantité réelle = Quantité théorique * (1 + Taux de perte / 100)
 */
export function calculateItemRealQuantity(
  theoreticalQty: number,
  wastePercentage: number
): number {
  if (theoreticalQty <= 0) return 0;
  const wasteRatio = Math.max(0, wastePercentage || 0) / 100;
  return Number((theoreticalQty * (1 + wasteRatio)).toFixed(4));
}

/**
 * Calculates total cost of a technical sheet item line:
 * Coût = Quantité réelle * Prix unitaire
 */
export function calculateItemTotalCost(realQty: number, unitPrice: number): number {
  return Number((Math.max(0, realQty) * Math.max(0, unitPrice)).toFixed(4));
}

/**
 * Recalculates an entire TechnicalSheetItem given theoreticalQty, wastePercentage, unitPrice
 */
export function updateSheetItem(
  item: TechnicalSheetItem,
  updates: Partial<TechnicalSheetItem>
): TechnicalSheetItem {
  const theoreticalQty = updates.theoreticalQty !== undefined ? updates.theoreticalQty : item.theoreticalQty;
  const wastePercentage = updates.wastePercentage !== undefined ? updates.wastePercentage : item.wastePercentage;
  const unitPrice = updates.unitPrice !== undefined ? updates.unitPrice : item.unitPrice;

  const realQty = calculateItemRealQuantity(theoreticalQty, wastePercentage);
  const totalCost = calculateItemTotalCost(realQty, unitPrice);

  return {
    ...item,
    ...updates,
    theoreticalQty,
    wastePercentage,
    unitPrice,
    realQty,
    totalCost,
  };
}

/**
 * Calculates labor operation cost:
 * If hourly: (timeMinutes / 60) * hourlyRate * operatorsCount
 * If piece: pieceRate * batchQty * operatorsCount
 */
export function calculateLaborOperationCost(
  op: LaborOperation,
  batchQuantity: number = 1
): number {
  const operators = Math.max(1, op.operatorsCount || 1);
  if (op.costType === 'piece') {
    const rate = Math.max(0, op.pieceRate || 0);
    return Number((rate * batchQuantity * operators).toFixed(4));
  } else {
    const hours = Math.max(0, op.timeMinutes || 0) / 60;
    const rate = Math.max(0, op.hourlyRate || 0);
    return Number((hours * rate * operators).toFixed(4));
  }
}

/**
 * Calculates total labor hours for a set of operations
 */
export function calculateTotalLaborHours(operations: LaborOperation[]): number {
  return operations.reduce((acc, op) => {
    const hours = (Math.max(0, op.timeMinutes || 0) / 60) * Math.max(1, op.operatorsCount || 1);
    return acc + hours;
  }, 0);
}

/**
 * Calculates overhead allocation for a specific overhead rule:
 * - 'percent_material': materialsCost * rate / 100
 * - 'percent_labor': laborCost * rate / 100
 * - 'fixed_per_unit': rate * batchQuantity
 * - 'hourly_rate': totalLaborHours * rate
 * - 'batch_spread': rate (fixed for the batch)
 */
export function calculateOverheadCost(
  overhead: OverheadCost,
  context: {
    directMaterialsCost: number;
    laborCost: number;
    totalLaborHours: number;
    batchQuantity: number;
  }
): number {
  if (!overhead.isActive) return 0;
  const rate = Math.max(0, overhead.rateOrAmount || 0);

  switch (overhead.allocationMethod) {
    case 'percent_material':
      return Number(((context.directMaterialsCost * rate) / 100).toFixed(4));
    case 'percent_labor':
      return Number(((context.laborCost * rate) / 100).toFixed(4));
    case 'fixed_per_unit':
      return Number((rate * Math.max(1, context.batchQuantity)).toFixed(4));
    case 'hourly_rate':
      return Number((context.totalLaborHours * rate).toFixed(4));
    case 'batch_spread':
      return Number(rate.toFixed(4));
    default:
      return 0;
  }
}

/**
 * Calculates suggested selling price based on cost and margin strategy:
 * Target Margin on Selling Price: SellingPrice = Cost / (1 - (Margin / 100))
 * Markup on Cost: SellingPrice = Cost * (1 + (Markup / 100))
 */
export function calculateSellingPrice(
  unitCost: number,
  strategy: 'target_margin' | 'cost_markup',
  ratePercentage: number
): number {
  if (unitCost <= 0) return 0;
  const rate = Math.max(0, ratePercentage || 0);

  if (strategy === 'target_margin') {
    // Taux de marque : Prix = Coût / (1 - Taux)
    // Taux cannot reach or exceed 100%
    if (rate >= 100) {
      // Clamped to avoid division by zero or negative price
      return Number((unitCost / 0.01).toFixed(3));
    }
    const marginFactor = 1 - rate / 100;
    return Number((unitCost / marginFactor).toFixed(3));
  } else {
    // Taux de majoration : Prix = Coût * (1 + Taux)
    const markupFactor = 1 + rate / 100;
    return Number((unitCost * markupFactor).toFixed(3));
  }
}

/**
 * Master Cost Calculation Engine
 * Computes all items, labor, waste, overheads, unit cost and margins for a Technical Sheet.
 */
export function computeTechnicalSheetCosts(
  sheet: TechnicalSheet
): CostCalculationSummary {
  const batchQuantity = Math.max(1, sheet.batchQuantity || 1);
  const yieldRate = Math.min(100, Math.max(1, sheet.productionYieldRate || 100));
  const goodUnitsObtained = Number((batchQuantity * (yieldRate / 100)).toFixed(2));

  let rawMaterialsCost = 0;
  let suppliesCost = 0;
  let consumablesCost = 0;
  let packagingCost = 0;
  let wasteCost = 0;

  for (const item of sheet.items) {
    const theoretical = Math.max(0, item.theoreticalQty || 0);
    const wastePct = Math.max(0, item.wastePercentage || 0);
    const unitPrice = Math.max(0, item.unitPrice || 0);

    const realQty = calculateItemRealQuantity(theoretical, wastePct);
    const lineCost = calculateItemTotalCost(realQty, unitPrice);
    const lineWasteCost = calculateItemTotalCost(realQty - theoretical, unitPrice);

    wasteCost += lineWasteCost;

    switch (item.category) {
      case 'matiere_premiere':
        rawMaterialsCost += lineCost;
        break;
      case 'fourniture_accessoire':
        suppliesCost += lineCost;
        break;
      case 'consommable':
        consumablesCost += lineCost;
        break;
      case 'emballage':
        packagingCost += lineCost;
        break;
      default:
        rawMaterialsCost += lineCost;
        break;
    }
  }

  const totalDirectMaterialsCost =
    rawMaterialsCost + suppliesCost + consumablesCost + packagingCost;

  // Labor
  let laborCost = 0;
  for (const op of sheet.laborOperations) {
    laborCost += calculateLaborOperationCost(op, batchQuantity);
  }
  const totalLaborHours = calculateTotalLaborHours(sheet.laborOperations);

  // Overheads
  let overheadsCost = 0;
  for (const ov of sheet.overheads) {
    overheadsCost += calculateOverheadCost(ov, {
      directMaterialsCost: totalDirectMaterialsCost,
      laborCost,
      totalLaborHours,
      batchQuantity,
    });
  }

  // Total batch cost
  const totalBatchCost = totalDirectMaterialsCost + laborCost + overheadsCost;

  // Unit cost price (incorporates yield rate: cost divided by good units)
  const unitCostPrice =
    goodUnitsObtained > 0
      ? Number((totalBatchCost / goodUnitsObtained).toFixed(3))
      : 0;

  // Suggested Selling Price
  const suggestedSellingPriceHT = calculateSellingPrice(
    unitCostPrice,
    sheet.marginStrategy,
    sheet.targetMarginRate
  );

  const vatRate = Math.max(0, sheet.vatRate || 0);
  const suggestedSellingPriceTTC = Number(
    (suggestedSellingPriceHT * (1 + vatRate / 100)).toFixed(3)
  );

  const previsionalGrossMarginUnit = Number(
    (suggestedSellingPriceHT - unitCostPrice).toFixed(3)
  );

  // Taux de marque = (Prix de vente HT - Coût de revient) / Prix de vente HT
  const actualMarginOnSalesRate =
    suggestedSellingPriceHT > 0
      ? Number(
          (
            ((suggestedSellingPriceHT - unitCostPrice) / suggestedSellingPriceHT) *
            100
          ).toFixed(2)
        )
      : 0;

  // Taux de marge = (Prix de vente HT - Coût de revient) / Coût de revient
  const actualMarkupOnCostRate =
    unitCostPrice > 0
      ? Number(
          (
            ((suggestedSellingPriceHT - unitCostPrice) / unitCostPrice) *
            100
          ).toFixed(2)
        )
      : 0;

  return {
    rawMaterialsCost: Number(rawMaterialsCost.toFixed(3)),
    suppliesCost: Number(suppliesCost.toFixed(3)),
    consumablesCost: Number(consumablesCost.toFixed(3)),
    packagingCost: Number(packagingCost.toFixed(3)),
    totalDirectMaterialsCost: Number(totalDirectMaterialsCost.toFixed(3)),
    wasteCost: Number(wasteCost.toFixed(3)),
    laborCost: Number(laborCost.toFixed(3)),
    totalLaborHours: Number(totalLaborHours.toFixed(2)),
    overheadsCost: Number(overheadsCost.toFixed(3)),
    totalBatchCost: Number(totalBatchCost.toFixed(3)),
    batchQuantity,
    goodUnitsObtained,
    unitCostPrice,
    suggestedSellingPriceHT,
    suggestedSellingPriceTTC,
    previsionalGrossMarginUnit,
    actualMarginOnSalesRate,
    actualMarkupOnCostRate,
  };
}
