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

interface props {
  setOpenModalEdit?: any;
  idAnimal?: any;
  getAlbergados: () => void;
}
export default function Editar({
  setOpenModalEdit,
  idAnimal,
  getAlbergados,
}: props) {
  const [file, setFile] = React.useState<any>("");
  const [foto, setFoto] = React.useState("");
  const [motivo, setMotivo] = React.useState("");
  const [esterelizado, setEsterilizado] = React.useState("");


  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "colitas/detail/" + idAnimal;
    axios.get(url).then((response) => {
      const { data } = response;
     
      setFoto(data.data.foto); 
      setMotivo(data.data.observaciones);
      setEsterilizado(data.data.esterelizacion)
    });
  };
  useEffect(() => {
    getById();
  }, []);

  const updateData = async() =>{
    const url=baseurl+'colitas/update/'+idAnimal
    
    const formData = new FormData();
        formData.append('esterelizacion', esterelizado);
        formData.append('observaciones', motivo);
        formData.append('foto', file);
    axios.put(url,formData)
    .then((response:any) =>{
        const { data } = response
        if(data.code === '000'){

            setOpenAlert(true)
            setSeverity('success')
            setMssg(data.message)
            setTimeout(() =>{
                setOpenModalEdit(false)
                getAlbergados()
            },1800)
        }
    })
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
            <Typography variant="h5">Editar Plan</Typography>
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
              <InputLabel id="demo-simple-select-label">Esterilizado</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={esterelizado ?? ""}
                label="Esterilizado"
                onChange={(e) => setEsterilizado(e.target.value)}
                size="small"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Si">Si</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <textarea
              placeholder="Ingrese Observaciones"
              value={motivo ?? ""}
              onChange={(e) => setMotivo(e.target.value)}
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
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <img
              src={`${baseurl}${foto}`}
              alt=""
              width="100px"
              height="100px"
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <input
              type="file"
              style={{
                border: "1px solid #c2c2c2",
                padding: "8px",
                width: "100%",
                borderRadius: "4px",
              }}
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
