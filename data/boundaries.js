/* ============================================================
   SYSTEM SCOPE — Datos: fronteras
   defineScope: 6 escenarios para "Define el alcance" (M3).
   boundaryEvents: 12 eventos de cambio de frontera (M4).
   Categorías: physical | economic | technical | temporal | out
   ============================================================ */
window.SS = window.SS || {};
SS.data = SS.data || {};

SS.data.boundaryKinds = [
  { id: "physical", label: "Física", icon: "📍", desc: "límite espacial o corporal" },
  { id: "economic", label: "Económica", icon: "💰", desc: "capacidad monetaria" },
  { id: "technical", label: "Técnica", icon: "⚙️", desc: "nivel de conocimientos y capacidad técnica" },
  { id: "temporal", label: "Temporal", icon: "⏱️", desc: "duración en el tiempo" }
];

SS.data.defineScope = [
  {
    id: "universidad",
    title: "Universidad",
    icon: "🏛️",
    context: "Analizaremos el sistema «Universidad» durante un semestre, únicamente dentro de las instalaciones del campus, considerando un presupuesto determinado y la capacidad actual del personal.",
    cards: [
      { id: "u1", icon: "🏢", text: "Campus universitario", cat: "physical" },
      { id: "u2", icon: "🔬", text: "Aulas y laboratorios", cat: "physical" },
      { id: "u3", icon: "💰", text: "Presupuesto de $2,000,000", cat: "economic" },
      { id: "u4", icon: "💸", text: "Salarios del semestre", cat: "economic" },
      { id: "u5", icon: "🎓", text: "Profesores capacitados", cat: "technical" },
      { id: "u6", icon: "🧑‍🏫", text: "Personal con posgrado", cat: "technical" },
      { id: "u7", icon: "🗓️", text: "Agosto – Diciembre", cat: "temporal" },
      { id: "u8", icon: "⏳", text: "Un semestre académico", cat: "temporal" },
      { id: "u9", icon: "🏙️", text: "Ciudad completa", cat: "out" },
      { id: "u10", icon: "♾️", text: "Tiempo indefinido", cat: "out" },
      { id: "u11", icon: "💳", text: "Cualquier presupuesto", cat: "out" },
      { id: "u12", icon: "🚫", text: "Personas sin preparación requerida", cat: "out" }
    ]
  },
  {
    id: "restaurante",
    title: "Restaurante",
    icon: "🍴",
    context: "Analizamos el restaurante «Sabor del Norte» durante su turno de la tarde, dentro de su local, con el capital disponible en caja y el personal que hoy está capacitado.",
    cards: [
      { id: "r1", icon: "🏠", text: "El local y su cocina", cat: "physical" },
      { id: "r2", icon: "🪑", text: "El área de comedor", cat: "physical" },
      { id: "r3", icon: "💵", text: "El capital en caja", cat: "economic" },
      { id: "r4", icon: "📦", text: "El costo del inventario del mes", cat: "economic" },
      { id: "r5", icon: "👨‍🍳", text: "El chef y su brigada capacitados", cat: "technical" },
      { id: "r6", icon: "📖", text: "El conocimiento de los menús", cat: "technical" },
      { id: "r7", icon: "🌆", text: "El turno de la tarde (16:00–23:00)", cat: "temporal" },
      { id: "r8", icon: "🎉", text: "La temporada de mayor demanda", cat: "temporal" },
      { id: "r9", icon: "🏢", text: "Toda la cadena de restaurantes", cat: "out" },
      { id: "r10", icon: "♾️", text: "Un presupuesto ilimitado", cat: "out" },
      { id: "r11", icon: "🌃", text: "El turno de madrugada", cat: "out" },
      { id: "r12", icon: "🚫", text: "Personal sin experiencia en cocina", cat: "out" }
    ]
  },
  {
    id: "familia",
    title: "Familia",
    icon: "👪",
    context: "Analizamos el sistema familiar de la familia López durante el año en curso, considerando su vivienda, su presupuesto mensual y las habilidades de sus integrantes.",
    cards: [
      { id: "f1", icon: "🏡", text: "La casa familiar", cat: "physical" },
      { id: "f2", icon: "🛏️", text: "Las habitaciones de la vivienda", cat: "physical" },
      { id: "f3", icon: "💰", text: "El presupuesto mensual del hogar", cat: "economic" },
      { id: "f4", icon: "🛒", text: "El gasto en alimentos del mes", cat: "economic" },
      { id: "f5", icon: "🍳", text: "Las habilidades de cocina de la familia", cat: "technical" },
      { id: "f6", icon: "📚", text: "El conocimiento escolar de los hijos", cat: "technical" },
      { id: "f7", icon: "🗓️", text: "El año en curso", cat: "temporal" },
      { id: "f8", icon: "🏖️", text: "Las vacaciones de verano", cat: "temporal" },
      { id: "f9", icon: "🏘️", text: "Los vecinos del barrio", cat: "out" },
      { id: "f10", icon: "💸", text: "El ingreso de familiares externos", cat: "out" },
      { id: "f11", icon: "🚫", text: "Personas sin habilidades de convivencia", cat: "out" },
      { id: "f12", icon: "👴", text: "La familia extendida en otra ciudad", cat: "out" }
    ]
  },
  {
    id: "gobierno",
    title: "Gobierno municipal",
    icon: "🏛️",
    context: "Analizamos el gobierno municipal durante su ejercicio anual, considerando el territorio del municipio, el presupuesto público y la capacidad de sus funcionarios.",
    cards: [
      { id: "g1", icon: "🗺️", text: "El territorio municipal", cat: "physical" },
      { id: "g2", icon: "🏢", text: "Los edificios públicos", cat: "physical" },
      { id: "g3", icon: "💰", text: "El presupuesto público anual", cat: "economic" },
      { id: "g4", icon: "🧾", text: "La recaudación del municipio", cat: "economic" },
      { id: "g5", icon: "🧑‍💼", text: "Funcionarios capacitados", cat: "technical" },
      { id: "g6", icon: "🎓", text: "Personal con formación en gestión", cat: "technical" },
      { id: "g7", icon: "🗓️", text: "El ejercicio fiscal anual", cat: "temporal" },
      { id: "g8", icon: "⏳", text: "La duración del mandato", cat: "temporal" },
      { id: "g9", icon: "🌍", text: "El territorio nacional completo", cat: "out" },
      { id: "g10", icon: "♾️", text: "Un presupuesto sin límite", cat: "out" },
      { id: "g11", icon: "🗳️", text: "El siguiente periodo electoral", cat: "out" },
      { id: "g12", icon: "🚫", text: "Ciudadanos sin cargo público", cat: "out" }
    ]
  },
  {
    id: "empresa",
    title: "Empresa",
    icon: "🏭",
    context: "Analizamos la empresa «Fábrica del Valle» durante su ejercicio fiscal, considerando sus instalaciones, su presupuesto operativo y el personal técnico disponible.",
    cards: [
      { id: "e1", icon: "🏗️", text: "Las instalaciones de la planta", cat: "physical" },
      { id: "e2", icon: "🏬", text: "Oficinas y almacenes", cat: "physical" },
      { id: "e3", icon: "💵", text: "El presupuesto operativo", cat: "economic" },
      { id: "e4", icon: "🧮", text: "El costo de producción", cat: "economic" },
      { id: "e5", icon: "🔧", text: "El personal técnico capacitado", cat: "technical" },
      { id: "e6", icon: "📐", text: "Los conocimientos del equipo de ingeniería", cat: "technical" },
      { id: "e7", icon: "🗓️", text: "El ejercicio fiscal anual", cat: "temporal" },
      { id: "e8", icon: "🔄", text: "Los ciclos de producción del año", cat: "temporal" },
      { id: "e9", icon: "🏦", text: "El grupo corporativo completo", cat: "out" },
      { id: "e10", icon: "💳", text: "El presupuesto de otras plantas", cat: "out" },
      { id: "e11", icon: "🚫", text: "Personal sin formación requerida", cat: "out" },
      { id: "e12", icon: "🤼", text: "Los competidores", cat: "out" }
    ]
  },
  {
    id: "software",
    title: "Proyecto de software",
    icon: "💻",
    context: "Analizamos el proyecto de software «Sistema de Nómina» durante sus 6 meses de desarrollo, considerando el equipo asignado, el presupuesto aprobado y las habilidades del equipo.",
    cards: [
      { id: "sw1", icon: "🏢", text: "Las oficinas del equipo", cat: "physical" },
      { id: "sw2", icon: "🖥️", text: "Los servidores del proyecto", cat: "physical" },
      { id: "sw3", icon: "💰", text: "El presupuesto de $100,000", cat: "economic" },
      { id: "sw4", icon: "💸", text: "Los salarios del equipo", cat: "economic" },
      { id: "sw5", icon: "👨‍💻", text: "El equipo de desarrolladores capacitados", cat: "technical" },
      { id: "sw6", icon: "🧑‍🔬", text: "El conocimiento de las tecnologías", cat: "technical" },
      { id: "sw7", icon: "⏱️", text: "Los 6 meses de desarrollo", cat: "temporal" },
      { id: "sw8", icon: "🎯", text: "El plazo de entrega de diciembre", cat: "temporal" },
      { id: "sw9", icon: "🏭", text: "La empresa completa", cat: "out" },
      { id: "sw10", icon: "♾️", text: "Un presupuesto ilimitado", cat: "out" },
      { id: "sw11", icon: "🚫", text: "La formación de otros departamentos", cat: "out" },
      { id: "sw12", icon: "🕰️", text: "El tiempo indefinido", cat: "out" }
    ]
  }
];

/* ------------------------------------------------------------
   M4 — Eventos de cambio de frontera
   initial: medidores iniciales; after: cómo queda el que cambia.
   ------------------------------------------------------------ */
SS.data.boundaryEvents = [
  {
    id: "ev1",
    system: "Proyecto de software",
    icon: "💻",
    event: "El presupuesto se reduce de $100,000 a $60,000.",
    answer: "economic",
    explain: "Una frontera económica está relacionada con la capacidad monetaria disponible. Al reducirse el presupuesto, cambió el alcance económico del proyecto.",
    initial: { economic: ["Presupuesto", "$100,000", 82], temporal: ["Plazo", "6 meses", 70], technical: ["Equipo", "5 desarrolladores", 60], physical: ["Alcance", "1 sede", 34] },
    after: { economic: ["Presupuesto", "$60,000", 48] }
  },
  {
    id: "ev2",
    system: "Proyecto de software",
    icon: "💻",
    event: "La fecha límite cambia de diciembre a octubre.",
    answer: "temporal",
    explain: "La fecha de entrega define la duración del proyecto. Cambiar el límite de diciembre a octubre modifica la frontera temporal.",
    initial: { economic: ["Presupuesto", "$100,000", 82], temporal: ["Plazo", "Diciembre", 82], technical: ["Equipo", "5 desarrolladores", 60], physical: ["Alcance", "1 sede", 34] },
    after: { temporal: ["Plazo", "Octubre", 60] }
  },
  {
    id: "ev3",
    system: "Proyecto de software",
    icon: "💻",
    event: "El equipo ahora cuenta con especialistas adicionales en ciberseguridad.",
    answer: "technical",
    explain: "La frontera técnica depende de los conocimientos y la preparación disponibles. Al sumar especialistas, se amplió la capacidad técnica.",
    initial: { economic: ["Presupuesto", "$100,000", 82], temporal: ["Plazo", "Octubre", 60], technical: ["Equipo", "5 desarrolladores", 60], physical: ["Alcance", "1 sede", 34] },
    after: { technical: ["Equipo", "8 especialistas", 82] }
  },
  {
    id: "ev4",
    system: "Proyecto de software",
    icon: "💻",
    event: "El proyecto ahora incluirá dos campus adicionales.",
    answer: "physical",
    explain: "La frontera física se refiere al espacio. Al incluir dos campus más, el alcance espacial del proyecto creció.",
    initial: { economic: ["Presupuesto", "$100,000", 82], temporal: ["Plazo", "Octubre", 60], technical: ["Equipo", "8 especialistas", 82], physical: ["Alcance", "1 sede", 34] },
    after: { physical: ["Alcance", "3 sedes", 68] }
  },
  {
    id: "ev5",
    system: "Empresa",
    icon: "🏭",
    event: "La empresa amplía sus operaciones a una segunda planta en otra ciudad.",
    answer: "physical",
    explain: "Abrir una segunda planta extiende el espacio físico en el que opera el sistema, por lo que cambió su frontera física.",
    initial: { economic: ["Presupuesto", "$5 millones", 70], temporal: ["Ejercicio", "Anual", 50], technical: ["Personal", "200 técnicos", 66], physical: ["Plantas", "1 planta", 40] },
    after: { physical: ["Plantas", "2 plantas", 62] }
  },
  {
    id: "ev6",
    system: "Empresa",
    icon: "🏭",
    event: "La junta decide recortar el presupuesto de publicidad.",
    answer: "economic",
    explain: "El presupuesto de publicidad es un recurso monetario; su recorte modifica la frontera económica de la empresa.",
    initial: { economic: ["Presupuesto", "$5 millones", 70], temporal: ["Ejercicio", "Anual", 50], technical: ["Personal", "200 técnicos", 66], physical: ["Plantas", "2 plantas", 62] },
    after: { economic: ["Presupuesto", "$4 millones", 56] }
  },
  {
    id: "ev7",
    system: "Empresa",
    icon: "🏭",
    event: "El equipo de producción completa un curso de certificación en manufactura.",
    answer: "technical",
    explain: "La certificación eleva la preparación y el nivel de conocimientos del personal, es decir, cambia la frontera técnica.",
    initial: { economic: ["Presupuesto", "$4 millones", 56], temporal: ["Ejercicio", "Anual", 50], technical: ["Personal", "200 técnicos", 66], physical: ["Plantas", "2 plantas", 62] },
    after: { technical: ["Personal", "200 certificados", 80] }
  },
  {
    id: "ev8",
    system: "Universidad",
    icon: "🏛️",
    event: "La universidad extiende el semestre dos semanas por el paro estudiantil.",
    answer: "temporal",
    explain: "Extender el semestre modifica la duración del periodo académico, es decir, la frontera temporal del sistema.",
    initial: { economic: ["Presupuesto", "$2,000,000", 74], temporal: ["Semestre", "Agosto–Dic", 66], technical: ["Docentes", "Capacitados", 70], physical: ["Campus", "Sede central", 45] },
    after: { temporal: ["Semestre", "Agosto–Dic + 2 sem", 74] }
  },
  {
    id: "ev9",
    system: "Universidad",
    icon: "🏛️",
    event: "El rector aprueba un nuevo presupuesto para laboratorios.",
    answer: "economic",
    explain: "Aprobar un nuevo presupuesto modifica los recursos monetarios del sistema, así que cambió la frontera económica.",
    initial: { economic: ["Presupuesto", "$2,000,000", 74], temporal: ["Semestre", "Agosto–Dic + 2 sem", 74], technical: ["Docentes", "Capacitados", 70], physical: ["Campus", "Sede central", 45] },
    after: { economic: ["Presupuesto", "$2,400,000", 84] }
  },
  {
    id: "ev10",
    system: "Universidad",
    icon: "🏛️",
    event: "Se contratan profesores con doctorado para la facultad.",
    answer: "technical",
    explain: "Contratar personal con mayor preparación amplía el nivel de conocimientos del sistema, cambiando su frontera técnica.",
    initial: { economic: ["Presupuesto", "$2,400,000", 84], temporal: ["Semestre", "Agosto–Dic + 2 sem", 74], technical: ["Docentes", "Capacitados", 70], physical: ["Campus", "Sede central", 45] },
    after: { technical: ["Docentes", "Con doctorado", 86] }
  },
  {
    id: "ev11",
    system: "Restaurante",
    icon: "🍴",
    event: "El restaurante cierra por remodelación un mes, recortando su temporada de operación.",
    answer: "temporal",
    explain: "El cierre reduce el tiempo en que el sistema opera. La duración de su actividad cambió, por lo que se trata de la frontera temporal.",
    initial: { economic: ["Ventas", "$120,000/mes", 66], temporal: ["Operación", "Todo el año", 80], technical: ["Brigada", "Capacitada", 62], physical: ["Local", "Sucursal norte", 50] },
    after: { temporal: ["Operación", "11 meses", 66] }
  },
  {
    id: "ev12",
    system: "Familia",
    icon: "👪",
    event: "La familia decide incluir en el análisis la vivienda de los abuelos.",
    answer: "physical",
    explain: "Añadir una vivienda extiende el espacio físico considerado, así que cambió la frontera física del sistema familiar.",
    initial: { economic: ["Ingreso", "$30,000/mes", 58], temporal: ["Periodo", "Año en curso", 62], technical: ["Habilidades", "Del hogar", 52], physical: ["Vivienda", "1 casa", 40] },
    after: { physical: ["Vivienda", "2 casas", 60] }
  }
];
