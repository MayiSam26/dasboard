import { Alert, Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import SaveIcon from '@mui/icons-material/Save';

import axios from "axios";
import baseurl from "../../../../../Config/axios";
 
interface props {
    setFlask?:any,
    setOpenModalEdit?:any
    idRefugio:any,
    getRedesSocial:() =>void
}
export default function Editar({setFlask,setOpenModalEdit,idRefugio,getRedesSocial}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[icono,setIcono] = React.useState<any>("")
    const[link,setLik] = React.useState<any>("")
    const[telefono,setTelefono] = React.useState<any>("")
    const[correo,setCorreo] = React.useState<any>("")
    const[descripcion,setDescripcion] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const getById = async() =>{
        const url = baseurl+'home/'+idRefugio
        axios.get(url)
        .then(response => {
            const {data} = response
           
            setNombre(data.data.nombre)
            setDescripcion(data.data.Descripcion)
            setLik(data.data.logo)
            setTelefono(data.data.telefono)
            setCorreo(data.data.correo)
        })
    }
    useEffect(() =>{
        getById()
    },[])
    const updateRefugio = async() =>{
        const url=baseurl+'home/updates/'+idRefugio
        const body = {
            nombre:nombre,
            Descripcion:descripcion,
            logo:link,
            telefono:telefono,
            correo:correo
        }
        axios.put(url,body)
        .then((response:any) =>{
            const { data } = response
            if(data.code === '000'){
                setFlask(data.code)
                setOpenAlert(true)
                setSeverity('success')
                setMssg(data.message)
                setTimeout(() =>{
                    setOpenModalEdit(false)
                    getRedesSocial()
                    setNombre("")
                    setDescripcion("")
                    setLik("")
                    setTelefono("")
                    setCorreo("")
                },1800)
            }
        })
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
                                        Editar
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                    onClick={updateRefugio}
                                    fullWidth
                                    variant="contained" sx={{
                                    background:'#65c178',
                                    fontWeight:'bolder',
                                    borderRadius:'20px',
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        background: '#ed6436', 
                                    },
                                    }}
                                    >
                                    <SaveIcon />
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
                            <textarea 
                            placeholder="Ingrese descripcion" 
                            value={descripcion??""}
                            onChange={(e) => setDescripcion(e.target.value)}         
                            style={{
                                width:'100%',
                                borderRadius: '4px',
                                border:'1px solid #c2c2c2',
                                padding:'9px',
                                maxHeight: '300px',
                                height:'130px',
                                fontFamily:'inherit'
                                }}></textarea>
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese URL del logo" 
                                variant="outlined" 
                                fullWidth
                                size="small"
                                value={link ?? ""}
                                onChange={(e) => setLik(e.target.value)}
                            />
                             <img src={link} width="100px" style={{padding:'10px',border:'1px solid #c2c2c2'}}/>
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese telefono" 
                                variant="outlined" 
                                fullWidth
                                size="small"
                                value={telefono ?? ""}
                                onChange={(e) => setTelefono(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese correo" 
                                variant="outlined" 
                                fullWidth
                                size="small"
                                value={correo ?? ""}
                                onChange={(e) => setCorreo(e.target.value)}
                            />
                        </Grid>
                    </Grid>
            </Grid>
            
        </>
    )
}