/* ============================================================
   SYSTEM SCOPE — Datos: misiones 1 y 2
   M1: identificar subsistemas (mecánica dentro/fuera)
   M2: identificar el suprasistema correcto
   ============================================================ */
window.SS = window.SS || {};
SS.data = SS.data || {};

/* Mecánica de M1: cada nodo debe clasificarse en 'inside' (subsistema)
   o 'outside' (no es subsistema a ese nivel). */
SS.data.mission1 = {
  title: "Dentro del Sistema",
  subtitle: "Identifica qué elementos pueden analizarse como subsistemas del sistema actual.",
  cases: [
    {
      id: "restaurante",
      system: "Restaurante",
      icon: "🍴",
      blurb: "Analizamos el restaurante como sistema. Coloca cada elemento dentro si puede analizarse como subsistema, o fuera si no pertenece a este nivel interno.",
      hint: 'Pregúntate: ¿este elemento está DENTRO del restaurante y puede analizarse con procesos propios? El menú es una salida, la cadena lo contiene y los clientes lo rodean.', 
      nodes: [
        { id: "r1", label: "Cocina", icon: "🍳", kind: "inside" },
        { id: "r2", label: "Área de bebidas", icon: "🥤", kind: "inside" },
        { id: "r3", label: "Caja", icon: "💵", kind: "inside" },
        { id: "r4", label: "Almacén", icon: "📦", kind: "inside" },
        { id: "r5", label: "Menú", icon: "📖", kind: "outside" },
        { id: "r6", label: "Cadena de restaurantes", icon: "🏢", kind: "outside" },
        { id: "r7", label: "Clientes", icon: "🧑", kind: "outside" },
        { id: "r8", label: "Ciudad", icon: "🏙️", kind: "outside" },
        { id: "r9", label: "Proveedores", icon: "🚚", kind: "outside" }
      ]
    },
    {
      id: "clase-optimizacion",
      system: "Clase de Optimización",
      icon: "🧮",
      blurb: "Analizamos la clase de Optimización como sistema. Coloca dentro los elementos que pueden funcionar como subsistemas; deja fuera los que pertenecen al entorno o a un nivel mayor.",
      hint: 'Un subsistema está contenido en la clase: equipos, docente y materiales forman parte de ella. La universidad y el departamento la CONTIENEN; la familia está en el entorno.', 
      nodes: [
        { id: "c1", label: "Equipos de trabajo", icon: "👥", kind: "inside" },
        { id: "c2", label: "Docente", icon: "👩‍🏫", kind: "inside" },
        { id: "c3", label: "Material didáctico", icon: "📗", kind: "inside" },
        { id: "c4", label: "Plataforma de la clase", icon: "💻", kind: "inside" },
        { id: "c5", label: "Departamento de Optimización", icon: "📐", kind: "outside" },
        { id: "c6", label: "Universidad", icon: "🏛️", kind: "outside" },
        { id: "c7", label: "Familia del estudiante", icon: "👪", kind: "outside" },
        { id: "c8", label: "Reglamento institucional", icon: "📜", kind: "outside" }
      ]
    },
    {
      id: "ser-humano",
      system: "Ser humano",
      icon: "🧍",
      blurb: "Analizamos el ser humano como sistema. Identifica sus subsistemas corporales y deja fuera los elementos del entorno o los sistemas mayores.",
      hint: 'Los subsistemas del ser humano son sus sistemas corporales. El oxígeno, los alimentos y la temperatura lo rodean; la familia lo contiene.', 
      nodes: [
        { id: "h1", label: "Sistema digestivo", icon: "🥗", kind: "inside" },
        { id: "h2", label: "Sistema respiratorio", icon: "🫁", kind: "inside" },
        { id: "h3", label: "Sistema circulatorio", icon: "❤️", kind: "inside" },
        { id: "h4", label: "Sistema nervioso", icon: "🧠", kind: "inside" },
        { id: "h5", label: "Oxígeno", icon: "💨", kind: "outside" },
        { id: "h6", label: "Alimentos", icon: "🍎", kind: "outside" },
        { id: "h7", label: "Familia", icon: "👪", kind: "outside" },
        { id: "h8", label: "Temperatura ambiente", icon: "🌡️", kind: "outside" }
      ]
    },
    {
      id: "programa-computo",
      system: "Programa de cómputo",
      icon: "💻",
      blurb: "Analizamos el programa de cómputo como sistema. Coloca dentro sus módulos o componentes internos; deja fuera el entorno y los sistemas que lo contienen.",
      hint: 'Los componentes internos del programa (interfaz, cálculos, datos, reportes) son sus subsistemas. El usuario y la red lo rodean; el sistema operativo lo contiene.', 
      nodes: [
        { id: "p1", label: "Interfaz de usuario", icon: "🖱️", kind: "inside" },
        { id: "p2", label: "Módulos de cálculo", icon: "🧮", kind: "inside" },
        { id: "p3", label: "Base de datos", icon: "🗄️", kind: "inside" },
        { id: "p4", label: "Módulo de reportes", icon: "📊", kind: "inside" },
        { id: "p5", label: "Usuarios", icon: "🧑‍💻", kind: "outside" },
        { id: "p6", label: "Sistema operativo", icon: "💿", kind: "outside" },
        { id: "p7", label: "Hardware", icon: "🖥️", kind: "outside" },
        { id: "p8", label: "Red de datos", icon: "🌐", kind: "outside" }
      ]
    },
    {
      id: "universidad",
      system: "Universidad",
      icon: "🏛️",
      blurb: "Analizamos la universidad como sistema. Identifica qué unidades pueden funcionar como subsistemas y qué elementos quedan fuera de este nivel.",
      hint: 'Dentro de la universidad hay unidades como facultad, biblioteca y administración. El sistema educativo la contiene; la sociedad, el gobierno y las empresas la rodean.', 
      nodes: [
        { id: "u1", label: "Facultad", icon: "⚙️", kind: "inside" },
        { id: "u2", label: "Biblioteca", icon: "📚", kind: "inside" },
        { id: "u3", label: "Administración", icon: "🗂️", kind: "inside" },
        { id: "u4", label: "Departamentos", icon: "📐", kind: "inside" },
        { id: "u5", label: "Sistema educativo", icon: "🎓", kind: "outside" },
        { id: "u6", label: "Gobierno", icon: "🏛️", kind: "outside" },
        { id: "u7", label: "Sociedad", icon: "🌍", kind: "outside" },
        { id: "u8", label: "Empresas", icon: "🏭", kind: "outside" }
      ]
    }
  ]
};

/* Mecánica de M2: elegir el suprasistema adecuado según el contexto. */
SS.data.mission2 = {
  title: "Fuera del Sistema",
  subtitle: "Avanza hacia afuera: identifica el sistema mayor que contiene al sistema actual.",
  cases: [
    {
      id: "restaurante",
      system: "Restaurante",
      icon: "🍴",
      blurb: "El restaurante 'Sabor del Norte' opera de forma independiente, pero comparte marca, proveedores y estándares con otros locales que pertenecen a la misma organización.",
      hint: "El suprasistema es algo que CONTIENE al restaurante. Piensa en qué agrupa a varios restaurantes con una misma marca.",
      options: [
        { id: "k1", label: "Cocina", icon: "🍳", desc: "Área donde se preparan los platillos.", correct: false, wrongWhy: "La cocina está DENTRO del restaurante: es un subsistema, no un sistema mayor." },
        { id: "k2", label: "Cadena de restaurantes", icon: "🏢", desc: "Organización que agrupa varios locales con una misma marca.", correct: true, wrongWhy: "" },
        { id: "k3", label: "Menú", icon: "📖", desc: "Lista de platillos que se ofrecen.", correct: false, wrongWhy: "El menú es una salida del sistema, no un sistema que lo contenga." },
        { id: "k4", label: "Ciudad", icon: "🏙️", desc: "Zona urbana donde se ubica el local.", correct: false, wrongWhy: "La ciudad rodea al restaurante y contiene muchísimos sistemas; el suprasistema inmediato es la cadena." },
        { id: "k5", label: "Proveedores", icon: "🚚", desc: "Empresas que suministran insumos.", correct: false, wrongWhy: "Los proveedores pertenecen al entorno del restaurante, no lo contienen." }
      ]
    },
    {
      id: "clase-optimizacion",
      system: "Clase de Optimización",
      icon: "🧮",
      blurb: "La clase de Optimización se imparte dentro de un plan de estudios de la Licenciatura en Ingeniería Industrial y depende académicamente de una unidad más amplia que la organiza.",
      hint: "El suprasistema es la unidad que organiza la clase dentro de la facultad. No es el grupo ni el aula.",
      options: [
        { id: "c1", label: "Equipo de trabajo", icon: "👥", desc: "Grupo de estudiantes que colabora.", correct: false, wrongWhy: "El equipo de trabajo está DENTRO de la clase: es un subsistema." },
        { id: "c2", label: "Departamento de Optimización", icon: "📐", desc: "Unidad que organiza la docencia de la disciplina.", correct: true, wrongWhy: "" },
        { id: "c3", label: "Docente", icon: "👩‍🏫", desc: "Persona que imparte la clase.", correct: false, wrongWhy: "El docente forma parte de la clase, es un componente interno." },
        { id: "c4", label: "Aula", icon: "🪑", desc: "Espacio físico donde se reúne el grupo.", correct: false, wrongWhy: "El aula es el espacio físico de la clase, no un sistema que la contenga." },
        { id: "c5", label: "Estudiante", icon: "🧑‍🎓", desc: "Persona inscrita en la clase.", correct: false, wrongWhy: "El estudiante es parte de la clase, no el sistema mayor." }
      ]
    },
    {
      id: "ser-humano",
      system: "Ser humano",
      icon: "🧍",
      blurb: "La profesora le pide analizar a una persona como sistema dentro de su contexto inmediato: ella vive y comparte su vida con las personas con las que convive cada día.",
      hint: "El suprasistema inmediato de una persona en su vida cotidiana es el grupo con el que convive cada día.",
      options: [
        { id: "s1", label: "Sistema digestivo", icon: "🥗", desc: "Subsistema corporal.", correct: false, wrongWhy: "El sistema digestivo está DENTRO del ser humano: es un subsistema." },
        { id: "s2", label: "Familia", icon: "👪", desc: "Grupo de personas con las que convive y que la contiene en su vida cotidiana.", correct: true, wrongWhy: "" },
        { id: "s3", label: "Comunidad", icon: "🏘️", desc: "Conjunto de familias de la zona.", correct: false, wrongWhy: "La comunidad contiene a la familia, que a su vez contiene a la persona; busca el nivel inmediato." },
        { id: "s4", label: "Alimentos", icon: "🍎", desc: "Elemento del entorno.", correct: false, wrongWhy: "Los alimentos son una entrada del entorno, no un sistema mayor." },
        { id: "s5", label: "Oxígeno", icon: "💨", desc: "Elemento del entorno.", correct: false, wrongWhy: "El oxígeno es un elemento del entorno, no un sistema mayor." }
      ]
    },
    {
      id: "programa-computo",
      system: "Programa de cómputo",
      icon: "💻",
      blurb: "El programa de reportes financieros se ejecuta sobre un software base que administra los recursos del equipo y que aloja a todas las aplicaciones de la empresa.",
      hint: "El suprasistema es el software base sobre el que se ejecuta el programa. No es el equipo físico.",
      options: [
        { id: "pc1", label: "Interfaz de usuario", icon: "🖱️", desc: "Componente interno del programa.", correct: false, wrongWhy: "La interfaz está DENTRO del programa: es un componente interno." },
        { id: "pc2", label: "Sistema operativo", icon: "💿", desc: "Software base que contiene y ejecuta las aplicaciones.", correct: true, wrongWhy: "" },
        { id: "pc3", label: "Base de datos", icon: "🗄️", desc: "Componente interno del programa.", correct: false, wrongWhy: "La base de datos es un subsistema del programa." },
        { id: "pc4", label: "Usuarios", icon: "🧑‍💻", desc: "Personas que usan el programa.", correct: false, wrongWhy: "Los usuarios interactúan desde el entorno, no contienen al programa." },
        { id: "pc5", label: "Hardware", icon: "🖥️", desc: "Equipo físico donde corre todo.", correct: false, wrongWhy: "El hardware es el soporte físico del entorno; el software que contiene al programa es el sistema operativo." }
      ]
    },
    {
      id: "universidad",
      system: "Universidad",
      icon: "🏛️",
      blurb: "La Universidad Central no está aislada: pertenece a un conjunto de instituciones de educación superior que operan bajo las mismas políticas educativas del país.",
      hint: "El suprasistema es el conjunto de instituciones educativas del país, no la sociedad completa.",
      options: [
        { id: "un1", label: "Facultad", icon: "⚙️", desc: "Subsistema interno de la universidad.", correct: false, wrongWhy: "La facultad está DENTRO de la universidad: es un subsistema." },
        { id: "un2", label: "Sistema educativo", icon: "🎓", desc: "Conjunto de instituciones que forman parte de la educación del país.", correct: true, wrongWhy: "" },
        { id: "un3", label: "Biblioteca", icon: "📚", desc: "Subsistema interno de la universidad.", correct: false, wrongWhy: "La biblioteca es un subsistema interno de la universidad." },
        { id: "un4", label: "Egresados", icon: "🎖️", desc: "Personas que ya se graduaron.", correct: false, wrongWhy: "Los egresados pertenecen al entorno social de la universidad." },
        { id: "un5", label: "Sociedad", icon: "🌍", desc: "Conjunto amplio que abarca todo lo social.", correct: false, wrongWhy: "La sociedad contiene muchísimos sistemas; el suprasistema inmediato de la universidad es el sistema educativo." }
      ]
    }
  ]
};


/* Metadatos de las misiones para el mapa de progreso */
SS.data.missionMeta = {
  m1: { num: "01", title: "Dentro del Sistema", desc: "Identifica los subsistemas de cada sistema." },
  m2: { num: "02", title: "Fuera del Sistema", desc: "Encuentra el suprasistema adecuado." },
  ref: { num: "03", title: "El Nivel Cambia", desc: "Observa cómo cambian los roles al cambiar de referencia." },
  m3: { num: "04", title: "Estableciendo Fronteras", desc: "Conoce las cuatro fronteras y define el alcance." },
  m4: { num: "05", title: "Fronteras en Acción", desc: "Detecta qué frontera cambia en cada evento." },
  m5: { num: "06", title: "Misión Final", desc: "Delimita por completo el sistema de entrega de medicamentos." }
};
