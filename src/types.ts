/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  credits: number;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  color: string;     // Tailwind class identifier
}

export type ActivityType = 'Foro' | 'Portafolio' | 'Encuentro Evaluativo' | 'Otro';

export interface Activity {
  id: string;
  subjectId: string;
  type: ActivityType;
  name: string;
  percentage: number; // Porcentaje evaluativo (por ejemplo: 20)
  openDate: string;   // YYYY-MM-DD
  closeDate: string;  // YYYY-MM-DD
  status: 'Pendiente' | 'Entregado';
  notes?: string;
}

export type EncounterType = 'Presencial' | 'Sincrónico-Virtual';

export interface ClassSession {
  id: string;
  subjectId: string;
  type: EncounterType;
  name: string;
  date: string;       // YYYY-MM-DD
  startTime: string;  // p.ej., 08:00 AM o 19:00
  endTime: string;    // p.ej., 17:00 o 20:00
  url: string;        // URL de acceso directo
  notes?: string;
}
