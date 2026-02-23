import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import { UserSessionContext } from "../Config/Context";
import axios from "axios";
import baseurl from "../Config/axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import formatlocaldate from "../Config/helpersDate";

export default function Home() {
  const navigate = useNavigate()
    const { login } = useContext(UserSessionContext);
    const[usuario,setUsuario] = useState<any>("")
    const[pass,setPass] = useState<any>("")
    const [showPassword, setShowPassword] = React.useState<any>(false);
    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const handleLogin = async () => {
      try {
        const body = {
          usuario:usuario,
          pass:pass
        }
       
        const url = baseurl+"session-user"
        const response = await axios.post(url, body);
        const{data} = response
    
      if (data.token) {
        localStorage.setItem("token",data.token);
        localStorage.setItem("user",data.usuario);
      }
      if(data.code === '000'){
        saveAuditoria()
        navigate("/panel")
      }else{
        setOpenAlert(true)
        setSeverity('error')
        setMssg(data.message)
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
     
    }
    };
  
    const saveAuditoria = async() =>{
      const fecha = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')

      const body = {
        fechaInicio:formatlocaldate(new Date()),
        modulo:"",
        fechaRegistro:fecha,
        resultado:null
      }
     
      const url = baseurl+"auditoria"
      const response = await axios.post(url, body);
      const{data} = response
      localStorage.setItem("auditoria",data.data.idauditoria)
    }

    const handleClickShowPassword = () => setShowPassword((show:any) => !show);
  
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    const alert = () =>{
      return(
          <Alert variant="filled" severity={severity}>
              {mssg}
          </Alert>
      )
  }
  return (
    <>
      <div className="account-pages pt-2 pt-sm-5 pb-4 pb-sm-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xxl-4 col-lg-5">
            {openAlert?alert():null}
              <div className="card">
                <div 
                    className="card-header pt-4 pb-4 text-center"
                    style={{
                        backgroundImage:'url(images/heros.png)',objectFit:'cover',backgroundPosition:'center'}}
                >
                </div>

                <div className="card-body p-4">
                  <div className="text-center w-75 m-auto">
                    <h4 className="text-dark-50 text-center pb-0 fw-bold">
                      Inicio de session
                    </h4>
                    <p className="text-muted mb-4">
                      Ingresa tu usuario y contraseña para ingresar al panel
                    </p>
                  </div>

                  <form action="#">
                    <div className="mb-3">
                      <label className="form-label">Usuario</label>
                      <TextField
                        className="form-control"
                        id="outlined-basic"
                        size="small"
                        label="Ingresar Usuario"
                        variant="outlined"
                        onChange={(e) =>setUsuario(e.target.value)}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <div className="input-group input-group-merge">
                        
                        <FormControl
                          sx={{ width: "100%" }}
                          variant="outlined"
                        >
                          <InputLabel htmlFor="outlined-adornment-password">
                            Contraseña
                          </InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-password"
                            size='small'
                            type={showPassword ? "text" : "password"}
                            onChange={(e) => setPass(e.target.value)}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <VisibilityOff />
                                  ) : (
                                    <Visibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            label="Contraseña"
                          />
                        </FormControl>
                      </div>
                    </div>

                    <div className="mb-3 mb-0 text-center">
                      <Button onClick={() => handleLogin()} variant="contained" sx={{textTransform:'capitalize'}}>
                            Iniciar Session
                      </Button>
                    </div>
                  </form>
                </div>
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
