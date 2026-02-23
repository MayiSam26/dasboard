import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";


export default function Header(){
    const[user,userName] = useState<any>("")
    useEffect(
        () =>{
            userName(localStorage.getItem("user"))
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
        verifyToken()
    }
    return(<>
            <div className="navbar-custom">
                        <ul className="list-unstyled topbar-menu float-end mb-0">
                            

                            <li className="dropdown notification-list">
                                <Link  className="nav-link dropdown-toggle nav-user arrow-none me-0"
                                     data-bs-toggle="dropdown" 
                                     to="#" role="button" 
                                     aria-haspopup="false" 
                                     aria-expanded="false"
                                     style={{display:'flex',alignItems:'center'}}
                                >
                                    <span className="account-user-avatar"> 
                                        <img src="../images/usuario.png" alt="user-image" className="rounded-circle" />
                                    </span>
                                    <span>
                                        <span className="account-user-name">{user}</span>
                                    </span>
                                </Link>
                                <div className="dropdown-menu dropdown-menu-end dropdown-menu-animated topbar-dropdown-menu profile-dropdown">
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