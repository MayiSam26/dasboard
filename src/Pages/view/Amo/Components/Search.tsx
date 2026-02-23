import { Button, Grid, Paper, TextField } from "@mui/material";

interface Props {
    handleBusqueda: (e:any) => void
    handleSearch:() => void
}
export default function Search({handleBusqueda,handleSearch}:Props) {
  return (
    <>
      <Grid container spacing={2} sx={{marginBottom:'24px'}}>
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ bgcolor: "background.paper" }}>
            <Grid container spacing={2} sx={{ p: 2, display:'flex', justifyContent:'space-between' }}>
              {/* Contenido dentro del Paper */}
              <Grid item xs={12} md={3}>
                <TextField
                  id="outlined-basic"
                  label="Buscar dueño"
                  variant="outlined"
                  fullWidth
                  size="small"
                  onChange={(e) =>handleBusqueda(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={1} sm={2}>
                <Button
                  onClick={handleSearch}
                  fullWidth
                  variant="contained"
                  color='info'
                  sx={{
                    fontWeight: "bolder",
                    borderRadius:'20px',
                    textTransform: "capitalize",
                    "&:hover": {
                      background: "#ed6436",
                    },
                  }}
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
