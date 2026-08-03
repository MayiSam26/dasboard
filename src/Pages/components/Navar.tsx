import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import PetsIcon from "@mui/icons-material/Pets";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import React from "react";

interface SubItem {
  label: string;
  path: string;
}

interface Section {
  key: string;
  label: string;
  icon: React.ReactNode;
  items: SubItem[];
  // Si no se define, la sección es visible para cualquier rol.
  roles?: string[];
}

const sections: Section[] = [
  {
    key: "refugio",
    label: "Refugio",
    icon: <HomeIcon />,
    roles: ["Administrador"],
    items: [
      { label: "Información", path: "/panel/informacion-pages" },
      { label: "Red Social", path: "/panel/redes-social" },
    ],
  },
  {
    key: "colitas",
    label: "Colitas",
    icon: <PetsIcon />,
    items: [{ label: "Albergados", path: "/panel/colitas" }],
  },
  {
    key: "perdidos",
    label: "Mascotas Perdidas",
    icon: <SearchOffIcon />,
    items: [
      { label: "Reportes de Perdidas", path: "/panel/perdidos" },
      { label: "Dueños", path: "/panel/apoderado" },
    ],
  },
  {
    key: "adopcion",
    label: "Adopción",
    icon: <FolderSharedIcon />,
    items: [
      { label: "Adoptante", path: "/panel/adoptante" },
      { label: "Adopción", path: "/panel/adopcion" },
      { label: "Entrevistas", path: "/panel/entrevistas" },
      { label: "Seguimiento", path: "/panel/seguimiento" },
    ],
  },
  {
    key: "donaciones",
    label: "Donaciones",
    icon: <StackedBarChartIcon />,
    items: [
      { label: "Ingreso", path: "/panel/ingresos" },
      { label: "Donante", path: "/panel/donante" },
    ],
  },
  {
    key: "usuarios",
    label: "Usuarios",
    icon: <GroupIcon />,
    roles: ["Administrador"],
    items: [{ label: "Usuarios y Roles", path: "/panel/usuarios" }],
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: <AssessmentIcon />,
    roles: ["Administrador"],
    items: [{ label: "Reportes Generales", path: "/panel/reportes" }],
  },
];

export default function Navar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si no hay rol guardado (sesiones que iniciaron antes de este cambio) se
  // muestran todas las secciones, igual que hace el backend con esos tokens.
  const rol = localStorage.getItem("rol");
  const visibleSections = sections.filter((s) => !s.roles || !rol || s.roles.includes(rol));

  const sectionOfCurrentPath = visibleSections.find((s) =>
    s.items.some((i) => i.path === location.pathname)
  );

  const [openSection, setOpenSection] = React.useState<string | null>(
    sectionOfCurrentPath?.key ?? null
  );

  const toggleSection = (key: string) => {
    setOpenSection((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <div className="leftside-menu" style={{ background: "var(--cya-sidebar-bg)" }}>
        <Link
          to="/panel"
          className="logo text-center logo-light"
          style={{ background: "rgba(255,255,255,0.08)" }}
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
            sx={{ width: "100%", maxWidth: 360, bgcolor: "transparent" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {visibleSections.map((section) => {
              const isSectionActive = section.items.some((i) => i.path === location.pathname);
              return (
                <React.Fragment key={section.key}>
                  <ListItemButton
                    className={`cya-sidebar-item${isSectionActive ? " cya-active" : ""}`}
                    onClick={() => toggleSection(section.key)}
                  >
                    <ListItemIcon>
                      {React.cloneElement(section.icon as React.ReactElement, {
                        sx: { color: "white" },
                      })}
                    </ListItemIcon>
                    <ListItemText sx={{ color: "white" }} primary={section.label} />
                  </ListItemButton>

                  <Collapse in={openSection === section.key} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {section.items.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                          <ListItemButton
                            key={item.path}
                            className={`cya-sidebar-item${active ? " cya-active" : ""}`}
                            sx={{ pl: 4 }}
                            onClick={() => navigate(item.path)}
                          >
                            <ListItemIcon>
                              <KeyboardArrowRightIcon sx={{ color: "white" }} />
                            </ListItemIcon>
                            <ListItemText sx={{ color: "white" }} primary={item.label} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            })}
          </List>

          <div className="clearfix"></div>
        </div>
      </div>
      <Outlet />
    </>
  );
}
