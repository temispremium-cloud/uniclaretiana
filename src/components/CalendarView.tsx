/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Subject, ClassSession, EncounterType } from '../types';
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  ExternalLink,
  Search,
  Filter,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';

interface CalendarViewProps {
  subjects: Subject[];
  sessions: ClassSession[];
}

export default function CalendarView({ subjects, sessions }: CalendarViewProps) {
  const [sessionTypeFilter, setSessionTypeFilter] = useState<'all' | EncounterType>('all');
  const [subjectFilterId, setSubjectFilterId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Map subjects for ultra fast lookups
  const subjectMap = useMemo(() => {
    const map: Record<string, Subject> = {};
    subjects.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, [subjects]);

  // Color helper according to subject color parameter
  const getSubjectColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-110',
          badge: 'bg-emerald-500 text-white',
          border: 'border-l-4 border-l-emerald-500',
          hoverBg: 'hover:bg-emerald-50/40',
        };
      case 'indigo':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-110',
          badge: 'bg-indigo-500 text-white',
          border: 'border-l-4 border-l-indigo-500',
          hoverBg: 'hover:bg-indigo-50/40',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-110',
          badge: 'bg-amber-500 text-white',
          border: 'border-l-4 border-l-amber-500',
          hoverBg: 'hover:bg-amber-50/40',
        };
      case 'rose':
        return {
          bg: 'bg-rose-50 text-rose-800 border-rose-110',
          badge: 'bg-rose-500 text-white',
          border: 'border-l-4 border-l-rose-500',
          hoverBg: 'hover:bg-rose-50/40',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-800 border-slate-110',
          badge: 'bg-slate-500 text-white',
          border: 'border-l-4 border-l-slate-400',
          hoverBg: 'hover:bg-slate-50/40',
        };
    }
  };

  // Filter and sort meetings chronologically
  const filteredSessions = useMemo(() => {
    return sessions
      .filter((sess) => {
        const sub = subjectMap[sess.subjectId];
        const matchSubject = subjectFilterId === 'all' || sess.subjectId === subjectFilterId;
        const matchType = sessionTypeFilter === 'all' || sess.type === sessionTypeFilter;
        
        const subName = sub ? sub.name.toLowerCase() : '';
        const teacherName = sub ? sub.teacher.toLowerCase() : '';
        const sessName = sess.name.toLowerCase();
        const matchSearch =
          sessName.includes(searchTerm.toLowerCase()) ||
          subName.includes(searchTerm.toLowerCase()) ||
          teacherName.includes(searchTerm.toLowerCase());

        return matchSubject && matchType && matchSearch;
      })
      .sort((a, b) => {
        // Sort chronologically (earliest first or latest first? Let's show upcoming chronological order)
        const dateCheck = a.date.localeCompare(b.date);
        if (dateCheck !== 0) return dateCheck;
        return a.startTime.localeCompare(b.startTime);
      });
  }, [sessions, subjectFilterId, sessionTypeFilter, searchTerm, subjectMap]);

  // Translate 24h to 12h nicely
  const formatTime12h = (timeStr: string) => {
    if (!timeStr) return '';
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${minutesStr} ${ampm}`;
  };

  // Friendly date helper in Spanish (e.g., "Miércoles, 27 de mayo de 2026")
  const formatFriendlyDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    try {
      const parts = dateStr.split('-');
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const str = d.toLocaleDateString('es-ES', options);
      // Capitalize first letter
      return str.charAt(0).toUpperCase() + str.slice(1);
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in" id="calendar-view">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Control de Clases y Encuentros
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Visualiza de forma consolidada todos los encuentros sincrónicos remotos e in-situ presenciales programados.
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar clase o profesor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <select
            value={subjectFilterId}
            onChange={(e) => setSubjectFilterId(e.target.value)}
            className="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="all">Materias: Todas</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={sessionTypeFilter}
            onChange={(e) => setSessionTypeFilter(e.target.value as any)}
            className="px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="all">Filtro: Todos</option>
            <option value="Sincrónico-Virtual">Virtual (Sincrónico)</option>
            <option value="Presencial">Presencial (Sede física)</option>
          </select>
        </div>
      </div>

      {/* Info Notice Badge */}
      <div className="p-4 bg-indigo-50 border border-indigo-100/80 rounded-3xl flex gap-3 text-xs text-indigo-900 leading-relaxed max-w-4xl shadow-2xs">
        <Info className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
        <div>
          <strong>🚀 Acceso Express en 1-Clic:</strong> Ya no necesitas entrar al portal universitario y buscar entre pestañas el aula web. Cada elemento a continuación cuenta con su enlace configurado. Para las videoconferencias virtuales, el botón te llevará directo a <strong>Google Meet / Teams</strong>, y para los encuentros presenciales, cargará un mapa de asistencia con detalles de ubicación estructurados.
        </div>
      </div>

      {/* Calendar chronological cards timeline grid */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white border border-slate-250 rounded-3xl p-12 text-center max-w-md mx-auto shadow-sm">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No se encontraron encuentros</h3>
            <p className="text-xs text-slate-500 mt-1">
              Prueba cambiando la configuración de los filtros superiores o registra un nuevo horario en el Módulo de Materias.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSessions.map((sess) => {
              const sub = subjectMap[sess.subjectId];
              const styles = getSubjectColorClasses(sub?.color || 'slate');

              return (
                <div
                  key={sess.id}
                  className={`bg-white rounded-3xl border border-slate-200 p-5 shadow-sm ${styles.border} ${styles.hoverBg} transition duration-150 flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    {/* Header line */}
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles.bg}`}>
                          {sub ? sub.name : 'Materia'}
                        </span>
                        <h3 className="text-slate-900 font-bold text-xs mt-1.5 leading-snug">{sess.name}</h3>
                        {sub?.teacher && (
                          <p className="text-[10px] text-slate-500 font-medium">Docente: {sub.teacher}</p>
                        )}
                      </div>

                      {/* virtual vs physical badge */}
                      <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-2.5 py-1 rounded-md shrink-0 border ${
                        sess.type === 'Sincrónico-Virtual'
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {sess.type === 'Sincrónico-Virtual' ? (
                          <>
                            <Video className="w-3.5 h-3.5" />
                            Virtual
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5" />
                            Presencial
                          </>
                        )}
                      </span>
                    </div>

                    {/* Clock, hours and date */}
                    <div className="flex flex-col gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-[11px] text-slate-700">{formatFriendlyDate(sess.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400" />
                        <span className="font-semibold text-indigo-700">
                          {formatTime12h(sess.startTime)} a {formatTime12h(sess.endTime)}
                        </span>
                      </div>
                    </div>

                    {/* Notes text area */}
                    {sess.notes && (
                      <p className="text-[11px] text-slate-500 leading-normal pl-1.5 border-l border-slate-200 italic">
                        "{sess.notes}"
                      </p>
                    )}
                  </div>

                  {/* Quick trigger action button */}
                  {sess.url && (
                    <div className="mt-5 pt-4 border-t border-slate-100">
                      <a
                        href={sess.url}
                        target="_blank"
                        rel="noreferrer referrer"
                        className={`w-full inline-flex items-center justify-center gap-2 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-transform hover:-translate-y-0.5 active:translate-y-0 ${
                          sess.type === 'Sincrónico-Virtual'
                            ? 'bg-indigo-650 hover:bg-indigo-750'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {sess.type === 'Sincrónico-Virtual' ? (
                          <>
                            <Video className="w-4 h-4" />
                            Ingresar a Videoconferencia con 1-clic
                          </>
                        ) : (
                          <>
                            <MapPin className="w-4 h-4" />
                            Ver mapa de acceso físico
                          </>
                        )}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
