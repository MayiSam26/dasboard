import { Grid, Typography } from "@mui/material";

interface props {
  count?: number;
}
export default function HeaderBox({ count }: props) {
  return (
    <>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Grid item xs={12}>
          <Typography variant="h4">Información del Refugio</Typography>
          <Typography variant="body2" sx={{ color: "var(--cya-text-muted)", mt: 0.3 }}>
            {typeof count === "number" && count > 0
              ? "Datos generales que se muestran en el sitio público"
              : "Aún no hay información registrada"}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}
