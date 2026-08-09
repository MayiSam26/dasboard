import {
  ClickAwayListener,
  Collapse,
  Grow,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
} from "@mui/material";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import PetsIcon from "@mui/icons-material/Pets";
import SearchOffIcon from "@mui/icons-material/SearchOff";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StackedBarChartIcon from "@mui/icons-material/StackedBarChart";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import React from "react";
import axios from "axios";
import baseurl from "../../Config/axios";

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
  // Secciones "configurables" consultan tblpermiso (panel de Permisos) para
  // Voluntario/Veterinario en vez de tener un `roles` fijo. Administrador
  // siempre las ve todas; "usuarios" queda fuera a propósito (ver Permisos.tsx).
  configurable?: boolean;
}

const sections: Section[] = [
  {
    key: "refugio",
    label: "Refugio",
    icon: <HomeIcon />,
    configurable: true,
    items: [
      { label: "Información", path: "/panel/informacion-pages" },
      { label: "Red Social", path: "/panel/redes-social" },
      { label: "Noticias", path: "/panel/noticias" },
    ],
  },
  {
    key: "colitas",
    label: "Colitas",
    icon: <PetsIcon />,
    configurable: true,
    items: [{ label: "Albergados", path: "/panel/colitas" }],
  },
  {
    key: "perdidos",
    label: "Mascotas Perdidas",
    icon: <SearchOffIcon />,
    configurable: true,
    items: [
      { label: "Reportes de Perdidas", path: "/panel/perdidos" },
      { label: "Dueños", path: "/panel/apoderado" },
    ],
  },
  {
    key: "veterinaria",
    label: "Veterinaria",
    icon: <MedicalServicesIcon />,
    configurable: true,
    items: [{ label: "Información Veterinaria", path: "/panel/veterinaria" }],
  },
  {
    key: "adopcion",
    label: "Adopción",
    icon: <FolderSharedIcon />,
    configurable: true,
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
    configurable: true,
    items: [
      { label: "Ingreso", path: "/panel/ingresos" },
      { label: "Donante", path: "/panel/donante" },
      { label: "Apadrinamientos", path: "/panel/apadrinado" },
    ],
  },
  {
    key: "usuarios",
    label: "Usuarios",
    icon: <GroupIcon />,
    roles: ["Administrador"],
    items: [
      { label: "Usuarios y Roles", path: "/panel/usuarios" },
      { label: "Permisos de Roles", path: "/panel/permisos" },
    ],
  },
  {
    key: "reportes",
    label: "Reportes",
    icon: <AssessmentIcon />,
    configurable: true,
    items: [{ label: "Reportes Generales", path: "/panel/reportes" }],
  },
];

const SECCIONES_CONFIGURABLES = sections.filter((s) => s.configurable).map((s) => s.key);

export default function Navar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Si no hay rol guardado (sesiones que iniciaron antes de este cambio) se
  // muestran todas las secciones, igual que hace el backend con esos tokens.
  const rol = localStorage.getItem("rol");

  // Secciones configurables: null = todavía no se sabe (evita mostrar y
  // luego ocultar). Administrador siempre las ve todas sin consultar nada.
  const [permisosVisibles, setPermisosVisibles] = React.useState<string[] | null>(
    !rol || rol === "Administrador" ? SECCIONES_CONFIGURABLES : null
  );

  React.useEffect(() => {
    if (!rol || rol === "Administrador") {
      setPermisosVisibles(SECCIONES_CONFIGURABLES);
      return;
    }
    axios
      .get(baseurl + "permisos/mios")
      .then((response) => setPermisosVisibles(response.data.data || []))
      .catch(() => setPermisosVisibles(SECCIONES_CONFIGURABLES)); // fail-open, mismo criterio que el resto del sistema
  }, [rol]);

  const visibleSections = sections.filter((s) => {
    if (s.configurable) {
      if (permisosVisibles === null) return false; // esperando la respuesta
      return permisosVisibles.includes(s.key);
    }
    return !s.roles || !rol || s.roles.includes(rol);
  });

  const sectionOfCurrentPath = visibleSections.find((s) =>
    s.items.some((i) => i.path === location.pathname)
  );

  const [openSection, setOpenSection] = React.useState<string | null>(
    sectionOfCurrentPath?.key ?? null
  );

  // El botón ☰ (fuera de React, en la plantilla legada app.min.js) alterna
  // body[data-leftbar-compact-mode="condensed"]. En vez de duplicar ese
  // toggle, solo lo observamos para saber si el sidebar está en modo
  // ícono-solo y así decidir cómo mostrar los sub-ítems de cada sección.
  const [isCondensed, setIsCondensed] = React.useState(
    () => document.body.getAttribute("data-leftbar-compact-mode") === "condensed"
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsCondensed(document.body.getAttribute("data-leftbar-compact-mode") === "condensed");
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["data-leftbar-compact-mode"] });
    return () => observer.disconnect();
  }, []);

  // Modo condensado: los sub-ítems no caben empujando contenido hacia abajo
  // (no hay texto visible al lado del ícono), así que en vez de un Collapse
  // se muestra un panel flotante (Popper) anclado al ícono de la sección.
  const [flyoutSection, setFlyoutSection] = React.useState<string | null>(null);
  const sectionRefs = React.useRef<Record<string, HTMLElement | null>>({});

  const toggleSection = (key: string) => {
    if (isCondensed) {
      setFlyoutSection((prev) => (prev === key ? null : key));
      return;
    }
    setOpenSection((prev) => (prev === key ? null : key));
  };

  // Si el sidebar pasa a modo expandido con un flyout abierto, se cierra el
  // flyout (ya no aplica) y se abre esa misma sección en el acordeón normal.
  React.useEffect(() => {
    if (!isCondensed && flyoutSection) {
      setOpenSection(flyoutSection);
      setFlyoutSection(null);
    }
  }, [isCondensed, flyoutSection]);

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
          <div className="cya-sidebar-divider" />
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "transparent", px: "8px" }}
            component="nav"
            aria-labelledby="nested-list-subheader"
          >
            {visibleSections.map((section) => {
              const isSectionActive = section.items.some((i) => i.path === location.pathname);
              const isOpen = openSection === section.key;
              const isFlyoutOpen = isCondensed && flyoutSection === section.key;
              return (
                <React.Fragment key={section.key}>
                  <ListItemButton
                    ref={(el) => {
                      sectionRefs.current[section.key] = el;
                    }}
                    className={`cya-sidebar-item${isSectionActive ? " cya-active" : ""}`}
                    onClick={() => toggleSection(section.key)}
                  >
                    <ListItemIcon>
                      {React.cloneElement(section.icon as React.ReactElement, {
                        className: "cya-sidebar-icon",
                      })}
                    </ListItemIcon>
                    <ListItemText className="cya-sidebar-label" primary={section.label} />
                    <ExpandMoreIcon
                      className="cya-sidebar-chevron"
                      fontSize="small"
                      style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </ListItemButton>

                  <Collapse in={isOpen && !isCondensed} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding className="cya-sidebar-sublist">
                      {section.items.map((item) => {
                        const active = location.pathname === item.path;
                        return (
                          <ListItemButton
                            key={item.path}
                            className={`cya-sidebar-item cya-sidebar-subitem${active ? " cya-active" : ""}`}
                            sx={{ pl: 4 }}
                            onClick={() => navigate(item.path)}
                          >
                            <ListItemIcon>
                              <KeyboardArrowRightIcon className="cya-sidebar-icon" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText className="cya-sidebar-label" primary={item.label} />
                          </ListItemButton>
                        );
                      })}
                    </List>
                  </Collapse>

                  <Popper
                    open={isFlyoutOpen}
                    anchorEl={sectionRefs.current[section.key]}
                    placement="right-start"
                    transition
                    className="cya-sidebar-flyout"
                    modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
                  >
                    {({ TransitionProps }) => (
                      <ClickAwayListener onClickAway={() => setFlyoutSection(null)}>
                        <Grow {...TransitionProps} timeout={150}>
                          <Paper className="cya-sidebar-flyout-panel">
                            <List component="div" disablePadding>
                              <ListItemText
                                className="cya-sidebar-flyout-title"
                                primary={section.label}
                              />
                              {section.items.map((item) => {
                                const active = location.pathname === item.path;
                                return (
                                  <ListItemButton
                                    key={item.path}
                                    className={`cya-sidebar-item cya-sidebar-subitem${active ? " cya-active" : ""}`}
                                    onClick={() => {
                                      navigate(item.path);
                                      setFlyoutSection(null);
                                    }}
                                  >
                                    <ListItemText className="cya-sidebar-label" primary={item.label} />
                                  </ListItemButton>
                                );
                              })}
                            </List>
                          </Paper>
                        </Grow>
                      </ClickAwayListener>
                    )}
                  </Popper>
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
