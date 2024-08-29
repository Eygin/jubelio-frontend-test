import { Package2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { sidebar } from "./data/sidebar";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const location = useLocation();
  return (
    <>
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Jubelio Test</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {sidebar.map((el, i) => {
                return (
                  <Link
                    key={i}
                    to={el.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      el.href.startsWith(location.pathname)
                        ? "text-primary"
                        : "text-muted-foreground",
                    )}
                  >
                    <el.Icon className="h-4 w-4" />
                    {el.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
