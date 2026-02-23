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
import SaveIcon from "@mui/icons-material/Save";

interface props {
  setOpenModalEdit: (value: boolean) => void;
  getDonante: () => void;

  handleFullname: (value: string) => void;
  handleRedsocial: (value: string) => void;
  handleIdtipopersona: (value: string) => void;
  handleRuc: (value: string) => void;
  handleDni: (value: string) => void;

  changeEditDonante: () => void;

  severity: "success" | "error" | "info" | "warning";
  mssg: string;
  openAlert: boolean;

  fullname: string;
  redsocial: string;
  idtipopersona: string;
  ruc: string;
  dni: string;
}

export default function Editar({
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

  return (
    <>
      {openAlert && (
        <Alert variant="filled" severity={severity} sx={{ mb: 2 }}>
          {mssg}
        </Alert>
      )}

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
          <TextField
            label="Ingrese Nombre completo"
            variant="outlined"
            fullWidth
            size="small"
            value={fullname}
            onChange={(e) => handleFullname(e.target.value)}
            sx={{ mt: 1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Red Social</InputLabel>
            <Select
              value={redsocial}
              onChange={(e) => handleRedsocial(e.target.value)}
              label="Red Social"
            >
              <MenuItem value="Facebook">Facebook</MenuItem>
              <MenuItem value="Instagram">Instagram</MenuItem>
              <MenuItem value="Tiktok">Tiktok</MenuItem>
              <MenuItem value="WhatsApp">WhatsApp</MenuItem>
              <MenuItem value="Ninguno">Ninguno</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth size="small" sx={{ mt: 1 }}>
            <InputLabel>Tipo Persona</InputLabel>
            <Select
              value={idtipopersona}
              onChange={(e) => handleIdtipopersona(e.target.value)}
              label="Tipo Persona"
            >
              <MenuItem value="1">Persona Natural</MenuItem>
              <MenuItem value="2">Persona Jurídica</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Ingrese Ruc"
            variant="outlined"
            fullWidth
            size="small"
            value={ruc}
            onChange={(e) => handleRuc(e.target.value)}
            sx={{ mt: 1 }}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            label="Ingrese DNI"
            variant="outlined"
            fullWidth
            size="small"
            value={dni}
            onChange={(e) => handleDni(e.target.value)}
            sx={{ mt: 1 }}
          />
        </Grid>
      </Grid>
    </>
  );
}
