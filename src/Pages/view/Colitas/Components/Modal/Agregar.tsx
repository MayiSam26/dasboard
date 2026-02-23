import {
  Alert,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import { isNull } from "util";
import { isNullishCoalesce } from "typescript";
import { deflate } from "zlib";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";

interface props {
  setOpenModal: any;
  getAlbergados: () => void;
}
export default function Agregar({ setOpenModal, getAlbergados }: props) {
  const [nombre, setNombre] = React.useState<any>("");
  const [tamano, setTamano] = React.useState<any>("");
  const [peso, setPeso] = React.useState<any>("");
  const [edad, setEdad] = React.useState<any>("");
  const [estado, setEstado] = React.useState<any>("En refugio");
  const [esterilizado, setEsterilizado] = React.useState<any>("");
  const [genero, setGenero] = React.useState<any>("");
  const [tipo, setTipo] = React.useState<any>("");
  const [observacion, setObservacion] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");
  const[file,setFile] = React.useState<any>("")

  
  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  console.log("estado",estado)
  const createColitas = async () => {
    console.log("estado",estado)
       const url =  baseurl+'colitas/create'
        const formData = new FormData();
        formData.append('nombre', nombre);
        formData.append('idtipoanimal', tipo);
        formData.append('idadopcion', "");
        formData.append('idgenero', genero);
        formData.append('tamano', tamano);
        formData.append('peso', peso);
        formData.append('Edada_Aprox', edad);
        formData.append('foto', file);
        formData.append('observaciones', observacion);
        formData.append('estado', estado);
        formData.append('esterelizacion', esterilizado);
        const fechaActual = new Date().toISOString();
        formData.append('fechaRegistro', fechaActual);
        formData.append('Fecha_Ingreso',dateTo );
        const response :any = await axios.post(url, formData);
        const {data} = response 
        if(data.code === '000'){
          saveAuditoria()
          setSeverity('success');
          setMssg(data.message);
          setOpenAlert(true);
          getAlbergados()
          setTimeout(() =>{
              setOpenModal(false)
          },1800)
        }else{
            setSeverity('error');
            setMssg(data.message);
            setOpenAlert(true);
        }
  };

  const saveAuditoria = async() =>{
    const id = localStorage.getItem("auditoria")
    let fecha = moment(new Date()).add(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
    const body = {
      modulo:"colitas",
      fechaRegistro:fecha
    }
   
    const url = baseurl+"auditoria/update/"+id
    const response = await axios.put(url, body);
    const{data} = response
    console.log(data)
  }
  const alert = () => {
    return (
      <Alert variant="filled" severity={severity}>
        {mssg}
      </Alert>
    );
  };
  return (
    <>
      {openAlert ? alert() : null}
      <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
        <Grid item xs={12} sx={{ display: "flex" }}>
          <Grid item xs={10}>
            <Typography variant="h5">Agregar Albergados</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={createColitas}
              fullWidth
              variant="contained"
              sx={{
                background: "#65c178",
                borderRadius: "20px",
                fontWeight: "bolder",
                textTransform: "capitalize",
                "&:hover": {
                  background: "#ed6436",
                },
              }}
            >
              <SaveIcon />
              Guardar
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese Nombre"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setNombre(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tamaño</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                label="Tamaño"
                size="small"
                onChange={(e) =>setTamano(e.target.value)}
              >
                <MenuItem value="mediano">Mediano</MenuItem>
                <MenuItem value="pequeño">Pequeño</MenuItem>
                <MenuItem value="grande">Grande</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese peso"
              variant="outlined"
              type="number"
              fullWidth
              size="small"
              onChange={(e) => setPeso(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese edad"
              variant="outlined"
              type="number"
              fullWidth
              size="small"
              onChange={(e) => setEdad(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                esterelizado
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                label="Tamaño"
                size="small"
                onChange={(e) => setEsterilizado(e.target.value)}
              >
                <MenuItem value="si">si</MenuItem>
                <MenuItem value="No">no</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Genero</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                onChange={(e) => setGenero(e.target.value)}
                label="Genero"
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="1">Macho</MenuItem>
                <MenuItem value="2">Hembra</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                label="Tipo"
                onChange={(e) => setTipo(e.target.value)}
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="1">Gato</MenuItem>
                <MenuItem value="2">Perro</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese edad"
              variant="outlined"
              type="number"
              fullWidth
              size="small"
              onChange={(e) => setEdad(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Estado"
              variant="outlined"
              fullWidth
              size="small"
              value={estado?? ""}
              disabled
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <textarea
              placeholder="Ingrese Observaciones"
              //value={descripcion ?? ""}
              onChange={(e) => setObservacion(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "4px",
                border: "1px solid #c2c2c2",
                padding: "9px",
                maxHeight: "300px",
                height: "130px",
                fontFamily: "inherit",
              }}
            ></textarea>
          </Grid>

          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <input
              type="date"
               onChange={(e) => setDateTo(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                border: "1px solid #c2c2c2",
                borderRadius: "4px",
              }}
            />
          </Grid>
          <Grid item xs={12} md={12} sx={{ marginTop: "10px" }}>
            <input
              type="file"
              style={{
                border: "1px solid #c2c2c2",
                padding: "8px",
                width: "100%",
                borderRadius: "4px",
              }}
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
