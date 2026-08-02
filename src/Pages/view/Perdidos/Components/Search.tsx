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
  handleSearch: () => void;
  handleStatus: (e: any) => void;
  handleDateTo: (e: any) => void;
  onClear: () => void;
}
export default function Search({
  handleBusqueda,
  handleSearch,
  handleTipoAnimal,
  handleGenero,
  handleStatus,
  handleDateTo,
  onClear,
}: Props) {
  const [showMore, setShowMore] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);

  const handleClear = () => {
    setResetKey((k) => k + 1);
    onClear();
  };

  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)" }}>
            <Grid container spacing={2} sx={{ p: 2, alignItems: "center" }} key={resetKey}>
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="status-select-label">Estado</InputLabel>
                  <Select
                    labelId="status-select-label"
                    defaultValue=""
                    label="Estado"
                    size="small"
                    onChange={(e) => handleStatus(e.target.value)}
                    sx={{ "& .MuiSelect-select": { textAlign: "center" } }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="P">Perdido</MenuItem>
                    <MenuItem value="E">Encontrado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  onClick={handleSearch}
                  fullWidth
                  variant="contained"
                  className="cya-btn-add"
                  startIcon={<SearchIcon />}
                >
                  Buscar
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                md={3}
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
                  <Grid container spacing={2} sx={{ pt: 1 }}>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="genero-select-label">Genero</InputLabel>
                        <Select
                          labelId="genero-select-label"
                          defaultValue=""
                          onChange={(e) => handleGenero(e.target.value)}
                          label="Genero"
                          size="small"
                          sx={{ "& .MuiSelect-select": { textAlign: "center" } }}
                        >
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="1">Macho</MenuItem>
                          <MenuItem value="2">Hembra</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="tipo-select-label">Tipo</InputLabel>
                        <Select
                          labelId="tipo-select-label"
                          defaultValue=""
                          label="Tipo"
                          onChange={(e) => handleTipoAnimal(e.target.value)}
                          size="small"
                          sx={{ "& .MuiSelect-select": { textAlign: "center" } }}
                        >
                          <MenuItem value="">Todos</MenuItem>
                          <MenuItem value="1">Perro</MenuItem>
                          <MenuItem value="2">Gato</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
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
