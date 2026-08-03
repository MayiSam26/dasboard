import { FormControl, Grid, InputLabel, MenuItem, Paper, Select, TextField } from "@mui/material";

const TIPOS = ["Diagnóstico", "Vacuna", "Tratamiento", "Esterilización", "Control médico"];

interface Props {
  busqueda: string;
  tipoFiltro: string;
  handleBusqueda: (v: string) => void;
  handleTipoFiltro: (v: string) => void;
}
export default function Search({ busqueda, tipoFiltro, handleBusqueda, handleTipoFiltro }: Props) {
  return (
    <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)" }}>
          <Grid container spacing={2} sx={{ p: 2, alignItems: "center" }}>
            <Grid item xs={12} md={5}>
              <TextField
                label="Buscar por mascota"
                variant="outlined"
                fullWidth
                size="small"
                value={busqueda}
                onChange={(e) => handleBusqueda(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={5}>
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
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
