import MainPage from "../pages/index.jsx";
import HomePage from "../pages/UserPages/HomePage/index.jsx";
import ProtectedRoute from "../ProtectedRoute.jsx";



const router = [
    {
        path: '/',
        element: <MainPage/>,
        children: [
            {
                path: "/",
                element: <HomePage/>
            }
        ]
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute>
                {/*<AdminPage/>*/}
            </ProtectedRoute>
        ),
        children: [

        ]
    },
    // {
    //   path: "/login",
    //   element: <AdminLogin/>
    // },
    // {
    //     path: "*",
    //     element: <NotFound/>
    // }
];

export default router;
