import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home";
import Ads from "../pages/Ads";
import Blogs from "../pages/Blogs";
import Bloggers from "../pages/Bloggers"
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import { ROUTE_PATHS } from "../config/constants";
import About from '../pages/About';
import Register from '../auth/Register';
import Contact from "../pages/Contact"

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
        path: ROUTE_PATHS.BLOGS,
        element: <Blogs />,
      },
      {
        path: ROUTE_PATHS.REGISTER,
        element: <Register />,
      },
      {
        path: ROUTE_PATHS.BLOGGERS,
        element: <Bloggers />,
      },  
      {
        path: ROUTE_PATHS.ABOUT,
        element: <About />,
      },
      {
        path: ROUTE_PATHS.CONTACT,
        element: <Contact />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);