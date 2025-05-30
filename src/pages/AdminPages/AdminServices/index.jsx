import ServicesTable from "./Table.jsx";
import image1 from "../../../assets/profile.png";
import {useNavigate} from "react-router-dom";

function AdminServices() {
    const navigate = useNavigate();
    return (
        <div>
            <div className={"right"}>
                <div className={"adminTopBar"}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                    }}>
                        <img src={image1} alt="profile"/>
                        <div>
                            <p>Admin</p>
                        </div>
                    </div>
                    <button className="addBtn" onClick={()=> navigate('/admin/services/add')}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <path
                                d="M12 22.5C6.21 22.5 1.5 17.79 1.5 12C1.5 6.21 6.21 1.5 12 1.5C17.79 1.5 22.5 6.21 22.5 12C22.5 17.79 17.79 22.5 12 22.5ZM12 3C7.035 3 3 7.035 3 12C3 16.965 7.035 21 12 21C16.965 21 21 16.965 21 12C21 7.035 16.965 3 12 3Z"
                                fill="white"
                            />
                            <path
                                d="M12 17.25C11.58 17.25 11.25 16.92 11.25 16.5V7.5C11.25 7.08 11.58 6.75 12 6.75C12.42 6.75 12.75 7.08 12.75 7.5V16.5C12.75 16.92 12.42 17.25 12 17.25Z"
                                fill="white"
                            />
                            <path
                                d="M16.5 12.75H7.5C7.08 12.75 6.75 12.42 6.75 12C6.75 11.58 7.08 11.25 7.5 11.25H16.5C16.92 11.25 17.25 11.58 17.25 12C17.25 12.42 16.92 12.75 16.5 12.75Z"
                                fill="white"
                            />
                        </svg>
                        Xidmət əlavə et
                    </button>
                </div>
            </div>
            <ServicesTable/>
        </div>
    );
}

export default AdminServices;