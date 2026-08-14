/* ============================================================
   SYSTEM SCOPE — Datos: sistemas, jerarquías, entorno, fronteras
   Modelo de grafo: cada nodo es un sistema que puede tener
   `children` (subsistemas) y un `parent` (suprasistema).
   `env` son elementos del entorno a ese nivel de análisis.
   ============================================================ */
window.SS = window.SS || {};

SS.data = SS.data || {};
SS.data.systems = {

  nodes: [
    /* ------------------------- UNIVERSIDAD ------------------------- */
    {
      id: "sociedad",
      name: "Sociedad",
      icon: "🌍",
      tag: "Suprasistema",
      blurb: "El entorno social más amplio en el que ocurren todos los demás procesos que analizaremos.",
      parent: null,
      children: ["sistema-educativo", "sector-gastronomico", "comunidad", "sistema-informatico", "mercado", "sistema-salud"],
      env: ["Cultura", "Instituciones", "Mercado laboral", "Legislación"],
      boundaries: {
        physical: "El territorio nacional.",
        economic: "La economía del país.",
        technical: "El conocimiento disponible en la población.",
        temporal: "El tiempo histórico de la sociedad."
      }
    },
    {
      id: "sistema-educativo",
      name: "Sistema educativo",
      icon: "🎓",
      tag: "Sistema",
      blurb: "Conjunto de instituciones y procesos que se organizan para formar a las personas de una sociedad.",
      parent: "sociedad",
      children: ["universidad"],
      env: ["Gobierno", "Economía", "Familias", "Mercado laboral"],
      boundaries: {
        physical: "Las instalaciones de las instituciones educativas del país.",
        economic: "El presupuesto destinado a la educación.",
        technical: "El nivel de formación de los docentes y planes de estudio.",
        temporal: "El ciclo escolar y las generaciones."
      }
    },
    {
      id: "universidad",
      name: "Universidad",
      icon: "🏛️",
      tag: "Sistema",
      blurb: "Institución de educación superior que forma profesionales a través de facultades, docencia, investigación y gestión.",
      parent: "sistema-educativo",
      children: ["facultad"],
      env: ["Sociedad", "Gobierno", "Empresas", "Egresados"],
      boundaries: {
        physical: "El campus universitario y sus instalaciones.",
        economic: "El presupuesto institucional.",
        technical: "La capacidad académica de su personal docente.",
        temporal: "El semestre y el calendario escolar."
      }
    },
    {
      id: "facultad",
      name: "Facultad de Ingeniería",
      icon: "⚙️",
      tag: "Sistema",
      blurb: "Unidad académica que agrupa departamentos según la disciplina y coordina planes de estudio.",
      parent: "universidad",
      children: ["departamento", "biblioteca"],
      env: ["Otras facultades", "Rectoría", "Sector industrial"],
      boundaries: {
        physical: "Los edificios y laboratorios asignados a la facultad.",
        economic: "El presupuesto de la facultad.",
        technical: "Los laboratorios y equipos disponibles para la enseñanza.",
        temporal: "Los semestres y periodos de acreditación."
      }
    },
    {
      id: "departamento",
      name: "Departamento de Optimización",
      icon: "📐",
      tag: "Sistema",
      blurb: "Unidad académico-administrativa que organiza la docencia e investigación de una disciplina.",
      parent: "facultad",
      children: ["clase-optimizacion"],
      env: ["Otros departamentos", "Dirección de la facultad", "Colegios profesionales"],
      boundaries: {
        physical: "Las oficinas y aulas del departamento.",
        economic: "El presupuesto departamental.",
        technical: "La especialización de su cuerpo académico.",
        temporal: "El periodo lectivo."
      }
    },
    {
      id: "clase-optimizacion",
      name: "Clase de Optimización",
      icon: "🧮",
      tag: "Sistema",
      blurb: "Espacio de enseñanza-aprendizaje donde un grupo estudia la teoría de sistemas y la optimización.",
      parent: "departamento",
      children: ["equipo"],
      env: ["Institución", "Otras clases", "Familia de los estudiantes"],
      boundaries: {
        physical: "El aula asignada.",
        economic: "Los recursos materiales de la clase.",
        technical: "Los conocimientos previos necesarios del estudiante.",
        temporal: "La duración del curso (un semestre)."
      }
    },
    {
      id: "equipo",
      name: "Equipo de trabajo",
      icon: "👥",
      tag: "Sistema",
      blurb: "Pequeño grupo de estudiantes que colabora para resolver los problemas de la clase.",
      parent: "clase-optimizacion",
      children: ["estudiante"],
      env: ["Otros equipos", "Docente", "Plataforma de la clase"],
      boundaries: {
        physical: "El lugar donde se reúne el equipo.",
        economic: "Los materiales que pueden costear.",
        technical: "Las habilidades complementarias de sus integrantes.",
        temporal: "La duración del proyecto."
      }
    },
    {
      id: "estudiante",
      name: "Estudiante",
      icon: "🧑‍🎓",
      tag: "Sistema",
      blurb: "Persona que participa en el proceso de aprendizaje y procesa la información del curso.",
      parent: "equipo",
      children: [],
      env: ["Familia", "Compañeros", "Entorno digital"],
      boundaries: {
        physical: "Su cuerpo y los espacios que ocupa.",
        economic: "Sus recursos para estudiar.",
        technical: "Sus conocimientos y habilidades de estudio.",
        temporal: "Su trayectoria escolar."
      }
    },
    {
      id: "biblioteca",
      name: "Biblioteca",
      icon: "📚",
      tag: "Subsistema",
      blurb: "Servicio que resguarda y facilita el acceso a la información para la comunidad universitaria.",
      parent: "facultad",
      children: [],
      env: ["Editoriales", "Usuarios", "Redes de bibliotecas"],
      boundaries: {
        physical: "El edificio de la biblioteca.",
        economic: "El presupuesto de adquisiciones.",
        technical: "El sistema de catalogación y el personal capacitado.",
        temporal: "El horario de servicio y el periodo de préstamo."
      }
    },

    /* ------------------------- RESTAURANTE ------------------------- */
    {
      id: "sector-gastronomico",
      name: "Sector gastronómico",
      icon: "🍽️",
      tag: "Suprasistema",
      blurb: "Conjunto de negocios y actividades dedicados a la preparación y venta de alimentos.",
      parent: "sociedad",
      children: ["cadena-restaurantes"],
      env: ["Consumidores", "Gobierno", "Agricultura", "Cultura alimentaria"],
      boundaries: {
        physical: "Los locales del sector.",
        economic: "La inversión del sector.",
        technical: "Las técnicas culinarias disponibles.",
        temporal: "Las temporadas y tendencias del mercado."
      }
    },
    {
      id: "cadena-restaurantes",
      name: "Cadena de restaurantes",
      icon: "🏢",
      tag: "Suprasistema",
      blurb: "Grupo de restaurantes bajo una misma marca que comparten estándares y administración.",
      parent: "sector-gastronomico",
      children: ["restaurante"],
      env: ["Proveedores", "Franquiciatarios", "Mercado"],
      boundaries: {
        physical: "Las sucursales de la cadena.",
        economic: "El capital de la empresa.",
        technical: "El know-how de la cadena.",
        temporal: "El periodo fiscal y de expansión."
      }
    },
    {
      id: "restaurante",
      name: "Restaurante",
      icon: "🍴",
      tag: "Sistema",
      blurb: "Establecimiento que transforma alimentos en platillos y los ofrece a los clientes.",
      parent: "cadena-restaurantes",
      children: ["cocina", "caja", "almacen", "sala"],
      env: ["Clientes", "Proveedores", "Ciudad", "Organismos de salud"],
      boundaries: {
        physical: "El local y su cocina.",
        economic: "El capital para operar.",
        technical: "Las habilidades del personal de cocina y servicio.",
        temporal: "El horario de servicio y los turnos."
      }
    },
    {
      id: "cocina",
      name: "Cocina",
      icon: "🍳",
      tag: "Subsistema",
      blurb: "Área donde los insumos se transforman en platillos mediante procesos de cocción.",
      parent: "restaurante",
      children: ["brigada"],
      env: ["Proveedores de alimentos", "Clientes", "Regulaciones sanitarias"],
      boundaries: {
        physical: "El área de cocina.",
        economic: "El costo de los insumos.",
        technical: "Las técnicas culinarias del equipo.",
        temporal: "La duración de los turnos de cocina."
      }
    },
    {
      id: "brigada",
      name: "Brigada de cocina",
      icon: "👨‍🍳",
      tag: "Subsistema",
      blurb: "Equipo de cocineros y ayudantes que ejecuta la preparación de los platillos.",
      parent: "cocina",
      children: [],
      env: ["Cocina", "Gerencia", "Proveedores"],
      boundaries: {
        physical: "El espacio de trabajo de la brigada.",
        economic: "El sueldo de su personal.",
        technical: "Las habilidades culinarias de cada integrante.",
        temporal: "La duración del turno."
      }
    },
    {
      id: "caja",
      name: "Caja",
      icon: "💵",
      tag: "Subsistema",
      blurb: "Área que registra y cobra los pedidos realizados por los clientes.",
      parent: "restaurante",
      children: [],
      env: ["Clientes", "Sistema de facturación", "Banco"],
      boundaries: {
        physical: "La zona de mostrador.",
        economic: "El efectivo en caja.",
        technical: "El manejo del sistema de cobro.",
        temporal: "El horario de apertura."
      }
    },
    {
      id: "almacen",
      name: "Almacén",
      icon: "📦",
      tag: "Subsistema",
      blurb: "Área de resguardo y control de insumos y materiales del restaurante.",
      parent: "restaurante",
      children: [],
      env: ["Proveedores", "Cocina", "Cadena de frío"],
      boundaries: {
        physical: "Las bodegas del restaurante.",
        economic: "El valor del inventario.",
        technical: "El sistema de control de inventarios.",
        temporal: "La vida útil de los insumos."
      }
    },
    {
      id: "sala",
      name: "Sala de servicio",
      icon: "🪑",
      tag: "Subsistema",
      blurb: "Zona donde los clientes son atendidos y reciben los platillos.",
      parent: "restaurante",
      children: [],
      env: ["Clientes", "Cocina", "Ambiente urbano"],
      boundaries: {
        physical: "El área de comedor.",
        economic: "El aforo según capacidad y venta.",
        technical: "Las habilidades del personal de servicio.",
        temporal: "El horario de atención."
      }
    },

    /* ------------------------- SER HUMANO ------------------------- */
    {
      id: "comunidad",
      name: "Comunidad",
      icon: "🏘️",
      tag: "Suprasistema",
      blurb: "Conjunto de familias y personas que comparten un espacio y relaciones sociales.",
      parent: "sociedad",
      children: ["familia"],
      env: ["Escuelas", "Servicios", "Redes sociales"],
      boundaries: {
        physical: "El área geográfica de la comunidad.",
        economic: "La economía local.",
        technical: "Los servicios disponibles.",
        temporal: "La historia de la comunidad."
      }
    },
    {
      id: "familia",
      name: "Familia",
      icon: "👪",
      tag: "Suprasistema",
      blurb: "Grupo de personas unidas por lazos que conviven e intercambian recursos y cuidados.",
      parent: "comunidad",
      children: ["ser-humano"],
      env: ["Comunidad", "Trabajo", "Escuela"],
      boundaries: {
        physical: "El hogar.",
        economic: "El ingreso familiar.",
        technical: "Los cuidados y habilidades del hogar.",
        temporal: "El ciclo de vida familiar."
      }
    },
    {
      id: "ser-humano",
      name: "Ser humano",
      icon: "🧍",
      tag: "Sistema",
      blurb: "Organismo que transforma nutrientes y oxígeno en energía mediante sistemas corporales.",
      parent: "familia",
      children: ["sistema-digestivo", "sistema-respiratorio", "sistema-circulatorio", "sistema-nervioso"],
      env: ["Oxígeno", "Alimentos", "Temperatura", "Otras personas"],
      boundaries: {
        physical: "La piel y el cuerpo.",
        economic: "Los recursos económicos de la persona.",
        technical: "Los conocimientos y habilidades de la persona.",
        temporal: "El ciclo de vida humano."
      }
    },
    {
      id: "sistema-digestivo",
      name: "Sistema digestivo",
      icon: "🥗",
      tag: "Subsistema",
      blurb: "Conjunto de órganos que transforman los alimentos en nutrientes aprovechables.",
      parent: "ser-humano",
      children: ["estomago"],
      env: ["Alimentos", "Agua", "Sistema circulatorio"],
      boundaries: {
        physical: "El tracto digestivo.",
        economic: "El costo de la alimentación.",
        technical: "La capacidad de procesar ciertos alimentos.",
        temporal: "El tiempo de digestión."
      }
    },
    {
      id: "estomago",
      name: "Estómago",
      icon: "🫄",
      tag: "Subsistema",
      blurb: "Órgano que almacena y procesa químicamente los alimentos que ingerimos.",
      parent: "sistema-digestivo",
      children: [],
      env: ["Alimentos", "Ácido gástrico", "Sistema nervioso"],
      boundaries: {
        physical: "La pared del estómago.",
        economic: "El costo de la dieta.",
        technical: "La tolerancia a ciertos alimentos.",
        temporal: "El tiempo de digestión gástrica."
      }
    },
    {
      id: "sistema-respiratorio",
      name: "Sistema respiratorio",
      icon: "🫁",
      tag: "Subsistema",
      blurb: "Conjunto de órganos que captan oxígeno y eliminan dióxido de carbono.",
      parent: "ser-humano",
      children: [],
      env: ["Oxígeno", "Contaminación", "Temperatura"],
      boundaries: {
        physical: "Las vías respiratorias.",
        economic: "El costo de la atención respiratoria.",
        technical: "La capacidad pulmonar.",
        temporal: "Cada ciclo de respiración."
      }
    },
    {
      id: "sistema-circulatorio",
      name: "Sistema circulatorio",
      icon: "❤️",
      tag: "Subsistema",
      blurb: "Red que transporta oxígeno, nutrientes y desechos por todo el cuerpo.",
      parent: "ser-humano",
      children: ["corazon"],
      env: ["Sistema respiratorio", "Sistema digestivo", "Actividad física"],
      boundaries: {
        physical: "El sistema de vasos sanguíneos.",
        economic: "El costo de la salud cardiovascular.",
        technical: "La condición del sistema.",
        temporal: "Cada latido y ciclo cardíaco."
      }
    },
    {
      id: "corazon",
      name: "Corazón",
      icon: "🫀",
      tag: "Subsistema",
      blurb: "Órgano que bombea la sangre a todo el organismo.",
      parent: "sistema-circulatorio",
      children: [],
      env: ["Vasos sanguíneos", "Actividad física", "Estrés"],
      boundaries: {
        physical: "El músculo cardíaco.",
        economic: "El costo de los cuidados cardíacos.",
        technical: "La capacidad del corazón.",
        temporal: "El ciclo cardíaco."
      }
    },
    {
      id: "sistema-nervioso",
      name: "Sistema nervioso",
      icon: "🧠",
      tag: "Subsistema",
      blurb: "Red que coordina y transmite las señales del cuerpo.",
      parent: "ser-humano",
      children: [],
      env: ["Estímulos del ambiente", "Alimentación", "Sueño"],
      boundaries: {
        physical: "Las neuronas y el encéfalo.",
        economic: "El costo de la salud mental.",
        technical: "Las capacidades cognitivas.",
        temporal: "Los tiempos de respuesta."
      }
    },

    /* ------------------------- PROGRAMA DE CÓMPUTO ------------------------- */
    {
      id: "sistema-informatico",
      name: "Sistema informático",
      icon: "🖥️",
      tag: "Suprasistema",
      blurb: "Conjunto de hardware, software y personas que procesan información.",
      parent: "sociedad",
      children: ["sistema-operativo"],
      env: ["Usuarios", "Red de datos", "Electricidad"],
      boundaries: {
        physical: "Los equipos del sistema.",
        economic: "La inversión tecnológica.",
        technical: "El nivel de los especialistas.",
        temporal: "El ciclo de vida del sistema."
      }
    },
    {
      id: "sistema-operativo",
      name: "Sistema operativo",
      icon: "💿",
      tag: "Suprasistema",
      blurb: "Software base que gestiona los recursos y ejecuta las aplicaciones.",
      parent: "sistema-informatico",
      children: ["programa-computo"],
      env: ["Hardware", "Red", "Usuarios"],
      boundaries: {
        physical: "Los dispositivos que gestiona.",
        economic: "Las licencias y el soporte.",
        technical: "La compatibilidad técnica.",
        temporal: "Las versiones y el soporte temporal."
      }
    },
    {
      id: "programa-computo",
      name: "Programa de cómputo",
      icon: "💻",
      tag: "Sistema",
      blurb: "Aplicación que procesa datos de entrada para producir resultados mediante módulos.",
      parent: "sistema-operativo",
      children: ["interfaz", "modulo-calculo", "base-datos", "modulo-reportes"],
      env: ["Usuarios", "Hardware", "Red de datos", "Datos externos"],
      boundaries: {
        physical: "Los equipos donde se ejecuta.",
        economic: "El presupuesto de desarrollo.",
        technical: "Los lenguajes y la capacidad del equipo.",
        temporal: "El ciclo de vida y las versiones."
      }
    },
    {
      id: "interfaz",
      name: "Interfaz de usuario",
      icon: "🖱️",
      tag: "Subsistema",
      blurb: "Componente que permite la comunicación entre el usuario y el programa.",
      parent: "programa-computo",
      children: [],
      env: ["Usuarios", "Navegador", "Pantalla"],
      boundaries: {
        physical: "La pantalla y el dispositivo.",
        economic: "El costo de diseño de la interfaz.",
        technical: "Las tecnologías de interfaz.",
        temporal: "El tiempo de uso de cada sesión."
      }
    },
    {
      id: "modulo-calculo",
      name: "Módulos de cálculo",
      icon: "🧮",
      tag: "Subsistema",
      blurb: "Componentes que implementan los algoritmos y transforman los datos.",
      parent: "programa-computo",
      children: [],
      env: ["Base de datos", "Interfaz", "Datos de entrada"],
      boundaries: {
        physical: "Los servidores de ejecución.",
        economic: "El costo de cómputo.",
        technical: "La complejidad algorítmica.",
        temporal: "El tiempo de procesamiento."
      }
    },
    {
      id: "base-datos",
      name: "Base de datos",
      icon: "🗄️",
      tag: "Subsistema",
      blurb: "Componente que almacena y recupera la información del programa.",
      parent: "programa-computo",
      children: [],
      env: ["Datos externos", "Usuarios", "Respaldos"],
      boundaries: {
        physical: "El almacenamiento físico.",
        economic: "El costo de almacenamiento.",
        technical: "La capacidad de la base.",
        temporal: "El tiempo de retención de datos."
      }
    },
    {
      id: "modulo-reportes",
      name: "Módulo de reportes",
      icon: "📊",
      tag: "Subsistema",
      blurb: "Componente que genera los resultados visuales a partir de la información procesada.",
      parent: "programa-computo",
      children: [],
      env: ["Usuarios", "Base de datos", "Impresoras"],
      boundaries: {
        physical: "Los equipos de salida.",
        economic: "El costo de impresión y distribución.",
        technical: "Las herramientas de reporte.",
        temporal: "La frecuencia de los reportes."
      }
    },

    /* ------------------------- EMPRESA ------------------------- */
    {
      id: "mercado",
      name: "Mercado",
      icon: "📈",
      tag: "Suprasistema",
      blurb: "Espacio donde interactúan oferta y demanda de bienes y servicios.",
      parent: "sociedad",
      children: ["grupo-corporativo"],
      env: ["Clientes", "Competencia", "Regulación", "Economía"],
      boundaries: {
        physical: "El mercado geográfico.",
        economic: "El poder adquisitivo.",
        technical: "Las tecnologías disponibles.",
        temporal: "Los ciclos de mercado."
      }
    },
    {
      id: "grupo-corporativo",
      name: "Grupo corporativo",
      icon: "🏦",
      tag: "Suprasistema",
      blurb: "Conjunto de empresas bajo una misma dirección que comparten recursos y estrategia.",
      parent: "mercado",
      children: ["empresa"],
      env: ["Inversionistas", "Mercado", "Reguladores"],
      boundaries: {
        physical: "Las sedes del grupo.",
        economic: "El capital corporativo.",
        technical: "Las capacidades directivas.",
        temporal: "El horizonte estratégico."
      }
    },
    {
      id: "empresa",
      name: "Empresa",
      icon: "🏭",
      tag: "Sistema",
      blurb: "Organización que combina recursos para producir bienes o servicios con una finalidad económica.",
      parent: "grupo-corporativo",
      children: ["produccion", "ventas", "finanzas", "recursos-humanos"],
      env: ["Clientes", "Proveedores", "Competidores", "Gobierno"],
      boundaries: {
        physical: "Las instalaciones de la empresa.",
        economic: "El capital y el presupuesto.",
        technical: "La tecnología y el personal capacitado.",
        temporal: "El ejercicio fiscal."
      }
    },
    {
      id: "produccion",
      name: "Producción",
      icon: "🏗️",
      tag: "Subsistema",
      blurb: "Área que transforma insumos en productos terminados.",
      parent: "empresa",
      children: [],
      env: ["Proveedores", "Ventas", "Máquinas"],
      boundaries: {
        physical: "La planta de producción.",
        economic: "El costo de producción.",
        technical: "La tecnología de manufactura.",
        temporal: "Los tiempos de producción."
      }
    },
    {
      id: "ventas",
      name: "Ventas",
      icon: "🤝",
      tag: "Subsistema",
      blurb: "Área que comercializa los productos y atiende a los clientes.",
      parent: "empresa",
      children: [],
      env: ["Clientes", "Mercado", "Publicidad"],
      boundaries: {
        physical: "Los puntos de venta.",
        economic: "El presupuesto de ventas.",
        technical: "Las habilidades comerciales.",
        temporal: "Los periodos de venta."
      }
    },
    {
      id: "finanzas",
      name: "Finanzas",
      icon: "💰",
      tag: "Subsistema",
      blurb: "Área que administra los recursos monetarios de la empresa.",
      parent: "empresa",
      children: [],
      env: ["Bancos", "Inversionistas", "Gobierno"],
      boundaries: {
        physical: "Las oficinas de tesorería.",
        economic: "El flujo de caja.",
        technical: "El conocimiento financiero.",
        temporal: "El ejercicio contable."
      }
    },
    {
      id: "recursos-humanos",
      name: "Recursos humanos",
      icon: "🧑‍💼",
      tag: "Subsistema",
      blurb: "Área que gestiona el personal y su desarrollo dentro de la empresa.",
      parent: "empresa",
      children: [],
      env: ["Mercado laboral", "Sindicatos", "Legislación laboral"],
      boundaries: {
        physical: "Las oficinas de RH.",
        economic: "La nómina.",
        technical: "Las competencias del personal.",
        temporal: "La permanencia del personal."
      }
    },

    /* ------------------------- HOSPITAL ------------------------- */
    {
      id: "sistema-salud",
      name: "Sistema de salud",
      icon: "🏥",
      tag: "Suprasistema",
      blurb: "Conjunto de instituciones y servicios que atienden la salud de la población.",
      parent: "sociedad",
      children: ["hospital"],
      env: ["Pacientes", "Gobierno", "Aseguradoras", "Profesionales de la salud"],
      boundaries: {
        physical: "Las instalaciones de salud del país.",
        economic: "El presupuesto de salud.",
        technical: "La capacidad del personal médico.",
        temporal: "Los turnos y programas de salud."
      }
    },
    {
      id: "hospital",
      name: "Hospital",
      icon: "⛑️",
      tag: "Sistema",
      blurb: "Institución que diagnostica, atiende y da seguimiento a los pacientes.",
      parent: "sistema-salud",
      children: ["urgencias", "quirurjico", "laboratorio", "farmacia"],
      env: ["Pacientes", "Familiares", "Proveedores médicos", "Aseguradoras"],
      boundaries: {
        physical: "Las instalaciones del hospital.",
        economic: "El presupuesto hospitalario.",
        technical: "El equipo y personal médico.",
        temporal: "Los turnos y estancias."
      }
    },
    {
      id: "urgencias",
      name: "Urgencias",
      icon: "🚑",
      tag: "Subsistema",
      blurb: "Servicio que atiende de inmediato los casos críticos.",
      parent: "hospital",
      children: [],
      env: ["Ambulancias", "Pacientes críticos", "Emergencias externas"],
      boundaries: {
        physical: "El área de urgencias.",
        economic: "El presupuesto de emergencias.",
        technical: "La preparación del personal de urgencias.",
        temporal: "El tiempo de respuesta."
      }
    },
    {
      id: "quirurjico",
      name: "Quirófano",
      icon: "🔬",
      tag: "Subsistema",
      blurb: "Área destinada a los procedimientos quirúrgicos.",
      parent: "hospital",
      children: [],
      env: ["Cirujanos", "Anestesiólogos", "Instrumental"],
      boundaries: {
        physical: "El área quirúrgica.",
        economic: "El costo de los procedimientos.",
        technical: "La experiencia del equipo quirúrgico.",
        temporal: "La duración de las cirugías."
      }
    },
    {
      id: "laboratorio",
      name: "Laboratorio clínico",
      icon: "🧪",
      tag: "Subsistema",
      blurb: "Servicio que analiza muestras para apoyar el diagnóstico.",
      parent: "hospital",
      children: [],
      env: ["Muestras", "Proveedores", "Pacientes"],
      boundaries: {
        physical: "El laboratorio.",
        economic: "El costo de los reactivos.",
        technical: "La exactitud de los equipos.",
        temporal: "El tiempo de entrega de resultados."
      }
    },
    {
      id: "farmacia",
      name: "Farmacia hospitalaria",
      icon: "💊",
      tag: "Subsistema",
      blurb: "Servicio que resguarda y suministra los medicamentos.",
      parent: "hospital",
      children: [],
      env: ["Proveedores farmacéuticos", "Pacientes", "Médicos"],
      boundaries: {
        physical: "El almacén de medicamentos.",
        economic: "El presupuesto farmacéutico.",
        technical: "El conocimiento farmacéutico.",
        temporal: "La caducidad de los medicamentos."
      }
    }
  ],

  /* Índice por id para acceso rápido */
  index: null,
  rootId: "sociedad",

  byId(id) {
    if (!this.index) {
      this.index = {};
      for (const n of this.nodes) this.index[n.id] = n;
    }
    return this.index[id];
  },

  /* Profundidad = niveles desde la raíz */
  depth(id) {
    let d = 0;
    let cur = this.byId(id);
    while (cur && cur.parent) { d++; cur = this.byId(cur.parent); }
    return d;
  }
};

SS.data.systems.index = null;
