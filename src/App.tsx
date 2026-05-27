/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Subject, Activity, ClassSession } from './types';
import { SEED_SUBJECTS, SEED_ACTIVITIES, SEED_SESSIONS } from './seed';
import Dashboard from './components/Dashboard';
import SubjectManager from './components/SubjectManager';
import CalendarView from './components/CalendarView';
import DataStructureView from './components/DataStructureView';

import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Calendar as CalendarIcon,
  Code2,
  RefreshCw,
  User,
  Settings,
  X,
  Plus,
  BookMarked,
  Clock,
  ChevronRight
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subjects' | 'calendar' | 'architecture'>('dashboard');

  // Core Persistent State
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [sessions, setSessions] = useState<ClassSession[]>([]);

  // Real Date helper
  const getTodayDateStr = () => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [useRealDate, setUseRealDate] = useState<boolean>(() => {
    const saved = localStorage.getItem('uniguide_use_real_date');
    return saved ? saved === 'true' : true; // Default to true!
  });

  // Student profile settings
  const [studentName, setStudentName] = useState('Temis Premium');
  const [degreeName, setDegreeName] = useState('Trabajo Social');
  const [universityName, setUniversityName] = useState('Fundación Universitaria Claretiana');
  const [simulatedDate, setSimulatedDate] = useState('2026-05-26'); // Matching realistic virtual platform date!

  // Profile Edit drawer/modal state
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Load from LocalStorage or seed automatically
  useEffect(() => {
    const savedSubjects = localStorage.getItem('uniguide_subjects');
    const savedActivities = localStorage.getItem('uniguide_activities');
    const savedSessions = localStorage.getItem('uniguide_sessions');
    const savedName = localStorage.getItem('uniguide_student_name');
    const savedDegree = localStorage.getItem('uniguide_degree');
    const savedUniversity = localStorage.getItem('uniguide_university');
    const savedSimDate = localStorage.getItem('uniguide_sim_date');

    if (savedSubjects && savedActivities && savedSessions) {
      const parsedSubjects = JSON.parse(savedSubjects);
      const parsedActivities = JSON.parse(savedActivities);
      const parsedSessions = JSON.parse(savedSessions);
      const statsSub = parsedSubjects.find((s: any) => s.id === 'fundamentos-estadistica');
      const metSub = parsedSubjects.find((s: any) => s.id === 'metodologia-investigacion');
      
      const eqgAct1 = parsedActivities.find((a: any) => a.id === 'eqg-act-1');
      const eqgAct2 = parsedActivities.find((a: any) => a.id === 'eqg-act-2');

      const metSess1 = parsedSessions.find((s: any) => s.id === 'met-sess-1');
      const estSess1 = parsedSessions.find((s: any) => s.id === 'est-sess-1');
      const eqgSess1 = parsedSessions.find((s: any) => s.id === 'eqg-sess-1');
      const dhSess1 = parsedSessions.find((s: any) => s.id === 'dh-sess-1');
      const needsTeamsUpdate = metSess1 && !metSess1.url.includes('launcher.html');
      const needsStatsTeamsUpdate = estSess1 && !estSess1.url.includes('teams.microsoft.com');
      const needsEqgTeamsUpdate = eqgSess1 && !eqgSess1.url.includes('teams.microsoft.com');
      const needsDhTeamsUpdate = dhSess1 && !dhSess1.url.includes('teams.microsoft.com');

      // Auto-migrate if database is using the old seed structure where stats had 3 credits, methodology is old, Equidad de Género dates are un-updated, or teams url is old
      const needsMigration = 
        (statsSub && (statsSub.credits === 3 || statsSub.teacher === 'Daniela Ines Morales Araque')) ||
        (metSub && (metSub.credits === 3 || metSub.teacher === 'Oscar Alberto de la Cruz Mesa' || !parsedSubjects.some((s: any) => s.id === 'equidad-genero'))) ||
        (eqgAct1 && eqgAct1.closeDate === '2026-05-17') ||
        (eqgAct2 && eqgAct2.closeDate === '2026-05-22') ||
        needsTeamsUpdate ||
        needsStatsTeamsUpdate ||
        needsEqgTeamsUpdate ||
        needsDhTeamsUpdate;

      if (needsMigration) {
        setSubjects(SEED_SUBJECTS);
        setActivities(SEED_ACTIVITIES);
        setSessions(SEED_SESSIONS);
        localStorage.setItem('uniguide_subjects', JSON.stringify(SEED_SUBJECTS));
        localStorage.setItem('uniguide_activities', JSON.stringify(SEED_ACTIVITIES));
        localStorage.setItem('uniguide_sessions', JSON.stringify(SEED_SESSIONS));
      } else {
        setSubjects(parsedSubjects);
        setActivities(JSON.parse(savedActivities));
        setSessions(JSON.parse(savedSessions));
      }
    } else {
      // Seed initial data
      setSubjects(SEED_SUBJECTS);
      setActivities(SEED_ACTIVITIES);
      setSessions(SEED_SESSIONS);

      localStorage.setItem('uniguide_subjects', JSON.stringify(SEED_SUBJECTS));
      localStorage.setItem('uniguide_activities', JSON.stringify(SEED_ACTIVITIES));
      localStorage.setItem('uniguide_sessions', JSON.stringify(SEED_SESSIONS));
    }

    if (savedName) setStudentName(savedName);
    if (savedDegree) setDegreeName(savedDegree);
    if (savedUniversity) setUniversityName(savedUniversity);
    
    const savedUseRealDate = localStorage.getItem('uniguide_use_real_date');
    const isReal = savedUseRealDate ? savedUseRealDate === 'true' : true;

    let activeSimDate = '2026-05-26';
    if (isReal) {
      activeSimDate = getTodayDateStr();
    } else if (savedSimDate) {
      activeSimDate = savedSimDate;
    } else {
      localStorage.setItem('uniguide_sim_date', '2026-05-26');
    }
    setSimulatedDate(activeSimDate);
    setSelectedSimulatedDateInput(activeSimDate);
  }, []);

  // Save states back to LocalStorage whenever they change
  const saveToStorage = (newSubs: Subject[], newActs: Activity[], newSess: ClassSession[]) => {
    setSubjects(newSubs);
    setActivities(newActs);
    setSessions(newSess);
    localStorage.setItem('uniguide_subjects', JSON.stringify(newSubs));
    localStorage.setItem('uniguide_activities', JSON.stringify(newActs));
    localStorage.setItem('uniguide_sessions', JSON.stringify(newSess));
  };

  // Profile save helper
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('uniguide_student_name', studentName);
    localStorage.setItem('uniguide_degree', degreeName);
    localStorage.setItem('uniguide_university', universityName);
    localStorage.setItem('uniguide_sim_date', simulatedDate);
    setShowSettingsModal(false);
  };

  // Reset helper
  const handleResetToSeedData = () => {
    if (confirm('¿Deseas restablecer toda la base de datos a los valores semilla de Uniclaretiana? Esto reescribirá tus materias actuales.')) {
      setSubjects(SEED_SUBJECTS);
      setActivities(SEED_ACTIVITIES);
      setSessions(SEED_SESSIONS);
      setSimulatedDate('2026-05-26');
      localStorage.setItem('uniguide_subjects', JSON.stringify(SEED_SUBJECTS));
      localStorage.setItem('uniguide_activities', JSON.stringify(SEED_ACTIVITIES));
      localStorage.setItem('uniguide_sessions', JSON.stringify(SEED_SESSIONS));
      localStorage.setItem('uniguide_sim_date', '2026-05-26');
      setSelectedSimulatedDateInput('2026-05-26');
      alert('¡Base de datos restablecida con éxito!');
    }
  };

  // Core Callback Actions
  // Toggle activity Completed / Pending
  const handleToggleActivityStatus = (id: string) => {
    const updated = activities.map((act) => {
      if (act.id === id) {
        return {
          ...act,
          status: act.status === 'Entregado' ? ('Pendiente' as const) : ('Entregado' as const)
        };
      }
      return act;
    });
    saveToStorage(subjects, updated, sessions);
  };

  // Set specific activity state
  const handleUpdateActivityStatus = (id: string, newStatus: 'Pendiente' | 'Entregado') => {
    const updated = activities.map((act) => {
      if (act.id === id) {
        return { ...act, status: newStatus };
      }
      return act;
    });
    saveToStorage(subjects, updated, sessions);
  };

  // CRUD Materias
  const handleAddSubject = (newSub: Omit<Subject, 'id'>) => {
    const fresh: Subject = {
      ...newSub,
      id: `subj-id-${Date.now()}`
    };
    const updated = [...subjects, fresh];
    saveToStorage(updated, activities, sessions);
  };

  const handleUpdateSubject = (updatedSub: Subject) => {
    const updated = subjects.map((s) => (s.id === updatedSub.id ? updatedSub : s));
    saveToStorage(updated, activities, sessions);
  };

  const handleDeleteSubject = (id: string) => {
    const updatedSubs = subjects.filter((s) => s.id !== id);
    // Cascade delete activities and sessions
    const updatedActs = activities.filter((act) => act.subjectId !== id);
    const updatedSess = sessions.filter((sess) => sess.subjectId !== id);
    saveToStorage(updatedSubs, updatedActs, updatedSess);
  };

  // CRUD Actividades
  const handleAddActivity = (newAct: Omit<Activity, 'id'>) => {
    const fresh: Activity = {
      ...newAct,
      id: `act-id-${Date.now()}`
    };
    const updated = [...activities, fresh];
    saveToStorage(subjects, updated, sessions);
  };

  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((act) => act.id !== id);
    saveToStorage(subjects, updated, sessions);
  };

  // CRUD Encuentros / Clases
  const handleAddSession = (newSess: Omit<ClassSession, 'id'>) => {
    const fresh: ClassSession = {
      ...newSess,
      id: `sess-id-${Date.now()}`
    };
    const updated = [...sessions, fresh];
    saveToStorage(subjects, activities, updated);
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((sess) => sess.id !== id);
    saveToStorage(subjects, activities, updated);
  };

  // Internal simulated date input sync state
  const [selectedSimulatedDateInput, setSelectedSimulatedDateInput] = useState('2026-05-26');

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col antialiased px-4 sm:px-6 lg:px-8 pb-20 lg:pb-0">
      {/* GLOBAL BANNER HEADER - Floating Bento Element */}
      <header className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 mt-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Institution + Student Persona block */}
          <div className="flex items-center gap-4">
            <div className="h-12 flex items-center shrink-0 bg-slate-50 border border-slate-100/60 p-2 rounded-xl shadow-2xs">
              <img src="https://sga.claretiano.edu.br/sav/res/img/logo-barra-fucla.png" alt="Uniclaretiana Logo" className="h-8 md:h-10 object-contain" referrerPolicy="no-referrer" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {universityName}
                </span>
                <span className="text-[10px] bg-slate-100 font-semibold text-slate-600 px-2.5 py-0.5 rounded-full">
                  Modalidad Híbrida
                </span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 leading-tight">
                Organizador Académico • <span className="text-indigo-600 font-display">{degreeName}</span>
              </h1>
            </div>
          </div>

          {/* Quick Stats + Profile actions */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto self-stretch md:self-auto justify-between md:justify-end">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between">
              <div 
                onClick={() => setShowSettingsModal(true)}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 hover:bg-slate-100 cursor-pointer p-2 rounded-xl transition text-xs font-semibold text-slate-700 shadow-2xs shrink-0"
                title="Configurar Perfil"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px]">
                  {studentName.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="max-w-[85px] sm:max-w-[120px] truncate text-slate-900 font-bold text-[11px]">{studentName}</p>
                </div>
                <Settings className="w-3 h-3 text-slate-400" />
              </div>

              <div className="flex items-center bg-slate-150 p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => {
                    setUseRealDate(true);
                    localStorage.setItem('uniguide_use_real_date', 'true');
                    const realDate = getTodayDateStr();
                    setSimulatedDate(realDate);
                    setSelectedSimulatedDateInput(realDate);
                  }}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition ${
                    useRealDate
                      ? 'bg-indigo-600 text-white shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Sincronizar automáticamente con el reloj de internet"
                >
                  📡 Hora Real
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUseRealDate(false);
                    localStorage.setItem('uniguide_use_real_date', 'false');
                  }}
                  className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition ${
                    !useRealDate
                      ? 'bg-indigo-600 text-white shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Simular fecha manualmente"
                >
                  ⚙️ Manual
                </button>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl text-xs font-semibold text-slate-705 shadow-2xs">
                <Clock className="w-3.5 h-3.5 text-indigo-505 shrink-0" />
                <input
                  type="date"
                  disabled={useRealDate}
                  value={selectedSimulatedDateInput}
                  onChange={(e) => {
                    setSelectedSimulatedDateInput(e.target.value);
                    setSimulatedDate(e.target.value);
                    localStorage.setItem('uniguide_sim_date', e.target.value);
                  }}
                  className={`bg-transparent text-slate-700 font-mono font-bold focus:outline-hidden border-none p-0 text-[10px] w-[95px] ${
                    useRealDate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                  title={useRealDate ? "Desactiva 'Hora Real' para cambiar la fecha manualmente" : "Cambiar fecha de simulación"}
                />
              </div>

              <button
                onClick={handleResetToSeedData}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl transition cursor-pointer flex items-center gap-1 text-xs font-semibold shadow-2xs shrink-0"
                title="Reiniciar datos semilla"
              >
                <RefreshCw className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">Restablecer Semilla</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CORE FRAME LAYOUT */}
      <div className="max-w-7xl mx-auto w-full py-6 flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* Navigation Sidebar (Left Column - desktop layout) */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 lg:sticky lg:top-6 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 block mb-1">
              Navegación
            </span>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition text-xs font-semibold ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                Resumen Dashboard
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('subjects')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition text-xs font-semibold ${
                activeTab === 'subjects'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4" />
                Gestión de Materias
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition text-xs font-semibold ${
                activeTab === 'calendar'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <CalendarIcon className="w-4 h-4" />
                Agenda Horarios / Meet
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl transition text-xs font-semibold ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4" />
                Entidades Spring Boot
              </span>
              <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            </button>

            {/* Quick Helper Widget in Sidebar - Bento style */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3 px-3">
              <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
                Fecha del Sistema
              </span>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="useSelfRealDateCheckbox"
                  checked={useRealDate}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setUseRealDate(checked);
                    localStorage.setItem('uniguide_use_real_date', String(checked));
                    if (checked) {
                      const realDate = getTodayDateStr();
                      setSimulatedDate(realDate);
                      setSelectedSimulatedDateInput(realDate);
                    }
                  }}
                  className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer h-3.5 w-3.5"
                />
                <label htmlFor="useSelfRealDateCheckbox" className="text-[10px] text-slate-600 font-bold cursor-pointer">
                  📡 Sincronizar con hora real
                </label>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                {useRealDate 
                  ? "Sincronizado vía web/red en tiempo real." 
                  : "Modifica el calendario simulado para ver las alertas de entrega cambiar dinámicamente."}
              </p>
              <input
                type="date"
                disabled={useRealDate}
                value={selectedSimulatedDateInput}
                onChange={(e) => {
                  setSelectedSimulatedDateInput(e.target.value);
                  setSimulatedDate(e.target.value);
                  localStorage.setItem('uniguide_sim_date', e.target.value);
                }}
                className={`w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 font-mono focus:outline-hidden focus:border-indigo-500 shadow-inner ${
                  useRealDate ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              />
            </div>
          </div>
        </aside>

        {/* Dynamic Display Panel Column (Right side) */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <Dashboard
              subjects={subjects}
              activities={activities}
              sessions={sessions}
              onToggleActivityStatus={handleToggleActivityStatus}
              simulatedDate={simulatedDate}
            />
          )}

          {activeTab === 'subjects' && (
            <SubjectManager
              subjects={subjects}
              activities={activities}
              sessions={sessions}
              onAddSubject={handleAddSubject}
              onUpdateSubject={handleUpdateSubject}
              onDeleteSubject={handleDeleteSubject}
              onAddActivity={handleAddActivity}
              onUpdateActivityStatus={handleUpdateActivityStatus}
              onDeleteActivity={handleDeleteActivity}
              onAddSession={handleAddSession}
              onDeleteSession={handleDeleteSession}
              simulatedDate={simulatedDate}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              subjects={subjects}
              sessions={sessions}
            />
          )}

          {activeTab === 'architecture' && (
            <DataStructureView />
          )}
        </main>
      </div>

      {/* FLOATING FOOTER INFORMATION ACCENT */}
      <footer className="hidden lg:flex border-t border-slate-200/80 py-5 mt-auto justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest gap-2">
        <div>Sincronizado con: Plataforma Universitaria Uniclaretiana v4.2</div>
        <div className="flex gap-4">
          <span>Backend: Java Spring Boot</span>
          <span>Frontend: React + Tailwind</span>
        </div>
      </footer>

      {/* STICKY BOTTOM TAB BAR FOR MOBILE COMPLIANCE */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 flex justify-around items-center py-2 px-3 lg:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex-col items-center gap-1.5 transition text-center select-none cursor-pointer flex ${
            activeTab === 'dashboard' ? 'text-indigo-650 font-bold' : 'text-slate-400 hover:text-indigo-500'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider">Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('subjects')}
          className={`flex-col items-center gap-1.5 transition text-center select-none cursor-pointer flex ${
            activeTab === 'subjects' ? 'text-indigo-650 font-bold' : 'text-slate-400 hover:text-indigo-500'
          }`}
        >
          <BookOpen className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider">Materias</span>
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`flex-col items-center gap-1.5 transition text-center select-none cursor-pointer flex ${
            activeTab === 'calendar' ? 'text-indigo-650 font-bold' : 'text-slate-400 hover:text-indigo-500'
          }`}
        >
          <CalendarIcon className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider">Agenda</span>
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex-col items-center gap-1.5 transition text-center select-none cursor-pointer flex ${
            activeTab === 'architecture' ? 'text-indigo-650 font-bold' : 'text-slate-400 hover:text-indigo-500'
          }`}
        >
          <Code2 className="w-5 h-5 shrink-0" />
          <span className="text-[9px] uppercase tracking-wider">Spring Boot</span>
        </button>
      </nav>

      {/* USER PROFILE & SETTINGS DIALOG */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-950 text-xs">Ajustes de Perfil Escolar</h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">Nombre del Estudiante</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Juan Pérez"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">Programa / Carrera Profesional</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Trabajo Social"
                  value={degreeName}
                  onChange={(e) => setDegreeName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">Institución Universitaria</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Fundación Universitaria Claretiana"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block text-[11px]">Fecha Actual del Campus (Simulación)</label>
                <input
                  type="date"
                  required
                  value={simulatedDate}
                  onChange={(e) => {
                    setSimulatedDate(e.target.value);
                    setSelectedSimulatedDateInput(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-mono"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 font-semibold rounded-lg text-white"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
