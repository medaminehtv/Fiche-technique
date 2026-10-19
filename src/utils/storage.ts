import {
  CompanySettings,
  ComponentItem,
  ProductionBatchOrder,
  StockMovement,
  Supplier,
  TechnicalSheet,
} from '../types';

export const DEFAULT_SETTINGS: CompanySettings = {
  companyName: 'Atelier Confection & Artisanat Carthage',
  registrationNumber: '1458923/B/A/M/000',
  address: 'Zone Artisanale La Soukra, Tunis, Tunisie',
  phone: '+216 71 890 120',
  email: 'contact@atelier-carthage.tn',
  currency: 'TND',
  currencySymbol: 'DT',
  currencyDecimals: 3,
  defaultVatRate: 19,
  defaultTargetMargin: 35,
  language: 'fr',
};

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-1',
    code: 'FRS-KSH',
    name: 'Tissages & Soieries de Ksar Hellal',
    contactPerson: 'M. Karim Bouzid',
    phone: '+216 73 450 110',
    email: 'commercial@soie-ksarhellal.tn',
    city: 'Ksar Hellal',
    notes: 'Fournisseur principal lins, cotonnades et soies sauvages',
  },
  {
    id: 'sup-2',
    code: 'FRS-SFX',
    name: 'Tanneries Réunies de Sfax',
    contactPerson: 'Mme. Salma Trabelsi',
    phone: '+216 74 220 890',
    email: 'commandes@tanneries-sfax.tn',
    city: 'Sfax',
    notes: 'Cuirs pleine fleur, vachette végétale et agneau',
  },
  {
    id: 'sup-3',
    code: 'FRS-MED',
    name: 'Comptoir Quincaillerie & Fournitures Médina',
    contactPerson: 'M. Mohamed Ben Salem',
    phone: '+216 71 320 440',
    email: 'fournitures.medina@gnet.tn',
    city: 'Tunis',
    notes: 'Boutons bois dolivier, nacre, zips et rivets laiton',
  },
  {
    id: 'sup-4',
    code: 'FRS-CAR',
    name: 'Cartonnerie & Emballages Éco-Carthage',
    contactPerson: 'Mme. Inès Gharbi',
    phone: '+216 71 905 600',
    email: 'info@eco-carthage-pack.tn',
    city: 'Ariana',
    notes: 'Boîtes cadeaux kraft, papier de soie et housses tissus',
  },
];

export const INITIAL_COMPONENTS: ComponentItem[] = [
  // MATIÈRES PREMIÈRES
  {
    id: 'comp-1',
    code: 'MAT-LIN-01',
    name: 'Tissu Lin Naturel Sablé 240g',
    category: 'matiere_premiere',
    description: 'Lin 100% lavé haut de gamme certifié Oeko-Tex',
    unit: 'm',
    unitPrice: 22.5,
    supplierId: 'sup-1',
    supplierName: 'Tissages & Soieries de Ksar Hellal',
    lastPriceDate: '2026-09-15',
    stockEnabled: true,
    stockQty: 85.5,
    stockMin: 20.0,
    defaultWastePercentage: 5,
    isActive: true,
  },
  {
    id: 'comp-2',
    code: 'MAT-DOU-02',
    name: 'Doublure Satin Soie Végétale',
    category: 'matiere_premiere',
    description: 'Doublure respirante douce pour vêtements et vestes',
    unit: 'm',
    unitPrice: 9.8,
    supplierId: 'sup-1',
    supplierName: 'Tissages & Soieries de Ksar Hellal',
    lastPriceDate: '2026-09-20',
    stockEnabled: true,
    stockQty: 110.0,
    stockMin: 25.0,
    defaultWastePercentage: 4,
    isActive: true,
  },
  {
    id: 'comp-3',
    code: 'MAT-CUI-03',
    name: 'Cuir Pleine Fleur Tannage Végétal Camel',
    category: 'matiere_premiere',
    description: 'Peau vachette 1.4-1.6mm qualité sellier',
    unit: 'm2',
    unitPrice: 85.0,
    supplierId: 'sup-2',
    supplierName: 'Tanneries Réunies de Sfax',
    lastPriceDate: '2026-10-02',
    stockEnabled: true,
    stockQty: 14.5,
    stockMin: 10.0,
    defaultWastePercentage: 12,
    isActive: true,
  },
  {
    id: 'comp-4',
    code: 'MAT-LAI-04',
    name: 'Laine Mérinos Filée à la Main',
    category: 'matiere_premiere',
    description: 'Fil naturel teinté avec pigments végétaux artisanaux',
    unit: 'kg',
    unitPrice: 48.0,
    supplierId: 'sup-1',
    supplierName: 'Tissages & Soieries de Ksar Hellal',
    lastPriceDate: '2026-08-10',
    stockEnabled: true,
    stockQty: 6.2,
    stockMin: 8.0, // Alert: Low stock
    defaultWastePercentage: 8,
    isActive: true,
  },

  // FOURNITURES ET ACCESSOIRES
  {
    id: 'comp-5',
    code: 'ACC-BOU-01',
    name: "Boutons en Bois d'Olivier Artisanal 22mm",
    category: 'fourniture_accessoire',
    description: 'Taillés à la main, finition cire d’abeille naturelle',
    unit: 'piece',
    unitPrice: 0.65,
    supplierId: 'sup-3',
    supplierName: 'Comptoir Quincaillerie & Fournitures Médina',
    lastPriceDate: '2026-10-01',
    stockEnabled: true,
    stockQty: 450,
    stockMin: 100,
    defaultWastePercentage: 0,
    isActive: true,
  },
  {
    id: 'comp-6',
    code: 'ACC-ZIP-02',
    name: 'Fermeture Éclair Métal Laiton Vieilli 45cm',
    category: 'fourniture_accessoire',
    description: 'Glissière robuste non séparable maille 5mm',
    unit: 'piece',
    unitPrice: 2.4,
    supplierId: 'sup-3',
    supplierName: 'Comptoir Quincaillerie & Fournitures Médina',
    lastPriceDate: '2026-09-12',
    stockEnabled: true,
    stockQty: 85,
    stockMin: 30,
    defaultWastePercentage: 0,
    isActive: true,
  },
  {
    id: 'comp-7',
    code: 'ACC-FIL-03',
    name: 'Fil de Soie pour Broderie Traditionnelle',
    category: 'fourniture_accessoire',
    description: 'Bobine 100m fil doré et argenté grand teint',
    unit: 'rouleau',
    unitPrice: 6.5,
    supplierId: 'sup-3',
    supplierName: 'Comptoir Quincaillerie & Fournitures Médina',
    lastPriceDate: '2026-09-28',
    stockEnabled: true,
    stockQty: 24,
    stockMin: 15,
    defaultWastePercentage: 10,
    isActive: true,
  },
  {
    id: 'comp-8',
    code: 'ACC-RIV-04',
    name: 'Rivets Doubles Laiton Massif 9mm',
    category: 'fourniture_accessoire',
    description: 'Pour fixation hanses et renforts cuir',
    unit: 'piece',
    unitPrice: 0.22,
    supplierId: 'sup-3',
    supplierName: 'Comptoir Quincaillerie & Fournitures Médina',
    lastPriceDate: '2026-07-15',
    stockEnabled: true,
    stockQty: 600,
    stockMin: 150,
    defaultWastePercentage: 2,
    isActive: true,
  },
  {
    id: 'comp-9',
    code: 'ACC-ETI-05',
    name: 'Étiquettes de Marque Tissées Damassées',
    category: 'fourniture_accessoire',
    description: 'Griffe couture col pliée bord à bord',
    unit: 'piece',
    unitPrice: 0.35,
    supplierId: 'sup-3',
    supplierName: 'Comptoir Quincaillerie & Fournitures Médina',
    lastPriceDate: '2026-05-10',
    stockEnabled: true,
    stockQty: 320,
    stockMin: 100,
    defaultWastePercentage: 0,
    isActive: true,
  },

  // CONSOMMABLES DE FABRICATION
  {
    id: 'comp-10',
    code: 'CSM-AIG-01',
    name: 'Aiguilles Machine Industrielle Schmetz 90',
    category: 'consommable',
    description: 'Boîte de 10 aiguilles pointe ronde',
    unit: 'boite',
    unitPrice: 8.5,
    supplierId: 'sup-3',
    supplierName: 'Comptoir Quincaillerie & Fournitures Médina',
    lastPriceDate: '2026-08-15',
    stockEnabled: true,
    stockQty: 18,
    stockMin: 10,
    defaultWastePercentage: 0,
    consumableAllocationType: 'spread',
    spreadKey: 'units',
    isActive: true,
  },
  {
    id: 'comp-11',
    code: 'CSM-COL-02',
    name: 'Colle Néoprène Contact Maroquinerie',
    category: 'consommable',
    description: 'Bidon 1L pour collage doublures et cuirs',
    unit: 'l',
    unitPrice: 16.0,
    supplierId: 'sup-3',
    supplierName: 'Comptoir Quincaillerie & Fournitures Médina',
    lastPriceDate: '2026-09-01',
    stockEnabled: true,
    stockQty: 4,
    stockMin: 5, // Alert: Low stock
    defaultWastePercentage: 5,
    consumableAllocationType: 'direct',
    isActive: true,
  },
  {
    id: 'comp-12',
    code: 'CSM-PAT-03',
    name: 'Papier de Coupe & Patronage Kraft 80g',
    category: 'consommable',
    description: 'Rouleau 100m largeur 1.20m',
    unit: 'rouleau',
    unitPrice: 32.0,
    supplierId: 'sup-4',
    supplierName: 'Cartonnerie & Emballages Éco-Carthage',
    lastPriceDate: '2026-06-12',
    stockEnabled: true,
    stockQty: 5,
    stockMin: 2,
    defaultWastePercentage: 0,
    consumableAllocationType: 'spread',
    spreadKey: 'batch',
    isActive: true,
  },

  // EMBALLAGES
  {
    id: 'comp-13',
    code: 'EMB-BOI-01',
    name: 'Boîte Cadeau Rigide Aimantée avec Logo Doré',
    category: 'emballage',
    description: 'Boîte carton kraft pelliculé mat intérieur noir',
    unit: 'piece',
    unitPrice: 4.8,
    supplierId: 'sup-4',
    supplierName: 'Cartonnerie & Emballages Éco-Carthage',
    lastPriceDate: '2026-10-05',
    stockEnabled: true,
    stockQty: 65,
    stockMin: 30,
    defaultWastePercentage: 0,
    isActive: true,
  },
  {
    id: 'comp-14',
    code: 'EMB-HOU-02',
    name: 'Housse Textile Coton Non-Tissé avec Fermeture',
    category: 'emballage',
    description: 'Protection vêtement et sac respirante anti-poussière',
    unit: 'piece',
    unitPrice: 2.2,
    supplierId: 'sup-4',
    supplierName: 'Cartonnerie & Emballages Éco-Carthage',
    lastPriceDate: '2026-09-18',
    stockEnabled: true,
    stockQty: 140,
    stockMin: 50,
    defaultWastePercentage: 0,
    isActive: true,
  },
  {
    id: 'comp-15',
    code: 'EMB-SAC-03',
    name: 'Sac Kraft Poignées Torsadées Haut de Gamme',
    category: 'emballage',
    description: 'Sac boutique 32x12x40cm impression soignée',
    unit: 'piece',
    unitPrice: 1.1,
    supplierId: 'sup-4',
    supplierName: 'Cartonnerie & Emballages Éco-Carthage',
    lastPriceDate: '2026-08-22',
    stockEnabled: true,
    stockQty: 250,
    stockMin: 80,
    defaultWastePercentage: 0,
    isActive: true,
  },
];

export const INITIAL_TECHNICAL_SHEETS: TechnicalSheet[] = [
  {
    id: 'sheet-1',
    reference: 'TUN-MOD-001',
    name: 'Tunique Traditionnelle Brodée Carthage',
    category: 'Vêtements traditionnels',
    description:
      'Tunique ample en pur lin naturel avec broderie artisanale au fil de soie sur col et poignets, boutons olivier et doublure partielle.',
    imageUrl:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    version: 1,
    createdAt: '2026-10-10',
    updatedAt: '2026-10-18',
    status: 'validee',
    batchQuantity: 1,
    productionUnit: 'pièce',
    productionYieldRate: 100,
    observations:
      'Repassage doux à la vapeur sur lenvers des broderies pour conserver le relief.',
    items: [
      {
        id: 'tsi-1',
        componentId: 'comp-1',
        componentCode: 'MAT-LIN-01',
        componentName: 'Tissu Lin Naturel Sablé 240g',
        category: 'matiere_premiere',
        theoreticalQty: 2.5,
        unit: 'm',
        wastePercentage: 6,
        realQty: 2.65,
        unitPrice: 22.5,
        totalCost: 59.625,
      },
      {
        id: 'tsi-2',
        componentId: 'comp-2',
        componentCode: 'MAT-DOU-02',
        componentName: 'Doublure Satin Soie Végétale',
        category: 'matiere_premiere',
        theoreticalQty: 0.8,
        unit: 'm',
        wastePercentage: 5,
        realQty: 0.84,
        unitPrice: 9.8,
        totalCost: 8.232,
      },
      {
        id: 'tsi-3',
        componentId: 'comp-5',
        componentCode: 'ACC-BOU-01',
        componentName: "Boutons en Bois d'Olivier Artisanal 22mm",
        category: 'fourniture_accessoire',
        theoreticalQty: 6,
        unit: 'piece',
        wastePercentage: 0,
        realQty: 6,
        unitPrice: 0.65,
        totalCost: 3.9,
      },
      {
        id: 'tsi-4',
        componentId: 'comp-7',
        componentCode: 'ACC-FIL-03',
        componentName: 'Fil de Soie pour Broderie Traditionnelle',
        category: 'fourniture_accessoire',
        theoreticalQty: 0.35,
        unit: 'rouleau',
        wastePercentage: 10,
        realQty: 0.385,
        unitPrice: 6.5,
        totalCost: 2.503,
      },
      {
        id: 'tsi-5',
        componentId: 'comp-9',
        componentCode: 'ACC-ETI-05',
        componentName: 'Étiquettes de Marque Tissées Damassées',
        category: 'fourniture_accessoire',
        theoreticalQty: 1,
        unit: 'piece',
        wastePercentage: 0,
        realQty: 1,
        unitPrice: 0.35,
        totalCost: 0.35,
      },
      {
        id: 'tsi-6',
        componentId: 'comp-10',
        componentCode: 'CSM-AIG-01',
        componentName: 'Aiguilles Machine Industrielle Schmetz 90',
        category: 'consommable',
        theoreticalQty: 0.05,
        unit: 'boite',
        wastePercentage: 0,
        realQty: 0.05,
        unitPrice: 8.5,
        totalCost: 0.425,
      },
      {
        id: 'tsi-7',
        componentId: 'comp-14',
        componentCode: 'EMB-HOU-02',
        componentName: 'Housse Textile Coton Non-Tissé avec Fermeture',
        category: 'emballage',
        theoreticalQty: 1,
        unit: 'piece',
        wastePercentage: 0,
        realQty: 1,
        unitPrice: 2.2,
        totalCost: 2.2,
      },
    ],
    laborOperations: [
      {
        id: 'lop-1',
        name: 'Patronage & Découpe manuelle précise',
        timeMinutes: 25,
        hourlyRate: 14.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 5.833,
      },
      {
        id: 'lop-2',
        name: 'Broderie artisanale faite main (Col & Manches)',
        timeMinutes: 75,
        hourlyRate: 16.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 20.0,
      },
      {
        id: 'lop-3',
        name: 'Assemblage, piquage et surjet 4 fils',
        timeMinutes: 50,
        hourlyRate: 12.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 10.0,
      },
      {
        id: 'lop-4',
        name: 'Pose boutons, finitions et repassage vapeur',
        timeMinutes: 20,
        hourlyRate: 11.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 3.667,
      },
    ],
    overheads: [
      {
        id: 'ov-1',
        name: 'Électricité & Énergie atelier',
        allocationMethod: 'hourly_rate',
        rateOrAmount: 1.8, // 1.8 TND / heure de main d'oeuvre
        isActive: true,
      },
      {
        id: 'ov-2',
        name: 'Amortissement machines à coudre & brodeuses',
        allocationMethod: 'fixed_per_unit',
        rateOrAmount: 3.0,
        isActive: true,
      },
      {
        id: 'ov-3',
        name: 'Frais généraux & Loyer atelier',
        allocationMethod: 'percent_labor',
        rateOrAmount: 15, // 15% du coût MO
        isActive: true,
      },
    ],
    marginStrategy: 'target_margin',
    targetMarginRate: 35, // 35% de marge sur prix de vente
    vatRate: 19,
    versionsHistory: [],
  },
  {
    id: 'sheet-2',
    reference: 'SAC-CAB-002',
    name: 'Sac Cabas Cuir & Lin Artisanal Médina',
    category: 'Maroquinerie & Cuir',
    description:
      'Grand sac cabas associant cuir tannage végétal camel et toile de lin épaisse sablée, hanses renforcées rivets laiton, poche intérieure zip.',
    imageUrl:
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
    version: 1,
    createdAt: '2026-10-12',
    updatedAt: '2026-10-17',
    status: 'validee',
    batchQuantity: 1,
    productionUnit: 'pièce',
    productionYieldRate: 98,
    observations:
      'Appliquer un léger baume de protection cuir avant emballage final.',
    items: [
      {
        id: 't2-1',
        componentId: 'comp-3',
        componentCode: 'MAT-CUI-03',
        componentName: 'Cuir Pleine Fleur Tannage Végétal Camel',
        category: 'matiere_premiere',
        theoreticalQty: 0.65,
        unit: 'm2',
        wastePercentage: 12,
        realQty: 0.728,
        unitPrice: 85.0,
        totalCost: 61.88,
      },
      {
        id: 't2-2',
        componentId: 'comp-1',
        componentCode: 'MAT-LIN-01',
        componentName: 'Tissu Lin Naturel Sablé 240g',
        category: 'matiere_premiere',
        theoreticalQty: 0.7,
        unit: 'm',
        wastePercentage: 5,
        realQty: 0.735,
        unitPrice: 22.5,
        totalCost: 16.538,
      },
      {
        id: 't2-3',
        componentId: 'comp-6',
        componentCode: 'ACC-ZIP-02',
        componentName: 'Fermeture Éclair Métal Laiton Vieilli 45cm',
        category: 'fourniture_accessoire',
        theoreticalQty: 1,
        unit: 'piece',
        wastePercentage: 0,
        realQty: 1,
        unitPrice: 2.4,
        totalCost: 2.4,
      },
      {
        id: 't2-4',
        componentId: 'comp-8',
        componentCode: 'ACC-RIV-04',
        componentName: 'Rivets Doubles Laiton Massif 9mm',
        category: 'fourniture_accessoire',
        theoreticalQty: 8,
        unit: 'piece',
        wastePercentage: 5,
        realQty: 8.4,
        unitPrice: 0.22,
        totalCost: 1.848,
      },
      {
        id: 't2-5',
        componentId: 'comp-11',
        componentCode: 'CSM-COL-02',
        componentName: 'Colle Néoprène Contact Maroquinerie',
        category: 'consommable',
        theoreticalQty: 0.1,
        unit: 'l',
        wastePercentage: 5,
        realQty: 0.105,
        unitPrice: 16.0,
        totalCost: 1.68,
      },
      {
        id: 't2-6',
        componentId: 'comp-13',
        componentCode: 'EMB-BOI-01',
        componentName: 'Boîte Cadeau Rigide Aimantée avec Logo Doré',
        category: 'emballage',
        theoreticalQty: 1,
        unit: 'piece',
        wastePercentage: 0,
        realQty: 1,
        unitPrice: 4.8,
        totalCost: 4.8,
      },
    ],
    laborOperations: [
      {
        id: 'lo2-1',
        name: 'Découpe du cuir et refente des bords',
        timeMinutes: 35,
        hourlyRate: 15.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 8.75,
      },
      {
        id: 'lo2-2',
        name: 'Encollage et préparation des hanses cuir',
        timeMinutes: 25,
        hourlyRate: 13.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 5.417,
      },
      {
        id: 'lo2-3',
        name: 'Piquage cuir machine triple entraînement',
        timeMinutes: 45,
        hourlyRate: 16.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 12.0,
      },
      {
        id: 'lo2-4',
        name: 'Teinture de tranche et lustrage cire',
        timeMinutes: 30,
        hourlyRate: 14.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 7.0,
      },
    ],
    overheads: [
      {
        id: 'ov2-1',
        name: 'Amortissement atelier maroquinerie',
        allocationMethod: 'fixed_per_unit',
        rateOrAmount: 5.0,
        isActive: true,
      },
      {
        id: 'ov2-2',
        name: 'Frais de transport & approvisionnement cuir',
        allocationMethod: 'percent_material',
        rateOrAmount: 5, // 5% des matières
        isActive: true,
      },
    ],
    marginStrategy: 'target_margin',
    targetMarginRate: 40, // 40% de marge sur vente pour maroquinerie
    vatRate: 19,
    versionsHistory: [],
  },
  {
    id: 'sheet-3',
    reference: 'CHE-RE-003',
    name: 'Chéchia Traditionnelle en Laine Mérinos Revisitée',
    category: 'Couvre-chefs traditionnels',
    description:
      'Chéchia feutrée de manière ancestrale, foulée à la main puis cardée aux chardons naturels, avec broderie discrète et doublure de protection.',
    imageUrl:
      'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=600&q=80',
    version: 1,
    createdAt: '2026-10-15',
    updatedAt: '2026-10-18',
    status: 'brouillon',
    batchQuantity: 5,
    productionUnit: 'lot de 5 pièces',
    productionYieldRate: 100,
    items: [
      {
        id: 't3-1',
        componentId: 'comp-4',
        componentCode: 'MAT-LAI-04',
        componentName: 'Laine Mérinos Filée à la Main',
        category: 'matiere_premiere',
        theoreticalQty: 0.75, // pour le lot de 5
        unit: 'kg',
        wastePercentage: 8,
        realQty: 0.81,
        unitPrice: 48.0,
        totalCost: 38.88,
      },
      {
        id: 't3-2',
        componentId: 'comp-7',
        componentCode: 'ACC-FIL-03',
        componentName: 'Fil de Soie pour Broderie Traditionnelle',
        category: 'fourniture_accessoire',
        theoreticalQty: 0.5,
        unit: 'rouleau',
        wastePercentage: 5,
        realQty: 0.525,
        unitPrice: 6.5,
        totalCost: 3.413,
      },
      {
        id: 't3-3',
        componentId: 'comp-13',
        componentCode: 'EMB-BOI-01',
        componentName: 'Boîte Cadeau Rigide Aimantée avec Logo Doré',
        category: 'emballage',
        theoreticalQty: 5,
        unit: 'piece',
        wastePercentage: 0,
        realQty: 5,
        unitPrice: 4.8,
        totalCost: 24.0,
      },
    ],
    laborOperations: [
      {
        id: 'lo3-1',
        name: 'Tricotage préliminaire de la calotte',
        timeMinutes: 90,
        hourlyRate: 11.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 16.5,
      },
      {
        id: 'lo3-2',
        name: 'Foulage thermique et savonnage à l’eau chaude',
        timeMinutes: 120,
        hourlyRate: 13.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 26.0,
      },
      {
        id: 'lo3-3',
        name: 'Cardage aux chardons naturels et teinture bain rouge garance',
        timeMinutes: 60,
        hourlyRate: 15.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 15.0,
      },
      {
        id: 'lo3-4',
        name: 'Mise en forme sur moule bois et repassage',
        timeMinutes: 40,
        hourlyRate: 12.0,
        costType: 'hourly',
        operatorsCount: 1,
        totalCost: 8.0,
      },
    ],
    overheads: [
      {
        id: 'ov3-1',
        name: 'Chauffage eau et électricité bain de teinture',
        allocationMethod: 'batch_spread',
        rateOrAmount: 12.0, // 12 TND pour le lot
        isActive: true,
      },
    ],
    marginStrategy: 'target_margin',
    targetMarginRate: 35,
    vatRate: 19,
    versionsHistory: [],
  },
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'mov-1',
    componentId: 'comp-1',
    componentCode: 'MAT-LIN-01',
    componentName: 'Tissu Lin Naturel Sablé 240g',
    date: '2026-10-01 09:30',
    type: 'in',
    quantity: 100,
    unitPrice: 22.5,
    referenceDoc: 'BL-KSH-8841',
    notes: 'Réception rouleau 100m certifié Oeko-Tex',
  },
  {
    id: 'mov-2',
    componentId: 'comp-1',
    componentCode: 'MAT-LIN-01',
    componentName: 'Tissu Lin Naturel Sablé 240g',
    date: '2026-10-12 14:15',
    type: 'production_batch',
    quantity: -14.5,
    referenceDoc: 'OF-TUN-26-01',
    notes: 'Sortie pour lot de production de tuniques',
  },
  {
    id: 'mov-3',
    componentId: 'comp-3',
    componentCode: 'MAT-CUI-03',
    componentName: 'Cuir Pleine Fleur Tannage Végétal Camel',
    date: '2026-10-05 11:00',
    type: 'in',
    quantity: 18.0,
    unitPrice: 85.0,
    referenceDoc: 'BL-SFX-3012',
    notes: 'Réception peaux sélectionnées qualité 1',
  },
  {
    id: 'mov-4',
    componentId: 'comp-3',
    componentCode: 'MAT-CUI-03',
    componentName: 'Cuir Pleine Fleur Tannage Végétal Camel',
    date: '2026-10-15 16:30',
    type: 'production_batch',
    quantity: -3.5,
    referenceDoc: 'OF-SAC-26-03',
    notes: 'Découpe cabas cuir',
  },
];

export const INITIAL_BATCH_ORDERS: ProductionBatchOrder[] = [
  {
    id: 'batch-1',
    batchCode: 'OF-2026-001',
    technicalSheetId: 'sheet-1',
    productReference: 'TUN-MOD-001',
    productName: 'Tunique Traditionnelle Brodée Carthage',
    plannedQty: 10,
    producedQty: 10,
    startDate: '2026-10-14',
    status: 'completed',
    stockDeducted: true,
    notes: 'Lot livré boutique Sidi Bou Said - Conformité 100%',
  },
  {
    id: 'batch-2',
    batchCode: 'OF-2026-002',
    technicalSheetId: 'sheet-2',
    productReference: 'SAC-CAB-002',
    productName: 'Sac Cabas Cuir & Lin Artisanal Médina',
    plannedQty: 5,
    producedQty: 0,
    startDate: '2026-10-19',
    status: 'in_progress',
    stockDeducted: false,
    notes: 'Découpe lancée en atelier cuir',
  },
];

// LOCAL STORAGE PERSISTENCE KEYS
const STORAGE_KEYS = {
  SETTINGS: 'ateliercost_settings_v1',
  SUPPLIERS: 'ateliercost_suppliers_v1',
  COMPONENTS: 'ateliercost_components_v1',
  TECHNICAL_SHEETS: 'ateliercost_sheets_v1',
  STOCK_MOVEMENTS: 'ateliercost_movements_v1',
  BATCH_ORDERS: 'ateliercost_batches_v1',
};

// HELPER STORAGE FUNCTIONS
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Erreur lors du chargement de ${key}:`, error);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Erreur lors de la sauvegarde de ${key}:`, error);
  }
}

// FULL DATABASE API
export const storageApi = {
  getSettings(): CompanySettings {
    return loadFromStorage<CompanySettings>(
      STORAGE_KEYS.SETTINGS,
      DEFAULT_SETTINGS
    );
  },
  saveSettings(settings: CompanySettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  },

  getSuppliers(): Supplier[] {
    return loadFromStorage<Supplier[]>(
      STORAGE_KEYS.SUPPLIERS,
      INITIAL_SUPPLIERS
    );
  },
  saveSuppliers(suppliers: Supplier[]): void {
    saveToStorage(STORAGE_KEYS.SUPPLIERS, suppliers);
  },

  getComponents(): ComponentItem[] {
    return loadFromStorage<ComponentItem[]>(
      STORAGE_KEYS.COMPONENTS,
      INITIAL_COMPONENTS
    );
  },
  saveComponents(components: ComponentItem[]): void {
    saveToStorage(STORAGE_KEYS.COMPONENTS, components);
  },

  getTechnicalSheets(): TechnicalSheet[] {
    return loadFromStorage<TechnicalSheet[]>(
      STORAGE_KEYS.TECHNICAL_SHEETS,
      INITIAL_TECHNICAL_SHEETS
    );
  },
  saveTechnicalSheets(sheets: TechnicalSheet[]): void {
    saveToStorage(STORAGE_KEYS.TECHNICAL_SHEETS, sheets);
  },

  getStockMovements(): StockMovement[] {
    return loadFromStorage<StockMovement[]>(
      STORAGE_KEYS.STOCK_MOVEMENTS,
      INITIAL_STOCK_MOVEMENTS
    );
  },
  saveStockMovements(movements: StockMovement[]): void {
    saveToStorage(STORAGE_KEYS.STOCK_MOVEMENTS, movements);
  },

  getBatchOrders(): ProductionBatchOrder[] {
    return loadFromStorage<ProductionBatchOrder[]>(
      STORAGE_KEYS.BATCH_ORDERS,
      INITIAL_BATCH_ORDERS
    );
  },
  saveBatchOrders(batches: ProductionBatchOrder[]): void {
    saveToStorage(STORAGE_KEYS.BATCH_ORDERS, batches);
  },

  // Reset to default seed data
  resetAll(): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    saveToStorage(STORAGE_KEYS.SUPPLIERS, INITIAL_SUPPLIERS);
    saveToStorage(STORAGE_KEYS.COMPONENTS, INITIAL_COMPONENTS);
    saveToStorage(STORAGE_KEYS.TECHNICAL_SHEETS, INITIAL_TECHNICAL_SHEETS);
    saveToStorage(STORAGE_KEYS.STOCK_MOVEMENTS, INITIAL_STOCK_MOVEMENTS);
    saveToStorage(STORAGE_KEYS.BATCH_ORDERS, INITIAL_BATCH_ORDERS);
  },

  // Export full JSON backup
  exportFullBackup(): string {
    const backup = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      settings: this.getSettings(),
      suppliers: this.getSuppliers(),
      components: this.getComponents(),
      technicalSheets: this.getTechnicalSheets(),
      stockMovements: this.getStockMovements(),
      batchOrders: this.getBatchOrders(),
    };
    return JSON.stringify(backup, null, 2);
  },

  // Import JSON backup
  importFullBackup(jsonContent: string): { success: boolean; message: string } {
    try {
      const data = JSON.parse(jsonContent);
      if (data.components && Array.isArray(data.components)) {
        this.saveComponents(data.components);
      }
      if (data.technicalSheets && Array.isArray(data.technicalSheets)) {
        this.saveTechnicalSheets(data.technicalSheets);
      }
      if (data.suppliers && Array.isArray(data.suppliers)) {
        this.saveSuppliers(data.suppliers);
      }
      if (data.settings) {
        this.saveSettings(data.settings);
      }
      if (data.stockMovements && Array.isArray(data.stockMovements)) {
        this.saveStockMovements(data.stockMovements);
      }
      if (data.batchOrders && Array.isArray(data.batchOrders)) {
        this.saveBatchOrders(data.batchOrders);
      }
      return { success: true, message: 'Base de données restaurée avec succès !' };
    } catch (e: unknown) {
      return {
        success: false,
        message:
          'Fichier JSON invalide: ' + (e instanceof Error ? e.message : 'erreur de parsing'),
      };
    }
  },
};
