import {
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

  interface Props {
    handleBusqueda: (e: any) => void;
    handleTipoAnimal: (e: any) => void;
    handleGenero: (e: any) => void;
    handleTamno: (e: any) => void;
    handleDateTo: (e: any) => void;
  }
  export default function Search({
    handleBusqueda,
    handleTipoAnimal,
    handleGenero,
    handleTamno,
    handleDateTo
  }: Props) {
    return (
      <>
        <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
          <Grid item xs={12}>
            <Paper variant="outlined" sx={{ bgcolor: "background.paper" }}>
              <Grid container spacing={5} sx={{ p: 2 }}>
                {/* Contenido dentro del Paper */}
                <Grid item xs={12} md={3}>
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
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tamaño</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue=""
                      label="Estado"
                      size="small"
                      onChange={(e) => handleTamno(e.target.value)}
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="mediano">Mediano</MenuItem>
                      <MenuItem value="pequeño">Pequeño</MenuItem>
                      <MenuItem value="grande">Grande</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Genero</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue=""
                      onChange={(e) => handleGenero(e.target.value)}
                      label="Genero"
                      size="small"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="1">Macho</MenuItem>
                      <MenuItem value="2">Hembra</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={2}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      defaultValue=""
                      label="Tipo"
                      onChange={(e) => handleTipoAnimal(e.target.value)}
                      size="small"
                    >
                      <MenuItem value="">Todos</MenuItem>
                      <MenuItem value="1">Gato</MenuItem>
                      <MenuItem value="2">Perro</MenuItem>
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
                      border: "1px solid #c2c2c2",
                      borderRadius: "4px",
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
