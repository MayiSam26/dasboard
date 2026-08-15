import { Alert, Box, Button, Typography } from "@mui/material";
import React from "react";

import axios from "axios";
import baseurl from "../../../../../Config/axios";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

interface props {
  setOpenModalDelete: any;
  idvisita: any;
  getVisitas: () => void;
}
export default function Delete({ setOpenModalDelete, idvisita, getVisitas }: props) {
  const [severity, setSeverity] = React.useState<any>("");
  const [mssg, setMssg] = React.useState<any>("");
  const [openAlert, setOpenAlert] = React.useState<boolean>(false);

  const onDelete = () => {
    const url = baseurl + "voluntario-visita/delete/" + idvisita;
    axios
      .delete(url)
      .then((response) => {
        const { data } = response;
        if (data.code === "000") {
          setSeverity("success");
          setMssg(data.message);
          setOpenAlert(true);
          setTimeout(() => {
            setOpenModalDelete(false);
            getVisitas();
          }, 1500);
        } else {
          setSeverity("error");
          setMssg(data.message || "Error al eliminar");
          setOpenAlert(true);
        }
      })
      .catch((err) => {
        setSeverity("error");
        setMssg(err?.response?.data?.message || err.message);
        setOpenAlert(true);
      });
  };

  return (
    <>
      {openAlert && (
        <Alert variant="filled" severity={severity} sx={{ borderRadius: 0 }}>
          {mssg}
        </Alert>
      )}
      <Box sx={{ px: 3, py: 3.5, textAlign: "center" }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(192, 57, 43, 0.12)",
            color: "#c0392b",
            mx: "auto",
            mb: 1.5,
          }}
        >
          <WarningAmberIcon />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: "var(--cya-dark)" }}>
          Eliminar Visita
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mt: 0.5 }}>
          ¿Estás segura? Esta acción no se puede deshacer.
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1.2,
          px: 3,
          py: 2.5,
          borderTop: "1px solid var(--cya-border)",
        }}
      >
        <Button
          variant="outlined"
          sx={{ textTransform: "none", minWidth: 120 }}
          onClick={() => setOpenModalDelete(false)}
        >
          Cancelar
        </Button>
        <Button onClick={onDelete} variant="contained" color="error" sx={{ textTransform: "none", minWidth: 120 }}>
          Eliminar
        </Button>
      </Box>
    </>
  );
}
