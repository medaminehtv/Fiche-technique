export type ComponentCategory =
  | 'matiere_premiere'
  | 'fourniture_accessoire'
  | 'consommable'
  | 'emballage'
  | 'autre';

export type UnitType =
  | 'm'
  | 'cm'
  | 'm2'
  | 'kg'
  | 'g'
  | 'l'
  | 'ml'
  | 'piece'
  | 'rouleau'
  | 'paquet'
  | 'boite'
  | 'heure'
  | 'minute'
  | 'autre';

export interface Supplier {
  id: string;
  name: string;
  code: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
}

export interface UnitConversion {
  fromUnit: UnitType;
  toUnit: UnitType;
  factor: number; // toUnit = fromUnit * factor
}

export interface ComponentItem {
  id: string;
  code: string;
  name: string;
  category: ComponentCategory;
  description?: string;
  unit: UnitType;
  unitPrice: number; // In base currency (TND)
  supplierId?: string;
  supplierName?: string;
  lastPriceDate: string;
  stockEnabled: boolean;
  stockQty: number;
  stockMin: number;
  defaultWastePercentage: number;
  // For consumables:
  consumableAllocationType?: 'direct' | 'spread'; // 'direct' per unit or 'spread'
  spreadKey?: 'units' | 'hours' | 'batch';
  notes?: string;
  isActive: boolean;
}

export interface TechnicalSheetItem {
  id: string;
  componentId: string;
  componentCode: string;
  componentName: string;
  category: ComponentCategory;
  theoreticalQty: number; // Quantité théorique
  unit: UnitType;
  wastePercentage: number; // Taux de perte en %
  realQty: number; // Quantité réelle = theoreticalQty * (1 + wastePercentage / 100)
  unitPrice: number; // Prix unitaire
  totalCost: number; // realQty * unitPrice
  notes?: string;
}

export interface LaborOperation {
  id: string;
  name: string;
  description?: string;
  timeMinutes: number; // in minutes
  hourlyRate: number; // TND/hour
  costType: 'hourly' | 'piece'; // hourly calculation or flat piece rate
  pieceRate?: number; // if costType === 'piece'
  operatorsCount: number;
  totalCost: number; // computed
}

export type OverheadAllocationMethod =
  | 'percent_material'
  | 'percent_labor'
  | 'fixed_per_unit'
  | 'hourly_rate'
  | 'batch_spread';

export interface OverheadCost {
  id: string;
  name: string;
  allocationMethod: OverheadAllocationMethod;
  rateOrAmount: number; // % or TND value
  description?: string;
  isActive: boolean;
  computedCost?: number;
}

export type ProductStatus = 'brouillon' | 'validee' | 'archivee';

export interface TechnicalSheetVersion {
  versionNumber: number;
  date: string;
  author: string;
  changeSummary: string;
  unitCost: number;
  sellingPrice: number;
  marginRate: number;
  batchQty: number;
  items: TechnicalSheetItem[];
  laborOperations: LaborOperation[];
  overheads: OverheadCost[];
}

export interface TechnicalSheet {
  id: string;
  reference: string;
  name: string;
  category: string;
  description: string;
  imageUrl?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  status: ProductStatus;
  batchQuantity: number; // Reference production batch (ex: 1 or 50 pieces)
  productionUnit: string; // ex: "pièce", "ensemble"
  productionYieldRate: number; // in % (ex: 98% good pieces, default 100%)
  observations?: string;

  // Components breakdown
  items: TechnicalSheetItem[];

  // Labor
  laborOperations: LaborOperation[];

  // Overheads
  overheads: OverheadCost[];

  // Pricing & Margins strategy
  marginStrategy: 'target_margin' | 'cost_markup'; // 'target_margin' = on selling price, 'cost_markup' = on cost
  targetMarginRate: number; // % (ex: 35%)
  vatRate: number; // % TVA (ex: 19% or 0%)

  // Version History snapshots
  versionsHistory: TechnicalSheetVersion[];
}

export interface StockMovement {
  id: string;
  componentId: string;
  componentCode: string;
  componentName: string;
  date: string;
  type: 'in' | 'out' | 'adjustment' | 'production_batch';
  quantity: number;
  unitPrice?: number;
  referenceDoc?: string;
  notes?: string;
}

export interface ProductionBatchOrder {
  id: string;
  batchCode: string;
  technicalSheetId: string;
  productReference: string;
  productName: string;
  plannedQty: number;
  producedQty: number;
  startDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  stockDeducted: boolean;
  notes?: string;
}

export interface CompanySettings {
  companyName: string;
  logoUrl?: string;
  registrationNumber: string; // Matricule Fiscal
  address: string;
  phone: string;
  email: string;
  currency: string;
  currencySymbol: string;
  currencyDecimals: number;
  defaultVatRate: number;
  defaultTargetMargin: number;
  language: 'fr' | 'ar' | 'en';
}

export interface CostCalculationSummary {
  rawMaterialsCost: number;
  suppliesCost: number;
  consumablesCost: number;
  packagingCost: number;
  totalDirectMaterialsCost: number;
  wasteCost: number; // Cost of the scrap material portion
  laborCost: number;
  totalLaborHours: number;
  overheadsCost: number;
  totalBatchCost: number;
  batchQuantity: number;
  goodUnitsObtained: number;
  unitCostPrice: number; // Coût de revient unitaire
  suggestedSellingPriceHT: number;
  suggestedSellingPriceTTC: number;
  previsionalGrossMarginUnit: number;
  actualMarginOnSalesRate: number; // Taux de marque
  actualMarkupOnCostRate: number; // Taux de marge
}
