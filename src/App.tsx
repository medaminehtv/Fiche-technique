import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TechnicalSheetsView } from './components/TechnicalSheetsView';
import { TechnicalSheetEditor } from './components/TechnicalSheetEditor';
import { ComponentsCatalog } from './components/ComponentsCatalog';
import { CostSimulator } from './components/CostSimulator';
import { StockView } from './components/StockView';
import { SuppliersView } from './components/SuppliersView';
import { Phase1DossierView } from './components/Phase1DossierView';
import { SettingsView } from './components/SettingsView';
import { PrintPdfModal } from './components/PrintPdfModal';
import { VersionCompareModal } from './components/VersionCompareModal';
import { storageApi } from './utils/storage';
import type {
  CompanySettings,
  ComponentItem,
  ProductionBatchOrder,
  StockMovement,
  Supplier,
  TechnicalSheet,
  TechnicalSheetVersion,
} from './types';
import { computeTechnicalSheetCosts } from './utils/calc';

export default function App() {
  const [settings, setSettings] = useState<CompanySettings>(() =>
    storageApi.getSettings()
  );
  const [sheets, setSheets] = useState<TechnicalSheet[]>(() =>
    storageApi.getTechnicalSheets()
  );
  const [components, setComponents] = useState<ComponentItem[]>(() =>
    storageApi.getComponents()
  );
  const [suppliers, setSuppliers] = useState<Supplier[]>(() =>
    storageApi.getSuppliers()
  );
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(() =>
    storageApi.getStockMovements()
  );
  const [batchOrders, setBatchOrders] = useState<ProductionBatchOrder[]>(() =>
    storageApi.getBatchOrders()
  );

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [editingSheet, setEditingSheet] = useState<TechnicalSheet | null>(null);
  const [printModalSheet, setPrintModalSheet] =
    useState<TechnicalSheet | null>(null);
  const [compareModalSheet, setCompareModalSheet] =
    useState<TechnicalSheet | null>(null);

  // Sync to local storage on changes
  useEffect(() => {
    storageApi.saveSettings(settings);
  }, [settings]);

  useEffect(() => {
    storageApi.saveTechnicalSheets(sheets);
  }, [sheets]);

  useEffect(() => {
    storageApi.saveComponents(components);
  }, [components]);

  useEffect(() => {
    storageApi.saveSuppliers(suppliers);
  }, [suppliers]);

  useEffect(() => {
    storageApi.saveStockMovements(stockMovements);
  }, [stockMovements]);

  useEffect(() => {
    storageApi.saveBatchOrders(batchOrders);
  }, [batchOrders]);

  // Handlers
  const handleNewSheet = () => {
    const newSheet: TechnicalSheet = {
      id: 'sheet-' + Date.now(),
      reference: 'PROD-' + (sheets.length + 1).toString().padStart(3, '0'),
      name: 'Nouveau Produit Confection',
      category: 'Textile & Confection',
      description: 'Description des caractéristiques techniques du produit...',
      version: 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'brouillon',
      batchQuantity: 1,
      productionUnit: 'pièce',
      productionYieldRate: 100,
      items: [],
      laborOperations: [],
      overheads: [
        {
          id: 'ov-' + Date.now(),
          name: 'Amortissement & Énergie atelier',
          allocationMethod: 'fixed_per_unit',
          rateOrAmount: 3.5,
          isActive: true,
        },
      ],
      marginStrategy: 'target_margin',
      targetMarginRate: settings.defaultTargetMargin,
      vatRate: settings.defaultVatRate,
      versionsHistory: [],
    };

    setEditingSheet(newSheet);
  };

  const handleSaveSheet = (
    updatedSheet: TechnicalSheet,
    createNewVersion: boolean
  ) => {
    const costs = computeTechnicalSheetCosts(updatedSheet);

    let finalSheet = { ...updatedSheet };

    if (createNewVersion) {
      // Archive the previous snapshot
      const existing = sheets.find((s) => s.id === updatedSheet.id);
      if (existing) {
        const oldCosts = computeTechnicalSheetCosts(existing);
        const snapshot: TechnicalSheetVersion = {
          versionNumber: existing.version,
          date: new Date().toISOString().split('T')[0],
          author: 'Responsable Technique',
          changeSummary: `Archive v${existing.version} avant mise à jour`,
          unitCost: oldCosts.unitCostPrice,
          sellingPrice: oldCosts.suggestedSellingPriceHT,
          marginRate: existing.targetMarginRate,
          batchQty: existing.batchQuantity,
          items: [...existing.items],
          laborOperations: [...existing.laborOperations],
          overheads: [...existing.overheads],
        };
        finalSheet = {
          ...finalSheet,
          versionsHistory: [snapshot, ...(existing.versionsHistory || [])],
        };
      }
    }

    setSheets((prev) => {
      const exists = prev.some((s) => s.id === finalSheet.id);
      if (exists) {
        return prev.map((s) => (s.id === finalSheet.id ? finalSheet : s));
      } else {
        return [finalSheet, ...prev];
      }
    });

    setEditingSheet(finalSheet);
  };

  const handleDuplicateSheet = (sheetId: string) => {
    const target = sheets.find((s) => s.id === sheetId);
    if (!target) return;

    const copy: TechnicalSheet = {
      ...target,
      id: 'sheet-' + Date.now(),
      reference: `${target.reference}-COP`,
      name: `${target.name} (Copie)`,
      version: 1,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      status: 'brouillon',
      versionsHistory: [],
      items: target.items.map((it) => ({
        ...it,
        id: 'tsi-' + Math.random().toString(36).substr(2, 9),
      })),
      laborOperations: target.laborOperations.map((lo) => ({
        ...lo,
        id: 'lop-' + Math.random().toString(36).substr(2, 9),
      })),
    };

    setSheets((prev) => [copy, ...prev]);
  };

  const handleDeleteSheet = (sheetId: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette fiche technique ?')) {
      setSheets((prev) => prev.filter((s) => s.id !== sheetId));
      if (editingSheet?.id === sheetId) {
        setEditingSheet(null);
      }
    }
  };

  // Component handlers
  const handleSaveComponent = (comp: ComponentItem) => {
    setComponents((prev) => {
      const exists = prev.some((c) => c.id === comp.id);
      if (exists) {
        return prev.map((c) => (c.id === comp.id ? comp : c));
      } else {
        return [comp, ...prev];
      }
    });
  };

  const handleDeleteComponent = (id: string) => {
    if (window.confirm('Supprimer ce composant du catalogue ?')) {
      setComponents((prev) => prev.filter((c) => c.id !== id));
    }
  };

  // Supplier handlers
  const handleSaveSupplier = (sup: Supplier) => {
    setSuppliers((prev) => {
      const exists = prev.some((s) => s.id === sup.id);
      if (exists) {
        return prev.map((s) => (s.id === sup.id ? sup : s));
      } else {
        return [sup, ...prev];
      }
    });
  };

  const handleDeleteSupplier = (id: string) => {
    if (window.confirm('Supprimer ce fournisseur ?')) {
      setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // Stock movement handler
  const handleNewMovement = (mov: StockMovement) => {
    setStockMovements((prev) => [mov, ...prev]);

    // Update component stock quantity
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === mov.componentId) {
          const newQty = Math.max(0, Number((c.stockQty + mov.quantity).toFixed(4)));
          return { ...c, stockQty: newQty };
        }
        return c;
      })
    );
  };

  // Production batch launch handler
  const handleLaunchProductionBatch = (
    sheet: TechnicalSheet,
    batchCode: string,
    plannedQty: number,
    deductStockNow: boolean
  ) => {
    const newBatch: ProductionBatchOrder = {
      id: 'batch-' + Date.now(),
      batchCode,
      technicalSheetId: sheet.id,
      productReference: sheet.reference,
      productName: sheet.name,
      plannedQty,
      producedQty: 0,
      startDate: new Date().toISOString().split('T')[0],
      status: 'in_progress',
      stockDeducted: deductStockNow,
      notes: `Lancement fabrication de ${plannedQty} pièces`,
    };

    setBatchOrders((prev) => [newBatch, ...prev]);

    if (deductStockNow) {
      const multiplier = plannedQty / Math.max(1, sheet.batchQuantity);
      const generatedMovements: StockMovement[] = [];

      setComponents((prevComponents) => {
        const updated = [...prevComponents];
        sheet.items.forEach((item) => {
          const compIdx = updated.findIndex((c) => c.id === item.componentId);
          if (compIdx >= 0) {
            const comp = updated[compIdx];
            if (comp.stockEnabled) {
              const consumedQty = Number((item.realQty * multiplier).toFixed(4));
              updated[compIdx] = {
                ...comp,
                stockQty: Math.max(0, Number((comp.stockQty - consumedQty).toFixed(4))),
              };

              generatedMovements.push({
                id: 'mov-' + Math.random().toString(36).substr(2, 9),
                componentId: comp.id,
                componentCode: comp.code,
                componentName: comp.name,
                date: new Date().toISOString().replace('T', ' ').substring(0, 16),
                type: 'production_batch',
                quantity: -consumedQty,
                unitPrice: comp.unitPrice,
                referenceDoc: batchCode,
                notes: `Consommation automatique pour fabrication ${plannedQty} x ${sheet.name}`,
              });
            }
          }
        });
        return updated;
      });

      if (generatedMovements.length > 0) {
        setStockMovements((prev) => [...generatedMovements, ...prev]);
      }
    }
  };

  // Backup handlers
  const handleExportBackup = () => {
    const jsonStr = storageApi.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sauvegarde-ateliercost-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (jsonString: string) => {
    const res = storageApi.importFullBackup(jsonString);
    if (res.success) {
      setSettings(storageApi.getSettings());
      setSheets(storageApi.getTechnicalSheets());
      setComponents(storageApi.getComponents());
      setSuppliers(storageApi.getSuppliers());
      setStockMovements(storageApi.getStockMovements());
      setBatchOrders(storageApi.getBatchOrders());
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  const handleResetAll = () => {
    storageApi.resetAll();
    setSettings(storageApi.getSettings());
    setSheets(storageApi.getTechnicalSheets());
    setComponents(storageApi.getComponents());
    setSuppliers(storageApi.getSuppliers());
    setStockMovements(storageApi.getStockMovements());
    setBatchOrders(storageApi.getBatchOrders());
    setEditingSheet(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased selection:bg-amber-500 selection:text-white">
      {/* Windows Application Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setEditingSheet(null);
        }}
        settings={settings}
        onExportBackup={handleExportBackup}
        onQuickNewSheet={() => {
          handleNewSheet();
          setActiveTab('sheets');
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {editingSheet ? (
          <TechnicalSheetEditor
            sheet={editingSheet}
            componentsCatalog={components}
            settings={settings}
            onSave={handleSaveSheet}
            onCancel={() => setEditingSheet(null)}
            onPrint={(sheet) => setPrintModalSheet(sheet)}
          />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                sheets={sheets}
                components={components}
                settings={settings}
                onOpenSheet={(sheetId) => {
                  const target = sheets.find((s) => s.id === sheetId);
                  if (target) {
                    setEditingSheet(target);
                    setActiveTab('sheets');
                  }
                }}
                onNewSheet={() => {
                  handleNewSheet();
                  setActiveTab('sheets');
                }}
                onOpenComponents={() => setActiveTab('components')}
                onOpenDossier={() => setActiveTab('dossier')}
              />
            )}

            {activeTab === 'sheets' && (
              <TechnicalSheetsView
                sheets={sheets}
                settings={settings}
                onSelectSheet={(sheet) => setEditingSheet(sheet)}
                onNewSheet={handleNewSheet}
                onDuplicateSheet={handleDuplicateSheet}
                onDeleteSheet={handleDeleteSheet}
                onPrintSheet={(sheet) => setPrintModalSheet(sheet)}
                onCompareVersions={(sheet) => setCompareModalSheet(sheet)}
              />
            )}

            {activeTab === 'components' && (
              <ComponentsCatalog
                components={components}
                suppliers={suppliers}
                settings={settings}
                onSaveComponent={handleSaveComponent}
                onDeleteComponent={handleDeleteComponent}
              />
            )}

            {activeTab === 'simulator' && (
              <CostSimulator sheets={sheets} settings={settings} />
            )}

            {activeTab === 'stock' && (
              <StockView
                components={components}
                stockMovements={stockMovements}
                sheets={sheets}
                batchOrders={batchOrders}
                settings={settings}
                onNewMovement={handleNewMovement}
                onLaunchProductionBatch={handleLaunchProductionBatch}
              />
            )}

            {activeTab === 'suppliers' && (
              <SuppliersView
                suppliers={suppliers}
                onSaveSupplier={handleSaveSupplier}
                onDeleteSupplier={handleDeleteSupplier}
              />
            )}

            {activeTab === 'dossier' && <Phase1DossierView />}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onSaveSettings={(s) => setSettings(s)}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onResetAll={handleResetAll}
              />
            )}
          </>
        )}
      </main>

      {/* Printable PDF Modal */}
      {printModalSheet && (
        <PrintPdfModal
          sheet={printModalSheet}
          settings={settings}
          onClose={() => setPrintModalSheet(null)}
        />
      )}

      {/* Version Comparison Modal */}
      {compareModalSheet && (
        <VersionCompareModal
          sheet={compareModalSheet}
          settings={settings}
          onClose={() => setCompareModalSheet(null)}
        />
      )}

      {/* Windows Application Status Bar */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-[11px] px-4 py-1.5 flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-3">
          <span>AtelierCost Pro v1.0.0</span>
          <span>•</span>
          <span>SQLite / IndexedDB Local Storage</span>
          <span>•</span>
          <span className="text-emerald-400">✓ Prêt & Données Synchronisées</span>
        </div>
        <div className="flex items-center space-x-3 font-mono">
          <span>Devise : {settings.currency} ({settings.currencySymbol})</span>
          <span>•</span>
          <span>TVA : {settings.defaultVatRate}%</span>
        </div>
      </footer>
    </div>
  );
}
