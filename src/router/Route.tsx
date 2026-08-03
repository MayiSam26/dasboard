import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Fragment } from "react";
import Home from "../Pages";
import HomePanel from "../Pages/view/Home";
import RedesSocial from "../Pages/view/Social/RedesSocial";
import Intial from "../Pages/view/Initial/Intial";
import Planes from "../Pages/view/Adoptante/Planes";
import Egreso from "../Pages/view/Egreso/Egreso";
import Donante from "../Pages/view/Donante/Donante";
import Adoptante from "../Pages/view/Adoptantes/Adoptante";
import Colitas from "../Pages/view/Colitas/Colitas";
import Adopcion from "../Pages/view/Adopciones/Adopcion";
import Entrevista from "../Pages/view/Entrevista/Entrevista";
import Seguimiento from "../Pages/view/Seguimiento/Seguimiento";
import Usuarios from "../Pages/view/Usuarios/Usuarios";
import Reportes from "../Pages/view/Reportes/Reportes";
import Ingresos from "../Pages/view/Ingresos/Ingresos";
import Amo from "../Pages/view/Amo/Amo";
import Perdidos from "../Pages/view/Perdidos/Perdidos";
import RecuperarClave from "../Pages/RecuperarClave";
import MiCuenta from "../Pages/view/MiCuenta/MiCuenta";

import PrivateRoute from "./PrivateRoute";

export function RoutesApp() {
  const isAuth = Boolean(localStorage.getItem("token"));

  return (
    <Fragment>
      <BrowserRouter>
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
            <Route path="/panel/ingresos" element={<Ingresos />} />
            <Route path="/panel/apoderado" element={<Amo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}