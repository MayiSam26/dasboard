import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
 
interface props {
    setFlask?:any,
    setOpenModalEdit?:any
    idRed:any
    getRedesSocial:() =>void
}
export default function Editar({setFlask,setOpenModalEdit,idRed,getRedesSocial}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[icono,setIcono] = React.useState<any>("")
    const[link,setLik] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const getById = async() =>{
        const url = baseurl+'redes-social/detail/'+idRed
        axios.get(url)
        .then(response => {
            const {data} = response
            setNombre(data.data.nombre)
            setIcono(data.data.icono)
            setLik(data.data.link)
        })
    }
    const updateRedes = async() =>{
        const url=baseurl+'redes-social/update/'+idRed
        const body = {
            nombre:nombre,
            icono:icono,
            link:link
        }
        axios.put(url,body)
        .then((response:any) =>{
            const { data } = response
            if(data.code === '000'){
                setFlask(data.code)
                getRedesSocial()
                setOpenAlert(true)
                setSeverity('success')
                setMssg(data.message)
                setTimeout(() =>{
                    setOpenModalEdit(false)
                    setNombre("")
                    setIcono("")
                    setLik("")
                },1800)
            }
        })
    }
    useEffect(() =>{
        getById()
    },[])
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
                                        Editar
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                    onClick={updateRedes}
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
                                label="Ingrese Icono" 
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={icono ?? ""}
                                onChange={(e) => setIcono(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese URL" 
                                variant="outlined" 
                                fullWidth
                                size="small"
                                value={link ?? ""}
                                onChange={(e) => setLik(e.target.value)}
                            />
                        </Grid>
                    </Grid>
            </Grid>
        </>
    )
}