import { Alert, Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
 
interface props {
    setFlask?:any
    setOpenModalEdit?:any
    idPlanMensual?:any
    getPlanesMensual:() =>void
}
export default function Editar({setFlask,setOpenModalEdit,idPlanMensual,getPlanesMensual}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[precio,setPrecio] = React.useState<any>("")
    const[link,setLik] = React.useState<any>("")
    const[detallesUno,setDetallesUno] = React.useState<any>("")
    const[detallesDos,setDetallesDos] = React.useState<any>("")
    const[detallesTres,setDetallesTres] = React.useState<any>("")
    const[file,setFile] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const getById = async() =>{
        const url = baseurl+'plan-mensual/detail/'+idPlanMensual
        axios.get(url)
        .then(response => {
            const {data} = response
            setNombre(data.data.nombre)
            setPrecio(data.data.cantidad)
            setLik(data.data.img)
            const detail :any[] = JSON.parse(data.data.content)

            setDetallesUno(detail[0]?detail[0].name:'')
            setDetallesDos(detail[1]?detail[1].name:'')
            setDetallesTres(detail[2]?detail[2].name:'')
        })
    }
    useEffect(() =>{
        getById()
    },[])
	
    const updatePlanMensual = async () =>{
        const detalle : any[] = []
        if(detallesUno){
          detalle.push({
              id:1,
              name:detallesUno
          })
        }
        if(detallesDos){
          detalle.push({
              id:2,
              name:detallesDos
          })
        }

        if(detallesTres){
          detalle.push({
              id:3,
              name:detallesTres
          })
        }
        const url = baseurl + 'plan-mensual/update/' + idPlanMensual;
        if (file) {
            
            const formData = new FormData();
            formData.append('img', file); 
    
            try {
                const uploadResponse : any= await axios.post(url, formData);
                const{data} = uploadResponse
                if (data.code === '000') {
                    setSeverity('success');
                    setMssg(data.message);
                    setOpenAlert(true);
                    setTimeout(() => {
                        setOpenModalEdit(false);
                        getPlanesMensual();
                    }, 1800);
                } else {
                    setSeverity('error');
                    setMssg(data.message);
                    setOpenAlert(true);
                }
            } catch (err) {
                console.error('Error al subir la imagen:', err);
            }
           
        }else{
            const dataToSend = {
                nombre: nombre,
                iduser: '',
                cantidad: precio,
                content: JSON.stringify(detalle),
            };
    
            // Verificar campos obligatorios
            if (nombre === '' || !precio || (!file && nombre === '' && !precio)) {
                setSeverity('error');
                setMssg('Los campos nombre, precio e imagen son requeridos');
                setOpenAlert(true);
                return;
            }
    
            // Enviar solicitud con axios
         
            const response = await axios.post(url, dataToSend);
            const { data } = response;
        
    
            if (data.code === '000') {
                setSeverity('success');
                setMssg(data.message);
                setOpenAlert(true);
                setTimeout(() => {
                    setOpenModalEdit(false);
                    getPlanesMensual();
                }, 1800);
            } else {
                setSeverity('error');
                setMssg(data.message);
                setOpenAlert(true);
            }
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
                                        Editar Plan
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                    onClick={updatePlanMensual}
                                    fullWidth
                                    variant="contained" sx={{
                                    background:'#65c178',
                                    fontWeight:'bolder',
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        background: '#ed6436', 
                                    },
                                    }}>
                                    Actualizar
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
                                value={nombre ?? ""}
                                onChange={(e) => setNombre(e.target.value)}
                             />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                    id="outlined-basic"
                                    label="Ingrese Precio" 
                                    variant="outlined"
                                    fullWidth
                                    type="number"
                                    size="small"
                                    value={precio ?? ""}
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
                                value={detallesUno ?? ""}
                                onChange={(e) => setDetallesUno(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese beneficio 2" 
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={detallesDos ?? ""}
                                onChange={(e) => setDetallesDos(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese beneficio 3" 
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={detallesTres ?? ""}
                                onChange={(e) => setDetallesTres(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese URL de la imagen" 
                                variant="outlined" 
                                fullWidth
                                size="small"
                                value={link ?? ""}
                                onChange={(e) => setLik(e.target.value)}
                                disabled
                            />
                             <img src={baseurl+link} width="100px" style={{padding:'10px',border:'1px solid #c2c2c2'}}/>
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