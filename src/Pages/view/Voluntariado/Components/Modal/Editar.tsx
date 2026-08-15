import {
    Alert,
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EventIcon from "@mui/icons-material/Event";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";

interface props {
    setOpenModalEdit: any;
    visita: any;
    getVisitas: () => void;
}

export default function Editar({ setOpenModalEdit, visita, getVisitas }: props) {
    const [fecha, setFecha] = React.useState("");
    const [nota, setNota] = React.useState("");
    const [estado, setEstado] = React.useState("Pendiente");

    const [severity, setSeverity] = React.useState<any>("");
    const [mssg, setMssg] = React.useState<any>("");
    const [openAlert, setOpenAlert] = React.useState<boolean>(false);

    React.useEffect(() => {
        setFecha(visita?.fecha ? moment(visita.fecha).format("YYYY-MM-DD") : "");
        setNota(visita?.nota || "");
        setEstado(visita?.Estado || "Pendiente");
    }, [visita]);

    const actualizar = async () => {
        if (!fecha) {
            setSeverity("warning");
            setMssg("La fecha de la visita es obligatoria.");
            setOpenAlert(true);
            return;
        }
        const url = baseurl + "voluntario-visita/update/" + visita.idvisita;
        const body = { fecha, nota: nota.trim() || null, Estado: estado };

        try {
            const response: any = await axios.put(url, body);
            const { data } = response;
            if (data.code === "000") {
                setSeverity("success");
                setMssg(data.message);
                setOpenAlert(true);
                getVisitas();
                setTimeout(() => {
                    setOpenModalEdit(false);
                }, 1500);
            } else {
                setSeverity("error");
                setMssg(data.message);
                setOpenAlert(true);
            }
        } catch (e: any) {
            setSeverity("error");
            setMssg(e?.response?.data?.message || e.message || "No se pudo actualizar.");
            setOpenAlert(true);
        }
    };

    const nombreVoluntario = visita?.voluntario
        ? `${visita.voluntario.nombres || ""} ${visita.voluntario.apellidos || ""}`.trim() || visita.voluntario.usuario
        : "—";

    return (
        <>
            {openAlert && (
                <Alert variant="filled" severity={severity} sx={{ borderRadius: 0 }}>
                    {mssg}
                </Alert>
            )}

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
                    background: "rgba(228, 96, 47, 0.12)",
                    color: "var(--cya-primary)",
                  }}
                >
                  <EventIcon fontSize="small" />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
                  Editar Visita
                </Typography>
              </Box>
              <IconButton onClick={() => setOpenModalEdit(false)} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <Box sx={{ px: 3, py: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    label="Voluntario"
                    variant="outlined"
                    fullWidth
                    size="small"
                    value={nombreVoluntario}
                    disabled
                />
                <Box>
                    <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mb: 0.5 }}>
                      Fecha de la visita *
                    </Typography>
                    <input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        style={{
                            padding: "8px",
                            width: "100%",
                            border: "1px solid var(--cya-border)",
                            borderRadius: "8px",
                            boxSizing: "border-box",
                        }}
                    />
                </Box>
                <TextField
                    label="Nota"
                    variant="outlined"
                    fullWidth
                    size="small"
                    multiline
                    minRows={2}
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    helperText="Opcional"
                />
                <FormControl fullWidth size="small">
                    <InputLabel id="estado-visita-label">Estado</InputLabel>
                    <Select
                        labelId="estado-visita-label"
                        value={estado}
                        onChange={(e) => setEstado(e.target.value)}
                        label="Estado"
                    >
                        <MenuItem value="Pendiente">Pendiente</MenuItem>
                        <MenuItem value="Realizado">Realizado</MenuItem>
                    </Select>
                </FormControl>
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
                onClick={() => setOpenModalEdit(false)}
                sx={{ textTransform: "none", color: "var(--cya-text-muted)" }}
              >
                Cancelar
              </Button>
              <Button onClick={actualizar} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
                Guardar
              </Button>
            </Box>
        </>
    );
}
