/* ============================================================
   SYSTEM SCOPE — Datos: Misión Final
   Sistema de entrega de medicamentos (FarmaPlus)
   5 etapas: sistema principal, subsistemas, suprasistema,
   sistema-entorno y las cuatro fronteras.
   ============================================================ */
window.SS = window.SS || {};
SS.data = SS.data || {};

SS.data.finalChallenge = {
  id: "m5",
  title: "Misión Final — Delimita el Sistema",
  icon: "💊",
  context: "FarmaPlus, una organización de distribución de medicamentos, desea analizar su proceso de entrega de medicamentos. Antes de optimizar, necesita delimitar correctamente el sistema: identificar su nivel de análisis, sus componentes, su sistema mayor y sus fronteras.",
  stages: [
    {
      id: "s1",
      title: "Sistema principal",
      task: "Selecciona el nivel que representa correctamente el sistema que FarmaPlus desea analizar, según el contexto.",
      type: "single",
      options: [
        { id: "o1", label: "FarmaPlus (empresa completa)", icon: "🏭", desc: "Todas las áreas y procesos de la organización.", correct: false },
        { id: "o2", label: "Sistema de entrega de medicamentos", icon: "💊", desc: "El proceso de entrega que se desea analizar y optimizar.", correct: true },
        { id: "o3", label: "Almacén central", icon: "📦", desc: "Únicamente la bodega de medicamentos.", correct: false },
        { id: "o4", label: "Repartidor", icon: "🛵", desc: "El vehículo y la persona que reparte.", correct: false },
        { id: "o5", label: "Mercado farmacéutico", icon: "📈", desc: "Toda la industria de medicamentos del país.", correct: false }
      ]
    },
    {
      id: "s2",
      title: "Subsistemas",
      task: "Marca los componentes que pueden analizarse como subsistemas del sistema de entrega. Después confirma tu selección.",
      type: "multi",
      options: [
        { id: "m1", label: "Recepción de pedidos", icon: "📋", desc: "Proceso que recibe y valida las solicitudes.", correct: true },
        { id: "m2", label: "Inventario", icon: "🗃️", desc: "Control de existencias de medicamentos.", correct: true },
        { id: "m3", label: "Preparación de pedidos", icon: "📦", desc: "Armado de los pedidos para su reparto.", correct: true },
        { id: "m4", label: "Reparto", icon: "🚚", desc: "Transporte de los pedidos hasta el destino.", correct: true },
        { id: "m5", label: "Proveedores farmacéuticos", icon: "🏭", desc: "Empresas que fabrican los medicamentos.", correct: false },
        { id: "m6", label: "Pacientes", icon: "🧑‍🦯", desc: "Personas que reciben los medicamentos.", correct: false },
        { id: "m7", label: "Hospitales", icon: "🏥", desc: "Destinos externos de los pedidos.", correct: false },
        { id: "m8", label: "Dirección general", icon: "💼", desc: "Órgano de gobierno de toda la organización.", correct: false }
      ]
    },
    {
      id: "s3",
      title: "Suprasistema",
      task: "Selecciona el sistema mayor que contiene al sistema de entrega de medicamentos, según el contexto.",
      type: "single",
      options: [
        { id: "u1", label: "FarmaPlus (la organización)", icon: "🏭", desc: "La organización que contiene el proceso de entrega.", correct: true },
        { id: "u2", label: "Mercado farmacéutico", icon: "📈", desc: "La industria de medicamentos a nivel país.", correct: false },
        { id: "u3", label: "Almacén central", icon: "📦", desc: "Un subsistema del sistema de entrega.", correct: false },
        { id: "u4", label: "Sistema de salud", icon: "🏥", desc: "Conjunto más amplio que atiende la salud.", correct: false },
        { id: "u5", label: "Pacientes", icon: "🧑‍🦯", desc: "Parte del entorno del sistema.", correct: false }
      ]
    },
    {
      id: "s4",
      title: "Sistema y entorno",
      task: "Coloca cada elemento DENTRO del sistema de entrega o en su ENTORNO, según lo que el análisis debe considerar.",
      type: "inside-out",
      elements: [
        { id: "x1", label: "Recepción de pedidos", icon: "📋", inside: true },
        { id: "x2", label: "Almacén central", icon: "📦", inside: true },
        { id: "x3", label: "Rutas de reparto", icon: "🗺️", inside: true },
        { id: "x4", label: "Pedidos validados", icon: "✅", inside: true },
        { id: "x5", label: "Pacientes", icon: "🧑‍🦯", inside: false },
        { id: "x6", label: "Hospitales", icon: "🏥", inside: false },
        { id: "x7", label: "Proveedores farmacéuticos", icon: "🏭", inside: false },
        { id: "x8", label: "Regulación sanitaria", icon: "📜", inside: false },
        { id: "x9", label: "Tráfico y clima", icon: "🌧️", inside: false }
      ]
    },
    {
      id: "s5",
      title: "Las cuatro fronteras",
      task: "Define con los controles visuales las cuatro fronteras del sistema de entrega.",
      type: "boundaries",
      controls: [
        {
          kind: "physical",
          title: "Frontera física",
          icon: "📍",
          hint: "¿Qué espacio abarca el sistema de entrega?",
          options: [
            { id: "p1", label: "Solo el almacén", icon: "📦", desc: "El perímetro se limita a la bodega.", correct: false },
            { id: "p2", label: "Almacén + rutas de reparto", icon: "🗺️", desc: "La bodega y las rutas por las que circulan los pedidos.", correct: true },
            { id: "p3", label: "Toda la organización", icon: "🏭", desc: "Incluye todas las áreas de FarmaPlus.", correct: false }
          ]
        },
        {
          kind: "economic",
          title: "Frontera económica",
          icon: "💰",
          hint: "¿Cuál es el presupuesto de operación logística?",
          segments: [
            { id: "e1", label: "Menos de $200,000", from: 0.0, to: 0.19, correct: false },
            { id: "e2", label: "$200,000 – $800,000", from: 0.2, to: 0.79, correct: true },
            { id: "e3", label: "Más de $1,000,000", from: 0.8, to: 1.0, correct: false }
          ]
        },
        {
          kind: "technical",
          title: "Frontera técnica",
          icon: "⚙️",
          hint: "Marca las capacidades que definen la frontera técnica. Deben quedar habilitadas exactamente las requeridas.",
          skills: [
            { id: "t1", label: "Logística", correct: true },
            { id: "t2", label: "Validación de pedidos", correct: true },
            { id: "t3", label: "Manejo de medicamentos", correct: true },
            { id: "t4", label: "Marketing", correct: false },
            { id: "t5", label: "Diseño de videojuegos", correct: false }
          ]
        },
        {
          kind: "temporal",
          title: "Frontera temporal",
          icon: "⏱️",
          hint: "Selecciona el inicio y el fin del ciclo diario de entrega (0 a 23 horas). El ciclo correcto va de las 8:00 a las 18:00.",
          startCorrect: 8,
          endCorrect: 18
        }
      ]
    }
  ]
};
