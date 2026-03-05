import { Navigate, Outlet } from "react-router-dom";

type Props = {
  isAuth: boolean;
};

export default function PrivateRoute({ isAuth }: Props) {
  if (!isAuth) return <Navigate to="/" replace />; // cámbialo a /login si tienes
  return <Outlet />;
}