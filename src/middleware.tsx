import React, { useEffect, useState, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { getApi } from "./lib/api";
import { URL_BACKEND } from "./lib/axios";
import { Loader2 } from "lucide-react";

const Authmiddleware = ({ children } : {children?: React.ReactNode}) => {
  const [loading, setLoading] = useState(true);
  const [access, setAccess] = useState(false);
  const location = useLocation();

  const user_cookie = useMemo(() => Cookies.get("token"), []);

  const getDetailUsers = async () => {
    setLoading(true);
    try {
      if (user_cookie) {
        const res = await getApi({
          url: URL_BACKEND + "user",
          params: {},
          auth: true,
        });

        if (res.status === 200) {
          setAccess(true);
        } else {
          setAccess(false);
        }
      } else {
        setAccess(false);
      }
    } catch (err) {
      console.error("ERROR", err);
      setAccess(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailUsers();
  }, [location]);

  if (loading) {
    return <Loader2 className="w-5 h-5 animated-spin" />;
  }

  if (!access) {
    return <Navigate to="/" replace />;
  }

  return <React.Fragment>{children}</React.Fragment>;
};

export default Authmiddleware;