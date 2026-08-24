import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";

// Edición de un canal de donación (Yape, Plin, PayPal...). Antes este
// formulario pasaba la URL del logo por un sanitizador numérico: bastaba con
// tocar el campo para dejarlo en dígitos y romper la imagen del sitio público.
// Además, si se subía un archivo, mandaba solo la imagen y descartaba el
// nombre y los datos de la cuenta. Ahora se envía siempre todo junto.
interface props {
    setFlask?:any
    setOpenModalEdit?:any
    idPlanMensual?:any
    getPlanesMensual:() =>void
}
export default function Editar({setFlask,setOpenModalEdit,idPlanMensual,getPlanesMensual}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[logoUrl,setLogoUrl] = React.useState<any>("")
    const[detallesUno,setDetallesUno] = React.useState<any>("")
    const[detallesDos,setDetallesDos] = React.useState<any>("")
    const[detallesTres,setDetallesTres] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const getById = async(id:any) =>{
        const url = baseurl+'plan-mensual/detail/'+id
        axios.get(url)
        .then(response => {
            const {data} = response
            setNombre(data.data.nombre)
            setLogoUrl(data.data.cantidad)
            let detail :any[] = []
            try {
                detail = typeof data.data.content === "string"
                    ? JSON.parse(data.data.content)
                    : (data.data.content || [])
            } catch {
                detail = []
            }
            setDetallesUno(detail[0]?detail[0].name:'')
            setDetallesDos(detail[1]?detail[1].name:'')
            setDetallesTres(detail[2]?detail[2].name:'')
        })
        .catch(e => console.log(e.message))
    }
    useEffect(() =>{
        getById(idPlanMensual)
    },[idPlanMensual])

    const updatePlanMensual = async () =>{
        const detalle : any[] = []
        if(detallesUno){
          detalle.push({ id:1, name:detallesUno })
        }
        if(detallesDos){
          detalle.push({ id:2, name:detallesDos })
        }
        if(detallesTres){
          detalle.push({ id:3, name:detallesTres })
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

        const url = baseurl + 'plan-mensual/update/' + idPlanMensual;
        const dataToSend = {
            nombre: nombre,
            cantidad: logoUrl,
            content: JSON.stringify(detalle),
        };

        try {
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
        } catch (e: any) {
            setSeverity('error');
            setMssg(e?.response?.data?.message || e.message || 'No se pudo actualizar.');
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
                                        Editar canal de donación
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
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={nombre}
                                    width="80px"
                                    style={{padding:'10px',border:'1px solid #c2c2c2',marginTop:'8px'}}
                                />
                            ) : null}
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField
                                label="Dato de la cuenta 1 (número o enlace)"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={detallesUno ?? ""}
                                onChange={(e) => setDetallesUno(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField
                                label="Dato de la cuenta 2 (opcional)"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={detallesDos ?? ""}
                                onChange={(e) => setDetallesDos(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField
                                label="Dato de la cuenta 3 (opcional)"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={detallesTres ?? ""}
                                onChange={(e) => setDetallesTres(e.target.value)}
                            />
                        </Grid>
                    </Grid>
            </Grid>
        </>
    )
}
