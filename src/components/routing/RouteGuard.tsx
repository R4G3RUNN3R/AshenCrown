import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../state/AuthContext";
import { usePlayer } from "../../state/PlayerContext";

const BLOCKED_WHILE_HOSPITALIZED = new Set([
  "/education",
  "/jobs",
  "/arena",
  "/travel",
  "/city",
  "/market",
  "/black-market",
  "/bank",
  "/academies",
  "/life-paths",
]);

type RouteGuardProps = {
  children: JSX.Element;
};

export default function RouteGuard({ children }: RouteGuardProps) {
  const { isLoggedIn } = useAuth();
  const { isRegistered, isHospitalized } = usePlayer();
  const location = useLocation();

  if (location.pathname === "/register") {
    return children;
  }

  if (!isLoggedIn || !isRegistered) {
    return <Navigate to="/register" replace state={{ redirectedFrom: location.pathname }} />;
  }

  if (isHospitalized && BLOCKED_WHILE_HOSPITALIZED.has(location.pathname)) {
    return <Navigate to="/hospital" replace state={{ redirectedFrom: location.pathname }} />;
  }

  return children;
}
