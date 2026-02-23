import { Box, Button, Grid, Typography } from "@mui/material";

interface props{
    setOpenModal:any
    showButtom?:boolean
}
export default function HeaderBox({setOpenModal,showButtom}:props){
    return(
        <>
            <Grid
                container
                spacing={2}
                sx={{display:'flex',justifyContent:'space-between'}}
            >
                <Grid item xs={11}>
                    <Typography variant="h4">
                            Informacion General
                    </Typography>
                </Grid>
                <Grid item xs={1}>
                    {
                        showButtom && (
                            <Button 
                                onClick={() => setOpenModal(true)}
                                variant="contained" sx={{
                                background:'#65c178',
                                fontWeight:'bolder',
                                textTransform:'capitalize',
                                '&:hover': {
                                    background: '#ed6436', 
                                },
                                }}>
                                Agregar
                    </Button>
                        )
                    }
                </Grid>
            </Grid>
        </>
    )
}