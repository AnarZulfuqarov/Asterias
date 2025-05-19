import {Outlet, useNavigate} from "react-router-dom";
import AdminLeftBar from "../AdminLeftBar/index.jsx";
import  image1 from "/src/assets/profile.png"
import './index.scss'
function AdminPage() {



    return (
        <section id="adminPage">
            <AdminLeftBar/>
            <div className="adminRightBar">
                <div className="adminTopBar">

                    <img src={image1} alt="profile"/>
                    <p>Admin</p>
                </div>
                <div className="rightBottomBar">
                    <Outlet/>
                </div>
            </div>
        </section>
    );
}

export default AdminPage;