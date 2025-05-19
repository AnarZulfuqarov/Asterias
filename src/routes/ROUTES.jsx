import MainPage from "../pages/index.jsx";
import HomePage from "../pages/UserPages/HomePage/index.jsx";
import ProtectedRoute from "../ProtectedRoute.jsx";
import Contact from "../pages/UserPages/ContactPage/index.jsx";
import ServDetailPageOne from "../pages/UserPages/ServicDetailPageOne/index.jsx";
import ServDetailPageTwo from "../pages/UserPages/ServicDetailPageTwo/index.jsx";
import AdminPage from "../components/AdminComponents/AdminPage/index.jsx";
import AdminServices from "../pages/AdminPages/AdminServices/index.jsx";
import AdminContact from "../pages/AdminPages/AdminContact/index.jsx";
import AdminServDetail from "../pages/AdminPages/AdminServicesDetail/index.jsx";
import AdminLogin from "../pages/AdminPages/AdminLogin/index.jsx";
import NotFound from "../pages/UserPages/NotFound/index.jsx";
import AdminServiceAdd from "../pages/AdminPages/AdminServiceAdd/index.jsx";

const router = [
    {
        path: '/',
        element: <MainPage/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            },
            {
                path: "/contact",
                element: <Contact/>
            },
            {
                path: "/serviceDetailOne/:id",
                element: <ServDetailPageOne/>
            },
            {
                path: "/serviceDetailTwo/:id",
                element: <ServDetailPageTwo/>
            }
        ]
    },
    {
        path: "/admin",
        element: (
            // <ProtectedRoute>
                <AdminPage/>
            // </ProtectedRoute>
        ),
        children: [
            {
                path: "/admin/services",
                element: <AdminServices/>
            },
            {
                path: "/admin/contact",
                element: <AdminContact/>
            },
            {
                path: "/admin/services/:id",
                element: <AdminServDetail/>
            },
            {
                path: "/admin/services/add",
                element: <AdminServiceAdd />
            }
        ]
    },
    {
      path: "/login",
      element: <AdminLogin/>
    },
    {
        path: "*",
        element: <NotFound/>
    }
];

export default router;
