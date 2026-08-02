import axios from "axios";

export function setAuthHeader(token: string | null) {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
}

// aplica el token guardado (si existe) apenas arranca la app
setAuthHeader(localStorage.getItem("token"));
