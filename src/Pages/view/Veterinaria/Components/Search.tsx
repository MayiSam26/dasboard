import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";

const TIPOS = ["Diagnóstico", "Vacuna", "Tratamiento", "Esterilización", "Control médico"];

interface Props {
  busqueda: string;
  tipoFiltro: string;
  desde: string;
  hasta: string;
  handleBusqueda: (v: string) => void;
  handleTipoFiltro: (v: string) => void;
  handleDesde: (v: string) => void;
  handleHasta: (v: string) => void;
  handleLimpiar: () => void;
}
export default function Search({
  busqueda,
  tipoFiltro,
  desde,
  hasta,
  handleBusqueda,
  handleTipoFiltro,
  handleDesde,
  handleHasta,
  handleLimpiar,
}: Props) {
  // Rango invertido: se avisa en la UI y el padre no consulta hasta corregirlo.
  const rangoInvalido = Boolean(desde && hasta && desde > hasta);
  const hayFiltros = Boolean(busqueda || tipoFiltro || desde || hasta);

  return (
    <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)" }}>
          <Grid container spacing={2} sx={{ p: 2, alignItems: "flex-start" }}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Buscar por mascota"
                variant="outlined"
                fullWidth
                size="small"
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="tipo-vet-label">Tipo</InputLabel>
                <Select
                  labelId="tipo-vet-label"
                  label="Tipo"
                  value={tipoFiltro}
                  onChange={(e) => handleTipoFiltro(e.target.value)}
                  sx={{ "& .MuiSelect-select": { textAlign: "center" } }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {TIPOS.map((t) => (
                    <MenuItem key={t} value={t}>
                      {t}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="Desde"
                type="date"
                variant="outlined"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={desde}
                onChange={(e) => handleDesde(e.target.value)}
              />
            </Grid>
            <Grid item xs={6} md={2}>
              <TextField
                label="Hasta"
                type="date"
                variant="outlined"
                fullWidth
                size="small"
                InputLabelProps={{ shrink: true }}
                value={hasta}
                onChange={(e) => handleHasta(e.target.value)}
                error={rangoInvalido}
                helperText={rangoInvalido ? "Debe ser posterior a «Desde»" : ""}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                variant="outlined"
                fullWidth
                size="medium"
                startIcon={<FilterAltOffIcon />}
                disabled={!hayFiltros}
                onClick={handleLimpiar}
                sx={{ height: "40px", textTransform: "none" }}
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
