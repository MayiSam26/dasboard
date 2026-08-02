import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  handleBusqueda: (e: any) => void;
  handleSearch: () => void;
  handleDateTo: (e: any) => void;
}
export default function Search({ handleBusqueda, handleSearch, handleDateTo }: Props) {
  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)" }}>
            <Grid container spacing={2} sx={{ p: 2, alignItems: "center" }}>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="estado-select-label">Estado</InputLabel>
                  <Select
                    labelId="estado-select-label"
                    defaultValue=""
                    label="Estado"
                    size="small"
                    onChange={(e) => handleBusqueda(e.target.value)}
                    sx={{ "& .MuiSelect-select": { textAlign: "center" } }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="proceso">Proceso</MenuItem>
                    <MenuItem value="adoptado">Adoptado</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
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
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
