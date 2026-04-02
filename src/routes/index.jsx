import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Ads from "../pages/Ads";
import Blog from "../pages/Blog";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { ROUTE_PATHS } from "../config/constants";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: ROUTE_PATHS.HOME,
        element: <Home />,
      },
      {
        path: ROUTE_PATHS.ADS,
        element: <Ads />,
      },
      {
        path: ROUTE_PATHS.BLOG,
        element: <Blog />,
      },
      {
        path: ROUTE_PATHS.LOGIN,
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);