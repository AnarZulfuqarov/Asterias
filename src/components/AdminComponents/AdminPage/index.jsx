import {Outlet} from "react-router-dom";
import AdminLeftBar from "../AdminLeftBar/index.jsx";
import './index.scss'

function AdminPage() {


    return (
        <section id="adminPage">
            <AdminLeftBar/>
            <div className="adminRightBar container">
                <Outlet/>
            </div>
        </section>
    );
}

export default AdminPage;