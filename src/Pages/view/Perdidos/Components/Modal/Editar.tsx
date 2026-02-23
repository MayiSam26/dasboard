import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Grid,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import SaveIcon from "@mui/icons-material/Save";
import moment from "moment";

interface props {
  setOpenModalEdit?: any;
  idapadrinado?: any;
  getApadrinado: () => void;
}

interface autocomplete {
  label: string;
  value: any;
}
export default function Editar({
  setOpenModalEdit,
  idapadrinado,
  getApadrinado,
}: props) {


  const [donante, setDonante] = React.useState<autocomplete[]>([]);
  const[albergados,setAlbergados] = React.useState<autocomplete[]>([])
  const [plan, setPlan] = React.useState<autocomplete[]>([]);


  const [donateSelect, setDonateSelect] = React.useState<any>("");
  const [animalSelect, setAnimalSelect] = React.useState<any>("");
  const [planSelect, setPlanSelect] = React.useState<any>("");
  const [fromto, setFromto] = React.useState<any>(null);

  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const getById = async () => {
    const url = baseurl + "apadrinado/detail/" + idapadrinado;
    axios
      .get(url)
      .then((response) => {
        const { data } = response;
        setDonateSelect(data.data.iddonantes);
        setAnimalSelect(data.data.idanimal);
        setPlanSelect(data.data.idplanmensual)
        setFromto(data.data.Fecha_Apadrinado);
      })
      .catch((e) => console.log(e.message));
  };
  useEffect(() => {
    getById();
  }, []);

  const getDonante = async () => {
    const url = baseurl + "donante/list";
    await axios.get(url).then((response) => {
      const { data } = response;

      const autocompletes: autocomplete[] = [];
      data.data.map((item: any) => {
        const dates = {
          label: item.Nombre + " " + item.Apellido,
          value: item.iddonantes,
        };
        autocompletes.push(dates);
      });

      setDonante(autocompletes);
    });
  };

  const getAlbergados = async () => {
    const url = baseurl + "colitas/list";
    await axios.get(url).then((response) => {
      const { data } = response;
      const autocompletes: autocomplete[] = [];
      data.data.map((item: any) => {
        const dates = {
          label: item.nombre,
          value: item.idanimal,
        };
        autocompletes.push(dates);
      });
      setAlbergados(autocompletes);
    });
  };
  const getPlanesMensual = async () => {
    const url = baseurl + "plan-mensual/list";
    axios.get(url).then((response) => {
      const { data } = response;
      const autocompletes :autocomplete[] = []
        data.data.map((item:any) =>{
            const dates ={
                label:item.nombre,
                value:item.idplanmensual
            }
            autocompletes.push(dates)
        })
        setPlan(autocompletes)
    });
  };

  React.useEffect(() => {
    getPlanesMensual();
  }, []);
  React.useEffect(() => {
    getAlbergados();
  }, []);

  React.useEffect(() => {
    getDonante();
  }, []);

  const handleDonantes = (
    event: React.ChangeEvent<{}>,
    newValue: autocomplete | null
  ) => {
    if (newValue) {
      setDonateSelect(newValue.value);
    } else {
      setDonateSelect(null);
    }
  };
  const handlePlan = (
    event: React.ChangeEvent<{}>,
    newValue: autocomplete | null
  ) => {
    if (newValue) {
      setPlanSelect(newValue.value);
    } else {
      setPlanSelect(null);
    }
  };

  const handleAnimal = (
    event: React.ChangeEvent<{}>,
    newValue: autocomplete | null
  ) => {
    if (newValue) {
      setAnimalSelect(newValue.value);
    } else {
      setAnimalSelect(null);
    }
  };

  const handleFormatTo = async (e: any) => {
    const selectedDate: any = new Date(e.target.value);
    setFromto(moment(selectedDate).add(1, "days").toDate());
  };


  const updateApoderado = () =>{
    const body ={
      iduser:null,
      iddonantes:donateSelect,
      idanimal:animalSelect,
      idplanmensual:planSelect,
      Fecha_Apadrinado:fromto
    }
    const url = baseurl + "apadrinado/update/" + idapadrinado;
    axios
    .put(url,body)
    .then((response) => {
      const { data } = response;
      if(data.code === '000'){
              setSeverity('success');
              setMssg(data.message);
              setOpenAlert(true);
              setTimeout(() =>{
                    setOpenModalEdit(false)
                    getApadrinado()
                },1800)
      }
      console.log("data",data)
      
    }).catch((e) => {
      setSeverity('error');
      setMssg(e.message);
      setOpenAlert(true);
    });
  }
  const alert = () => {
    return (
      <Alert variant="filled" severity={severity}>
        {mssg}
      </Alert>
    );
  };
  const formatDateToString = (date: Date | null) => {
    return date ? moment(date).format("YYYY-MM-DD") : "";
  };
  return (
    <>
      {openAlert ? alert() : null}
      <Grid container spacing={2} sx={{ py: 1, px: 2 }}>
        <Grid item xs={12} sx={{ display: "flex" }}>
          <Grid item xs={9}>
            <Typography variant="h5">Editar Apoderado Mascota</Typography>
          </Grid>
          <Grid item xs={3}>
            <Button
              onClick={updateApoderado}
              fullWidth
              variant="contained"
              sx={{
                background: "#65c178",
                fontWeight: "bolder",
                borderRadius: "20px",
                textTransform: "capitalize",
                "&:hover": {
                  background: "#ed6436",
                },
              }}
            >
              <SaveIcon />
              Actualizar
            </Button>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={donante}
              value={
                donante.find((item) => item.value === donateSelect) ?? null
              }
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Donantes" />
              )}
              onChange={handleDonantes}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={albergados}
              value={
                albergados.find((item) => item.value === donateSelect) ?? null
              }
              size="small"
              fullWidth
              renderInput={(params) => (
                <TextField {...params} label="Donantes" />
              )}
              onChange={handleAnimal}
            />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={plan}
                value={
                  plan.find((item) => item.value === planSelect) ?? null
                }
                size="small"
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Plan Mensual" />
                )}
                onChange={handlePlan}
              />
          </Grid>
          <Grid item xs={12} sx={{ marginTop: "10px" }}>
            <input
              value={formatDateToString(fromto) ?? ""}
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
        </Grid>
      </Grid>
    </>
  );
}
