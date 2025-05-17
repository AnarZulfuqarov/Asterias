import './App.css'
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router-dom";
import ROUTES from "./routes/ROUTES.jsx";
import {ToastContainer} from "react-toastify";
import Cookies from "js-cookie";

function App() {
    const token = Cookies.get("sssToken");

    if (!token) {
        Cookies.set("sssToken", "null");
    }


    const routes = createBrowserRouter(ROUTES);

    return (
        <>
            <ToastContainer/>
            <RouterProvider router={routes}/>
        </>
    )
}

export default App