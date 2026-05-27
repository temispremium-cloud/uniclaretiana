/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Copy, Check, FileCode, Database } from 'lucide-react';

export default function DataStructureView() {
  const [activeTab, setActiveTab] = useState<'json' | 'java'>('json');
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const jsonSchema = `{
  "materia": {
    "id": "desarrollo-humano",
    "nombre": "Desarrollo Humano",
    "docente": "Myriam Elsy Quiñones Cabrera",
    "creditos": 2,
    "fechaInicio": "2026-05-08",
    "fechaFin": "2026-06-05",
    "actividades": [
      {
        "id": "dh-act-4",
        "tipo": "Portafolio",
        "nombre": "Portafolio 2: Análisis multidimensional...",
        "porcentajeEvaluativo": 25.0,
        "fechaApertura": "2026-05-25",
        "fechaCierre": "2026-05-31",
        "estado": "Pendiente",
        "notas": "Análisis multidimensional de las teorías"
      }
    ],
    "encuentros": [
      {
        "id": "dh-sess-3",
        "tipo": "Sincrónico-Virtual",
        "nombre": "Videoconferencia 3 (Evaluativa 5%)",
        "fecha": "2026-05-28",
        "horaInicio": "19:00",
        "horaFin": "20:00",
        "urlAcceso": "https://meet.google.com/abc-dh-vc3",
        "notas": "Asistencia obligatoria"
      }
    ]
  }
}`;

  const javaCode = `// --- ENTIDADES DE PERSISTENCIA EN JAVA (SPRING BOOT + JPA) ---

package com.universidad.organizador.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Table(name = "materias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Materia {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String docente;

    @Column(nullable = false)
    private Integer creditos;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate fechaInicio;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate fechaFin;

    @OneToMany(mappedBy = "materia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Actividad> actividades;

    @OneToMany(mappedBy = "materia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EncuentroHorario> encuentros;
}

@Entity
@Table(name = "actividades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;

    @Column(nullable = false)
    private String tipo; // Foro, Portafolio, Encuentro Evaluativo, Otro

    @Column(nullable = false)
    private String nombre;

    @Column(name = "porcentaje_evaluativo", nullable = false)
    private Double porcentajeEvaluativo;

    @Column(name = "fecha_apertura")
    private LocalDate fechaApertura;

    @Column(name = "fecha_cierre", nullable = false)
    private LocalDate fechaCierre;

    @Column(nullable = false)
    private String estado; // Pendiente, Entregado

    @Column(columnDefinition = "TEXT")
    private String notas;
}

@Entity
@Table(name = "encuentros_horarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EncuentroHorario {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materia_id", nullable = false)
    private Materia materia;

    @Column(nullable = false)
    private String tipo; // Presencial, Sincrónico-Virtual

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio", nullable = false)
    private LocalTime horaInicio;

    @Column(name = "hora_fin", nullable = false)
    private LocalTime horaFin;

    @Column(name = "url_acceso")
    private String urlAcceso;

    @Column(columnDefinition = "TEXT")
    private String notas;
}
`;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            Propuesta de Arquitectura de Datos
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Estructura ideal para el mapeo relacional de materias, actividades (Foros y Portafolios) y encuentros escolares.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-0.5 rounded-xl self-start">
          <button
            onClick={() => setActiveTab('json')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'json'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Esquema JSON
          </button>
          <button
            onClick={() => setActiveTab('java')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              activeTab === 'java'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-950'
            }`}
          >
            Entidades Java (JPA)
          </button>
        </div>
      </div>

      <div className="relative">
        <button
          onClick={() => handleCopy(activeTab === 'json' ? jsonSchema : javaCode)}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-medium z-10"
          title="Copiar código"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">¡Copiado!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copiar</span>
            </>
          )}
        </button>

        {activeTab === 'json' ? (
          <div>
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 font-mono text-xs leading-relaxed overflow-x-auto max-h-[500px]">
              <div className="text-slate-500 mb-2">// Estructura típica de un documento o respuesta API</div>
              <pre>{jsonSchema}</pre>
            </div>
            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-indigo-900 leading-relaxed shadow-3xs">
              <strong>💡 Recomendación del Experto:</strong> Esta estructura JSON refleja una relación <strong>1:N (Uno a Muchos)</strong> limpia. Las actividades y encuentros están anidados directamente dentro de la materia, lo que facilita el consumo ágil y "scannable" en un solo viaje al servidor, ideal para el desarrollo del dashboard móvil/web en React.
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 font-mono text-xs leading-relaxed overflow-x-auto max-h-[500px]">
              <div className="text-slate-500 mb-2 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-slate-400" />
                <span>Materia.java, Actividad.java y EncuentroHorario.java</span>
              </div>
              <pre>{javaCode}</pre>
            </div>
            <div className="mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-emerald-900 leading-relaxed shadow-3xs">
              <strong>☕ Mapeo Hibernate/JPA:</strong> Se utiliza Lombok para reducir la verbosidad de getters/setters. Se mapea bidireccionalmente la relación con carga diferida <code>FetchType.LAZY</code> para maximizar el rendimiento de la base de datos PostgreSQL, SQLite o MySQL al listar los cursos del dashboard.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
