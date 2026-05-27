/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Subject, Activity, ClassSession } from '../types';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  MessageSquare,
  Search,
  Filter,
  CheckSquare,
  Square,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  subjects: Subject[];
  activities: Activity[];
  sessions: ClassSession[];
  onToggleActivityStatus: (id: string) => void;
  simulatedDate: string; // YYYY-MM-DD
}

export default function Dashboard({
  subjects,
  activities,
  sessions,
  onToggleActivityStatus,
  simulatedDate
}: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pendiente' | 'Entregado'>('all');
  const [activityTypeFilter, setActivityTypeFilter] = useState<'all' | 'Foro' | 'Portafolio'>('all');

  // Convert "YYYY-MM-DD" style string to Date
  const parseSimulatedDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00');
  };

  const todayStr = simulatedDate;
  const tomorrowStr = useMemo(() => {
    const d = parseSimulatedDate(simulatedDate);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, [simulatedDate]);

  // Map subjects by ID for ultra fast lookups
  const subjectMap = useMemo(() => {
    const map: Record<string, Subject> = {};
    subjects.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [subjects]);

  // Compute days difference between two YYYY-MM-DD dates
  const getDaysDifference = (targetDateStr: string) => {
    const today = parseSimulatedDate(todayStr);
    const target = parseSimulatedDate(targetDateStr);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Class sessions for HOY (Today) and MAÑANA (Tomorrow)
  const todaySessions = useMemo(() => {
    return sessions
      .filter((sess) => sess.date === todayStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [sessions, todayStr]);

  const tomorrowSessions = useMemo(() => {
    return sessions
      .filter((sess) => sess.date === tomorrowStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [sessions, tomorrowStr]);

  // Activity cards metrics helper
  const taskAlerts = useMemo(() => {
    let redCount = 0;
    let yellowCount = 0;
    let greenCount = 0;
    let totalPending = 0;

    activities.forEach((act) => {
      if (act.status === 'Pendiente') {
        totalPending++;
        const daysLeft = getDaysDifference(act.closeDate);
        if (daysLeft < 0) {
          // Overdue still counts as urgent red
          redCount++;
        } else if (daysLeft <= 2) {
          redCount++;
        } else if (daysLeft <= 7) {
          yellowCount++;
        } else {
          greenCount++;
        }
      }
    });

    return { redCount, yellowCount, greenCount, totalPending };
  }, [activities, todayStr]);

  // Complete timeline list with dynamic metrics & sorted by close date
  const filteredActivities = useMemo(() => {
    return activities
      .filter((act) => {
        const subject = subjectMap[act.subjectId];
        const subjectName = subject ? subject.name.toLowerCase() : '';
        const actName = act.name.toLowerCase();
        const matchesSearch =
          actName.includes(searchTerm.toLowerCase()) ||
          subjectName.includes(searchTerm.toLowerCase());

        const matchesSubject = selectedSubjectId === 'all' || act.subjectId === selectedSubjectId;
        const matchesStatus = statusFilter === 'all' || act.status === statusFilter;
        
        let matchesType = true;
        if (activityTypeFilter !== 'all') {
          matchesType = act.type === activityTypeFilter;
        }

        return matchesSearch && matchesSubject && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        // First sort by close date ascending
        return a.closeDate.localeCompare(b.closeDate);
      });
  }, [activities, searchTerm, selectedSubjectId, statusFilter, activityTypeFilter, subjectMap]);

  // Color helper according to subject color parameter
  const getSubjectColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
          badge: 'bg-emerald-500 text-white',
          border: 'border-l-4 border-l-emerald-500',
          accent: 'text-emerald-600',
          dot: 'bg-emerald-500'
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-110',
          badge: 'bg-indigo-500 text-white',
          border: 'border-l-4 border-l-indigo-500',
          accent: 'text-indigo-600',
          dot: 'bg-indigo-500'
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-100',
          badge: 'bg-amber-500 text-white',
          border: 'border-l-4 border-l-amber-500',
          accent: 'text-amber-600',
          dot: 'bg-amber-500'
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-100',
          badge: 'bg-rose-500 text-white',
          border: 'border-l-4 border-l-rose-500',
          accent: 'text-rose-600',
          dot: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-100',
          badge: 'bg-slate-500 text-white',
          border: 'border-l-4 border-l-slate-400',
          accent: 'text-slate-600',
          dot: 'bg-slate-400'
        };
    }
  };

  // Formats 24h hours (19:00) to 12h user-friendly formats (7:00 p.m.)
  const formatTime12h = (timeStr: string) => {
    if (!timeStr) return '';
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${minutesStr} ${ampm}`;
  };

  // Format date readable in Spanish
  const formatReadableDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    try {
      const date = parseSimulatedDate(dateStr);
      const str = date.toLocaleDateString('es-ES', options);
      // Capitalize first letter
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="dashboard-view">
      {/* Dynamic Date Banner & Stats Banner Header - Bento styled */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-slate-900 text-white p-6 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32" />
        </div>
        <div className="space-y-1.5 z-10">
          <span className="text-xs uppercase tracking-widest text-indigo-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
            Cronograma de Actividades Sincronizado
          </span>
          <h1 className="text-2xl font-bold font-display">Mi Dashboard</h1>
          <p className="text-sm text-slate-300">
            {formatReadableDate(simulatedDate)} (Simulado)
          </p>
        </div>

        {/* Highlight widgets */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto z-10">
          <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/50 flex flex-col">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Pendientes</span>
            <span className="text-2xl font-black text-white mt-1">{taskAlerts.totalPending}</span>
          </div>
          <div className="bg-red-950/40 p-3.5 rounded-2xl border border-red-900/40 flex flex-col">
            <span className="text-[10px] text-red-300 uppercase font-bold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Críticos
            </span>
            <span className="text-2xl font-black text-red-400 mt-1">{taskAlerts.redCount}</span>
          </div>
          <div className="bg-amber-950/30 p-3.5 rounded-2xl border border-amber-900/30 flex flex-col">
            <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> Esta Semana
            </span>
            <span className="text-2xl font-black text-amber-400 mt-1">{taskAlerts.yellowCount}</span>
          </div>
          <div className="bg-emerald-950/20 p-3.5 rounded-2xl border border-emerald-900/30 flex flex-col">
            <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Con Tiempo
            </span>
            <span className="text-2xl font-black text-emerald-400 mt-1">{taskAlerts.greenCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column / Agenda del Día */}
        <div className="lg:col-span-1 space-y-6">
          {/* THE BEAUTIFUL INDIGO AGENDA BOX */}
          <div className="bg-indigo-600 p-6 rounded-[2.5rem] text-white relative overflow-hidden shadow-md flex-1">
            <div className="relative z-10">
              <h2 className="text-lg font-bold font-sans flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5" />
                Agenda de Hoy
              </h2>

              {todaySessions.length === 0 ? (
                <div className="bg-white/10 rounded-2xl p-5 text-center border border-dashed border-white/20">
                  <Clock className="w-8 h-8 text-indigo-200 mx-auto mb-2" />
                  <p className="text-xs text-white">No hay encuentros programados para hoy.</p>
                  <p className="text-[10px] text-indigo-200 mt-1 italic">¡Buen momento para adelantar tareas!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todaySessions.map((sess) => {
                    const sub = subjectMap[sess.subjectId];
                    return (
                      <div
                        key={sess.id}
                        className="bg-white/10 p-4 rounded-2xl border border-white/20 text-white space-y-3"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <span className="px-2 py-0.5 bg-indigo-400/30 rounded text-[9px] font-bold uppercase tracking-wider block w-fit mb-1.5 truncate">
                              {sub ? sub.name : 'Materia'}
                            </span>
                            <h4 className="text-sm font-bold leading-tight">{sess.name}</h4>
                          </div>
                          <span className="px-2 py-0.5 bg-indigo-400/30 rounded text-[9px] font-bold uppercase tracking-wider block shrink-0">
                            {sess.type === 'Sincrónico-Virtual' ? 'Virtual' : 'Presencial'}
                          </span>
                        </div>

                        <p className="text-[10px] opacity-80 leading-tight">
                          Docente: {sub ? sub.teacher : 'Docente'} • {sub ? sub.credits : ''} Creds
                        </p>

                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <Clock className="w-3.5 h-3.5 opacity-80" />
                          <span>{formatTime12h(sess.startTime)} - {formatTime12h(sess.endTime)}</span>
                        </div>

                        {sess.url && (
                          <a
                            href={sess.url}
                            target="_blank"
                            rel="noreferrer referrer"
                            className="block w-full text-center py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold shadow-md hover:bg-indigo-50 transition"
                          >
                            Unirse a Clase
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Tomorrow summary inside agenda box */}
              {tomorrowSessions.length > 0 && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <span className="text-[10px] uppercase tracking-widest text-indigo-200 font-bold block mb-3">
                    Próximamente Mañana
                  </span>
                  <div className="space-y-2">
                    {tomorrowSessions.map((sess) => {
                      const sub = subjectMap[sess.subjectId];
                      return (
                        <div key={sess.id} className="flex gap-3 items-center text-xs p-2.5 rounded-xl bg-white/5 border border-white/10">
                          <div className="opacity-70">
                            <Clock className="w-3.5 h-3.5 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white truncate text-[11px]">{sess.name}</p>
                            <p className="text-[10px] text-indigo-200 font-mono mt-0.5">
                              {formatTime12h(sess.startTime)} • {sub ? sub.name : 'Materia'} • Docente: {sub ? sub.teacher : 'N/A'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Decorative circle absolute */}
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          </div>

          {/* Academic Performance tracker - Bento Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 font-black block">
              Desempeño Académico Estimado
            </h2>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Calculado en base al peso de las actividades entregadas con éxito:
            </p>

            <div className="space-y-4">
              {subjects.map((sub) => {
                const subActivities = activities.filter((act) => act.subjectId === sub.id);
                const deliveredWeight = subActivities
                  .filter((act) => act.status === 'Entregado')
                  .reduce((sum, act) => sum + act.percentage, 0);
                const totalCourseWeight = subActivities.reduce((sum, act) => sum + act.percentage, 0);
                
                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-700 truncate max-w-[170px]" title={sub.name}>
                        {sub.name}
                      </span>
                      <span className="font-mono text-slate-500 text-[10px]">
                        {deliveredWeight}% / {totalCourseWeight}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          deliveredWeight === 100
                            ? 'bg-emerald-500'
                            : deliveredWeight >= 50
                            ? 'bg-indigo-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${totalCourseWeight ? (deliveredWeight / totalCourseWeight) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right columns / Dynamic Task Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            
            {/* Filter controls and Search layout */}
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div>
                  <h2 className="text-md font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-slate-500" />
                    Timeline de Actividades Pendientes
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ordenado cronológicamente por fecha límite (First In, First Out con respecto al tiempo).
                  </p>
                </div>
              </div>

              {/* Filters grid */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                {/* Search word */}
                <div className="relative sm:col-span-2">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar tarea o materia..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 placeholder-slate-400"
                  />
                </div>

                {/* Subject filter */}
                <div className="relative">
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="all">Materias: Todas</option>
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Urgencia / Status filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="all">Estado: Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Entregado">Entregado</option>
                  </select>
                </div>

                {/* Sub-Filters / Activity Type */}
                <div className="relative sm:col-span-2 sm:col-start-3">
                  <div className="flex items-center gap-1 bg-slate-200/50 p-0.5 rounded-md text-[11px] w-full">
                    <button
                      onClick={() => setActivityTypeFilter('all')}
                      className={`flex-1 text-center py-1 rounded transition-${
                        activityTypeFilter === 'all' ? 'bg-white font-bold text-slate-800 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setActivityTypeFilter('Portafolio')}
                      className={`flex-1 text-center py-1 rounded transition-${
                        activityTypeFilter === 'Portafolio' ? 'bg-white font-bold text-slate-800 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Portafolios
                    </button>
                    <button
                      onClick={() => setActivityTypeFilter('Foro')}
                      className={`flex-1 text-center py-1 rounded transition-${
                        activityTypeFilter === 'Foro' ? 'bg-white font-bold text-slate-800 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      Foros
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* List items timeline container */}
            <div className="mt-6 space-y-3">
              {filteredActivities.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                  <AlertTriangle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Ninguna actividad coincide con los filtros aplicados.</p>
                </div>
              ) : (
                filteredActivities.map((act) => {
                  const sub = subjectMap[act.subjectId];
                  const colorTheme = getSubjectColorClasses(sub?.color || 'slate');
                  const daysLeft = getDaysDifference(act.closeDate);
                  
                  // Compute alarm styling
                  let urgencyBadge = '';
                  let levelText = '';
                  let timelineBorderClasses = 'border-l-4 border-l-slate-300';
                  
                  if (act.status === 'Entregado') {
                    urgencyBadge = 'bg-slate-100 text-slate-500 border-slate-200';
                    levelText = 'Completado ✓';
                    timelineBorderClasses = 'border-l-4 border-l-slate-300 opacity-60 bg-slate-50/30';
                  } else {
                    if (daysLeft < 0) {
                      urgencyBadge = 'bg-red-50 text-red-600 border-red-200-dotted opacity-85';
                      levelText = `Cerrado / Vencido`;
                      timelineBorderClasses = 'border-l-4 border-l-slate-300 opacity-60 bg-slate-50/30';
                    } else if (daysLeft === 0) {
                      urgencyBadge = 'bg-red-50 text-red-700 border-red-200 font-bold animate-pulse';
                      levelText = '¡VENCE HOY! 🚨';
                      timelineBorderClasses = 'border-l-4 border-l-red-500 bg-red-50/20';
                    } else if (daysLeft === 1) {
                      urgencyBadge = 'bg-red-50 text-red-600 border-red-100 font-bold';
                      levelText = 'Vence mañana ⌛';
                      timelineBorderClasses = 'border-l-4 border-l-red-400 bg-red-50/10';
                    } else if (daysLeft <= 2) {
                      urgencyBadge = 'bg-red-50 text-red-600 border-red-100';
                      levelText = `Vence en ${daysLeft} días ⏳`;
                      timelineBorderClasses = 'border-l-4 border-l-red-400 bg-red-50/10';
                    } else if (daysLeft <= 7) {
                      urgencyBadge = 'bg-amber-50 text-amber-800 border-amber-100';
                      levelText = `Vence en ${daysLeft} días`;
                      timelineBorderClasses = 'border-l-4 border-l-amber-400 bg-amber-50/10';
                    } else {
                      urgencyBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                      levelText = `Suficiente (${daysLeft} días)`;
                      timelineBorderClasses = 'border-l-4 border-l-emerald-400 bg-emerald-50/5';
                    }
                  }

                  return (
                    <div
                      key={act.id}
                      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4.5 rounded-2xl border border-slate-200 transition hover:shadow-sm hover:border-slate-300 gap-4 ${timelineBorderClasses}`}
                    >
                      {/* Check interaction + basic text description */}
                      <div className="flex gap-3 items-start flex-1 min-w-0">
                        <button
                          onClick={() => onToggleActivityStatus(act.id)}
                          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                          title={
                            act.status === 'Entregado' 
                              ? 'Marcar como pendiente' 
                              : daysLeft < 0 
                              ? 'Cerrado / Vencido (Click para forzar completado)' 
                              : 'Marcar como completado'
                          }
                        >
                          {act.status === 'Entregado' ? (
                            <CheckSquare className="w-5 h-5 text-indigo-600" />
                          ) : daysLeft < 0 ? (
                            <div className="relative flex items-center justify-center">
                              <Square className="w-5 h-5 text-red-300 opacity-65" />
                              <span className="absolute text-[12px] text-red-500 font-bold select-none leading-none">×</span>
                            </div>
                          ) : (
                            <Square className="w-5 h-5 text-slate-400 hover:text-indigo-500" />
                          )}
                        </button>

                        <div className="space-y-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${colorTheme.bg}`}>
                              {sub ? sub.name : 'Materia'}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                              {act.type === 'Foro' ? (
                                <MessageSquare className="w-3 h-3 text-slate-400" />
                              ) : (
                                <FileText className="w-3 h-3 text-slate-400" />
                              )}
                              {act.type}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                              {act.percentage}%
                            </span>
                            {sub?.teacher && (
                              <span className="text-[10px] text-indigo-750 font-semibold bg-indigo-50/70 border border-indigo-100/50 px-1.5 py-0.5 rounded-md">
                                Docente: {sub.teacher}
                              </span>
                            )}
                          </div>

                          <h3
                            className={`text-slate-900 font-medium text-xs leading-snug ${
                              act.status === 'Entregado' || daysLeft < 0 ? 'line-through text-slate-400/85 italic' : ''
                            }`}
                          >
                            {act.name}
                            {daysLeft < 0 && act.status !== 'Entregado' && (
                              <span className="ml-1.5 inline-block text-[10px] bg-red-50 text-red-500 border border-red-100 px-1 rounded font-semibold italic">
                                Cerró / Vencido
                              </span>
                            )}
                          </h3>

                          {act.notes && (
                            <p className="text-[10px] text-slate-400 pt-0.5 max-w-xl">{act.notes}</p>
                          )}
                          
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono mt-1">
                            <span>Apertura: {act.openDate}</span>
                            <span>•</span>
                            <span>Límite: {act.closeDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Urgencia Alert Tag */}
                      <div className="flex sm:flex-col justify-between sm:items-end w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                        <div className={`text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full border ${urgencyBadge}`}>
                          {levelText}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
