import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import HomeIcon from "@mui/icons-material/Home";
import InterestsIcon from "@mui/icons-material/Interests";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import LocalPlayIcon from "@mui/icons-material/LocalPlay";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import PetsIcon from "@mui/icons-material/Pets";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import React from "react";
export default function Navar() {
  const navigate = useNavigate();
  const [openRefugio, setOpenRefugio] = React.useState(false);
  const [openAdopcion, setOpenAdopcion] = React.useState(false);
  const [openDonacion, setOpenDonacion] = React.useState(false);
  const [openColitas, setOpenColitas] = React.useState(false);

  const handleopenRefugio = () => {
    setOpenRefugio(!openRefugio);
  };
  const handleopenAdopcion = () => {
    setOpenAdopcion(!openAdopcion);
  };

  const handleopenDonacion = () => {
    setOpenDonacion(!openDonacion);
  };

  const handleopenColitas = () => {
    setOpenColitas(!openColitas);
  };
  return (
    <>
      <div className="leftside-menu" style={{ background: "#313a46" }}>
        <Link
          to="/panel"
          className="logo text-center logo-light"
          style={{ background: "rgb(133, 146, 158,0.5)" }}
        >
          <span className="logo-lg">
            <img src="../images/logocito.png" alt="" height="40" />
          </span>
          <span className="logo-sm">
            <img src="../images/logocito.png" alt="" height="40" />
          </span>
        </Link>

        <Link to="/panel" className="logo text-center logo-dark">
          <span className="logo-lg">
            <img src="images/logo-dark.png" alt="" height="16" />
          </span>
          <span className="logo-sm">
            <img src="images/logo_sm_dark.png" alt="" height="16" />
          </span>
        </Link>

        <div className="h-100" id="leftside-menu-container" data-simplebar="">
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "#313A46" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            <ListItemButton onClick={handleopenRefugio}>
              <ListItemIcon>
                <HomeIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText sx={{ color: "white" }} primary="Refugio" />
            </ListItemButton>

            <Collapse in={openRefugio} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/panel/informacion-pages")}
                >
                  <ListItemIcon>
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Informacion" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/panel/redes-social")}
                >
                  <ListItemIcon>
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Red Social" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={handleopenColitas}>
              <ListItemIcon>
                <PetsIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText sx={{ color: "white" }} primary="Colitas" />
            </ListItemButton>

            <Collapse in={openColitas} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/panel/colitas")}
                >
                  <ListItemIcon>
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Albergados" />
                </ListItemButton>

              </List>
            </Collapse>

            <ListItemButton onClick={handleopenAdopcion}>
              <ListItemIcon>
                <FolderSharedIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText sx={{ color: "white" }} primary="Adopcion" />
            </ListItemButton>



            <Collapse in={openAdopcion} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/panel/adoptante")}
                >
                  <ListItemIcon>
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Adoptante" />
                </ListItemButton>

                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/panel/adopcion")}
                >
                  <ListItemIcon>
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Adopcion" />
                </ListItemButton>
              </List>
            </Collapse>

            <ListItemButton onClick={handleopenDonacion}>
              <ListItemIcon>
                <StackedBarChartIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText sx={{ color: "white" }} primary="Donaciones" />
            </ListItemButton>

            <Collapse in={openDonacion} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>

               <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/panel/ingresos")}
                >
                  <ListItemIcon>
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Ingreso" />
                </ListItemButton>


                <ListItemButton
                  sx={{ pl: 4 }}
                  onClick={() => navigate("/panel/donante")}
                >
                  <ListItemIcon>
                    <KeyboardArrowRightIcon sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText sx={{ color: "white" }} primary="Donante" />
                </ListItemButton>

              </List>
            </Collapse>
          </List>

          <div className="clearfix"></div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
