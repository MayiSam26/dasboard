import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";

import moment from "moment";

 
import { soloDecimal } from "../../../../../utils/campos";
import FechaRegistro from "../../../../components/FechaRegistro";
interface props {
    setOpenModal:any
    getEgreso:() => void
}
export default function Agregar({setOpenModal,getEgreso}:props){
    const[nombre,setNombre] = React.useState<any>("")
    const[precio,setPrecio] = React.useState<any>(null)
    const[fromto,setFromto] = React.useState<any>(null)

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

   
    // Antes se convertía a Date y se le sumaba un día para compensar el
    // desfase de zona horaria (new Date("2026-08-23") se interpreta como UTC
    // y en Perú caía un día antes). Guardando el texto "YYYY-MM-DD" tal cual,
    // como hacen los demás módulos, el problema no existe y no hay que
    // corregir nada a mano.


   const saveIngreso = () =>{

        const body : any = {
            iduser:0,
            Descripcion:nombre,
            Monto:precio,
            fechato:fromto
        }

        if(nombre == ''){
                setSeverity('error');
                setMssg('Campo nombre requerido');
                setOpenAlert(true);
                return;
        }
        if(!precio){
            setSeverity('error');
            setMssg('Campo  precio requerido!');
            setOpenAlert(true);
            return;
        }
        if(!fromto){
            setSeverity('error');
            setMssg('Campo fecha requerido!');
            setOpenAlert(true);
            return;
        }
        const url = baseurl +"egreso/create"
        axios.post(url,body)
        .then((response:any) =>{
            const {data} = response
            if(data.code === '000'){
                setSeverity('success');
                setMssg(data.message);
                setOpenAlert(true);
                setTimeout(() =>{
                    setOpenModal(false)
                    getEgreso()
                },1800)
            }
        }).catch((e) => {
            setSeverity('error');
            setMssg(e.message);
            setOpenAlert(true);
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
                                        Ingresar nuevo egreso
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                   onClick={saveIngreso}
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
                                type="text"
                                inputProps={{ inputMode: "decimal" }}
                                fullWidth
                                size="small"
                                value={precio ?? ""}
                                onChange={(e) => setPrecio(soloDecimal(e.target.value))}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                                    <FechaRegistro
                                        label="Fecha de registro"
                                        value={fromto || ""}
                                        onChange={setFromto}
                                    />
                        </Grid>
                    </Grid>
            </Grid>
        </>
    )
}