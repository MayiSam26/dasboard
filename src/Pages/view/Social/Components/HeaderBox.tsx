import { Button, Grid, Typography } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface props {
  setOpenModal: any;
  count?: number;
}
export default function HeaderBox({ setOpenModal, count }: props) {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Grid item xs={12} md="auto">
          <Typography variant="h4">Redes Sociales</Typography>
          {typeof count === "number" && (
            <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mt: 0.3 }}>
              {count} {count === 1 ? "red social registrada" : "redes sociales registradas"}
            </Typography>
          )}
        </Grid>
        <Grid item xs={12} md="auto">
          <Button
            className="cya-btn-add"
            onClick={() => setOpenModal(true)}
            variant="contained"
            startIcon={<AddCircleIcon />}
          >
            Agregar
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
