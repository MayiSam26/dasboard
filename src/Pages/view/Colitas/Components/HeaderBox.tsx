import { Button, Grid, Stack, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import GridOnIcon from "@mui/icons-material/GridOn";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

interface props {
  setOpenModal?: any;
  onExportExcel?: () => void;
  onExportPDF?: () => void;
  count?: number;
}
export default function HeaderBox({ setOpenModal, onExportExcel, onExportPDF, count }: props) {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Grid item xs={12} md="auto">
          <Typography variant="h4">Mascotas Albergadas</Typography>
          {typeof count === "number" && (
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mt: 0.3 }}>
              {count} {count === 1 ? "mascota registrada" : "mascotas registradas"}
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
              onClick={onExportExcel}
              variant="outlined"
              startIcon={<GridOnIcon />}
            >
              Excel
            </Button>
            <Button
              className="cya-btn-export"
              onClick={onExportPDF}
              variant="outlined"
              startIcon={<PictureAsPdfIcon />}
            >
              PDF
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
