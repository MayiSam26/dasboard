import {
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
  } from "@mui/material";
  import SearchIcon from "@mui/icons-material/Search";
  
  interface Props {
    handleBusqueda: (e: any) => void;
    
    handleSearch: () => void;

    handleDateTo: (e: any) => void;
  }
  export default function Search({
    handleBusqueda,
    handleSearch,
    handleDateTo
  }: Props) {
    return (
      <>
        <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ bgcolor: "background.paper" }}>
              <Grid container spacing={5} sx={{ p: 2 }}>
                {/* Contenido dentro del Paper */}
               
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Estados</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      //value={age}
                      label="Estados"
                      size="small"
                      onChange={(e) => handleBusqueda(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="proceso">proceso</MenuItem>
                      <MenuItem value="adoptado">adoptado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <input
                    type="date"
                    onChange={(e) => handleDateTo(e.target.value)}
                    style={{
                      padding: "8px",
                      width: "100%",
                      border: "1px solid #c2c2c2",
                      borderRadius: "4px",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2} sm={2}>
                  <Button
                    onClick={handleSearch}
                    fullWidth
                    variant="contained"
                    color="info"
                    sx={{
                      fontWeight: "bolder",
                      borderRadius: "20px",
                      textTransform: "capitalize",
                      "&:hover": {
                        background: "#ed6436",
                      },
                    }}
                  >
                    <SearchIcon />
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
  