import {
  Alert,
  Autocomplete,
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
import formatlocaldate from "../../../../../Config/helpersDate";
import moment from "moment";

interface props {
  setOpenModal: any;
  getAdopciones: () => void;
  getReportes: () => void
}

interface autocomplete {
  label: string;
  value: any;
}
export default function Agregar({ setOpenModal, getAdopciones, getReportes }: props) {
  const [nombre, setNombre] = React.useState<any>("");
  const [precio, setPrecio] = React.useState<any>(null);
  const [file, setFile] = React.useState<any>("");
  const [donante, setAdoptante] = React.useState<autocomplete[]>([]);
  const [albergados, setAlbergados] = React.useState<autocomplete[]>([]);

  const [selectadoptante, setDonateSelect] = React.useState<any>("");
  const [selectColitas, setColitaSelect] = React.useState<any>("");
  const [status, setStatus] = React.useState<any>("");
  const [fromdate, setfromDate] = React.useState<any>("");
  const [motivo, setMotivo] = React.useState<any>("");

  const [detalleUno, setDetalleUno] = React.useState<any>("");
  const [detalledos, setDetalleDos] = React.useState<any>("");
  const [detalletres, setDetalleTres] = React.useState<any>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const createdata = async () => {
    const body = {
      iduser: null,
      idadoptante: selectadoptante,
      idanimal: selectColitas,
      Fecha_Adopcion: formatlocaldate(fromdate),
      Observaciones: motivo,
      Estado: status,
      fecharegistro: new Date(),
    };
    const url = baseurl +"adopciones/create/adopciones-colitas"
    axios.post(url,body)
    .then((response:any) =>{
        const {data} = response
        if(data.code === '000'){
            saveAuditoria()
            setSeverity('success');
            setMssg(data.message);
            setOpenAlert(true);
            setTimeout(() =>{
                setOpenModal(false)
                getAdopciones()
                getReportes()
            },1800)
        }
    }).catch((e) => {
        setSeverity('error');
        setMssg(e.message);
        setOpenAlert(true);
})
  };

  const getDonante = async () => {
    const body = { search: "", fechaBusqueda: null };
    const url = baseurl + "adoptante/list";
    await axios.post(url, body).then((response) => {
      const { data } = response;
      console.log(data);
      const autocompletes: autocomplete[] = [];
      data.data.map((item: any) => {
        const dates = {
          label: item.Nombre,
          value: item.idadoptante,
        };
        autocompletes.push(dates);
      });
      setAdoptante(autocompletes);
    });
  };

  const getAlbergados = async () => {
    const body = {
      search: "",
      p_tamano: null,
      p_idtipoanimal: null,
      p_idgenero: null,
      fechaBusqueda: null,
    };
    const url = baseurl + "colitas/list";
    await axios.post(url, body).then((response) => {
      const { data } = response;
      const autocompletes: autocomplete[] = [];
      data.data.map((item: any) => {
        if (item.estado === "En refugio") { 
          const date = {
            label: item.nombre,
            value: item.idanimal,
          };
          autocompletes.push(date);
        }
      });
      setAlbergados(autocompletes);
    });
  };

  const handleDonantes = (
    event: React.ChangeEvent<{}>,
    newValue: autocomplete | null
  ) => {
    if (newValue) {
      setDonateSelect(newValue.value);
    } else {
      setDonateSelect(null);
    }
  };

  const handleAnimal = (
    event: React.ChangeEvent<{}>,
    newValue: autocomplete | null
  ) => {
    if (newValue) {
      setColitaSelect(newValue.value);
    } else {
      setColitaSelect(null);
    }
  };

  const saveAuditoria = async() =>{
    const id = localStorage.getItem("auditoria")
    let fecha = moment(new Date()).add(5, 'hours').format('YYYY-MM-DD HH:mm:ss');
    const body = {
      modulo:"Adopciones",
      fechaRegistro:fecha
    }
   
    const url = baseurl+"auditoria/update/"+id
    const response = await axios.put(url, body);
    const{data} = response
    console.log(data)
  }

  React.useEffect(() => {
    getAlbergados();
    getDonante();
  }, []);
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
            <Typography variant="h5">Crear Nueva Adopcion</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={createdata}
              fullWidth
              variant="contained"
              sx={{
                background: "#65c178",
                fontWeight: "bolder",
                textTransform: "capitalize",
                "&:hover": {
                  background: "#ed6436",
                },
              }}
            >
              Guardar
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={donante}
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Adoptante" />
              )}
              onChange={handleDonantes}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={albergados}
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Colitas" />
              )}
              onChange={handleAnimal}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                label="Estado"
                size="small"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="proceso">Proceso</MenuItem>
                <MenuItem value="adoptado">Adoptado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <textarea
              placeholder="Ingrese descripcion"
              onChange={(e) => setMotivo(e.target.value)}
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
              onChange={(e) => setfromDate(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                border: "1px solid #c2c2c2",
                borderRadius: "4px",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
