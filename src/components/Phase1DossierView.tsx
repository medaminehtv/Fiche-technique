import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Database,
  Cpu,
  Layers,
  Calculator,
  Workflow,
  Sparkles,
  Download,
  Code,
  FileCheck,
} from 'lucide-react';

export const Phase1DossierView: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<number>(1);

  const chapters = [
    { id: 1, title: '1. Cahier des Charges Fonctionnel & Règles Métier' },
    { id: 2, title: '2. Taxonomie Complète des Composants & Matières' },
    { id: 3, title: '3. Fonctionnement Détaillé d’une Fiche Technique' },
    { id: 4, title: '4. Formules Mathématiques du Moteur de Calcul' },
    { id: 5, title: '5. Architecture Logicielle Windows Hors-Ligne' },
    { id: 6, title: '6. Modèle de Données Relationnel & Schéma SQL' },
    { id: 7, title: '7. Cartographie des Écrans & Parcours Utilisateur' },
    { id: 8, title: '8. Périmètre de la Première Version Fonctionnelle' },
    { id: 9, title: '9. Plan de Développement & Feuille de Route' },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 mb-2">
            Mission 1 — Phase 1 Conception
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100">
            Dossier d&apos;Ingénierie & Spécifications Systèmes
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Documentation technique exhaustive et modèle formel de calcul du coût de revient textile, maroquinerie et artisanat.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold transition shadow"
        >
          <Download className="w-4 h-4 mr-1.5" />
          Imprimer le Dossier d&apos;Ingénierie
        </button>
      </div>

      {/* Chapters Navigation and Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-sm space-y-1 text-xs self-start">
          <div className="p-2 font-bold text-slate-700 text-[11px] uppercase tracking-wider border-b border-slate-100">
            Sommaire Phase 1
          </div>
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapter(ch.id)}
              className={`w-full text-left px-3 py-2 rounded-lg font-medium transition flex items-center justify-between ${
                activeChapter === ch.id
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="truncate">{ch.title}</span>
              {activeChapter === ch.id && (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 ml-1" />
              )}
            </button>
          ))}
        </div>

        {/* Chapter Details Container */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-xs text-slate-700 space-y-6 leading-relaxed">
          {/* CHAPTER 1 */}
          {activeChapter === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                1. Cahier des Charges Fonctionnel & Règles Métier
              </h2>
              <p>
                L&apos;application <strong>AtelierCost Pro</strong> est conçue pour résoudre un écueil critique des ateliers de confection textile, maroquinerie et artisanat : l&apos;imprécision du calcul du coût de revient et l&apos;oubli systématique des micro-consommables, des chutes de coupe et des frais généraux d&apos;atelier.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-slate-50 border rounded-lg space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-xs">Utilisateurs Cibles</h3>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Responsables d&apos;ateliers de confection & modélistes.</li>
                    <li>Artisans créateurs (vêtements traditionnels, chéchia, maroquinerie).</li>
                    <li>Contrôleurs de gestion & chefs d&apos;entreprise PME.</li>
                    <li>Opérateurs de coupe et d&apos;assemblage en atelier.</li>
                  </ul>
                </div>

                <div className="p-3.5 bg-slate-50 border rounded-lg space-y-1.5">
                  <h3 className="font-bold text-slate-900 text-xs">Règles Métier Intransigeantes</h3>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600">
                    <li>Tout changement de prix unitaire ou de taux de perte doit recalculer automatiquement l&apos;ensemble de la chaîne de coûts.</li>
                    <li>La déduction de stock doit être une étape explicite et tracée.</li>
                    <li>Le calcul distingue rigoureusement <strong>Taux de marque</strong> (sur PV HT) et <strong>Taux de marge</strong> (sur coût).</li>
                    <li>Aucun double comptage entre charges directes et frais généraux.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 2 */}
          {activeChapter === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                2. Taxonomie Complète des Composants & Matières
              </h2>
              <p>
                Le catalogue centralisé structure les intrants en 4 familles distinctes avec des règles d&apos;allocation et de valorisation appropriées :
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-lg">
                  <h4 className="font-bold text-amber-900 text-xs">A. Matières Premières Principales</h4>
                  <p className="text-amber-800 mt-1">
                    Composants majeurs découpés ou transformés soumis aux pertes géométriques (chutes d&apos;emboîtement, sens du droit-fil, défauts naturels du cuir).
                  </p>
                  <div className="mt-2 text-slate-600 font-mono text-[11px]">
                    Exemples : Tissu lin sablé (m), Cuir tannage végétal (m²), Doublure satin (m), Laine filée main (kg), Soie sauvage (m).
                  </div>
                </div>

                <div className="p-3 bg-sky-50/60 border border-sky-200 rounded-lg">
                  <h4 className="font-bold text-sky-900 text-xs">B. Fournitures & Accessoires</h4>
                  <p className="text-sky-800 mt-1">
                    Éléments préfabriqués montés directement sur l&apos;article. Pertes faibles ou nulles sauf casse au montage.
                  </p>
                  <div className="mt-2 text-slate-600 font-mono text-[11px]">
                    Exemples : Boutons olivier / nacre (pièce), Fermetures éclair métal (pièce), Rivets laiton (pièce), Fil broderie soie (rouleau), Étiquettes tissées (pièce).
                  </div>
                </div>

                <div className="p-3 bg-purple-50/60 border border-purple-200 rounded-lg">
                  <h4 className="font-bold text-purple-900 text-xs">C. Consommables de Fabrication (Souvent oubliés)</h4>
                  <p className="text-purple-800 mt-1">
                    Composants d&apos;usure ou consommés pendant la confection. Double méthode : affectation directe ou répartition clé d&apos;atelier (unités produites ou heures machine).
                  </p>
                  <div className="mt-2 text-slate-600 font-mono text-[11px]">
                    Exemples : Aiguilles Schmetz industrielles (boîte), Craie tailleur (boîte), Colle contact néoprène (L), Papier kraft de coupe (rouleau).
                  </div>
                </div>

                <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                  <h4 className="font-bold text-emerald-900 text-xs">D. Emballages & Présentation Commerciale</h4>
                  <p className="text-emerald-800 mt-1">
                    Protection, conditionnement et valorisation de marque au départ de l&apos;atelier.
                  </p>
                  <div className="mt-2 text-slate-600 font-mono text-[11px]">
                    Exemples : Boîtes rigides avec logo doré, Housses respirantes non-tissées, Papier de soie gaufré, Sacs kraft boutique.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 3 */}
          {activeChapter === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                3. Fonctionnement Détaillé d’une Fiche Technique (BOM)
              </h2>
              <p>
                Une fiche technique constitue le passeport de fabrication et la référence financière d&apos;un produit. Elle se décompose en 5 sections interactives :
              </p>

              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  <strong>En-tête & Traçabilité :</strong> Référence unique normalisée, version active, statut (brouillon / validée / archivée), date de création et révision.
                </li>
                <li>
                  <strong>Nomenclature Dynamique (BOM) :</strong> Pour chaque ligne : liaison avec le catalogue, quantité théorique, taux de perte spécifique au produit ou à la taille, quantité réelle à réserver et coût ligne.
                </li>
                <li>
                  <strong>Gamme Opératoire & Main-d&apos;œuvre :</strong> Séquence ordonnée des postes (découpe, piquage, broderie manuelle, surjet, assemblage, repassage, emballage). Prise en compte du nombre d&apos;opérateurs et du temps au centième d&apos;heure.
                </li>
                <li>
                  <strong>Frais Indirects Configurables :</strong> Charges réparties selon les standards de la comptabilité analytique (pourcentage matière, pourcentage main-d&apos;œuvre, forfait horaire, forfait unitaire).
                </li>
                <li>
                  <strong>Matrice de Marges & Tarification :</strong> Définition de l&apos;objectif de rentabilité (marge sur vente vs majoration), calcul du prix HT et application de la TVA applicable.
                </li>
              </ol>
            </div>
          )}

          {/* CHAPTER 4 */}
          {activeChapter === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                4. Formules Mathématiques du Moteur de Calcul Automatique
              </h2>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg">
                  <div className="text-amber-400 font-bold mb-1 font-sans">1. Quantité Réelle avec Perte Matière</div>
                  <div>Quantité_Réelle = Quantité_Théorique × (1 + Taux_Perte / 100)</div>
                  <div className="text-slate-400 text-[11px] font-sans mt-1">Exemple : 2.50m lin à 6% de perte = 2.50 × 1.06 = 2.650m</div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg">
                  <div className="text-amber-400 font-bold mb-1 font-sans">2. Coût Direct de la Matière</div>
                  <div>Coût_Ligne = Quantité_Réelle × Prix_Unitaire_Achat</div>
                  <div className="text-slate-400 text-[11px] font-sans mt-1">Exemple : 2.650m × 22.500 DT/m = 59.625 DT</div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg">
                  <div className="text-amber-400 font-bold mb-1 font-sans">3. Coût de Main-d’œuvre par Opération</div>
                  <div>Coût_MO_Horaire = (Temps_Minutes / 60) × Taux_Horaire × Nombre_Opérateurs</div>
                  <div>Coût_MO_Pièce = Tarif_Unitaire_Pièce × Taille_Lot × Nombre_Opérateurs</div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg">
                  <div className="text-amber-400 font-bold mb-1 font-sans">4. Coût de Revient Unitaire Global</div>
                  <div>Coût_Total_Lot = Total_Matières + Total_MO + Frais_Indirects</div>
                  <div>Coût_Revient_Unitaire = Coût_Total_Lot / (Taille_Lot × (Rendement_Atelier / 100))</div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg">
                  <div className="text-amber-400 font-bold mb-1 font-sans">5. Prix de Vente HT selon Taux de Marque (Marge sur PV)</div>
                  <div>Prix_Vente_HT = Coût_Revient_Unitaire / (1 − (Taux_Marque / 100))</div>
                  <div className="text-slate-400 text-[11px] font-sans mt-1">Condition : Taux_Marque &lt; 100% (division par zéro protégée)</div>
                </div>

                <div className="p-3 bg-slate-900 text-slate-100 rounded-lg">
                  <div className="text-amber-400 font-bold mb-1 font-sans">6. Prix de Vente HT selon Taux de Majoration (Marge sur Coût)</div>
                  <div>Prix_Vente_HT = Coût_Revient_Unitaire × (1 + (Taux_Majoration / 100))</div>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 5 */}
          {activeChapter === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                5. Architecture Technique Recommandée pour Windows Hors-Ligne
              </h2>
              <p>
                Pour garantir une indépendance totale sans dépendance à une connexion Internet ni à un serveur cloud obligatoire, l&apos;architecture repose sur une double approche :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg bg-slate-50 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center">
                    <Cpu className="w-4 h-4 mr-1.5 text-indigo-600" />
                    Stack Logicielle Desktop Windows
                  </h3>
                  <ul className="space-y-1 text-slate-600">
                    <li><strong>Moteur Desktop :</strong> Tauri v2 ou Electron / Python PySide6.</li>
                    <li><strong>Base de données locale :</strong> SQLite embarqué avec WAL (Write-Ahead Logging) pour transactions ACID sécurisées.</li>
                    <li><strong>ORM & Migrations :</strong> Prisma ou SQLAlchemy.</li>
                    <li><strong>Génération PDF :</strong> ReportLab / Chromium Headless natif en vectoriel haute définition (300 DPI pour impression).</li>
                    <li><strong>Packaging Windows :</strong> MSI / EXE installateur standalone sans runtime externe requis.</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-lg bg-slate-50 space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center">
                    <Database className="w-4 h-4 mr-1.5 text-emerald-600" />
                    Protection & Résilience des Données
                  </h3>
                  <ul className="space-y-1 text-slate-600">
                    <li><strong>Zéro dépendance réseau :</strong> Toutes les données résident sur le disque local de la machine.</li>
                    <li><strong>Sauvegarde en 1 clic :</strong> Exportation JSON chiffrée ou fichier SQLite compacté.</li>
                    <li><strong>Restauration instantanée :</strong> Capacité de réinjecter les données après changement de poste.</li>
                    <li><strong>Snapshots de versions :</strong> Immutabilité des fiches techniques historiques validées.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 6 */}
          {activeChapter === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                6. Modèle de Données Relationnel Initial & Schéma SQL
              </h2>
              <p>
                Schéma relationnel normalisé en 3e forme normale (3NF) avec clés étrangères et contraintes d&apos;intégrité :
              </p>

              <div className="p-4 bg-slate-950 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto max-h-96">
                <pre>{`-- SCHÉMA SQL COMPLET ATELIERCOST PRO (SQLITE / POSTGRESQL COMPATIBLE)

CREATE TABLE suppliers (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(100),
    city VARCHAR(80),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE components (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('matiere_premiere', 'fourniture_accessoire', 'consommable', 'emballage', 'autre')),
    description TEXT,
    unit VARCHAR(20) NOT NULL,
    unit_price NUMERIC(12, 4) NOT NULL CHECK (unit_price >= 0),
    supplier_id VARCHAR(36) REFERENCES suppliers(id) ON DELETE SET NULL,
    last_price_date DATE NOT NULL,
    stock_enabled BOOLEAN DEFAULT TRUE,
    stock_qty NUMERIC(12, 4) DEFAULT 0,
    stock_min NUMERIC(12, 4) DEFAULT 0,
    default_waste_percentage NUMERIC(5, 2) DEFAULT 0 CHECK (default_waste_percentage >= 0 AND default_waste_percentage <= 100),
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE technical_sheets (
    id VARCHAR(36) PRIMARY KEY,
    reference VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(80),
    description TEXT,
    image_url TEXT,
    version INTEGER DEFAULT 1,
    status VARCHAR(20) DEFAULT 'brouillon' CHECK (status IN ('brouillon', 'validee', 'archivee')),
    batch_quantity NUMERIC(10, 2) DEFAULT 1 CHECK (batch_quantity > 0),
    production_unit VARCHAR(50) DEFAULT 'pièce',
    production_yield_rate NUMERIC(5, 2) DEFAULT 100 CHECK (production_yield_rate > 0 AND production_yield_rate <= 100),
    margin_strategy VARCHAR(30) DEFAULT 'target_margin',
    target_margin_rate NUMERIC(5, 2) DEFAULT 35 CHECK (target_margin_rate >= 0 AND target_margin_rate < 100),
    vat_rate NUMERIC(5, 2) DEFAULT 19,
    observations TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE technical_sheet_items (
    id VARCHAR(36) PRIMARY KEY,
    technical_sheet_id VARCHAR(36) NOT NULL REFERENCES technical_sheets(id) ON DELETE CASCADE,
    component_id VARCHAR(36) REFERENCES components(id),
    component_code VARCHAR(50) NOT NULL,
    component_name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    theoretical_qty NUMERIC(12, 4) NOT NULL CHECK (theoretical_qty >= 0),
    unit VARCHAR(20) NOT NULL,
    waste_percentage NUMERIC(5, 2) DEFAULT 0 CHECK (waste_percentage >= 0),
    real_qty NUMERIC(12, 4) NOT NULL CHECK (real_qty >= 0),
    unit_price NUMERIC(12, 4) NOT NULL CHECK (unit_price >= 0),
    total_cost NUMERIC(14, 4) NOT NULL,
    position_order INTEGER DEFAULT 0
);

CREATE TABLE labor_operations (
    id VARCHAR(36) PRIMARY KEY,
    technical_sheet_id VARCHAR(36) NOT NULL REFERENCES technical_sheets(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    time_minutes NUMERIC(8, 2) DEFAULT 0,
    hourly_rate NUMERIC(10, 2) DEFAULT 0,
    cost_type VARCHAR(20) DEFAULT 'hourly' CHECK (cost_type IN ('hourly', 'piece')),
    piece_rate NUMERIC(10, 2) DEFAULT 0,
    operators_count INTEGER DEFAULT 1 CHECK (operators_count >= 1),
    total_cost NUMERIC(12, 4) NOT NULL,
    position_order INTEGER DEFAULT 0
);

CREATE TABLE stock_movements (
    id VARCHAR(36) PRIMARY KEY,
    component_id VARCHAR(36) NOT NULL REFERENCES components(id),
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(30) NOT NULL CHECK (type IN ('in', 'out', 'adjustment', 'production_batch')),
    quantity NUMERIC(12, 4) NOT NULL,
    unit_price NUMERIC(12, 4),
    reference_doc VARCHAR(100),
    notes TEXT
);

CREATE TABLE production_batches (
    id VARCHAR(36) PRIMARY KEY,
    batch_code VARCHAR(50) UNIQUE NOT NULL,
    technical_sheet_id VARCHAR(36) REFERENCES technical_sheets(id),
    planned_qty NUMERIC(10, 2) NOT NULL,
    produced_qty NUMERIC(10, 2) DEFAULT 0,
    start_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'planned',
    stock_deducted BOOLEAN DEFAULT FALSE,
    notes TEXT
);`}</pre>
              </div>
            </div>
          )}

          {/* CHAPTER 7 */}
          {activeChapter === 7 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                7. Cartographie des Écrans & Parcours Utilisateur
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border rounded-lg">
                  <h4 className="font-bold text-slate-900 text-xs">Écran 1 : Tableau de Bord KPI</h4>
                  <p className="text-slate-600 mt-1">Indicateurs clés : nombre de fiches, alertes de stock bas, marges moyennes, coûts récents.</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-lg">
                  <h4 className="font-bold text-slate-900 text-xs">Écran 2 : Fiches Techniques & BOM</h4>
                  <p className="text-slate-600 mt-1">Éditeur immersif multi-sections, recalcul instantané au moindre changement de quantité ou prix.</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-lg">
                  <h4 className="font-bold text-slate-900 text-xs">Écran 3 : Catalogue Composants</h4>
                  <p className="text-slate-600 mt-1">Fiches matières premières, unités de mesure, historique prix et seuils de réapprovisionnement.</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-lg">
                  <h4 className="font-bold text-slate-900 text-xs">Écran 4 : Simulateur Sensibilité</h4>
                  <p className="text-slate-600 mt-1">Curseurs d&apos;inflation matières, hausses salariales et variations d&apos;échelle de fabrication.</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-lg">
                  <h4 className="font-bold text-slate-900 text-xs">Écran 5 : Gestion des Stocks</h4>
                  <p className="text-slate-600 mt-1">Valorisation CMUP, suivi des entrées/sorties et déstockage automatique contrôlé par OF.</p>
                </div>
                <div className="p-3 bg-slate-50 border rounded-lg">
                  <h4 className="font-bold text-slate-900 text-xs">Écran 6 : Impression PDF A4</h4>
                  <p className="text-slate-600 mt-1">Double vue : Fiche Atelier de confection (masquage financier) vs Fiche Direction chiffrée.</p>
                </div>
              </div>
            </div>
          )}

          {/* CHAPTER 8 */}
          {activeChapter === 8 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                8. Périmètre de la Première Version Fonctionnelle (MVP)
              </h2>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg space-y-2">
                <h3 className="font-bold text-emerald-900 text-xs">
                  Livrables Actifs et Opérationnels dès la Version 1.0 :
                </h3>
                <ul className="list-disc pl-5 space-y-1 text-emerald-800">
                  <li>Création, édition, duplication et archivage de fiches techniques complètes.</li>
                  <li>Catalogue complet des 4 catégories avec conversions d&apos;unités automatiques.</li>
                  <li>Moteur de calcul réactif : pertes matières, main-d&apos;œuvre, frais d&apos;atelier et marges en Dinars Tunisiens (TND).</li>
                  <li>Gestion complète des stocks d&apos;atelier avec alertes sous seuil.</li>
                  <li>Module de simulation &quot;What-If&quot; avec comparatif côte à côte.</li>
                  <li>Génération & impression PDF en formats A4 natifs Atelier et Direction.</li>
                  <li>Sauvegarde et restauration intégrale de la base de données en format JSON.</li>
                </ul>
              </div>
            </div>
          )}

          {/* CHAPTER 9 */}
          {activeChapter === 9 && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 border-b pb-2">
                9. Plan de Développement & Feuille de Route
              </h2>
              <div className="space-y-3">
                <div className="p-3 border-l-4 border-emerald-500 bg-slate-50 rounded-r-lg">
                  <div className="font-bold text-slate-900">Phase 1 : Spécifications & Formalisation Mathématique (Terminée ✓)</div>
                  <div className="text-slate-600 text-[11px]">Cahier des charges, formules, schéma relationnel, taxonomie et maquette fonctionnelle.</div>
                </div>
                <div className="p-3 border-l-4 border-emerald-500 bg-slate-50 rounded-r-lg">
                  <div className="font-bold text-slate-900">Phase 2 : Moteur de Calcul Découplé & Tests Unitaires (Terminée ✓)</div>
                  <div className="text-slate-600 text-[11px]">100% de couverture sur les calculs avec node:test et node:assert/strict.</div>
                </div>
                <div className="p-3 border-l-4 border-emerald-500 bg-slate-50 rounded-r-lg">
                  <div className="font-bold text-slate-900">Phase 3 : Interface Pro Desktop & Gestion des Stocks (Terminée ✓)</div>
                  <div className="text-slate-600 text-[11px]">Workstation de nomenclature BOM, gestion des stocks, OF et simulation de marges.</div>
                </div>
                <div className="p-3 border-l-4 border-amber-500 bg-slate-50 rounded-r-lg">
                  <div className="font-bold text-slate-900">Phase 4 : Intégration Windows Standalone (Packager PyInstaller / Tauri)</div>
                  <div className="text-slate-600 text-[11px]">Fabrication du binaire exécutable .exe pour déploiement local sous Windows.</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
