import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { setAuthHeader } from "../../Config/axiosSetup";
import baseurl from "../../Config/axios";
import NotificationBell from "./NotificationBell";

function buildImgUrl(foto: string) {
    const cleanBase = baseurl.replace(/\/+$/, "");
    const cleanFoto = (foto || "").replace(/\\/g, "/").replace(/^\/+/, "");
    return `${cleanBase}/${cleanFoto}`;
}

export default function Header(){
    const[user,userName] = useState<any>("")
    const[foto,setFoto] = useState<any>("")
    useEffect(
        () =>{
            userName(localStorage.getItem("user"))
            setFoto(localStorage.getItem("userFoto"))
        },[user]
    )

    const navigate = useNavigate(); // Usa useNavigate si necesitas redireccionar
    const verifyToken = () =>{
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirige a la página de inicio si no hay token
        }
    }
    const logout = () =>{
        localStorage.removeItem("token")
        localStorage.removeItem("auditoria")
        localStorage.removeItem("userFoto")
        setAuthHeader(null)
        verifyToken()
    }
    return(<>
            <div className="navbar-custom" style={{ display: "flex", alignItems: "center" }}>
                        <ul
                            className="list-unstyled topbar-menu float-end mb-0"
                            style={{ display: "flex", alignItems: "center", height: "100%" }}
                        >

                            <li className="dropdown notification-list" style={{ display: "flex", alignItems: "center" }}>
                                <NotificationBell />
                            </li>

                            <li className="dropdown notification-list">
                                <Link  className="nav-link dropdown-toggle nav-user arrow-none me-0"
                                     data-bs-toggle="dropdown" 
                                     to="#" role="button" 
                                     aria-haspopup="false" 
                                     aria-expanded="false"
                                     style={{display:'flex',alignItems:'center'}}
                                >
                                    <span className="account-user-avatar">
                                        <img
                                            src={foto ? buildImgUrl(foto) : "../images/usuario.png"}
                                            alt="user-image"
                                            className="rounded-circle"
                                            style={{ objectFit: "cover" }}
                                        />
                                    </span>
                                    <span>
                                        <span className="account-user-name">{user}</span>
                                    </span>
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
                                    <Link to="/panel/mi-cuenta" className="dropdown-item notify-item">
                                        <i className="mdi mdi-account-circle me-1"></i>
                                        <span style={{color:'black',textTransform:'capitalize'}}>Mi cuenta</span>
                                    </Link>
                                    <Button
                                    onClick={() => logout()}
                                    className="dropdown-item notify-item">
                                        <i className="mdi mdi-logout me-1"></i>
                                        <span style={{color:'black',textTransform:'capitalize'}}>Salir</span>
                                    </Button>
                                </div>
                            </li>

                        </ul>
                        <button className="button-menu-mobile open-left">
                            <i className="mdi mdi-menu"></i>
                        </button>
                    </div>
    </>)
}