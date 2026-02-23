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
import formatlocaldate from "../../../../../Config/helpersDate";

interface props {
  setOpenModal: any;
  getDonante: () => void;
}

interface autocomplete {
  label: string;
  value: any;
}
export default function Agregar({ setOpenModal, getDonante }: props) {
  const [fullname, setFullname] = React.useState<any>("");
  const [redsocial, setSocial] = React.useState<any>("");
  const [idtipopersona, setTipo] = React.useState<any>("");
  const [ruc, setRuc] = React.useState<any>("");
  const [dni, setDNI] = React.useState<any>("");
  const [dateTo, setDateTo] = React.useState<any>("");

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const createData = async () => {
    const url = baseurl + "donante/create";
    const body = {
      idtipopersona: idtipopersona,
      fullname: fullname,
      redsocial: redsocial,
      Ruc: ruc,
      Dni: dni,
      Fecha_Registro:formatlocaldate(dateTo),
    };
    await axios
      .post(url, body)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModal(false);
            getDonante();
          }, 1800);
        }
      })
      .catch((e) => {
        setSeverity("error");
        setMssg(e.message);
        setOpenAlert(true);
      });
  };

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
            <Typography variant="h5">Agregar Nuevo Donante</Typography>
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
            <TextField
              id="outlined-basic"
              label="Ingrese Nombre completo"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setFullname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese Red Social"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setSocial(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Tipo Persona
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                onChange={(e) => setTipo(e.target.value)}
                label="Tipo Persona"
                size="small"
              >
                <MenuItem value="1">persona natural</MenuItem>
                <MenuItem value="2">persona juridica</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese Ruc"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setRuc(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese DNI"
              variant="outlined"
              fullWidth
              size="small"
              onChange={(e) => setDNI(e.target.value)}
            />
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
        </Grid>
      </Grid>
    </>
  );
}
