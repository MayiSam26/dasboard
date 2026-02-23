import { Alert, Autocomplete, Button, Grid, TextField, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import { isNull } from "util";
import { isNullishCoalesce } from "typescript";
import { deflate } from "zlib";
import SaveIcon from '@mui/icons-material/Save';
import moment from "moment";
 
interface props {
    setOpenModal:any
    getApadrinado:() => void
}

interface autocomplete {
    label:string,
    value:any
}
export default function Agregar({setOpenModal,getApadrinado}:props){
  
    const[donante,setDonante] = React.useState<autocomplete[]>([]);
    const[albergados,setAlbergados] = React.useState<autocomplete[]>([])
    const [plan, setPlan] = React.useState<autocomplete[]>([]);

    // form
    const[donateSelect,setDonateSelect] = React.useState<any>("")
    const[animalSelect,setAnimalSelect] = React.useState<any>("")
    const[planSelect,setPlanSelect] = React.useState<any>("")
    const[fromto,setFromto] = React.useState<any>(null)

    const[severity,setSeverity] = React.useState<any>("")
    const[mssg,setMssg] = React.useState<any>("")
    const[openAlert,setOpenAlert] = React.useState<boolean>(false)

    const saveApadrinado = async() =>{
        const body ={
            iduser:null,
            iddonantes:donateSelect,
            idanimal:animalSelect,
            idplanmensual:planSelect,
            Fecha_Apadrinado:fromto
        }
        const url = baseurl + "apadrinado/create";
        await axios.post(url,body).then((response) => {
            const { data } = response;
            if(data.code === '000'){
                setSeverity('success');
                setMssg(data.message);
                setOpenAlert(true);
                setTimeout(() =>{
                    setOpenModal(false)
                    getApadrinado()
                },1800)
            }
        })
        .catch((e) => {
                setSeverity('error');
                setMssg(e.message);
                setOpenAlert(true);
        })
    }

    //search donante
    const getDonante = async () => {
        const url = baseurl + "donante/list";
        await axios.get(url).then((response) => {
          const { data } = response;
           
            const autocompletes :autocomplete[] = []
            data.data.map((item:any) =>{
                const dates ={
                    label:item.Nombre + " " +item.Apellido,
                    value:item.iddonantes
                }
                autocompletes.push(dates)
            })
            
            setDonante(autocompletes)
        });
      };
    
    React.useEffect(() => {
        getDonante();
      }, []);
   
   //search animales
    const getAlbergados = async () => {
        const url = baseurl + "colitas/list";
        await axios.get(url).then((response) => {
          const { data } = response;
          const autocompletes :autocomplete[] = []
            data.data.map((item:any) =>{
                const dates ={
                    label:item.nombre,
                    value:item.idanimal
                }
                autocompletes.push(dates)
            })
            setAlbergados(autocompletes)
        });
      };
    
      React.useEffect(() => {
        getAlbergados();
      }, []);
    //search planes
    const getPlanesMensual = async () => {
        const url = baseurl + "plan-mensual/list";
        axios.get(url).then((response) => {
          const { data } = response;
          const autocompletes :autocomplete[] = []
            data.data.map((item:any) =>{
                const dates ={
                    label:item.nombre,
                    value:item.idplanmensual
                }
                autocompletes.push(dates)
            })
            setPlan(autocompletes)
        });
      };
    
      React.useEffect(() => {
        getPlanesMensual();
      }, []);
      
    const handleDonantes= (event: React.ChangeEvent<{}>, newValue: autocomplete | null) => {
        if (newValue) {
            setDonateSelect(newValue.value); 
        } else {
            setDonateSelect(null); 
        }
    };
    const handlePlan= (event: React.ChangeEvent<{}>, newValue: autocomplete | null) => {
        if (newValue) {
            setPlanSelect(newValue.value); 
        } else {
            setPlanSelect(null); 
        }
    };

    const handleAnimal= (event: React.ChangeEvent<{}>, newValue: autocomplete | null) => {
        if (newValue) {
            setAnimalSelect(newValue.value); 
        } else {
            setAnimalSelect(null); 
        }
    };

    const handleFormatTo = async (e: any) => {
        const selectedDate :any = new Date(e.target.value); 
        setFromto(moment(selectedDate).add(1, 'days').toDate()); 
    };
    console.log("donateSelect",donateSelect)
    console.log("animalSelect",animalSelect)
    console.log("planSelect",planSelect)
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
                                        Agregar Apadrinado
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button 
                                    onClick={saveApadrinado}
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
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={donante}
                                size="small"
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Donantes" />}
                                onChange={handleDonantes}
                                />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={albergados}
                                size="small"
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Albergados" />}
                                onChange={handleAnimal}
                                />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                             <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={plan}
                                size="small"
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Plan Mensual" />}
                                onChange={handlePlan}
                                />
                        </Grid>
                        <Grid item xs={12} sx={{marginTop:'10px'}}>
                                <input 
                                        type="date"
                                        onChange={handleFormatTo}
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