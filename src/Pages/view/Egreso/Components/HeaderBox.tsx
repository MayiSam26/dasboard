import { Box, Button, Grid, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
interface props{
    setOpenModal?:any
}
export default function HeaderBox({setOpenModal}:props){
    return(
        <>
            <Grid
                container
                spacing={2}
                sx={{display:'flex',justifyContent:'space-between'}}
            >
                <Grid item xs={12} md={9} >
                    <Typography variant="h4">
                            Egreso del Refugio
                    </Typography>
                </Grid>
                <Grid item xs={12} md={1}>
                    <Button 
                        onClick={() => setOpenModal(true)}
                        variant="contained" sx={{
                        background:'#65c178',
                        fontWeight:'bolder',
                        borderRadius:'20px',
                        textTransform:'capitalize',
                        '&:hover': {
                            background: '#ed6436', 
                          },
                        }}
                        fullWidth
                        >
                        <AddCircleIcon />
                        Agregar
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}