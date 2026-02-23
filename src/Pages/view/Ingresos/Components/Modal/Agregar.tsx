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
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import { isNull } from "util";
import { isNullishCoalesce } from "typescript";
import { deflate } from "zlib";
import SaveIcon from "@mui/icons-material/Save";

interface props {
  setOpenModal: any;
  getIngresos: () => void;
  getReportes: () => void;
}

interface autocomplete {
  label: string;
  value: any;
}
export default function Agregar({
  setOpenModal,
  getIngresos,
  getReportes,
}: props) {
  const [donante, setDonante] = React.useState<autocomplete[]>([]);
  const [monto, setMonto] = React.useState<any>("");
  const [suministro, setSuministro] = React.useState<any>("");

  const [donateSelect, setDonateSelect] = React.useState<any>("");
  const [donacion, setDonacion] = React.useState<any>("");
  const [tipoyape, setTipoYape] = React.useState<any>("");
  const [file, setFile] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const createData = async () => {
    const url = baseurl + "ingresos/create";
    const formData = new FormData();
    formData.append("iddonantes", donateSelect);
    formData.append("monto", monto);
    formData.append("suministro", suministro);
    formData.append("fecha_registro", dateTo);
    formData.append("donacion", donacion);
    formData.append("pago", tipoyape);
    formData.append("evidencia", file);

    //const fechaActual = new Date().toISOString();
    //formData.append("fechaRegistro", fechaActual);
    //formData.append("Fecha_Ingreso", dateTo);
    const response: any = await axios.post(url, formData);
    const { data } = response;
    if (data.code === "000") {
      setSeverity("success");
      setMssg(data.message);
      getReportes();
      setOpenAlert(true);
      getIngresos();
      setTimeout(() => {
        setOpenModal(false);
      }, 1800);
    } else {
      setSeverity("error");
      setMssg(data.message);
      setOpenAlert(true);
    }
  };

  const getDonante = async () => {
    const url = baseurl + "donante/list";
    await axios.get(url).then((response) => {
      const { data } = response;

      const autocompletes: autocomplete[] = [];
      data.data.map((item: any) => {
        const dates = {
          label: item.fullname,
          value: item.iddonantes,
        };
        autocompletes.push(dates);
      });

      setDonante(autocompletes);
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

  useEffect(() => {
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
            <Typography variant="h5">Agregar Nuevo Ingreso</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={createData}
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
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={donante}
              value={
                donante.find((item) => item.value === donateSelect) ?? null
              }
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Donantes" />
              )}
              onChange={handleDonantes}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese Monto"
              variant="outlined"
              fullWidth
              type="number"
              size="small"
              onChange={(e) => setMonto(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth size="small">
              <InputLabel id="suministro-label">¿Es Suministro?</InputLabel>
              <Select
                labelId="suministro-label"
                id="suministro-select"
                value={suministro}
                label="¿Es Suministro?"
                onChange={(e) => setSuministro(e.target.value)}
              >
                <MenuItem value="Sí">Sí</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
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
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Donacion</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                label="Donacion"
                size="small"
                onChange={(e) => setDonacion(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="monetaria">Monetaria</MenuItem>
                <MenuItem value="comida">Comida</MenuItem>
                <MenuItem value="otros">Otros</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Tipo de pago
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                label="Donacion"
                size="small"
                onChange={(e) => setTipoYape(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="yape">Yape</MenuItem>
                <MenuItem value="plin">Plin</MenuItem>
                <MenuItem value="tarjeta">Tarjeta</MenuItem>
                <MenuItem value="ninguna">Ninguna</MenuItem>
              </Select>
            </FormControl>
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
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
