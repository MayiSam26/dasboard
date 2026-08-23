import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment, Suspense, lazy, useEffect, useState } from "react";
import Home from "../Pages";
import RecuperarClave from "../Pages/RecuperarClave";

import PrivateRoute from "./PrivateRoute";
import { moduleLoaders, precargarModulosEnReposo } from "./lazyModules";

// Cada módulo del panel se carga solo cuando se visita (code splitting por
// ruta): el login y el sitio público no necesitan pagar el costo de bundle
// de las ~18 pantallas del panel administrativo si nunca se abren. Los
// loaders viven en lazyModules.ts para poder precargarlos desde el menú.
const HomePanel = lazy(moduleLoaders["/panel"]);
const RedesSocial = lazy(moduleLoaders["/panel/redes-social"]);
const Intial = lazy(moduleLoaders["/panel/informacion-pages"]);
const Planes = lazy(moduleLoaders["/panel/informacion-adoptante"]);
const Egreso = lazy(moduleLoaders["/panel/egreso"]);
const Donante = lazy(moduleLoaders["/panel/donante"]);
const Adoptante = lazy(moduleLoaders["/panel/adoptante"]);
const Colitas = lazy(moduleLoaders["/panel/colitas"]);
const Adopcion = lazy(moduleLoaders["/panel/adopcion"]);
const Entrevista = lazy(moduleLoaders["/panel/entrevistas"]);
const Seguimiento = lazy(moduleLoaders["/panel/seguimiento"]);
const Usuarios = lazy(moduleLoaders["/panel/usuarios"]);
const Reportes = lazy(moduleLoaders["/panel/reportes"]);
const Auditoria = lazy(moduleLoaders["/panel/auditoria"]);
const Noticias = lazy(moduleLoaders["/panel/noticias"]);
const Ingresos = lazy(moduleLoaders["/panel/ingresos"]);
const Amo = lazy(moduleLoaders["/panel/apoderado"]);
const Perdidos = lazy(moduleLoaders["/panel/perdidos"]);
const MiCuenta = lazy(moduleLoaders["/panel/mi-cuenta"]);
const Veterinaria = lazy(moduleLoaders["/panel/veterinaria"]);
const Permisos = lazy(moduleLoaders["/panel/permisos"]);
const Apadrinado = lazy(moduleLoaders["/panel/apadrinado"]);
const Voluntariado = lazy(moduleLoaders["/panel/voluntariado"]);

// El indicador espera un cuarto de segundo antes de aparecer. Con los módulos
// ya precargados el cambio de pantalla es casi instantáneo, y mostrar un
// "Cargando..." por dos cuadros de animación se veía como un parpadeo. Si de
// verdad tarda (primera visita, red lenta), el aviso igual aparece.
function PanelFallback() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 250);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        color: "var(--cya-muted, #6c757d)",
        fontFamily: "inherit",
      }}
    >
      Cargando...
    </div>
  );
}

export function RoutesApp() {
  const isAuth = Boolean(localStorage.getItem("token"));

  // Con la sesión iniciada, el resto de pantallas se van bajando solas en los
  // ratos muertos para que moverse por el menú no tenga espera.
  useEffect(() => {
    if (!isAuth) return;
    precargarModulosEnReposo([window.location.pathname]);
  }, [isAuth]);

  return (
    <Fragment>
      <BrowserRouter>
        <Suspense fallback={<PanelFallback />}>
          <Routes>
            {/* PUBLICA */}
            <Route path="/" element={<Home />} />
            <Route path="/recuperar-clave" element={<RecuperarClave />} />

            {/* PROTEGIDAS */}
            <Route element={<PrivateRoute isAuth={isAuth} />}>
              <Route path="/panel" element={<HomePanel />} />
              <Route path="/panel/mi-cuenta" element={<MiCuenta />} />
              <Route path="/panel/redes-social" element={<RedesSocial />} />
              <Route path="/panel/informacion-pages" element={<Intial />} />
              <Route path="/panel/informacion-adoptante" element={<Planes />} />
              <Route path="/panel/egreso" element={<Egreso />} />
              <Route path="/panel/donante" element={<Donante />} />
              <Route path="/panel/adoptante" element={<Adoptante />} />
              <Route path="/panel/colitas" element={<Colitas />} />
              <Route path="/panel/perdidos" element={<Perdidos />} />
              <Route path="/panel/adopcion" element={<Adopcion />} />
              <Route path="/panel/entrevistas" element={<Entrevista />} />
              <Route path="/panel/seguimiento" element={<Seguimiento />} />
              <Route path="/panel/usuarios" element={<Usuarios />} />
              <Route path="/panel/reportes" element={<Reportes />} />
              <Route path="/panel/auditoria" element={<Auditoria />} />
              <Route path="/panel/noticias" element={<Noticias />} />
              <Route path="/panel/ingresos" element={<Ingresos />} />
              <Route path="/panel/apoderado" element={<Amo />} />
              <Route path="/panel/veterinaria" element={<Veterinaria />} />
              <Route path="/panel/permisos" element={<Permisos />} />
              <Route path="/panel/apadrinado" element={<Apadrinado />} />
              <Route path="/panel/voluntariado" element={<Voluntariado />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Fragment>
  );
}
