import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    Cookies.remove("token");
    navigate("/");
  }, []);
  return (
    <>
      <Loader2 className="w-5 h-5 animate-spin" />
    </>
  );
}