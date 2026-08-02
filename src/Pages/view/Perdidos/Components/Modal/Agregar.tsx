import {
    Alert,
    Autocomplete,
    Box,
    Button,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";

interface props {
    setOpenModal: any;
    getPerdidos: () => void;
}

interface autocomplete {
    label: string;
    value: any;
}
export default function Agregar({ setOpenModal, getPerdidos }: props) {
    const [amo, setAmo] = React.useState<autocomplete[]>([]);

// 👇 ESTAS SON LAS 3 LÍNEAS QUE FALTABAN 👇
  const [openAlert, setOpenAlert] = React.useState(false)
  const [mssg, setMssg] = React.useState("")
  const [severity, setSeverity] = React.useState<any>("success")
  // 👆 ===================================== 👆

  // AGREGA ESTO PARA QUE TUS INPUTS FUNCIONEN:
    const [nombre, setNombre] = React.useState("");
    const [edad, setEdad] = React.useState("");
    const [descripcion, setDescripcion] = React.useState("");
    const [file, setFile] = React.useState<any>(null);

    // form
    const [amoSelect, setAmoSelect] = React.useState<any>("");
    const [genero, setGenero] = React.useState<any>("");
    const [tipoAnimal, setTipoAnimal] = React.useState<any>("");
    const [fromto, setFromto] = React.useState<any>(null);
    const saveApadrinado = async () => {
        const body = {};
    };

    //search
    const getAmo = async () => {
        const url = baseurl + "amo/list";
        const body = {
            busqueda: "",
        };
        await axios.post(url, body).then((response) => {
            const { data } = response;
            console.log(data)
            const autocompletes: autocomplete[] = [];
            data.data.map((item: any) => {
                const dates = {
                    label: item.nombre,
                    value: item.iddueno,
                };
                autocompletes.push(dates);
            });

            setAmo(autocompletes);
        });
    };

    React.useEffect(() => {
        getAmo();
    }, []);

    const handleGenero = (value: any) => {
        setGenero(value);
    };

    const handleTipoAnimal = (value: any) => {
        setTipoAnimal(value);
    };

    const handleDonantes = (
        event: React.ChangeEvent<{}>,
        newValue: autocomplete | null
    ) => {
        if (newValue) {
            setAmoSelect(newValue.value);
        } else {
            setAmoSelect(null);
        }
    };

    const handleFormatTo = async (e: any) => {
        const selectedDate: any = new Date(e.target.value);
        setFromto(moment(selectedDate).add(1, "days").toDate());
    };

    const alert = () => {
        return (
            <Alert variant="filled" severity={severity} sx={{ borderRadius: 0 }}>
                {mssg}
            </Alert>
        );
    };
    return (
        <>
            {openAlert ? alert() : null}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2.2,
                borderBottom: "1px solid var(--cya-border)",
                background: "var(--cya-bg-alt)",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(63, 158, 92, 0.14)",
                    color: "var(--cya-secondary-dark)",
                  }}
                >
                  <SearchOffIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
                  Agregar Mascota Perdida
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenModal(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ px: 3, py: 2.5 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={amo}
                        size="small"
                        fullWidth
                        renderInput={(params) => (
                            <TextField {...params} label="Amo" />
                        )}
                        onChange={handleDonantes}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-basic"
                        label="Ingrese Nombre"
                        variant="outlined"
                        fullWidth
                        size="small"
                    //onChange={(e) => setNombre(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        id="outlined-basic"
                        label="Ingrese edad"
                        variant="outlined"
                        type="number"
                        fullWidth
                        size="small"
                    //onChange={(e) => setNombre(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label">Tamaño</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            //value={age}
                            //onChange={(e) => handleGenero(e.target.value)}
                            label="Tamaño"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="pequeño">Pequeño</MenuItem>
                            <MenuItem value="mediano">Mediano</MenuItem>
                            <MenuItem value="grande">Grande</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label2">Estado</InputLabel>
                        <Select
                            labelId="demo-simple-select-label2"
                            id="demo-simple-select2"
                            //value={age}
                            //onChange={(e) => handleTipoAnimal(e.target.value)}
                            label="Estado"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="P">Perdido</MenuItem>
                            <MenuItem value="E">Encontrado</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label3">Genero</InputLabel>
                        <Select
                            labelId="demo-simple-select-label3"
                            id="demo-simple-select3"
                            //value={age}
                            onChange={(e) => handleGenero(e.target.value)}
                            label="Genero"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="1">Macho</MenuItem>
                            <MenuItem value="2">Hembra</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="demo-simple-select-label4">Tipo</InputLabel>
                        <Select
                            labelId="demo-simple-select-label4"
                            id="demo-simple-select4"
                            //value={age}
                            onChange={(e) => handleTipoAnimal(e.target.value)}
                            label="Tipo"
                        >
                            <MenuItem value="">Todos</MenuItem>
                            <MenuItem value="1">Perro</MenuItem>
                            <MenuItem value="2">Gato</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
                      Observaciones
                    </Typography>
                    <textarea
                        placeholder="Ingrese Observaciones"
                        //value={descripcion ?? ""}
                        //onChange={(e) => setDescripcion(e.target.value)}
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            border: "1px solid var(--cya-border)",
                            padding: "10px",
                            maxHeight: "300px",
                            height: "110px",
                            fontFamily: "inherit",
                            boxSizing: "border-box",
                        }}
                    ></textarea>
                </Grid>

                <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
                      Fecha de extravío
                    </Typography>
                    <input
                        type="date"
                        onChange={handleFormatTo}
                        style={{
                            padding: "8px",
                            width: "100%",
                            border: "1px solid var(--cya-border)",
                            borderRadius: "8px",
                            boxSizing: "border-box",
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
                      Foto
                    </Typography>
                    <input
                        type="file"
                        accept="image/*"
                        style={{
                            border: '1px solid var(--cya-border)',
                            padding: '8px',
                            width: '100%',
                            borderRadius: '8px',
                            boxSizing: "border-box",
                        }}
                        //onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    />
                </Grid>
              </Grid>
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1.2,
                px: 3,
                py: 2,
                borderTop: "1px solid var(--cya-border)",
              }}
            >
              <Button
                onClick={() => setOpenModal(false)}
                sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
              >
                Cancelar
              </Button>
              <Button
                onClick={saveApadrinado}
                variant="contained"
                startIcon={<SaveIcon />}
                className="cya-btn-add"
              >
                Guardar
              </Button>
            </Box>
        </>
    );
}
