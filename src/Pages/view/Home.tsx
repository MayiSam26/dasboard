import React, { useEffect } from "react";
import Header from "../components/Header";
import Body from "../components/Layout/Body";
import Content from "../components/Layout/Content";
import Layout from "../components/Layout/Index";
import Navar from "../components/Navar";
import CheckAuthentication from "../../Config/Private";
import { useNavigate } from "react-router-dom";


export default function HomePanel(){
    const[user,userName] = React.useState<any>("")
    useEffect(
        () =>{
            userName(localStorage.getItem("user"))
        },[user]
    )
    const navigate = useNavigate(); // Usa useNavigate si necesitas redireccionar
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/'); // Redirige a la página de inicio si no hay token
        }
    }, [navigate]);
    return(
        <>
            <Layout>
                <Navar />
                <Content>
                    <Header />
                    <Body>
                        <div style={{
                            display:'flex',
                            justifyContent:'center',
                            width:'100%',
                            flexDirection:'column'
                        }}>
                              <h1 style={{textAlign:'center',fontWeight:400}} >Sistema de Colitas & Amor</h1>
                              
                              <h1 style={{textAlign:'center',fontWeight:400}}>
                                Bienvenido <span style={{fontWeight:700,color:'#64C27A'}}>{user}</span>
                              </h1>
                        </div>
                      
                        <div style={{display:"flex",justifyContent:'center'}}>
                            <img src="images/welcome.png" alt="welcome" />
                        </div>
                    </Body>
                </Content>
            </Layout>
        </>
    )
}