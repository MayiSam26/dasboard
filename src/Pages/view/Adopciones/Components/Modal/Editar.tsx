import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";

interface props {
  setOpenModalEdit?: any;
  idAdopcion?: any;
  getAdopciones: () => void;
  updates:() => void
}
export default function Editar({
  setOpenModalEdit,
  idAdopcion,
  getAdopciones,
  updates
}: props) {
  const [status, setStatus] = React.useState<any>("");
 
  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "adopciones/detail/" + idAdopcion;
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setStatus(data.data.Estado);
      })
      .catch((e) => console.log(e.message));
  };
  useEffect(() => {
    getById();
  }, []);

  const updateData = async() =>{
    const url=baseurl+'adopciones/update/'+idAdopcion
    const body = {
        Estado:status,
    }
    axios.put(url,body)
    .then((response:any) =>{
        const { data } = response
        if(data.code === '000'){
            setSeverity('success');
            setMssg(data.message);
            setOpenAlert(true);
            updates()
            setTimeout(() =>{
                  setOpenModalEdit(false)
                  getAdopciones()
              },1800)

        }
    }).catch((e:any)=>{console.log(e.message)})
}
  
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
              background: "rgba(228, 96, 47, 0.12)",
              color: "var(--cya-primary)",
            }}
          >
            <FavoriteIcon fontSize="small" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
            Actualizar Estado de Adopción
          </Typography>
        </Box>
        <IconButton onClick={() => setOpenModalEdit(false)} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: 3, py: 2.5 }}>
        <FormControl fullWidth size="small">
          <InputLabel id="demo-simple-select-label">Estado</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            label="Estado"
            value={status ?? ""}
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="proceso">Proceso</MenuItem>
            <MenuItem value="adoptado">Adoptado</MenuItem>
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
        <Button onClick={updateData} variant="contained" startIcon={<SaveIcon />} className="cya-btn-add">
          Actualizar
        </Button>
      </Box>
    </>
  );
}
