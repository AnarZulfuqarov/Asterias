import './App.css'
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router-dom";
import ROUTES from "./routes/ROUTES.jsx";
import {ToastContainer} from "react-toastify";
import Cookies from "js-cookie";
import Carousel from "./components/UserComponents/Carousel/index.jsx";
import flagAz from "./assets/azerbaijan.png";
import flagEn from "./assets/uk.png";
import flagTr from "./assets/turkey.png";
import flagRu from "./assets/circle.png";
// const imgs = [
//     flagAz,
//     flagEn,
//     flagTr,
//     flagRu,
//     '/img5.jpg',
//     '/img6.jpg',
//     '/img7.jpg',
// ];
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
            {/*<Carousel images={imgs} visibleCount={5} gap={140} />*/}
        </>
    )
}

export default App