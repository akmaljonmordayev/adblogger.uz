import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Ads from "../pages/Ads";
import Blog from "../pages/Blog";
import Blogger from "../pages/Blogger"
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { ROUTE_PATHS } from "../config/constants";
import About from '../pages/About';
import Register from '../auth/Register';

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
        path: ROUTE_PATHS.REGISTER,
        element: <Register />,
      },
      {
        path: ROUTE_PATHS.BLOGGER,
        element: <Blogger />,
      },  
      {
        path: ROUTE_PATHS.ABOUT,
        element: <About />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);