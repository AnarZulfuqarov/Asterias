import ContactTable from "./Table.jsx";
import image1 from "../../../assets/profile.png";

function AdminContact() {
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
                </div>
            </div>
<ContactTable/>
        </div>
    );
}

export default AdminContact;