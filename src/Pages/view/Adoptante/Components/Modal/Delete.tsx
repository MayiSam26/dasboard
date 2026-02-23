import { Alert, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import { isNull } from "util";
import { isNullishCoalesce } from "typescript";
import { deflate } from "zlib";
 
interface props {
    setFlask?:any
    setOpenModalDelete?:any
    idPlanMensual?:any
    getPlanesMensual:() => void
}
export default function Delete({setFlask,setOpenModalDelete,idPlanMensual,getPlanesMensual}:props){
    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)
   
    const onDelete = () => {
        const url = baseurl+'plan-mensual/remove/'+idPlanMensual
        axios.post(url)
        .then((response) => {
            const {data} = response
            if(data.code === '000'){
                setSeverity('success');
                setMssg(data.message);
                setOpenAlert(true);
                setTimeout(() =>{
                    setOpenModalDelete(false)
                    getPlanesMensual()
                },1700)
            }else{
                setSeverity('error');
                setMssg("error al eliminar");
                setOpenAlert(true);
            }
            
            
        })
        .catch((err) => {
            setSeverity('error');
            setMssg(err.message);
            setOpenAlert(true);
        })
    };
     
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
                    <Grid item xs={12}>
                        <Grid item xs={10} md={12}>
                                    <Typography variant="h5" sx={{textAlign:'center'}}>
                                            Eliminar Plan Mensual
                                    </Typography>
                            </Grid>
                            <Grid item xs={10} md={12}>
                                    <Typography variant="h6" sx={{fontWeight:300,textAlign:'center'}} >
                                            ¿Estas seguro de Eliminar?
                                    </Typography>
                            </Grid>
                            
                        </Grid>
                    <Grid item xs={12} md={12} sx={{display:'flex',justifyContent:'center'}}>
                        <Grid item xs={12} md={3} sx={{marginTop:'10px'}}>
                            <Button
                                sx={{
                                    textTransform:'capitalize',
                                    
                                }}
                                variant="contained"
                                fullWidth
                                color='error'
                                onClick={() =>setOpenModalDelete(false)}
                            >Cancelar</Button>
                        </Grid>
                        <Grid item xs={12} md={3} sx={{marginTop:'10px'}}>
                            <Button
                                onClick={()=>onDelete()}
                                sx={{
                                    textTransform:'capitalize',
                                    marginLeft:'5px'
                                }}
                                fullWidth
                                variant="contained"
                                >Eliminar</Button>
                        </Grid>
                    </Grid>
            </Grid>
        </>
    )
}