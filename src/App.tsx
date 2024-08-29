import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LoginForm } from "./page/auth/Login";
import Authmiddleware from "./middleware";
import { Toaster } from "sonner";
import { RegisterForm } from "./page/auth/Register";
import Product from "./page/product/Product";
import Adjustment from "./page/adjustment/Adjustment";
import Logout from "./page/auth/Logout";

function App() {
  const routes = [
    { path: "/", component: <LoginForm />, protected: false },
    { path: "/logout", component: <Logout />, protected: false},
    { path: "/register", component: <RegisterForm />, protected: false },
    { path: "/products", component: <Product />, protected: true},
    { path: "/adjustment", component: <Adjustment />, protected: true}
  ];

  return (
    <>
      <Toaster />
      <BrowserRouter future={{ v7_startTransition: true }}>
        <Routes>
          {routes.map(({ path, component, protected: isProtected }) =>
            isProtected ? (
              <Route
                key={path}
                path={path}
                element={<Authmiddleware>{component}</Authmiddleware>}
              />
            ) : (
              <Route key={path} path={path} element={component} />
            ),
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;