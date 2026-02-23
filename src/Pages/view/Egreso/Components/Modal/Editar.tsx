import { Alert, Box, Button, Grid, Modal, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import moment from "moment";
 
interface props {
    
    setOpenModalEdit?:any
    idEgreso?:any
    getEgreso:() =>void
}
export default function Editar({setOpenModalEdit,idEgreso,getEgreso}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[precio,setPrecio] = React.useState<any>("")
    const[fromto,setFromto] = React.useState<any>(null)
    

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const getById = async() =>{
        const url = baseurl+'egreso/detail/'+idEgreso
        axios.get(url)
        .then(response => {
            const {data} = response
            setNombre(data.data.Descripcion)
            setPrecio(data.data.Monto)
            setFromto(data.data.fechato)
        }).catch(e => console.log(e.message))
    }
    useEffect(() =>{
        getById()
    },[])
	
    const formatDateToString = (date: Date | null) => {
        return date ? moment(date).format("YYYY-MM-DD") : "";
    };

    
    const updtaById = async() =>{
        const body ={
            Descripcion:nombre,
            Monto:precio,
            fechato:fromto
        }
        const url = baseurl+'egreso/update/'+idEgreso
        axios.put(url,body)
        .then(response => {
            const {data} = response
            if(data.code = '000'){
                setSeverity('success');
                setMssg(data.message);
                setOpenAlert(true);
                setTimeout(() => {
                    setOpenModalEdit(false);
                    getEgreso();
                }, 1800);
            }else {
                setSeverity('error');
                setMssg(data.message);
                setOpenAlert(true);
            }
        }).catch(e => console.log(e.message))
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
                                        Ingresar nuevo ingreso
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                   onClick={updtaById}
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
                                value={nombre ?? ""}
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
                                value={precio ?? ""}
                                size="small"
                                onChange={(e) => setPrecio(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                                    <input 
                                        type="date"
                                        value={formatDateToString(fromto) ?? ""}
                                        style={{
                                            padding:'8px',
                                            width:'100%',
                                            border:'1px solid #c2c2c2',
                                            borderRadius:'4px'
                                        }}
                                    />
                        </Grid>
                    </Grid>
            </Grid>
            
        </>
    )
}