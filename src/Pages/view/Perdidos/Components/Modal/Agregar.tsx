import {
    Alert,
    Autocomplete,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
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
            <Alert variant="filled" severity={severity}>
                {mssg}
            </Alert>
        );
    };
    return (
        <>
            {openAlert ? alert() : null}
            <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
                <Grid item xs={12} sx={{ display: "flex" }}>
                    <Grid item xs={10}>
                        <Typography variant="h5">Agregar Mascota Perdida</Typography>
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            onClick={saveApadrinado}
                            fullWidth
                            variant="contained"
                            sx={{
                                background: "#65c178",
                                borderRadius: "20px",
                                fontWeight: "bolder",
                                textTransform: "capitalize",
                                "&:hover": {
                                    background: "#ed6436",
                                },
                            }}
                        >
                            <SaveIcon />
                            Save
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid item xs={12} sx={{ marginTop: "10px", marginBottom: "10px" }}>
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
                    <Grid item xs={12} sx={{ marginTop: "10px" }}>
                        <TextField
                            id="outlined-basic"
                            label="Ingrese Nombre"
                            variant="outlined"
                            fullWidth
                            size="small"
                        //onChange={(e) => setNombre(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={12} md={12} sx={{ marginTop: "10px" }}>
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
                    <Grid container spacing={2} sx={{ marginTop: "5px" }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tamaño</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    //value={age}
                                    //onChange={(e) => handleGenero(e.target.value)}
                                    label="Tamaño"
                                    size="small"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="pequeño">Pequeño</MenuItem>
                                    <MenuItem value="mediano">Mediano</MenuItem>
                                    <MenuItem value="grande">Grande</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    //value={age}
                                    //onChange={(e) => handleTipoAnimal(e.target.value)}
                                    label="Estado"
                                    size="small"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="P">Perdido</MenuItem>
                                    <MenuItem value="E">Encontrado</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ marginTop: "5px" }}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Genero</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    //value={age}
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
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    //value={age}
                                    onChange={(e) => handleTipoAnimal(e.target.value)}
                                    label="Tipo"
                                    size="small"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="1">Perro</MenuItem>
                                    <MenuItem value="2">Gato</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} sx={{ marginTop: "10px" }}>
                        <textarea
                            placeholder="Ingrese Observaciones"
                            //value={descripcion ?? ""}
                            //onChange={(e) => setDescripcion(e.target.value)}
                            style={{
                                width: "100%",
                                borderRadius: "4px",
                                border: "1px solid #c2c2c2",
                                padding: "9px",
                                maxHeight: "300px",
                                height: "130px",
                                fontFamily: "inherit",
                            }}
                        ></textarea>
                    </Grid>

                    <Grid item xs={12} md={12} sx={{ marginTop: "10px" }}>
                        <input
                            type="date"
                            onChange={handleFormatTo}
                            style={{
                                padding: "8px",
                                width: "100%",
                                border: "1px solid #c2c2c2",
                                borderRadius: "4px",
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={12} sx={{ marginTop: "10px" }}>
                        <input
                            type="file"
                            style={{
                                border: '1px solid #c2c2c2',
                                padding: '8px',
                                width: '100%',
                                borderRadius: '4px'
                            }}
                            //onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}
