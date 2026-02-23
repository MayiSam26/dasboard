import { BrowserRouter, Routes ,Route} from "react-router-dom";
import App from "../App";
import { routes } from "./Router";
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
import Apadrinado from "../Pages/view/Apadrinado/Apadrinado";
import Ingresos from "../Pages/view/Ingresos/Ingresos";
import Amo from "../Pages/view/Amo/Amo";
import Perdidos from "../Pages/view/Perdidos/Perdidos";

export  function RoutesApp(){
    return(
        <Fragment>
                 <BrowserRouter>
                    <Routes>
                        <Route path={"/"} element={<Home />}/>
                        <Route path={"/panel"} element={<HomePanel />}/>
                        <Route path={"/panel/redes-social"} element={<RedesSocial />}/>
                        <Route path={"/panel/informacion-pages"} element={<Intial />}/>
                        <Route path={"/panel/informacion-adoptante"} element={<Planes />}/>
                        <Route path={"/panel/egreso"} element={<Egreso />}/>
                        <Route path={"/panel/donante"} element={<Donante />}/>
                        <Route path={"/panel/adoptante"} element={<Adoptante />}/>
                        <Route path={"/panel/colitas"} element={<Colitas />}/>
                        <Route path={"/panel/perdidos"} element={<Perdidos />}/>
                        <Route path={"/panel/adopcion"} element={<Adopcion />}/>
                        <Route path={"/panel/apadrinado"} element={<Apadrinado />}/>
                        <Route path={"/panel/ingresos"} element={<Ingresos />}/>
                        <Route path={"/panel/apoderado"} element={<Amo />}/>
                        <Route path={"/panel/perdidos"} element={<Perdidos />}/>
                    </Routes>
            </BrowserRouter>
        </Fragment>
    )
}