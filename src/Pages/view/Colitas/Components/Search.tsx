import {
  Button,
  Collapse,
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
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";

interface Props {
  handleBusqueda: (e: any) => void;
  handleTipoAnimal: (e: any) => void;
  handleGenero: (e: any) => void;
  handleTamno: (e: any) => void;
  handleDateTo: (e: any) => void;
  handleEstado: (e: any) => void;
  onClear: () => void;
}
export default function Search({
  handleBusqueda,
  handleTipoAnimal,
  handleGenero,
  handleTamno,
  handleDateTo,
  handleEstado,
  onClear,
}: Props) {
  const [showMore, setShowMore] = React.useState(false);

  // Los <Select> son no controlados (usan defaultValue), así que para
  // "Limpiar filtros" forzamos un remount cambiando esta key.
  const [resetKey, setResetKey] = React.useState(0);

  const handleClear = () => {
    setResetKey((k) => k + 1);
    onClear();
  };

  const selectSx = { "& .MuiSelect-select": { textAlign: "center" as const } };

  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
        <Grid item xs={12}>
          <Paper
            variant="outlined"
            sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)" }}
          >
            <Grid container spacing={1.5} sx={{ p: 2, alignItems: "center" }} key={resetKey}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  id="outlined-basic"
                  label="Buscar Colitas"
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
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="tipo-select-label">Tipo</InputLabel>
                  <Select
                    labelId="tipo-select-label"
                    id="tipo-select"
                    defaultValue=""
                    label="Tipo"
                    onChange={(e) => handleTipoAnimal(e.target.value)}
                    sx={selectSx}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="1">Gato</MenuItem>
                    <MenuItem value="2">Perro</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel id="estado-select-label">Estado</InputLabel>
                  <Select
                    labelId="estado-select-label"
                    id="estado-select"
                    defaultValue=""
                    label="Estado"
                    onChange={(e) => handleEstado(e.target.value)}
                    sx={selectSx}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="En refugio">En refugio</MenuItem>
                    <MenuItem value="proceso">En proceso</MenuItem>
                    <MenuItem value="adoptado">Adoptado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                md={5}
                sx={{ display: "flex", alignItems: "center", gap: 1, justifyContent: { md: "flex-end" } }}
              >
                <Button
                  className="cya-filters-toggle"
                  onClick={() => setShowMore((v) => !v)}
                  startIcon={<TuneIcon />}
                  endIcon={showMore ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                >
                  Más filtros
                </Button>
                <Button
                  onClick={handleClear}
                  startIcon={<ClearIcon />}
                  size="small"
                  sx={{ color: "var(--cya-text-muted)", textTransform: "none" }}
                >
                  Limpiar
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Collapse in={showMore} timeout="auto" unmountOnExit>
                  <Grid container spacing={1.5} sx={{ pt: 1 }}>
                    <Grid item xs={6} sm={4} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="tamano-select-label">Tamaño</InputLabel>
                        <Select
                          labelId="tamano-select-label"
                          id="tamano-select"
                          defaultValue=""
                          label="Tamaño"
                          onChange={(e) => handleTamno(e.target.value)}
                          sx={selectSx}
                        >
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="mediano">Mediano</MenuItem>
                          <MenuItem value="pequeño">Pequeño</MenuItem>
                          <MenuItem value="grande">Grande</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={4} md={3}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="genero-select-label">Genero</InputLabel>
                        <Select
                          labelId="genero-select-label"
                          id="genero-select"
                          defaultValue=""
                          onChange={(e) => handleGenero(e.target.value)}
                          label="Genero"
                          sx={selectSx}
                        >
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="1">Macho</MenuItem>
                          <MenuItem value="2">Hembra</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                      <input
                        type="date"
                        onChange={(e) => handleDateTo(e.target.value)}
                        style={{
                          padding: "8px",
                          width: "100%",
                          height: "40px",
                          border: "1px solid #c2c2c2",
                          borderRadius: "4px",
                          boxSizing: "border-box",
                        }}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
