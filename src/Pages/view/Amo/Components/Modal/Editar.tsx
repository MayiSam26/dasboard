import { Alert, Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from '@mui/icons-material/Save';

 
interface props {
    setOpenModalEdit?:any
    iddueno?:any
    getApadrinado:() =>void
}
export default function Editar({setOpenModalEdit,iddueno,getApadrinado}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[facebook,setFacebook] = React.useState<any>("")
    const[instagram,setInstagram] = React.useState<any>("")

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const getById = async() =>{
        const url = baseurl+'amo/detail/'+iddueno
        axios.get(url)
        .then(response => {
            const {data} = response
            setNombre(data.data.nombre)
            setFacebook(data.data.facebook)
            setInstagram(data.data.instagram)
        }).catch((e) => console.log(e.message))
    }
    useEffect(() =>{
        getById()
    },[])
	
  
    const updateById = async() =>{
        const body ={
            nombre:nombre,
            facebook:facebook,
            instagram:instagram
        }
        const url = baseurl+'amo/update/'+iddueno
        axios.put(url,body)
        .then(response => {
            const {data} = response
            if (data.code === '000') {
                setSeverity('success');
                setMssg(data.message);
                setOpenAlert(true);
                setTimeout(() => {
                    setOpenModalEdit(false);
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
                            <Grid item xs={9}>
                                <Typography variant="h5">
                                        Editar Apoderado Mascota
                                </Typography>
                            </Grid>
                            <Grid item xs={3}>
                                <Button 
                                    onClick={updateById}
                                    fullWidth
                                    variant="contained" sx={{
                                    background:'#65c178',
                                    fontWeight:'bolder',
                                    borderRadius:'20px',
                                    textTransform:'capitalize',
                                    '&:hover': {
                                        background: '#ed6436', 
                                    },
                                    }}>
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
                            <TextField 
                                    id="outlined-basic"
                                    label="Ingrese facebook" 
                                    variant="outlined"
                                    fullWidth
                                    size="small"
                                    value={facebook ?? ""}
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
                                value={instagram ?? ""}
                                onChange={(e) => setInstagram(e.target.value)}
                            />
                        </Grid>
                    </Grid>
            </Grid>
            
        </>
    )
}