import React from 'react';
import {
  FileSpreadsheet,
  Layers,
  Package,
  Calculator,
  Boxes,
  Users,
  Settings,
  BookOpen,
  Printer,
  Download,
  ShieldCheck,
} from 'lucide-react';
import type { CompanySettings } from '../types';

export type ActiveTab =
  | 'dashboard'
  | 'sheets'
  | 'components'
  | 'simulator'
  | 'stock'
  | 'suppliers'
  | 'dossier'
  | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  settings: CompanySettings;
  onExportBackup: () => void;
  onQuickNewSheet: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  settings,
  onExportBackup,
  onQuickNewSheet,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Tableau de Bord',
      icon: <Layers className="w-4 h-4 mr-1.5" />,
    },
    {
      id: 'sheets',
      label: 'Fiches Techniques (BOM)',
      icon: <FileSpreadsheet className="w-4 h-4 mr-1.5" />,
    },
    {
      id: 'components',
      label: 'Catalogue Matières & Composants',
      icon: <Package className="w-4 h-4 mr-1.5" />,
    },
    {
      id: 'simulator',
      label: 'Simulateur & Marges',
      icon: <Calculator className="w-4 h-4 mr-1.5" />,
    },
    {
      id: 'stock',
      label: 'Stocks & Mouvements',
      icon: <Boxes className="w-4 h-4 mr-1.5" />,
    },
    {
      id: 'suppliers',
      label: 'Fournisseurs',
      icon: <Users className="w-4 h-4 mr-1.5" />,
    },
    {
      id: 'dossier',
      label: 'Dossier Phase 1 (Specs)',
      icon: <BookOpen className="w-4 h-4 mr-1.5 text-amber-500" />,
    },
    {
      id: 'settings',
      label: 'Paramètres',
      icon: <Settings className="w-4 h-4 mr-1.5" />,
    },
  ];

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
      {/* Top Windows-style utility bar */}
      <div className="px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span className="font-semibold text-slate-100 uppercase tracking-wide">
              {settings.companyName}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
            MF : {settings.registrationNumber}
          </span>
          <span className="hidden md:inline-flex items-center text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Mode Bureau Hors-ligne Sécurisé
          </span>
        </div>

        <div className="flex items-center space-x-2 mt-1 sm:mt-0">
          <button
            onClick={onExportBackup}
            className="flex items-center px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition"
            title="Exporter une sauvegarde JSON complète"
          >
            <Download className="w-3.5 h-3.5 mr-1 text-sky-400" />
            Sauvegarde JSON
          </button>
          <button
            onClick={onQuickNewSheet}
            className="flex items-center px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded shadow transition"
          >
            + Nouvelle Fiche Technique
          </button>
        </div>
      </div>

      {/* Main navigation header */}
      <div className="px-4 py-2.5 flex items-center justify-between overflow-x-auto scrollbar-none">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="flex items-center mr-3 font-bold text-base sm:text-lg text-amber-400 whitespace-nowrap">
            <FileSpreadsheet className="w-5 h-5 mr-2 text-amber-500" />
            AtelierCost <span className="text-white ml-1 font-normal text-xs bg-amber-900/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-700/50">PRO</span>
          </div>

          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
