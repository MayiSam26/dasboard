import { Grid, Stack, Typography } from "@mui/material";
import { Button } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

interface props {
  setOpenModal?: any;
  count?: number;
  onReporte?: () => void;
  generandoReporte?: boolean;
}
export default function HeaderBox({ setOpenModal, count, onReporte, generandoReporte }: props) {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Grid item xs={12} md="auto">
          <Typography variant="h4">Ingresos</Typography>
          {typeof count === "number" && (
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mt: 0.3 }}>
              {count} {count === 1 ? "ingreso registrado" : "ingresos registrados"}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md="auto">
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.2}
            className="cya-table-toolbar"
          >
            <Button
              className="cya-btn-export"
              onClick={onReporte}
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
              disabled={generandoReporte}
            >
              {generandoReporte ? "Generando..." : "Reporte"}
            </Button>
            <Button
              className="cya-btn-add"
              onClick={() => setOpenModal(true)}
              variant="contained"
              startIcon={<AddCircleIcon />}
            >
              Agregar
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}
