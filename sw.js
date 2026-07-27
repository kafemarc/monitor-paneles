// ════════════════════════════════════════════════════════
//  SERVICE WORKER — Monitor de Paneles
//  Auto-programa todas las alertas del día al activarse.
//  Se reprograma solo a medianoche para el día siguiente.
// ════════════════════════════════════════════════════════

// ── FESTIVOS COLOMBIA 2026 ──────────────────────────────
const HOLIDAYS = {
  '2026-01-01':'Año Nuevo','2026-01-12':'Reyes Magos',
  '2026-03-23':'San José','2026-03-29':'Domingo de Ramos',
  '2026-04-02':'Jueves Santo','2026-04-03':'Viernes Santo',
  '2026-04-05':'Domingo de Resurrección','2026-05-01':'Día del Trabajo',
  '2026-05-18':'Ascensión','2026-06-08':'Corpus Christi',
  '2026-06-15':'Sagrado Corazón','2026-06-29':'San Pedro y San Pablo',
  '2026-07-13':'Nuestra Señora del Rosario de Chiquinquirá',
  '2026-07-20':'Día de la Independencia','2026-08-07':'Batalla de Boyacá',
  '2026-08-17':'Asunción de la Virgen','2026-10-12':'Día de la Raza',
  '2026-11-02':'Todos los Santos','2026-11-16':'Independencia de Cartagena',
  '2026-12-08':'Inmaculada Concepción','2026-12-25':'Navidad',
};
const MONDAY_HOLIDAYS = [
  '2026-01-12','2026-03-23','2026-05-18','2026-06-08',
  '2026-06-15','2026-06-29','2026-07-13','2026-07-20',
  '2026-08-17','2026-10-12','2026-11-02','2026-11-16',
];

// ── CRONOGRAMA ──────────────────────────────────────────
// t:'auto'   → panel automático → alerta 10 min DESPUÉS
// t:'manual' → tarea manual     → alerta 20 min ANTES
const SCH = {
  1:[ // LUNES
    {h:2,m:0,  n:'Derechos Fundamentales en el Trabajo V3',               t:'auto'},
    {h:3,m:0,  n:'Horas Instructor 2026',                                  t:'auto'},
    {h:7,m:0,  n:'Proyección Cupos - III Oferta Presencial y A Distancia', t:'auto'},
    {h:7,m:30, n:'Cargue reporte actualizado - Derechos Fundamentales V3', t:'manual'},
    {h:7,m:30, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:8,m:0,  n:'Ejecución de Metas 2026',                                t:'auto'},
    {h:8,m:0,  n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:9,m:0,  n:'Programación Horas por Grupo',                           t:'manual'},
    {h:9,m:30, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:10,m:0, n:'Indicador Horas Instructor - Contratista',               t:'manual'},
    {h:10,m:30,n:'Indicador Horas Instructor - Planta',                    t:'manual'},
    {h:11,m:0, n:'Infografía DFP Regiones 2026',                           t:'auto'},
    {h:12,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:14,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:14,m:30,n:'FEC - Construcción',                                     t:'auto'},
    {h:15,m:30,n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:16,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:18,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:20,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
  ],
  2:[ // MARTES
    {h:2,m:0,  n:'Derechos Fundamentales en el Trabajo V3',                t:'auto'},
    {h:5,m:0,  n:'Generación de reportes',                                 t:'manual'},
    {h:6,m:30, n:'Ejecución Meta Propia TIC 2026',                         t:'auto'},
    {h:7,m:0,  n:'Proyección Cupos - III Oferta Presencial y A Distancia', t:'auto'},
    {h:7,m:30, n:'Cargue reporte actualizado - Derechos Fundamentales V3', t:'manual'},
    {h:7,m:30, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:8,m:0,  n:'Ejecución de Metas 2026',                                t:'auto'},
    {h:8,m:0,  n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:9,m:0,  n:'Generar reportes Instructores - Juicios Emitidos vs Programados', t:'manual'},
    {h:9,m:30, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:11,m:0, n:'Infografía DFP Regiones 2026',                           t:'auto'},
    {h:12,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:14,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:14,m:30,n:'FEC - Construcción',                                     t:'auto'},
    {h:15,m:0, n:'Envío certificados bilingüe 7 y 8',                      t:'manual'},
    {h:15,m:30,n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:16,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:17,m:30,n:'Cargue reportes Instructores - Juicios Emitidos (Onedrive)', t:'manual'},
    {h:18,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:20,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:21,m:0, n:'118 paneles - Instructores con Juicios Emitidos y con Programación', t:'manual'},
  ],
  3:[ // MIÉRCOLES
    {h:2,m:0,  n:'Derechos Fundamentales en el Trabajo V3',                t:'auto'},
    {h:7,m:0,  n:'Proyección Cupos - III Oferta Presencial y A Distancia', t:'auto'},
    {h:7,m:30, n:'Cargue reporte actualizado - Derechos Fundamentales V3', t:'manual'},
    {h:7,m:30, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:8,m:0,  n:'Ejecución de Metas 2026',                                t:'auto'},
    {h:8,m:0,  n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:9,m:0,  n:'Programación Horas por Grupo',                           t:'manual'},
    {h:9,m:30, n:'Ejecución Catatumbo',                                    t:'manual'},
    {h:9,m:30, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:10,m:0, n:'Ejecución PDET',                                         t:'manual'},
    {h:11,m:0, n:'Infografía DFP Regiones 2026',                           t:'auto'},
    {h:12,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:14,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:14,m:30,n:'FEC - Construcción',                                     t:'auto'},
    {h:15,m:30,n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:16,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:17,m:30,n:'Cargue reportes Instructores - Juicios Emitidos (Onedrive)', t:'manual'},
    {h:18,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:20,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
  ],
  4:[ // JUEVES
    {h:0,m:0,  n:'Horas por Competencia - Terminadas',                     t:'auto'},
    {h:2,m:0,  n:'Derechos Fundamentales en el Trabajo V3',                t:'auto'},
    {h:6,m:30, n:'Ejecución Meta Propia TIC 2026',                         t:'auto'},
    {h:7,m:0,  n:'Proyección Cupos - III Oferta Presencial y A Distancia', t:'auto'},
    {h:7,m:30, n:'Cargue reporte actualizado - Derechos Fundamentales V3', t:'manual'},
    {h:7,m:30, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:8,m:0,  n:'Ejecución de Metas 2026',                                t:'auto'},
    {h:8,m:0,  n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:9,m:30, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:11,m:0, n:'Infografía DFP Regiones 2026',                           t:'auto'},
    {h:12,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:14,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:14,m:30,n:'FEC - Construcción',                                     t:'auto'},
    {h:15,m:30,n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:16,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:17,m:30,n:'Instructores Juicios Emitidos vs Programados',           t:'manual'},
    {h:18,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:20,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
  ],
  5:[ // VIERNES
    {h:2,m:0,  n:'Derechos Fundamentales en el Trabajo V3',                t:'auto'},
    {h:5,m:0,  n:'Generación de reportes',                                 t:'manual'},
    {h:6,m:30, n:'Generación de reportes de Etapa Productiva',             t:'manual'},
    {h:6,m:30, n:'Ejecución Meta Propia TIC 2026',                         t:'auto'},
    {h:7,m:0,  n:'Proyección Cupos - III Oferta Presencial y A Distancia', t:'auto'},
    {h:7,m:30, n:'Cargue reporte actualizado - Derechos Fundamentales V3', t:'manual'},
    {h:7,m:30, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:8,m:0,  n:'Ejecución de Metas 2026',                                t:'auto'},
    {h:8,m:0,  n:'Infografía DFP Regiones 2026',                           t:'auto'},
    {h:8,m:0,  n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:9,m:0,  n:'Programación Horas por Grupo',                           t:'manual'},
    {h:9,m:30, n:'Generación de reportes de Visualización de Etapa Productiva', t:'manual'},
    {h:9,m:30, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:10,m:30,n:'Infografía DFP Regiones 2026',                           t:'auto'},
    {h:12,m:0, n:'Indicadores de Programas de Formación Titulada desde el 2019', t:'auto'},
    {h:12,m:30,n:'Indicadores de Programas de Formación Complementaria desde el 2019', t:'auto'},
    {h:13,m:0, n:'Indicador 771 fichas correctamente programadas',         t:'manual'},
    {h:13,m:30,n:'Actualización de Etapa Productiva',                      t:'manual'},
    {h:14,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:14,m:30,n:'FEC - Construcción',                                     t:'auto'},
    {h:15,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:15,m:30,n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:16,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:16,m:30,n:'Indicador programación horas grupo en ejecución - Lectiva', t:'manual'},
    {h:17,m:30,n:'Lista de chequeo actualización semanal',                 t:'manual'},
    {h:18,m:0, n:'Seguimiento Inscritos Ofertas',                          t:'auto'},
    {h:19,m:30,n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
    {h:20,m:0, n:'Comportamiento del Proceso de Matrículas 2026',          t:'auto'},
  ],
};

const MONDAY_ONLY = [
  {h:3,m:0,  n:'Horas Instructor 2026',                    t:'auto',  extra:true},
  {h:10,m:0, n:'Indicador Horas Instructor - Contratista', t:'manual',extra:true},
  {h:10,m:30,n:'Indicador Horas Instructor - Planta',      t:'manual',extra:true},
];

// ── UTILIDADES ──────────────────────────────────────────
function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function alertTimestamp(h, m, type, baseDate) {
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  const ms = type === 'auto' ? 10 * 60 * 1000 : -20 * 60 * 1000;
  return d.getTime() + ms;
}

// ── CONSTRUIR ALERTAS DE HOY ─────────────────────────────
function buildAlerts(date) {
  const dow  = date.getDay();
  const dStr = toDateStr(date);

  if (HOLIDAYS[dStr]) return [];
  if (dow === 0 || dow === 6) return [];

  let items = [...(SCH[dow] || [])];

  if (dow === 2) {
    const yest = new Date(date);
    yest.setDate(yest.getDate() - 1);
    if (MONDAY_HOLIDAYS.includes(toDateStr(yest))) {
      items = [...items, ...MONDAY_ONLY];
    }
  }

  const now = Date.now();
  return items
    .map((it, i) => ({
      id:        `${dStr}-${i}`,
      name:      it.n,
      type:      it.t,
      timestamp: alertTimestamp(it.h, it.m, it.t, date),
    }))
    .filter(a => a.timestamp > now); // solo alertas futuras
}

// ── ESTADO ──────────────────────────────────────────────
let timers = [];
let midnightTimer = null;
let dismissed = new Set();

function clearTimers() {
  timers.forEach(clearTimeout);
  timers = [];
  if (midnightTimer) { clearTimeout(midnightTimer); midnightTimer = null; }
}

// ── PROGRAMAR ALERTAS ───────────────────────────────────
function scheduleToday() {
  clearTimers();
  const today  = new Date();
  const alerts = buildAlerts(today);

  alerts.forEach(alert => {
    const delay = alert.timestamp - Date.now();
    if (delay > 0 && delay < 26 * 60 * 60 * 1000) {
      const t = setTimeout(() => {
        if (!dismissed.has(alert.id)) fireNotification(alert);
      }, delay);
      timers.push(t);
    }
  });

  // Reprogramar a medianoche para el día siguiente
  const tomorrow = new Date();
  tomorrow.setHours(24, 0, 5, 0); // 12:00:05 a.m.
  midnightTimer = setTimeout(scheduleToday, tomorrow - Date.now());
}

// ── DISPARAR NOTIFICACIÓN ───────────────────────────────
function fireNotification(alert) {
  const isAuto = alert.type === 'auto';
  self.registration.showNotification(
    isAuto ? '✅ Verificar panel automático' : '🟣 Ejecutar tarea manual ahora',
    {
      body:             alert.name,
      tag:              alert.id,
      requireInteraction: true,
      icon:             './icon.svg',
      badge:            './icon.svg',
      vibrate:          isAuto ? [200, 80, 200] : [300, 100, 300, 100, 300],
      data:             { id: alert.id, type: alert.type, name: alert.name },
      actions: [
        { action: 'done',   title: '✓ Verificado' },
        { action: 'snooze', title: '⏰ +10 min'   },
      ],
    }
  );
}

// ── CLICKS EN NOTIFICACIÓN ──────────────────────────────
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const data = e.notification.data || {};

  if (e.action === 'done') {
    dismissed.add(data.id);

  } else if (e.action === 'snooze') {
    const snoozed = { ...data, timestamp: Date.now() + 10 * 60 * 1000 };
    const t = setTimeout(() => fireNotification(snoozed), 10 * 60 * 1000);
    timers.push(t);

  } else {
    // Abrir la app
    e.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
        const open = cs.find(c => c.url.includes('index') || c.url.endsWith('/'));
        if (open) return open.focus();
        return clients.openWindow('./');
      })
    );
  }
});

// ── INSTALL / ACTIVATE ──────────────────────────────────
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim().then(() => scheduleToday()));
});

// ── MENSAJES DESDE LA PÁGINA ────────────────────────────
self.addEventListener('message', (e) => {
  if (!e.data) return;
  switch (e.data.type) {
    case 'PING':
      // keepalive — responder para que la página sepa que el SW está vivo
      e.source && e.source.postMessage({ type: 'PONG' });
      break;
    case 'RESCHEDULE':
      scheduleToday();
      break;
    case 'DISMISS':
      dismissed.add(e.data.id);
      break;
  }
});

// ── BACKGROUND SYNC (respaldo) ───────────────────────────
self.addEventListener('sync', (e) => {
  if (e.tag === 'reschedule') e.waitUntil(scheduleToday());
});
