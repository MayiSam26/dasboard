import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment, Suspense, lazy } from "react";
import Home from "../Pages";
import RecuperarClave from "../Pages/RecuperarClave";

import PrivateRoute from "./PrivateRoute";

// Cada módulo del panel se carga solo cuando se visita (code splitting por
// ruta): el login y el sitio público no necesitan pagar el costo de bundle
// de las ~18 pantallas del panel administrativo si nunca se abren.
const HomePanel = lazy(() => import("../Pages/view/Home"));
const RedesSocial = lazy(() => import("../Pages/view/Social/RedesSocial"));
const Intial = lazy(() => import("../Pages/view/Initial/Intial"));
const Planes = lazy(() => import("../Pages/view/Adoptante/Planes"));
const Egreso = lazy(() => import("../Pages/view/Egreso/Egreso"));
const Donante = lazy(() => import("../Pages/view/Donante/Donante"));
const Adoptante = lazy(() => import("../Pages/view/Adoptantes/Adoptante"));
const Colitas = lazy(() => import("../Pages/view/Colitas/Colitas"));
const Adopcion = lazy(() => import("../Pages/view/Adopciones/Adopcion"));
const Entrevista = lazy(() => import("../Pages/view/Entrevista/Entrevista"));
const Seguimiento = lazy(() => import("../Pages/view/Seguimiento/Seguimiento"));
const Usuarios = lazy(() => import("../Pages/view/Usuarios/Usuarios"));
const Reportes = lazy(() => import("../Pages/view/Reportes/Reportes"));
const Noticias = lazy(() => import("../Pages/view/Noticias/Noticias"));
const Ingresos = lazy(() => import("../Pages/view/Ingresos/Ingresos"));
const Amo = lazy(() => import("../Pages/view/Amo/Amo"));
const Perdidos = lazy(() => import("../Pages/view/Perdidos/Perdidos"));
const MiCuenta = lazy(() => import("../Pages/view/MiCuenta/MiCuenta"));

function PanelFallback() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      Cargando...
    </div>
  );
}

export function RoutesApp() {
  const isAuth = Boolean(localStorage.getItem("token"));

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
              <Route path="/panel/noticias" element={<Noticias />} />
              <Route path="/panel/ingresos" element={<Ingresos />} />
              <Route path="/panel/apoderado" element={<Amo />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Fragment>
  );
}
