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
  setOpenModalEdit: any;
  getDonante: () => void;
  Editdonante: any;
  handleFullname: (value: string) => void;
  handleRedsocial: (value: string) => void;
  handleIdtipopersona: (value: string) => void;
  handleRuc: (value: string) => void;
  handleDni: (value: string) => void;
  changeEditDonante: () => void;
  severity: any;
  mssg: any;
  openAlert: any;
  fullname :string;
  redsocial :string;
  idtipopersona :string;
  ruc :string;
  dni :string;
}

interface autocomplete {
  label: string;
  value: any;
}
export default function Editar({
  setOpenModalEdit,
  getDonante,
  Editdonante,
  handleFullname,
  handleRedsocial,
  handleIdtipopersona,
  handleRuc,
  handleDni,
  changeEditDonante,
  fullname,
  redsocial,
  idtipopersona,
  ruc,
  dni,
  severity,
  mssg,
  openAlert,
}: props) {
    const Alerts = () => {
      return (
        <Alert variant="filled" severity={severity}>
          {mssg}
        </Alert>
      );
    };
  return (
    <>
      {openAlert ? Alerts() : null}
      <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
        <Grid item xs={12} sx={{ display: "flex" }}>
          <Grid item xs={10}>
            <Typography variant="h5">Editar Donante</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
              onClick={changeEditDonante}
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
              value={fullname ?? ""}
              onChange={(e) => handleFullname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Red Social</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                value={redsocial ?? ""}
                onChange={(e) => handleRedsocial(e.target.value)}
                label="Red Social"
                size="small"
              >
                <MenuItem value="Facebook">Facebook</MenuItem>
                <MenuItem value="Instagram">Instagram</MenuItem>
                <MenuItem value="Tiktok">Tiktok</MenuItem>
                <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                <MenuItem value="Ninguno">Ninguno</MenuItem>
              </Select>
            </FormControl>
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
                value={idtipopersona ?? ""}
                onChange={(e) => handleIdtipopersona(e.target.value)}
                label="Tipo Persona"
                size="small"
              >
                <MenuItem value="1">Persona Natural</MenuItem>
                <MenuItem value="2">Persona Juridica</MenuItem>
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
              value={ruc ?? ""}
              onChange={(e) => handleRuc(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <TextField
              id="outlined-basic"
              label="Ingrese DNI"
              variant="outlined"
              fullWidth
              size="small"
              value={dni ?? ""}
              onChange={(e) => handleDni(e.target.value)}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
