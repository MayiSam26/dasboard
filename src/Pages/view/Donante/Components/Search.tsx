import { Grid, InputAdornment, Paper, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface Props {
  handleBusqueda: (e: any) => void;
}
export default function Search({ handleBusqueda }: Props) {
  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)" }}>
            <Grid container spacing={2} sx={{ p: 2, alignItems: "center" }}>
              <Grid item xs={12} md={4}>
                <TextField
                  id="outlined-basic"
                  label="Buscar donante"
                  variant="outlined"
                  fullWidth
                  size="small"
                  placeholder="Nombre, RUC o DNI..."
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
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
