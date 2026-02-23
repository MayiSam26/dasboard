import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import { isNull } from "util";
import { isNullishCoalesce } from "typescript";
import { deflate } from "zlib";
 
interface props {
    setFlask:any,
    setOpenModal:any
    getPlanesMensual:() => void
}
export default function Agregar({setFlask,setOpenModal,getPlanesMensual}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[precio,setPrecio] = React.useState<any>(null)
    const[file,setFile] = React.useState<any>("")
    const[detalleUno,setDetalleUno] = React.useState<any>("")
    const[detalledos,setDetalleDos] = React.useState<any>("")
    const[detalletres,setDetalleTres] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

   
    const createPlanMensual = async () => {
        const detalle : any[] = []
        if(detalleUno){
          detalle.push({
              id:1,
              name:detalleUno
          })
        }
        if(detalledos){
          detalle.push({
              id:2,
              name:detalledos
          })
        }

        if(detalletres){
          detalle.push({
              id:3,
              name:detalletres
          })
        }
         
       
        
        const url =  baseurl+'plan-mensual/create'
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('iduser', '');
        formData.append('cantidad', precio);
        formData.append('content', JSON.stringify(detalle));
        if (file) {
          formData.append('img', file);
        }
        
        if (nombre === '') {
            setSeverity('error');
            setMssg('El campo nombre requerido');
            setOpenAlert(true);
            return;
        }
        if (!precio) {
            setSeverity('error');
            setMssg('El campo precio requerido');
            setOpenAlert(true);
            return;
        }
        if (!file) {
            setSeverity('error');
            setMssg('debes subir imagen');
            setOpenAlert(true);
            return;
        }
        if(nombre === '' &&  precio === '' && !file){
            setSeverity('error');
            setMssg('Los campos nombre,precio y imagen son requeridos');
            setOpenAlert(true);
            return;
        }
        const response :any = (await axios.post(url, formData));
        const {data} = response
        if(data.code === '000'){
          setSeverity('success');
          setMssg(data.message);
          setOpenAlert(true);
          getPlanesMensual()
          setTimeout(() =>{
              setOpenModal(false)
          },1800)
        }else{
            setSeverity('error');
            setMssg(data.message);
            setOpenAlert(true);
        }
      
      }
    
    const alert = () =>{
        return(
            <Alert variant="filled" severity={severity}>
                {mssg}
            </Alert>
        )
    }
    return(
        <>
            {openAlert?alert():null}
            <Grid container spacing={2} sx={{py:1,px:2}}>
                    <Grid item xs={12} sx={{display:'flex'}}>
                        <Grid item xs={10}>
                                <Typography variant="h5">
                                        Crear Nuevo Plan
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                    onClick={createPlanMensual}
                                    fullWidth
                                    variant="contained" sx={{
                                    background:'#65c178',
                                    fontWeight:'bolder',
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        background: '#ed6436', 
                                    },
                                    }}>
                                    Save
                                </Button>
                            </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic"
                                label="Ingrese Nombre" 
                                variant="outlined"
                                fullWidth
                                size="small"
                                onChange={(e) => setNombre(e.target.value)}
                             />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese Precio" 
                                variant="outlined"
                                type='number'
                                fullWidth
                                size="small"
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese beneficio 1" 
                                variant="outlined"
                                fullWidth
                                size="small"
                                onChange={(e) => setDetalleUno(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese beneficio 2" 
                                variant="outlined"
                                fullWidth
                                size="small"
                                onChange={(e) => setDetalleDos(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese beneficio 3" 
                                variant="outlined"
                                fullWidth
                                size="small"
                                onChange={(e) => setDetalleTres(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <input 
                                type="file"
                                style={{ 
                                    border:'1px solid #c2c2c2',
                                    padding:'8px',
                                    width:'100%',
                                    borderRadius:'4px'
                                }}
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            />
                        </Grid>
                    </Grid>
            </Grid>
        </>
    )
}