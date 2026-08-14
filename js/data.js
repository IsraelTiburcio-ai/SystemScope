/* ============================================================
   BOUNDARY RUN — Datos: situaciones de frontera
   Terminología del Gimnasio 1 (Optimización I):
   Física = límite espacial o corporal
   Económica = capacidad monetaria
   Técnica = nivel de conocimientos o capacidad técnica
   Temporal = duración en el tiempo
   ============================================================ */
window.SITUATIONS = [
  /* ---------------- Física ---------------- */
  { text: "El análisis se limita al campus universitario.", kind: "physical", note: "límite espacial" },
  { text: "La frontera del organismo es su piel.", kind: "physical", note: "límite corporal" },
  { text: "El estudio cubre solo las instalaciones del hospital.", kind: "physical", note: "límite espacial" },
  { text: "Consideramos únicamente el territorio del municipio.", kind: "physical", note: "límite espacial" },
  { text: "El proyecto incluye las tres sedes de la empresa.", kind: "physical", note: "límite espacial" },
  { text: "El análisis abarca el local y sus rutas de reparto.", kind: "physical", note: "límite espacial" },

  /* ---------------- Económica ---------------- */
  { text: "Solo tenemos $20,000 para el proyecto.", kind: "economic", note: "capacidad monetaria" },
  { text: "El presupuesto del semestre es de $2,000,000.", kind: "economic", note: "capacidad monetaria" },
  { text: "El capital alcanza para operar un solo local.", kind: "economic", note: "capacidad monetaria" },
  { text: "El costo del inventario limita lo que podemos analizar.", kind: "economic", note: "capacidad monetaria" },
  { text: "La empresa no puede pagar más de diez empleados.", kind: "economic", note: "capacidad monetaria" },
  { text: "El presupuesto de salud cubre cinco hospitales.", kind: "economic", note: "capacidad monetaria" },

  /* ---------------- Técnica ---------------- */
  { text: "El equipo aún no sabe usar el software.", kind: "technical", note: "conocimientos y preparación" },
  { text: "Se requiere personal con posgrado.", kind: "technical", note: "nivel de preparación" },
  { text: "La capacitación actual del grupo no es suficiente.", kind: "technical", note: "capacidad técnica" },
  { text: "Solo técnicos certificados operan la máquina.", kind: "technical", note: "capacidad técnica" },
  { text: "El estudiante no tiene los conocimientos previos.", kind: "technical", note: "nivel de conocimientos" },
  { text: "Faltan habilidades para manejar los medicamentos.", kind: "technical", note: "capacidad técnica" },

  /* ---------------- Temporal ---------------- */
  { text: "El proyecto termina en diciembre.", kind: "temporal", note: "duración en el tiempo" },
  { text: "El plazo de entrega es de seis meses.", kind: "temporal", note: "duración en el tiempo" },
  { text: "El análisis cubre de agosto a diciembre.", kind: "temporal", note: "duración en el tiempo" },
  { text: "Tenemos hasta el viernes para decidir.", kind: "temporal", note: "duración en el tiempo" },
  { text: "La clase dura un semestre.", kind: "temporal", note: "duración en el tiempo" },
  { text: "El ciclo de entrega va de las 8:00 a las 18:00.", kind: "temporal", note: "duración en el tiempo" }
];

window.DOORS = [
  { kind: "physical", name: "FÍSICA", icon: "📍" },
  { kind: "economic", name: "ECONÓMICA", icon: "💰" },
  { kind: "technical", name: "TÉCNICA", icon: "⚙️" },
  { kind: "temporal", name: "TEMPORAL", icon: "⏱️" }
];
