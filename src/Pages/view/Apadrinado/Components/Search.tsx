import {
  Button,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";

interface Props {
  handleBusqueda: (e: any) => void;
  handleTipo: (e: any) => void;
  handleEstado: (e: any) => void;
  onClear: () => void;
}
export default function Search({ handleBusqueda, handleTipo, handleEstado, onClear }: Props) {
  // Los <Select> son no controlados (usan defaultValue), así que para
  // "Limpiar filtros" forzamos un remount cambiando esta key.
  const [resetKey, setResetKey] = React.useState(0);

  const handleClear = () => {
    setResetKey((k) => k + 1);
    onClear();
  };

  const selectSx = { "& .MuiSelect-select": { textAlign: "center" as const } };

  return (
    <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)" }}>
          <Grid container spacing={1.5} sx={{ p: 2, alignItems: "center" }} key={resetKey}>
            <Grid item xs={12} sm={6} md={5}>
              <TextField
                label="Buscar por padrino"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Escribe un nombre..."
                onChange={(e) => handleBusqueda(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="tipo-apadrinamiento-select-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-apadrinamiento-select-label"
                  defaultValue=""
                  label="Tipo"
                  size="small"
                  onChange={(e) => handleTipo(e.target.value)}
                  sx={selectSx}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Mensual">Mensual</MenuItem>
                  <MenuItem value="Único">Único</MenuItem>
                  <MenuItem value="Alimentación">Alimentación</MenuItem>
                  <MenuItem value="Médico">Médico</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel id="estado-apadrinamiento-select-label">Estado</InputLabel>
                <Select
                  labelId="estado-apadrinamiento-select-label"
                  defaultValue=""
                  label="Estado"
                  size="small"
                  onChange={(e) => handleEstado(e.target.value)}
                  sx={selectSx}
                >
                  <MenuItem value="">Todos</MenuItem>
                  <MenuItem value="Activo">Activo</MenuItem>
                  <MenuItem value="Finalizado">Finalizado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={2}
              sx={{ display: "flex", alignItems: "center", justifyContent: { md: "flex-end" } }}
            >
              <Button
                onClick={handleClear}
                startIcon={<ClearIcon />}
                size="small"
                sx={{ color: "var(--cya-text-muted)", textTransform: "none" }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
