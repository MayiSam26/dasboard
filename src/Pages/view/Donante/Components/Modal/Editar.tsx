import {
  Alert,
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
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";

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
  setOpenModalEdit,
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
        <Alert variant="filled" severity={severity} sx={{ borderRadius: 0 }}>
          {mssg}
        </Alert>
      )}

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
              background: "rgba(228, 96, 47, 0.12)",
              color: "var(--cya-primary)",
            }}
          >
            <VolunteerActivismIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Editar Donante
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre completo"
              variant="outlined"
              fullWidth
              size="small"
              value={fullname}
              onChange={(e) => handleFullname(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
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

          <Grid item xs={6}>
            <FormControl fullWidth size="small">
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

          <Grid item xs={6}>
            <TextField
              label="RUC"
              variant="outlined"
              fullWidth
              size="small"
              value={ruc}
              onChange={(e) => handleRuc(e.target.value)}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="DNI"
              variant="outlined"
              fullWidth
              size="small"
              value={dni}
              onChange={(e) => handleDni(e.target.value)}
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
          onClick={() => setOpenModalEdit(false)}
          sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
        >
          Cancelar
        </Button>
        <Button
          onClick={changeEditDonante}
          variant="contained"
          startIcon={<SaveIcon />}
          className="cya-btn-add"
        >
          Guardar
        </Button>
      </Box>
    </>
  );
}
