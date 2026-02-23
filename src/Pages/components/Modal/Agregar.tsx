import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";
import baseurl from "../../../Config/axios";
import axios from "axios";
 
interface props {
    setFlask:any,
    setOpenModal:any
}
export default function Agregar({setFlask,setOpenModal}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[icono,setIcono] = React.useState<any>("")
    const[link,setLik] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const createRedes = async() =>{
        const url=baseurl+'redes-social/create'
        const body = {
            nombre:nombre,
            icono:icono,
            link:link
        }
        axios.post(url,body)
        .then((response:any) =>{
            const { data } = response
            if(data.code === '000'){
                setFlask(data.code)
                setOpenAlert(true)
                setSeverity('success')
                setMssg(data.message)
                setTimeout(() =>{
                    setOpenModal(false)
                    setNombre("")
                    setIcono("")
                    setLik("")
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
                                        Crear nuevo
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                    onClick={createRedes}
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
                                label="Ingrese Icono" 
                                variant="outlined"
                                fullWidth
                                size="small"
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
                                onChange={(e) => setLik(e.target.value)}
                            />
                        </Grid>
                    </Grid>
            </Grid>
        </>
    )
}