import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import React from "react";

interface Voluntario {
  label: string;
  value: number;
}

interface Props {
  voluntarios: Voluntario[];
  handleVoluntario: (e: any) => void;
  handleMes: (e: any) => void;
  onClear: () => void;
}
export default function Search({ voluntarios, handleVoluntario, handleMes, onClear }: Props) {
  // El <Select> es no controlado (usa defaultValue), así que para "Limpiar
  // filtros" forzamos un remount cambiando esta key.
  const [resetKey, setResetKey] = React.useState(0);

  const handleClear = () => {
    setResetKey((k) => k + 1);
    onClear();
  };

  return (
    <Grid container spacing={2} sx={{ marginBottom: "24px" }}>
      <Grid item xs={12}>
        <Paper variant="outlined" sx={{ bgcolor: "background.paper", borderColor: "var(--cya-border)" }}>
          <Grid container spacing={1.5} sx={{ p: 2, alignItems: "center" }} key={resetKey}>
            <Grid item xs={12} sm={6} md={5}>
              <FormControl fullWidth size="small">
                <InputLabel id="voluntario-select-label">Voluntario</InputLabel>
                <Select
                  labelId="voluntario-select-label"
                  defaultValue=""
                  label="Voluntario"
                  size="small"
                  onChange={(e) => handleVoluntario(e.target.value)}
                  sx={{ "& .MuiSelect-select": { textAlign: "center" } }}
                >
                  <MenuItem value="">Todos</MenuItem>
                  {voluntarios.map((v) => (
                    <MenuItem key={v.value} value={v.value}>
                      {v.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <input
                type="month"
                onChange={(e) => handleMes(e.target.value)}
                style={{
                  padding: "8px",
                  width: "100%",
                  height: "40px",
                  border: "1px solid #c2c2c2",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={4}
              sx={{ display: "flex", alignItems: "center", justifyContent: { md: "flex-end" } }}
            >
              <Button
                onClick={handleClear}
                startIcon={<ClearIcon />}
                size="small"
                sx={{ color: "var(--cya-text-muted)", textTransform: "none" }}
              >
                Limpiar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </Grid>
  );
}
