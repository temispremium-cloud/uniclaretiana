/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Subject, Activity, ClassSession } from './types';

export const SEED_SUBJECTS: Subject[] = [
  {
    id: 'desarrollo-humano',
    name: 'Desarrollo Humano',
    teacher: 'Myriam Elsy Quiñones Cabrera',
    credits: 2,
    startDate: '2026-05-08',
    endDate: '2026-06-05',
    color: 'emerald', // Emerald Green
  },
  {
    id: 'equidad-genero',
    name: 'Equidad de Género',
    teacher: 'Jazmín Lorena Grajales Clavijo',
    credits: 2,
    startDate: '2026-05-08',
    endDate: '2026-06-05',
    color: 'indigo', // Indigo Blue
  },
  {
    id: 'fundamentos-estadistica',
    name: 'Fundamentos de Estadística',
    teacher: 'Daniela Morales',
    credits: 2,
    startDate: '2026-05-08',
    endDate: '2026-06-05',
    color: 'amber', // Amber Yellow
  },
  {
    id: 'metodologia-investigacion',
    name: 'Metodología de la Investigación',
    teacher: 'Oscar Alberto De la Cruz Mesa',
    credits: 2,
    startDate: '2026-05-08',
    endDate: '2026-06-05',
    color: 'rose', // Rose / Red-Pink
  }
];

export const SEED_ACTIVITIES: Activity[] = [
  // Desarrollo Humano activities
  {
    id: 'dh-act-1',
    subjectId: 'desarrollo-humano',
    type: 'Encuentro Evaluativo',
    name: 'Actividad evaluativa: Acercándonos al concepto de desarrollo humano',
    percentage: 20,
    openDate: '2026-05-10',
    closeDate: '2026-05-10',
    status: 'Entregado',
    notes: 'Encuentro presencial: Horario 08:00 a.m. a 5:00 p.m.'
  },
  {
    id: 'dh-act-2',
    subjectId: 'desarrollo-humano',
    type: 'Portafolio',
    name: 'Portafolio 1: Reflexionemos sobre el desarrollo humano',
    percentage: 30,
    openDate: '2026-05-13',
    closeDate: '2026-05-17',
    status: 'Entregado',
    notes: 'Primer entregable parcial'
  },
  {
    id: 'dh-act-3',
    subjectId: 'desarrollo-humano',
    type: 'Foro',
    name: 'Foro: Perspectivas del desarrollo humano',
    percentage: 20,
    openDate: '2026-05-19',
    closeDate: '2026-05-23',
    status: 'Entregado',
    notes: 'Participación obligatoria en el foro temático'
  },
  {
    id: 'dh-act-4',
    subjectId: 'desarrollo-humano',
    type: 'Portafolio',
    name: 'Portafolio 2: Análisis multidimensional "A través de los lentes del desarrollo humano"',
    percentage: 25,
    openDate: '2026-05-25',
    closeDate: '2026-05-31', // 4 days remaining from May 27
    status: 'Pendiente',
    notes: 'Análisis multidimensional de las teorías'
  },

  // Equidad de Género activities
  {
    id: 'eqg-act-1',
    subjectId: 'equidad-genero',
    type: 'Foro',
    name: 'Foro 1: Recorrido histórico de la lucha por los derechos de las mujeres y de la comunidad LGBTIQ+',
    percentage: 20,
    openDate: '2026-05-12',
    closeDate: '2026-05-19',
    status: 'Entregado',
    notes: 'Tipo A • Equiv. 1.00. Cumple rúbrica TIGRE y Netiqueta.'
  },
  {
    id: 'eqg-act-2',
    subjectId: 'equidad-genero',
    type: 'Portafolio',
    name: 'Portafolio 1: Las relaciones de género en los escenarios contemporáneos a nivel nacional',
    percentage: 20,
    openDate: '2026-05-15',
    closeDate: '2026-05-28',
    status: 'Entregado',
    notes: 'Tipo A • Equiv. 1.00. Elaborar un guion para un Podcast en grupo.'
  },
  {
    id: 'eqg-act-3',
    subjectId: 'equidad-genero',
    type: 'Portafolio',
    name: 'Portafolio 2: Examen Parcial de Equidad de Género',
    percentage: 25,
    openDate: '2026-05-26',
    closeDate: '2026-05-27',
    status: 'Pendiente',
    notes: 'Tipo B • Equiv. 1.25. Examen Parcial de 10 preguntas tipo Saber Pro.'
  },
  {
    id: 'eqg-act-4',
    subjectId: 'equidad-genero',
    type: 'Portafolio',
    name: 'Portafolio 3: Análisis de políticas públicas para superar las brechas de género',
    percentage: 30,
    openDate: '2026-05-25',
    closeDate: '2026-05-30',
    status: 'Pendiente',
    notes: 'Tipo C • Equiv. 1.50. Podcast final sobre las relaciones de género.'
  },

  // Fundamentos de Estadística activities
  {
    id: 'est-act-1',
    subjectId: 'fundamentos-estadistica',
    type: 'Encuentro Evaluativo',
    name: 'Actividad evaluativa: Exposición sobre análisis de datos descriptivos',
    percentage: 20,
    openDate: '2026-05-10',
    closeDate: '2026-05-10',
    status: 'Entregado',
    notes: 'Tipo A • Equiv. 1.00. Identificación de tipos de datos y cálculo de medidas descriptivas.'
  },
  {
    id: 'est-act-2',
    subjectId: 'fundamentos-estadistica',
    type: 'Foro',
    name: 'Foro 1: Indicadores estadísticos para analizar y comprender sus efectos en las dinámicas sociales',
    percentage: 20,
    openDate: '2026-05-08',
    closeDate: '2026-05-17',
    status: 'Entregado',
    notes: 'Tipo A • Equiv. 1.00. Explicación de perspectivas económicas e indicadores (IPC, Gini, Desempleo, PIB).'
  },
  {
    id: 'est-act-3',
    subjectId: 'fundamentos-estadistica',
    type: 'Portafolio',
    name: 'Portafolio 1: Calculando medidas de tendencia central y dispersión en contextos sociales',
    percentage: 25,
    openDate: '2026-05-08',
    closeDate: '2026-05-24',
    status: 'Entregado',
    notes: 'Tipo B • Equiv. 1.50. Cálculo de media, mediana, moda, rango y desviación estándar.'
  },
  {
    id: 'est-act-4',
    subjectId: 'fundamentos-estadistica',
    type: 'Portafolio',
    name: 'Portafolio 2: "Análisis inferencial de una problemática social del territorio"',
    percentage: 30,
    openDate: '2026-05-08',
    closeDate: '2026-05-31',
    status: 'Pendiente',
    notes: 'Tipo C • Equiv. 1.25. Inferencia estadística, estimación puntual e intervalo de confianza del 95%.'
  },
  {
    id: 'est-act-5',
    subjectId: 'fundamentos-estadistica',
    type: 'Otro',
    name: 'Participación y asistencia en encuentros sincrónicos',
    percentage: 5,
    openDate: '2026-05-14',
    closeDate: '2026-06-04',
    status: 'Pendiente',
    notes: 'Tipo A • Equiv. 0.25 (5% evaluativo total de las sesiones asistidas).'
  },

  // Metodología de la Investigación activities
  {
    id: 'met-act-1',
    subjectId: 'metodologia-investigacion',
    type: 'Encuentro Evaluativo',
    name: 'Actividad evaluativa: Examen tipo Saber Pro (Presencial)',
    percentage: 20,
    openDate: '2026-05-09',
    closeDate: '2026-05-09',
    status: 'Entregado',
    notes: 'Tipo A Seguimiento • Equiv. 1.00. Horario: 8:00 am a 5:00 pm.'
  },
  {
    id: 'met-act-2',
    subjectId: 'metodologia-investigacion',
    type: 'Portafolio',
    name: 'Portafolio Parcial 1: Identificación del Problema de Investigación',
    percentage: 25,
    openDate: '2026-05-15',
    closeDate: '2026-05-20',
    status: 'Entregado',
    notes: 'Tipo B Parcial • Equiv. 1.25. Formulario Matriz Unificada.'
  },
  {
    id: 'met-act-3',
    subjectId: 'metodologia-investigacion',
    type: 'Portafolio',
    name: 'Portafolio Parcial 2: Marco teórico y categorial de análisis de la investigación',
    percentage: 20,
    openDate: '2026-05-22',
    closeDate: '2026-05-28',
    status: 'Pendiente',
    notes: 'Tipo A Seguimiento • Equiv. 1.00. Formatos #4 y #5 de la Matriz Unificada.'
  },
  {
    id: 'met-act-4',
    subjectId: 'metodologia-investigacion',
    type: 'Portafolio',
    name: 'Portafolio Final: Marco referencial, pregunta y objetivos',
    percentage: 30,
    openDate: '2026-05-29',
    closeDate: '2026-06-03',
    status: 'Pendiente',
    notes: 'Tipo C Final • Equiv. 1.50. Consolidado del anteproyecto.'
  },
  {
    id: 'met-act-5',
    subjectId: 'metodologia-investigacion',
    type: 'Otro',
    name: 'Asistencia y participación en videoconferencias',
    percentage: 5,
    openDate: '2026-05-13',
    closeDate: '2026-06-03',
    status: 'Pendiente',
    notes: 'Tipo A Seguimiento • Equiv. 0.25 (5% evaluativo total de las sesiones asistidas).'
  }
];

export const SEED_SESSIONS: ClassSession[] = [
  // Desarrollo Humano weekly videoconferences
  {
    id: 'dh-sess-1',
    subjectId: 'desarrollo-humano',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 1: Conceptos de Desarrollo y Desarrollo Humano',
    date: '2026-05-14',
    startTime: '19:00',
    endTime: '20:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F238485977936191%3Fp%3Dua5ZEEUCNCKQbLL4IW%26anon%3Dtrue&type=meet&deeplinkId=bb426ab6-0035-4172-a274-5b8d3c2620ad&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Sesión grabada sobre Dimensiones del Desarrollo'
  },
  {
    id: 'dh-sess-2',
    subjectId: 'desarrollo-humano',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 2: Análisis de los Conceptos de Paradigma y Visiones del Mundo en Conflicto',
    date: '2026-05-21',
    startTime: '19:00',
    endTime: '20:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F238485977936191%3Fp%3Dua5ZEEUCNCKQbLL4IW%26anon%3Dtrue&type=meet&deeplinkId=bb426ab6-0035-4172-a274-5b8d3c2620ad&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true'
  },
  {
    id: 'dh-sess-3',
    subjectId: 'desarrollo-humano',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 3: Neurodesarrollo, desarrollo infantil y su relación con los Objetivos de desarrollo Sostenible',
    date: '2026-05-28', // Tomorrow!
    startTime: '19:00',
    endTime: '20:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F238485977936191%3Fp%3Dua5ZEEUCNCKQbLL4IW%26anon%3Dtrue&type=meet&deeplinkId=bb426ab6-0035-4172-a274-5b8d3c2620ad&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Asistencia obligatoria. Se tomará control evaluativo del 5%.'
  },
  {
    id: 'dh-sess-4',
    subjectId: 'desarrollo-humano',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 4: El Desarrollo de Capacidades Interculturales para la Gestión Comunitaria',
    date: '2026-06-04',
    startTime: '19:00',
    endTime: '20:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F238485977936191%3Fp%3Dua5ZEEUCNCKQbLL4IW%26anon%3Dtrue&type=meet&deeplinkId=bb426ab6-0035-4172-a274-5b8d3c2620ad&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true'
  },

  // Equidad de Género weekly sessions
  {
    id: 'eqg-sess-1',
    subjectId: 'equidad-genero',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 1 (Unidad 1): Evolución del concepto de género, equidad de género, enfoque de género y diferencia',
    date: '2026-05-12',
    startTime: '20:00',
    endTime: '22:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F25114197411533%3Fp%3DKVvYQribqojaatiHWw%26anon%3Dtrue&type=meet&deeplinkId=c0a1a805-4f02-4b6d-9db6-c5af4637d68a&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Unidad 1 • Presentación y trabajo colectivo'
  },
  {
    id: 'eqg-sess-2',
    subjectId: 'equidad-genero',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 2 (Unidad 1): Relaciones de género en los escenarios socioculturales, económicos, políticos, jurídicos, de la identidad y diversidad sexual',
    date: '2026-05-19',
    startTime: '20:00',
    endTime: '22:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F25114197411533%3Fp%3DKVvYQribqojaatiHWw%26anon%3Dtrue&type=meet&deeplinkId=c0a1a805-4f02-4b6d-9db6-c5af4637d68a&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Unidad 1 • Análisis de brechas contemporáneas'
  },
  {
    id: 'eqg-sess-3',
    subjectId: 'equidad-genero',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 3 (Unidad 2): Legislación para protección de los Derechos Humanos y formas de reivindicación',
    date: '2026-05-26',
    startTime: '20:00',
    endTime: '22:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F25114197411533%3Fp%3DKVvYQribqojaatiHWw%26anon%3Dtrue&type=meet&deeplinkId=c0a1a805-4f02-4b6d-9db6-c5af4637d68a&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Unidad 2 • Explicación para examen parcial'
  },
  {
    id: 'eqg-sess-4',
    subjectId: 'equidad-genero',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 4 (Unidad 2): Políticas públicas de equidad de género para las mujeres y para los derechos de la comunidad LGBTIQ+',
    date: '2026-06-02',
    startTime: '20:00',
    endTime: '22:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F25114197411533%3Fp%3DKVvYQribqojaatiHWw%26anon%3Dtrue&type=meet&deeplinkId=c0a1a805-4f02-4b6d-9db6-c5af4637d68a&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Unidad 2 • Orientaciones para Portafolio 3'
  },

  // Fundamentos de Estadística sessions
  {
    id: 'est-sess-1',
    subjectId: 'fundamentos-estadistica',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 1 (Unidad 1): Introducción a la Estadística Descriptiva',
    date: '2026-05-14',
    startTime: '18:00',
    endTime: '19:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F255584446190402%3Fp%3DATWUsKCGoJm00KrvDa%26anon%3Dtrue&type=meet&deeplinkId=a63d9f32-8dfc-4009-a195-ae51de0aec5f&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Apropiación de conceptos básicos y tipos de datos.'
  },
  {
    id: 'est-sess-2',
    subjectId: 'fundamentos-estadistica',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 2 (Unidad 1): Medidas de Tendencia Central y Medidas de Dispersión',
    date: '2026-05-21',
    startTime: '18:00',
    endTime: '19:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F255584446190402%3Fp%3DATWUsKCGoJm00KrvDa%26anon%3Dtrue&type=meet&deeplinkId=a63d9f32-8dfc-4009-a195-ae51de0aec5f&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Cálculos de promedio, variabilidad y distribuciones.'
  },
  {
    id: 'est-sess-3',
    subjectId: 'fundamentos-estadistica',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 3 (Unidad 2): Estimación de Parámetros estadísticos',
    date: '2026-05-28',
    startTime: '18:00',
    endTime: '19:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F255584446190402%3Fp%3DATWUsKCGoJm00KrvDa%26anon%3Dtrue&type=meet&deeplinkId=a63d9f32-8dfc-4009-a195-ae51de0aec5f&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Población, muestra, margen de error e intervalos de confianza del 95%.'
  },
  {
    id: 'est-sess-4',
    subjectId: 'fundamentos-estadistica',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 4 (Unidad 2): Pruebas de Hipótesis Estadísticas',
    date: '2026-06-04',
    startTime: '18:00',
    endTime: '19:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F255584446190402%3Fp%3DATWUsKCGoJm00KrvDa%26anon%3Dtrue&type=meet&deeplinkId=a63d9f32-8dfc-4009-a195-ae51de0aec5f&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Planteamiento de hipótesis nula/alternativa y pruebas paramétricas/no paramétricas.'
  },
  {
    id: 'est-sess-presencial',
    subjectId: 'fundamentos-estadistica',
    type: 'Presencial',
    name: 'Encuentro Presencial: Exposición de diagnóstico territorial y datos',
    date: '2026-05-10',
    startTime: '08:00',
    endTime: '17:00',
    url: 'https://maps.google.com/?q=Sede+Principal+Uniclaretiana',
    notes: 'Duración de 8 horas. Exposición breve de interpretación social.'
  },
  {
    id: 'met-sess-1',
    subjectId: 'metodologia-investigacion',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 1: El problema y antecedentes de investigación',
    date: '2026-05-13',
    startTime: '18:00',
    endTime: '19:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F243228195381688%3Fp%3Dio7kimgA0FPhyeQvSz%26anon%3Dtrue&type=meet&deeplinkId=143b84a0-f333-4216-be11-5ea6228cf193&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Unidad 1 • Delimitación y antecedentes de investigación'
  },
  {
    id: 'met-sess-2',
    subjectId: 'metodologia-investigacion',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 2: Delimitación del problema de investigación',
    date: '2026-05-20',
    startTime: '18:00',
    endTime: '19:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F243228195381688%3Fp%3Dio7kimgA0FPhyeQvSz%26anon%3Dtrue&type=meet&deeplinkId=143b84a0-f333-4216-be11-5ea6228cf193&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Unidad 1 • Planteamiento formal y objetivos de investigación'
  },
  {
    id: 'met-sess-3',
    subjectId: 'metodologia-investigacion',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 3: Marco teórico conceptual',
    date: '2026-05-27', // Mañana (Miércoles)
    startTime: '18:00',
    endTime: '19:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F243228195381688%3Fp%3Dio7kimgA0FPhyeQvSz%26anon%3Dtrue&type=meet&deeplinkId=143b84a0-f333-4216-be11-5ea6228cf193&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Unidad 2 • Construcción del marco teórico y categorización'
  },
  {
    id: 'met-sess-4',
    subjectId: 'metodologia-investigacion',
    type: 'Sincrónico-Virtual',
    name: 'Videoconferencia 4: Marco contextual, normativo y ético',
    date: '2026-06-03',
    startTime: '18:00',
    endTime: '19:00',
    url: 'https://teams.microsoft.com/dl/launcher/launcher.html?url=%2F_%23%2Fmeet%2F243228195381688%3Fp%3Dio7kimgA0FPhyeQvSz%26anon%3Dtrue&type=meet&deeplinkId=143b84a0-f333-4216-be11-5ea6228cf193&directDl=true&msLaunch=true&enableMobilePage=true&suppressPrompt=true',
    notes: 'Unidad 2 • Cierre de marcos y consentimiento informado'
  },
  {
    id: 'met-sess-presencial',
    subjectId: 'metodologia-investigacion',
    type: 'Presencial',
    name: 'Encuentro Presencial (Evaluativo): Examen tipo Saber Pro',
    date: '2026-05-09',
    startTime: '08:00',
    endTime: '17:00',
    url: 'https://maps.google.com/?q=Sede+Principal+Uniclaretiana',
    notes: 'Duración: 8 horas (8:00 am a 5:00 pm). Examen Presencial obligatorio.'
  }
];
