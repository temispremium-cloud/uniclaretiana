/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Subject, Activity, ClassSession, ActivityType, EncounterType } from '../types';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit,
  User,
  Award,
  Calendar,
  Layers,
  Link,
  Save,
  X,
  PlusCircle,
  Video,
  MapPin,
  Clock,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

interface SubjectManagerProps {
  subjects: Subject[];
  activities: Activity[];
  sessions: ClassSession[];
  onAddSubject: (subject: Omit<Subject, 'id'>) => void;
  onUpdateSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string) => void;
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
  onUpdateActivityStatus: (id: string, status: 'Pendiente' | 'Entregado') => void;
  onDeleteActivity: (id: string) => void;
  onAddSession: (session: Omit<ClassSession, 'id'>) => void;
  onDeleteSession: (id: string) => void;
  simulatedDate: string;
}

export default function SubjectManager({
  subjects,
  activities,
  sessions,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onAddActivity,
  onUpdateActivityStatus,
  onDeleteActivity,
  onAddSession,
  onDeleteSession,
  simulatedDate
}: SubjectManagerProps) {
  // Navigation / Selected course state
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    subjects.length > 0 ? subjects[0].id : null
  );

  // Forms modals visibility
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showSessionForm, setShowSessionForm] = useState(false);

  // Form states - Subject
  const [subjectName, setSubjectName] = useState('');
  const [subjectTeacher, setSubjectTeacher] = useState('');
  const [subjectCredits, setSubjectCredits] = useState(2);
  const [subjectStartDate, setSubjectStartDate] = useState('2026-05-08');
  const [subjectEndDate, setSubjectEndDate] = useState('2026-06-10');
  const [subjectColor, setSubjectColor] = useState('indigo');

  // Form states - Activity
  const [activityName, setActivityName] = useState('');
  const [activityType, setActivityType] = useState<ActivityType>('Portafolio');
  const [activityPercentage, setActivityPercentage] = useState(20);
  const [activityOpenDate, setActivityOpenDate] = useState('2026-05-15');
  const [activityCloseDate, setActivityCloseDate] = useState('2026-05-31');
  const [activityNotes, setActivityNotes] = useState('');

  // Form states - ClassSession/Encuentro
  const [sessionName, setSessionName] = useState('');
  const [sessionType, setSessionType] = useState<EncounterType>('Sincrónico-Virtual');
  const [sessionDate, setSessionDate] = useState('2026-05-28');
  const [sessionStartTime, setSessionStartTime] = useState('19:00');
  const [sessionEndTime, setSessionEndTime] = useState('20:00');
  const [sessionUrl, setSessionUrl] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  // Get current active subject object
  const activeSubject = subjects.find(s => s.id === selectedSubjectId) || null;

  // Filter activities and sessions for selected course
  const activeActivities = activities.filter(act => act.subjectId === selectedSubjectId);
  const activeSessions = sessions.filter(sess => sess.subjectId === selectedSubjectId);

  // Color helper according to subject color parameter
  const getSubjectColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100/50';
      case 'indigo': return 'bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100/50';
      case 'amber': return 'bg-amber-50 text-amber-800 border-amber-100 hover:bg-amber-100/50';
      case 'rose': return 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100/50';
      default: return 'bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100/50';
    }
  };

  const getColorHex = (color: string) => {
    switch (color) {
      case 'emerald': return 'bg-emerald-500';
      case 'indigo': return 'bg-indigo-500';
      case 'amber': return 'bg-amber-500';
      case 'rose': return 'bg-rose-500';
      default: return 'bg-slate-400';
    }
  };

  // Submit handers
  const handleSubmitSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim() || !subjectTeacher.trim()) {
      alert('Por favor completa todos los campos de la materia');
      return;
    }

    if (editingSubject) {
      onUpdateSubject({
        id: editingSubject.id,
        name: subjectName,
        teacher: subjectTeacher,
        credits: subjectCredits,
        startDate: subjectStartDate,
        endDate: subjectEndDate,
        color: subjectColor
      });
    } else {
      onAddSubject({
        name: subjectName,
        teacher: subjectTeacher,
        credits: subjectCredits,
        startDate: subjectStartDate,
        endDate: subjectEndDate,
        color: subjectColor
      });
    }

    // Reset fields
    setSubjectName('');
    setSubjectTeacher('');
    setSubjectCredits(2);
    setShowSubjectForm(false);
    setEditingSubject(null);
  };

  const handleEditSubjectClick = (sub: Subject) => {
    setEditingSubject(sub);
    setSubjectName(sub.name);
    setSubjectTeacher(sub.teacher);
    setSubjectCredits(sub.credits);
    setSubjectStartDate(sub.startDate);
    setSubjectEndDate(sub.endDate);
    setSubjectColor(sub.color);
    setShowSubjectForm(true);
  };

  const handleAddSubjectClick = () => {
    setEditingSubject(null);
    setSubjectName('');
    setSubjectTeacher('');
    setSubjectCredits(2);
    setSubjectStartDate('2026-05-08');
    setSubjectEndDate('2026-06-10');
    setSubjectColor('indigo');
    setShowSubjectForm(true);
  };

  const handleDeleteSubjectClick = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta materia? Esto borrará también todas sus actividades y encuentros.')) {
      onDeleteSubject(id);
      if (selectedSubjectId === id) {
        const remaining = subjects.filter(s => s.id !== id);
        setSelectedSubjectId(remaining.length > 0 ? remaining[0].id : null);
      }
    }
  };

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;
    if (!activityName.trim()) {
      alert('Por favor ingresa un nombre para la actividad');
      return;
    }

    onAddActivity({
      subjectId: selectedSubjectId,
      type: activityType,
      name: activityName,
      percentage: activityPercentage,
      openDate: activityOpenDate,
      closeDate: activityCloseDate,
      status: 'Pendiente',
      notes: activityNotes || undefined
    });

    // Reset fields
    setActivityName('');
    setActivityPercentage(20);
    setActivityNotes('');
    setShowActivityForm(false);
  };

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;
    if (!sessionName.trim()) {
      alert('Por favor ingresa un nombre para el encuentro');
      return;
    }

    onAddSession({
      subjectId: selectedSubjectId,
      type: sessionType,
      name: sessionName,
      date: sessionDate,
      startTime: sessionStartTime,
      endTime: sessionEndTime,
      url: sessionUrl || '#',
      notes: sessionNotes || undefined
    });

    // Reset fields
    setSessionName('');
    setSessionUrl('');
    setSessionNotes('');
    setShowSessionForm(false);
  };

  // Formats 24h hours (19:00) to 12h user-friendly formats (7:00 p.m.)
  const formatTime12h = (timeStr: string) => {
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${displayHours}:${minutesStr} ${ampm}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in" id="subject-manager-view">
      
      {/* Subject list (Left Panel - 4 spans) */}
      <div className="lg:col-span-4 space-y-4">
        <div className="flex justify-between items-center bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <h2 className="text-xs uppercase tracking-wider font-bold text-slate-450 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            Cursos ({subjects.length})
          </h2>
          <button
            onClick={handleAddSubjectClick}
            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-1.5 px-3 rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva Materia
          </button>
        </div>

        {/* Subjects list cards */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {subjects.length === 0 ? (
            <div className="p-8 text-center bg-white border border-dashed border-slate-250 rounded-3xl">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No hay materias registradas aún.</p>
              <button
                onClick={handleAddSubjectClick}
                className="mt-3 text-xs font-semibold text-indigo-600 hover:underline"
              >
                Crear materia inicial
              </button>
            </div>
          ) : (
            subjects.map(sub => {
              const isSelected = selectedSubjectId === sub.id;
              const subActCount = activities.filter(a => a.subjectId === sub.id).length;
              const subSessCount = sessions.filter(s => s.subjectId === sub.id).length;

              return (
                <div
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/10'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${getColorHex(sub.color)}`}></div>
                  
                  <div className="pl-2 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400 font-bold font-mono uppercase">
                            {sub.credits} Créditos
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{sub.name}</h3>
                      </div>
                      <div className="flex items-center gap-1.5 select-none" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEditSubjectClick(sub)}
                          className="p-1 rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          title="Editar materia"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubjectClick(sub.id)}
                          className="p-1 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                          title="Eliminar materia"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-500">
                      <p className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{sub.teacher}</span>
                      </p>
                      <p className="flex items-center gap-1.5 font-mono text-[10px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{sub.startDate} al {sub.endDate}</span>
                      </p>
                    </div>

                    <div className="flex gap-2 text-[10px] font-semibold text-slate-400 pt-1.5 border-t border-slate-50">
                      <span>{subActCount} Actividades</span>
                      <span>•</span>
                      <span>{subSessCount} Encuentros</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Course Detail Panel (Right Panel - 8 spans) */}
      <div className="lg:col-span-8">
        {!activeSubject ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px] shadow-sm">
            <Layers className="w-12 h-12 text-slate-300 mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">Ninguna materia seleccionada</h3>
            <p className="text-xs text-slate-500 mt-1">Selecciona una materia a la izquierda o crea una nueva.</p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-8 shadow-sm">
            {/* Subject details heading banner */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100">
              <div>
                <span className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-0.5 rounded-full ${getSubjectColorClasses(activeSubject.color)}`}>
                  {activeSubject.credits} CRÉDITOS ACADÉMICOS
                </span>
                <h1 className="text-lg font-black text-slate-900 mt-2">{activeSubject.name}</h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  Docente principal: <strong>{activeSubject.teacher}</strong>
                </p>
              </div>

              <div className="flex gap-2 text-xs font-mono text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Vigencia Inicio</div>
                  <div className="font-bold text-slate-700 text-xs mt-0.5">{activeSubject.startDate}</div>
                </div>
                <div className="border-l border-slate-300 mx-2"></div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">Vigencia Cierre</div>
                  <div className="font-bold text-slate-700 text-xs mt-0.5">{activeSubject.endDate}</div>
                </div>
              </div>
            </div>

            {/* Sub-modulo: ACTIVIDADES (Foros, Portafolios) */}
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <h2 className="font-bold text-slate-800 text-xs">Foros y Portafolios Evaluativos</h2>
                </div>
                <button
                  onClick={() => setShowActivityForm(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Añadir Actividad
                </button>
              </div>

              {activeActivities.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 text-center">No hay actividades registradas en esta materia.</p>
              ) : (
                <div className="space-y-2">
                  {activeActivities.map(act => (
                    <div
                      key={act.id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg border border-slate-100 hover:border-slate-200 text-xs gap-3 bg-slate-50/20"
                    >
                      <div className="flex gap-2 items-start">
                        <input
                          type="checkbox"
                          checked={act.status === 'Entregado'}
                          onChange={() =>
                            onUpdateActivityStatus(
                              act.id,
                              act.status === 'Entregado' ? 'Pendiente' : 'Entregado'
                            )
                          }
                          className="mt-0.5 rounded text-indigo-650 focus:ring-indigo-500 cursor-pointer h-4 w-4 shrink-0"
                        />
                        <div>
                          <p className={`font-medium text-slate-900 leading-snug ${act.status === 'Entregado' || (act.closeDate < simulatedDate) ? 'line-through text-slate-400/80 italic' : ''}`}>
                            {act.name}
                            {act.closeDate < simulatedDate && act.status !== 'Entregado' && (
                              <span className="ml-1.5 inline-block text-[9px] bg-red-50 text-red-500 border border-red-100 px-1 rounded font-semibold italic">
                                Cerró / Vencido
                              </span>
                            )}
                          </p>
                          <div className="flex flex-wrap gap-2 text-[10px] text-slate-400 font-mono mt-1 items-center">
                            <span className="bg-slate-100 px-1 py-0.2 rounded-sm font-bold text-slate-600">{act.type}</span>
                            <span>Apertura: {act.openDate}</span>
                            <span>•</span>
                            <span>Cierre: {act.closeDate}</span>
                            {activeSubject?.teacher && (
                              <>
                                <span>•</span>
                                <span className="text-slate-500 font-semibold bg-slate-100/60 px-1.5 py-0.2 rounded flex items-center gap-1">Docente: {activeSubject.teacher}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-100 pt-2 sm:pt-0">
                        <span className="font-bold font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm shrink-0">
                          {act.percentage}%
                        </span>
                        <span className={`text-[10px] p-1 font-bold shrink-0 ${act.status === 'Entregado' ? 'text-emerald-600 bg-emerald-50 px-2 rounded-sm' : act.closeDate < simulatedDate ? 'text-red-500 bg-red-100/70 border border-red-100/50 px-2 rounded-sm' : 'text-amber-700 bg-amber-50 px-2 rounded-sm'}`}>
                          {act.status === 'Entregado' ? 'Entregado' : act.closeDate < simulatedDate ? 'Vencido' : 'Pendiente'}
                        </span>
                        <button
                          onClick={() => onDeleteActivity(act.id)}
                          className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 shrink-0"
                          title="Eliminar actividad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sub-modulo: HORARIOS Y ENCUENTROS */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-600" />
                  <h2 className="font-bold text-slate-800 text-xs">Clases y Encuentros (Virtual o Presencial)</h2>
                </div>
                <button
                  onClick={() => setShowSessionForm(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  Añadir Encuentro
                </button>
              </div>

              {activeSessions.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-4 text-center font-mono">No hay encuentros programados en esta materia.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeSessions.map(sess => (
                    <div
                      key={sess.id}
                      className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="font-mono text-[10px] text-slate-500 flex items-center gap-1 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                            <Calendar className="w-3 h-3" />
                            {sess.date}
                          </span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            sess.type === 'Sincrónico-Virtual'
                              ? 'bg-indigo-100 text-indigo-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {sess.type === 'Sincrónico-Virtual' ? <Video className="w-2.5 h-2.5" /> : <MapPin className="w-2.5 h-2.5" />}
                            {sess.type}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs leading-snug">{sess.name}</h4>
                        {activeSubject?.teacher && (
                          <div className="text-[10px] text-indigo-700 font-semibold bg-indigo-50/60 border border-indigo-100/40 px-1.5 py-0.5 rounded-md w-fit">
                            Docente: {activeSubject.teacher}
                          </div>
                        )}
                        <p className="text-[10px] text-slate-400 italic line-clamp-2">{sess.notes || 'Sin anotación adicional'}</p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 mt-2">
                        <span className="font-mono font-medium text-slate-500 text-[10px] flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatTime12h(sess.startTime)} - {formatTime12h(sess.endTime)}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          {sess.url && (
                            <a
                              href={sess.url}
                              target="_blank"
                              rel="noreferrer referrer"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded p-1.5"
                              title="Acceder con un clic"
                            >
                              <Link className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            onClick={() => onDeleteSession(sess.id)}
                            className="text-slate-400 hover:text-red-500 hover:bg-slate-100 p-1 rounded"
                            title="Eliminar encuentro"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL / FORMULA DIALOGS */}
      {/* 1. Modal / Form for Subject CRUD */}
      {showSubjectForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingSubject ? 'Editar Materia Académica' : 'Nueva Materia Académica'}
              </h3>
              <button onClick={() => setShowSubjectForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSubject} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nombre de la Materia *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Desarrollo Humano"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nombre del Docente *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Lic. Myriam Quiñones"
                  value={subjectTeacher}
                  onChange={(e) => setSubjectTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Créditos Universitarios</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    placeholder="2"
                    value={subjectCredits}
                    onChange={(e) => setSubjectCredits(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Esquema Color</label>
                  <select
                    value={subjectColor}
                    onChange={(e) => setSubjectColor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="indigo">Azul Índigo</option>
                    <option value="emerald">Verde Esmeralda</option>
                    <option value="amber">Amarillo Ámbar</option>
                    <option value="rose">Rosa / Carmesí</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Fecha de Inicio *</label>
                  <input
                    type="date"
                    required
                    value={subjectStartDate}
                    onChange={(e) => setSubjectStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Fecha de Cierre *</label>
                  <input
                    type="date"
                    required
                    value={subjectEndDate}
                    onChange={(e) => setSubjectEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSubjectForm(false)}
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

      {/* 2. Modal / Form for Activity CRUD */}
      {showActivityForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Añadir Actividad a {activeSubject?.name}
              </h3>
              <button onClick={() => setShowActivityForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitActivity} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nombre de la Actividad *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Portafolio 2: Análisis multidimensional"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tipo de Actividad</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as ActivityType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="Portafolio">Portafolio</option>
                    <option value="Foro">Foro</option>
                    <option value="Encuentro Evaluativo">Encuentro Evaluativo</option>
                    <option value="Otro">Otro entregable</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Porcentaje Evaluativo (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={activityPercentage}
                    onChange={(e) => setActivityPercentage(parseInt(e.target.value) || 20)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Fecha de Apertura</label>
                  <input
                    type="date"
                    required
                    value={activityOpenDate}
                    onChange={(e) => setActivityOpenDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Fecha de Cierre (Vencimiento) *</label>
                  <input
                    type="date"
                    required
                    value={activityCloseDate}
                    onChange={(e) => setActivityCloseDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Notas / Explicaciones</label>
                <textarea
                  placeholder="Escribe comentarios de apoyo, pautas, links adicionales..."
                  rows={2}
                  value={activityNotes}
                  onChange={(e) => setActivityNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowActivityForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 font-semibold rounded-lg text-white"
                >
                  Añadir Actividad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal / Form for Session CRUD */}
      {showSessionForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                Añadir Encuentro Académico a {activeSubject?.name}
              </h3>
              <button onClick={() => setShowSessionForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSession} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nombre del Encuentro *</label>
                <input
                  type="text"
                  required
                  placeholder="ej. Videoconferencia 3: Neurodesarrollo infantil"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tipo de Encuentro</label>
                  <select
                    value={sessionType}
                    onChange={(e) => setSessionType(e.target.value as EncounterType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  >
                    <option value="Sincrónico-Virtual">Sincrónico-Virtual (Internet)</option>
                    <option value="Presencial">Presencial (En Sede)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Fecha del Encuentro *</label>
                  <input
                    type="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hora de Inicio (24h) *</label>
                  <input
                    type="time"
                    required
                    value={sessionStartTime}
                    onChange={(e) => setSessionStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Hora de Fin (24h) *</label>
                  <input
                    type="time"
                    required
                    value={sessionEndTime}
                    onChange={(e) => setSessionEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="font-bold text-slate-700">Enlace de Acceso Directo (URL) *</label>
                  <span className="text-[10px] text-indigo-600 flex items-center gap-1">
                    <HelpCircle className="w-3 h-3" title="Meet, Teams o Maps" />
                    Ej. Google Meet
                  </span>
                </div>
                <input
                  type="url"
                  placeholder="https://meet.google.com/xyz-abc"
                  value={sessionUrl}
                  onChange={(e) => setSessionUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Notas / Lugar</label>
                <textarea
                  placeholder="ej. Aula 302, llevar portátil, o anotaciones importantes de asistencia..."
                  rows={2}
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowSessionForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 font-semibold rounded-lg text-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-650 hover:bg-indigo-750 font-semibold rounded-lg text-white"
                >
                  Añadir Encuentro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
