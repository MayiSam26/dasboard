import { Button, Collapse, Grid, InputAdornment, Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";

import { soloDigitos, propsNumericos, LARGO_TELEFONO } from "../../../../utils/campos";
interface Props {
  handleBusqueda: (e: any) => void;
  handleDateTo: (e: any) => void;
  handleTelefono: (e: any) => void;
  onClear: () => void;
}
export default function Search({ handleBusqueda, handleDateTo, handleTelefono, onClear }: Props) {
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
            <Grid container spacing={1.5} sx={{ p: 2, alignItems: "center" }} key={resetKey}>
              <Grid item xs={12} sm={6} md={5}>
                <TextField
                  id="outlined-basic"
                  label="Buscar Adoptante"
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder="Nombre, apellido o DNI..."
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
              <Grid
                item
                xs={12}
                md={7}
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
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Teléfono / Celular"
                        variant="outlined"
                        fullWidth
                        size="small"
                        placeholder="Escribe un número..."
                        inputProps={propsNumericos(LARGO_TELEFONO)}
                        onChange={(e) => handleTelefono(soloDigitos(e.target.value, LARGO_TELEFONO))}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
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
