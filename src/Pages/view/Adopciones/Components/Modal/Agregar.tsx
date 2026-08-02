import {
  Alert,
  Autocomplete,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import formatlocaldate from "../../../../../Config/helpersDate";
import moment from "moment";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SaveIcon from "@mui/icons-material/Save";

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
      <Alert variant="filled" severity={severity} sx={{ borderRadius: 0 }}>
        {mssg}
      </Alert>
    );
  };
  return (
    <>
      {openAlert ? alert() : null}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.2,
          borderBottom: "1px solid var(--cya-border)",
          background: "var(--cya-bg-alt)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(63, 158, 92, 0.14)",
              color: "var(--cya-secondary-dark)",
            }}
          >
            <FavoriteIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Crear Nueva Adopción
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModal(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={donante}
              size="small"
              fullWidth
              renderInput={(params) => <TextField {...params} label="Adoptante" />}
              onChange={handleDonantes}
            />
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={albergados}
              size="small"
              fullWidth
              renderInput={(params) => <TextField {...params} label="Colitas" />}
              onChange={handleAnimal}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                label="Estado"
                defaultValue=""
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="proceso">Proceso</MenuItem>
                <MenuItem value="adoptado">Adoptado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Observaciones
            </Typography>
            <textarea
              placeholder="Ingrese descripcion"
              onChange={(e) => setMotivo(e.target.value)}
              style={{
                width: "100%",
                borderRadius: "8px",
                border: "1px solid var(--cya-border)",
                padding: "10px",
                maxHeight: "300px",
                height: "110px",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            ></textarea>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
              Fecha de adopción
            </Typography>
            <input
              type="date"
              onChange={(e) => setfromDate(e.target.value)}
              style={{
                padding: "8px",
                width: "100%",
                border: "1px solid var(--cya-border)",
                borderRadius: "8px",
                boxSizing: "border-box",
              }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 1.2,
          px: 3,
          py: 2,
          borderTop: "1px solid var(--cya-border)",
        }}
      >
        <Button
          onClick={() => setOpenModal(false)}
          sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
        >
          Cancelar
        </Button>
        <Button onClick={createdata} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Guardar
        </Button>
      </Box>
    </>
  );
}
