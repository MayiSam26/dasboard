import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";

// Alta de un canal de donación (Yape, Plin, PayPal...). Los nombres de las
// columnas vienen de cuando la tabla era de "planes mensuales": "cantidad"
// guarda la URL del logo y "content" los datos de la cuenta. Las etiquetas de
// este formulario dicen lo que el campo realmente es.
interface props {
    setFlask:any,
    setOpenModal:any
    getPlanesMensual:() => void
}
export default function Agregar({setFlask,setOpenModal,getPlanesMensual}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[logoUrl,setLogoUrl] = React.useState<any>("")
    const[detalleUno,setDetalleUno] = React.useState<any>("")
    const[detalledos,setDetalleDos] = React.useState<any>("")
    const[detalletres,setDetalleTres] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const createPlanMensual = async () => {
        const detalle : any[] = []
        if(detalleUno){
          detalle.push({ id:1, name:detalleUno })
        }
        if(detalledos){
          detalle.push({ id:2, name:detalledos })
        }
        if(detalletres){
          detalle.push({ id:3, name:detalletres })
        }

        if (nombre === '') {
            setSeverity('error');
            setMssg('Indica el canal (por ejemplo Yape, Plin o PayPal).');
            setOpenAlert(true);
            return;
        }
        if (!logoUrl) {
            setSeverity('error');
            setMssg('Falta la URL del logo del canal.');
            setOpenAlert(true);
            return;
        }
        if (detalle.length === 0) {
            setSeverity('error');
            setMssg('Agrega al menos un dato de la cuenta (número o enlace).');
            setOpenAlert(true);
            return;
        }

        const url =  baseurl+'plan-mensual/create'
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('cantidad', logoUrl);
        formData.append('content', JSON.stringify(detalle));
        try {
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
        } catch (e: any) {
          setSeverity('error');
          setMssg(e?.response?.data?.message || e.message || 'No se pudo guardar.');
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
                                        Nuevo canal de donación
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
                                    Guardar
                                </Button>
                            </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField
                                label="Canal (Yape, Plin, PayPal...)"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={nombre ?? ""}
                                onChange={(e) => setNombre(e.target.value)}
                             />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField
                                label="URL del logo del canal"
                                helperText="Es la imagen que se muestra en la tarjeta del sitio público."
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={logoUrl ?? ""}
                                onChange={(e) => setLogoUrl(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField
                                label="Dato de la cuenta 1 (número o enlace)"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={detalleUno ?? ""}
                                onChange={(e) => setDetalleUno(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField
                                label="Dato de la cuenta 2 (opcional)"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={detalledos ?? ""}
                                onChange={(e) => setDetalleDos(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField
                                label="Dato de la cuenta 3 (opcional)"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={detalletres ?? ""}
                                onChange={(e) => setDetalleTres(e.target.value)}
                            />
                        </Grid>
                    </Grid>
            </Grid>
        </>
    )
}
