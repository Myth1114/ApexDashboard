import { useEffect, useState } from "react";
import { getUser } from "../../../lib/auth";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner";

function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    getUser().then((u) => setUser(u));
  }, []);

  if (user === undefined) return <Spinner />;

  if (!user) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;
