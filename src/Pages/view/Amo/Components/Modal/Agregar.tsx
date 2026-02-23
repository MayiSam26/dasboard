import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import { isNull } from "util";
import { isNullishCoalesce } from "typescript";
import { deflate } from "zlib";
import SaveIcon from '@mui/icons-material/Save';
 
interface props {
    setOpenModal:any
    getApadrinado:() => void
}
export default function Agregar({setOpenModal,getApadrinado}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[facebook,setFacebook] = React.useState<any>("")
    const[instagram,setInstagram] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

   
    const createPlanMensual = async () => {
        const body ={
            iduser:null,
            nombre:nombre,
            facebook:facebook,
            instagram:instagram
        }
        const url = baseurl+'amo/create'
        axios.post(url,body)
        .then(response => {
            const {data} = response
            if (data.code === '000') {
                setSeverity('success');
                setMssg(data.message);
                setOpenAlert(true);
                setTimeout(() => {
                    setOpenModal(false);
                    getApadrinado();
                }, 1800);
            } else {
                setSeverity('error');
                setMssg(data.message);
                setOpenAlert(true);
            }
        }).catch((e) => console.log(e.message))
      
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
                                        Agregar Apoderado Mascota
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                    onClick={createPlanMensual}
                                    fullWidth
                                    variant="contained" 
                                    sx={{
                                    background:'#65c178',
                                    borderRadius:'20px',
                                    fontWeight:'bolder',
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        background: '#ed6436', 
                                    },
                                    }}>
                                    <SaveIcon />
                                    Guardar
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
                                    label="Ingrese facebook" 
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    onChange={(e) => setFacebook(e.target.value)}
                             />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <TextField 
                                id="outlined-basic" 
                                label="Ingrese instagram" 
                                variant="outlined"
                                fullWidth
                                size="small"
                                onChange={(e) => setInstagram(e.target.value)}
                            />
                        </Grid>
                    </Grid>
            </Grid>
        </>
    )
}