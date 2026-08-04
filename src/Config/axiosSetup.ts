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

// Sin esto, cuando el token expira cada pantalla lo trata como "no hay
// datos" (los .catch(() => setX([])) que usan casi todos los módulos) y
// muestra listas vacías en silencio, sin avisar que hace falta volver a
// iniciar sesión - parece que se perdió información cuando en realidad
// solo venció la sesión.
let sesionExpiradaEnCurso = false;
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && !sesionExpiradaEnCurso && window.location.pathname !== "/") {
      sesionExpiradaEnCurso = true;
      localStorage.removeItem("token");
      localStorage.removeItem("rol");
      localStorage.removeItem("user");
      localStorage.removeItem("userFoto");
      localStorage.removeItem("auditoria");
      window.alert("Tu sesión expiró. Vuelve a iniciar sesión.");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
