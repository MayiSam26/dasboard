import {
  Alert,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";

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
            <Typography variant="h5">Actualizar Estado de Adopcion</Typography>
          </Grid>
          <Grid item xs={2}>
            <Button
             onClick={updateData}
              fullWidth
              variant="contained"
              sx={{
                background: "#65c178",
                fontWeight: "bolder",
                textTransform: "capitalize",
                "&:hover": {
                  background: "#ed6436",
                },
              }}
            >
                Actualizar
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
        
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Estado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                //value={age}
                label="Estado"
                size="small"
                value={status ?? ""}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="proceso">Proceso</MenuItem>
                <MenuItem value="adoptado">Adoptado</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
