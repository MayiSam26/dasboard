// Carga diferida de las pantallas del panel, en un solo lugar para que tanto
// las rutas como el menú lateral usen exactamente los mismos "loaders".
//
// El panel divide su código por pantalla (code splitting): abrir un módulo por
// primera vez descarga su archivo y, si es la primera tabla o el primer
// gráfico de la sesión, también las librerías compartidas (~560 KB entre la
// grilla y los gráficos). Eso es lo que hacía aparecer el "Cargando...".
// Aquí se precargan esos archivos mientras el navegador está ocioso, de modo
// que al momento de cambiar de módulo ya estén en caché.

type Loader = () => Promise<{ default: React.ComponentType<any> }>;

export const moduleLoaders: Record<string, Loader> = {
  "/panel": () => import("../Pages/view/Home"),
  "/panel/mi-cuenta": () => import("../Pages/view/MiCuenta/MiCuenta"),
  "/panel/redes-social": () => import("../Pages/view/Social/RedesSocial"),
  "/panel/informacion-pages": () => import("../Pages/view/Initial/Intial"),
  "/panel/informacion-adoptante": () => import("../Pages/view/Adoptante/Planes"),
  "/panel/egreso": () => import("../Pages/view/Egreso/Egreso"),
  "/panel/donante": () => import("../Pages/view/Donante/Donante"),
  "/panel/adoptante": () => import("../Pages/view/Adoptantes/Adoptante"),
  "/panel/colitas": () => import("../Pages/view/Colitas/Colitas"),
  "/panel/perdidos": () => import("../Pages/view/Perdidos/Perdidos"),
  "/panel/adopcion": () => import("../Pages/view/Adopciones/Adopcion"),
  "/panel/entrevistas": () => import("../Pages/view/Entrevista/Entrevista"),
  "/panel/seguimiento": () => import("../Pages/view/Seguimiento/Seguimiento"),
  "/panel/usuarios": () => import("../Pages/view/Usuarios/Usuarios"),
  "/panel/reportes": () => import("../Pages/view/Reportes/Reportes"),
  "/panel/auditoria": () => import("../Pages/view/Auditoria/Auditoria"),
  "/panel/noticias": () => import("../Pages/view/Noticias/Noticias"),
  "/panel/ingresos": () => import("../Pages/view/Ingresos/Ingresos"),
  "/panel/apoderado": () => import("../Pages/view/Amo/Amo"),
  "/panel/veterinaria": () => import("../Pages/view/Veterinaria/Veterinaria"),
  "/panel/permisos": () => import("../Pages/view/Usuarios/Permisos"),
  "/panel/apadrinado": () => import("../Pages/view/Apadrinado/Apadrinado"),
  "/panel/voluntariado": () => import("../Pages/view/Voluntariado/Voluntariado"),
};

// Un módulo ya pedido no se vuelve a pedir: el navegador cachea el archivo,
// pero así evitamos también encolar promesas de más.
const yaPedidos = new Set<string>();

/** Adelanta la descarga de un módulo (al pasar el mouse por el menú). */
export function precargarModulo(path: string) {
  const loader = moduleLoaders[path];
  if (!loader || yaPedidos.has(path)) return;
  yaPedidos.add(path);
  loader().catch(() => yaPedidos.delete(path)); // si falla, se reintenta al navegar
}

const idle: (cb: () => void) => void =
  typeof window !== "undefined" && "requestIdleCallback" in window
    ? (cb) => (window as any).requestIdleCallback(cb, { timeout: 2500 })
    : (cb) => window.setTimeout(cb, 300);

/**
 * Descarga en segundo plano el resto de pantallas, de a una y solo cuando el
 * navegador no tiene nada mejor que hacer, para que cambiar de módulo sea
 * inmediato. Se omite si el usuario pidió ahorrar datos o está en una red
 * lenta: ahí conviene bajar solo lo que realmente abra.
 */
export function precargarModulosEnReposo(prioridad: string[] = []) {
  const conexion = (navigator as any).connection;
  if (conexion?.saveData) return;
  if (/2g/.test(conexion?.effectiveType || "")) return;

  const pendientes = [
    ...prioridad.filter((p) => moduleLoaders[p]),
    ...Object.keys(moduleLoaders).filter((p) => !prioridad.includes(p)),
  ];

  const siguiente = () => {
    const path = pendientes.shift();
    if (!path) return;
    precargarModulo(path);
    idle(siguiente);
  };
  idle(siguiente);
}
