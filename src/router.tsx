import { createBrowserRouter } from "react-router-dom";
import { LoginForm } from "./page/auth/Login";
import { RegisterForm } from "./page/auth/Register";
import Product from "./page/product/Product";
import Adjustment from "./page/adjustment/Adjustment";
import Authmiddleware from "./middleware";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterForm />,
  },
  {
    element: <Authmiddleware />,
    children: [
      {
        path: "/products",
        element: <Product />,
      },
      {
        path: "/adjustment",
        element: <Adjustment />,
      },
    ],
  },
]);