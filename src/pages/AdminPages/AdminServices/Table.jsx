import { useState } from "react";
import {
    useDeleteServiceMutation,
    useGetAllServicesQuery,
    usePutServiceMutation,
} from "../../../services/userApi.jsx";
import showToast from "../../../components/ToastMessage.js";
import "./index.scss";

// Helper function to convert image URL to File object
const convertImageToFile = async (imgSrc, fileName) => {
    try {
        const res = await fetch(imgSrc);
        if (!res.ok) throw new Error("Failed to fetch image");
        const blob = await res.blob();
        return new File([blob], fileName, { type: blob.type });
    } catch (error) {
        throw new Error(`Image conversion failed: ${error.message}`);
    }
};

const ServicesTable = () => {
    const { data: getAllServices, refetch: getAllServicesRefetch, isLoading } = useGetAllServicesQuery();
    const [deleteService] = useDeleteServiceMutation();
    const [putService] = usePutServiceMutation();
    const [editingKey, setEditingKey] = useState(null);
    const [formData, setFormData] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;

    // Sample data (replace with actual API data)
    const dataSource = [
        {
            id: 1,
            title: "Service",
            subTitle:
                "Yeniyetmələrin özünü daha yaxşı başa düşməyə, mühüm bacarıq, bilik və təcrübə əldə etməyə...",
        },
        {
            id: 2,
            title: "Service Name",
            subTitle:
                "Yeniyetmələrin özünü daha yaxşı başa düşməyə, mühüm bacarıq, bilik və təcrübə əldə etməyə...",
        },
    ];

    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
        setFormData({
            title: record.title,
            subTitle: record.subTitle,
            cardImage: record.cardImage,
        });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey(null);
        setFormData({});
    };

    const save = async (id) => {
        try {
            const formDataToSend = new FormData();
            const textFields = ["title", "subTitle"];
            textFields.forEach((field) => {
                if (formData[field]) formDataToSend.append(field, formData[field]);
            });
            formDataToSend.append("id", id);

            // Handle image if changed
            if (formData.cardImage) {
                const imgObj = availableServiceCardImages.find((item) => item.name === formData.cardImage);
                if (imgObj) {
                    const file = await convertImageToFile(imgObj.src, imgObj.name);
                    formDataToSend.append("cardImage", file);
                } else {
                    throw new Error("Selected image not found");
                }
            }

            await putService(formDataToSend).unwrap();
            showToast("Service updated successfully!", "success");
            setEditingKey(null);
            getAllServicesRefetch();
        } catch (error) {
            console.error("PUT Error:", error);
            showToast(error.message || error?.data?.message || "Error updating service!", "error");
        }
    };

    const handleDelete = async (record) => {
        try {
            await deleteService(record.id).unwrap();
            showToast("Service deleted successfully!", "success");
            getAllServicesRefetch();
        } catch (error) {
            console.error("Delete Error:", error);
            showToast(error?.data?.message || "Error deleting service!", "error");
        }
    };

    const handleInputChange = (e, field) => {
        setFormData({ ...formData, [field]: e.target.value });
    };

    // Pagination logic
    const totalItems = dataSource.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const paginatedData = dataSource.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="services-table-container">
            <table className="custom-table">
                <thead>
                <tr>
                    <th>№</th>
                    <th>Şəkil</th>
                    <th>Başlıq (AZ)</th>
                    <th>Alt Başlıq (AZ)</th>
                    <th>Fəaliyyaətlər</th>
                </tr>
                </thead>
                <tbody>
                {paginatedData.map((record, index) => (
                    <tr key={record.id}>
                        <td>{(currentPage - 1) * pageSize + index + 1}</td>
                        <td>
                            {isEditing(record) ? (
                                <input
                                    type="text"
                                    value={formData.cardImage || ""}
                                    onChange={(e) => handleInputChange(e, "cardImage")}
                                    placeholder="Image name"
                                    className="edit-input"
                                />
                            ) : record.cardImage ? (
                                <img
                                    src={record.cardImage}
                                    alt="Card"
                                    className="service-image"
                                    onError={(e) => {
                                        e.target.src = "/src/assets/services/placeholder.png";
                                    }}
                                />
                            ) : (
                                <span>No Image</span>
                            )}
                        </td>
                        <td>
                            {isEditing(record) ? (
                                <input
                                    type="text"
                                    value={formData.title || ""}
                                    onChange={(e) => handleInputChange(e, "title")}
                                    placeholder="Başlıq daxil edin"
                                    className="edit-input"
                                    required
                                />
                            ) : (
                                record.title
                            )}
                        </td>
                        <td>
                            <div className="subtitle-cell">
                                {isEditing(record) ? (
                                    <input
                                        type="text"
                                        value={formData.subTitle || ""}
                                        onChange={(e) => handleInputChange(e, "subTitle")}
                                        placeholder="Alt Başlıq"
                                        className="edit-input"
                                    />
                                ) : (
                                    record.subTitle
                                )}
                            </div>
                        </td>
                        <td>
                            <div className="editdeleteDiv">
                                {isEditing(record) ? (
                                    <>
                                        <button
                                            className="editDelete"
                                            onClick={() => save(record.id)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                            >
                                                <path
                                                    d="M7.5 17.5L2.5 12.5L4.225 10.775L7.5 14.05L15.775 5.775L17.5 7.5L7.5 17.5Z"
                                                    fill="#007781"
                                                />
                                            </svg>
                                        </button>
                                        <button className="editDelete" onClick={cancel}>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                            >
                                                <path
                                                    d="M15 5L5 15M5 5L15 15"
                                                    stroke="#ED0303"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            className="editDelete"
                                            onClick={() => edit(record)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                            >
                                                <path
                                                    d="M18.3332 6.03318C18.3338 5.92351 18.3128 5.81479 18.2713 5.71326C18.2299 5.61173 18.1688 5.51938 18.0915 5.44152L14.5582 1.90818C14.4803 1.83095 14.388 1.76985 14.2864 1.72838C14.1849 1.6869 14.0762 1.66588 13.9665 1.66652C13.8568 1.66588 13.7481 1.6869 13.6466 1.72838C13.5451 1.76985 13.4527 1.83095 13.3749 1.90818L11.0165 4.26652L1.90818 13.3749C1.83095 13.4527 1.76985 13.5451 1.72838 13.6466C1.6869 13.7481 1.66588 13.8568 1.66652 13.9665V17.4999C1.66652 17.7209 1.75432 17.9328 1.9106 18.0891C2.06688 18.2454 2.27884 18.3332 2.49985 18.3332H6.03318C6.14979 18.3395 6.26643 18.3213 6.37553 18.2797C6.48464 18.238 6.58378 18.1739 6.66652 18.0915L15.7249 8.98318L18.0915 6.66652C18.1675 6.58565 18.2294 6.49272 18.2749 6.39152C18.2829 6.32509 18.2829 6.25794 18.2749 6.19152C18.2788 6.15273 18.2788 6.11364 18.2749 6.07485L18.3332 6.03318ZM5.69152 16.6665H3.33318V14.3082L11.6082 6.03318L13.9665 8.39152L5.69152 16.6665ZM15.1415 7.21652L12.7832 4.85818L13.9665 3.68318L16.3165 6.03318L15.1415 7.21652Z"
                                                    fill="#919191"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            className="editDelete"
                                            onClick={() => handleDelete(record)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="20"
                                                height="20"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M8.5915 1.875H11.4082C11.589 1.875 11.7465 1.875 11.8948 1.89833C12.1838 1.94462 12.4578 2.05788 12.6952 2.22907C12.9325 2.40025 13.1264 2.6246 13.2615 2.88417C13.3315 3.0175 13.3807 3.16667 13.4382 3.3375L13.5307 3.61667L13.5557 3.6875C13.6311 3.89679 13.7715 4.07645 13.9564 4.20016C14.1413 4.32387 14.3609 4.38514 14.5832 4.375H17.0832C17.2489 4.375 17.4079 4.44085 17.5251 4.55806C17.6423 4.67527 17.7082 4.83424 17.7082 5C17.7082 5.16576 17.6423 5.32473 17.5251 5.44194C17.4079 5.55915 17.2489 5.625 17.0832 5.625H2.9165C2.75074 5.625 2.59177 5.55915 2.47456 5.44194C2.35735 5.32473 2.2915 5.16576 2.2915 5C2.2915 4.83424 2.35735 4.67527 2.47456 4.55806C2.59177 4.44085 2.75074 4.375 2.9165 4.375H5.4915C5.71409 4.36966 5.92911 4.29314 6.10503 4.15667C6.28095 4.02019 6.40851 3.83094 6.469 3.61667L6.56234 3.3375C6.619 3.16667 6.66817 3.0175 6.73734 2.88417C6.8725 2.6245 7.06658 2.40009 7.30405 2.2289C7.54151 2.05771 7.81576 1.9445 8.10484 1.89833C8.25317 1.875 8.41067 1.875 8.59067 1.875M7.50567 4.375C7.56339 4.26004 7.61214 4.1408 7.6515 4.01833L7.73484 3.76833C7.81067 3.54083 7.82817 3.495 7.84567 3.46167C7.89066 3.37501 7.95532 3.30009 8.03448 3.24293C8.11364 3.18577 8.20509 3.14795 8.3015 3.1325C8.41011 3.12288 8.51924 3.12037 8.62817 3.125H11.3698C11.6098 3.125 11.6598 3.12667 11.6965 3.13333C11.7928 3.14869 11.8842 3.18639 11.9634 3.2434C12.0425 3.30041 12.1073 3.37516 12.1523 3.46167C12.1698 3.495 12.1873 3.54083 12.2632 3.76917L12.3465 4.01917L12.379 4.1125C12.4118 4.20361 12.4496 4.29111 12.4923 4.375H7.50567Z"
                                                    fill="#ED0303"
                                                />
                                                <path
                                                    d="M4.92907 7.04148C4.91802 6.87605 4.8417 6.72179 4.71691 6.61263C4.59212 6.50347 4.42908 6.44835 4.26365 6.4594C4.09822 6.47045 3.94396 6.54676 3.8348 6.67155C3.72563 6.79634 3.67052 6.95939 3.68157 7.12482L4.06823 12.9181C4.13907 13.9865 4.19657 14.8498 4.33157 15.5281C4.4724 16.2323 4.71073 16.8207 5.20407 17.2815C5.6974 17.7423 6.2999 17.9423 7.0124 18.0348C7.6974 18.1248 8.5624 18.1248 9.63407 18.1248H10.3666C11.4374 18.1248 12.3032 18.1248 12.9882 18.0348C13.6999 17.9423 14.3032 17.7431 14.7966 17.2815C15.2891 16.8207 15.5274 16.2315 15.6682 15.5281C15.8032 14.8506 15.8599 13.9865 15.9316 12.9181L16.3182 7.12482C16.3293 6.95939 16.2742 6.79634 16.165 6.67155C16.0558 6.54676 15.9016 6.47045 15.7361 6.4594C15.5707 6.44835 15.4077 6.50347 15.2829 6.61263C15.1581 6.72179 15.0818 6.87605 15.0707 7.04148L14.6874 12.7915C14.6124 13.914 14.5591 14.6956 14.4424 15.2831C14.3282 15.854 14.1699 16.1556 13.9424 16.369C13.7141 16.5823 13.4024 16.7206 12.8257 16.7956C12.2316 16.8731 11.4482 16.8748 10.3224 16.8748H9.6774C8.5524 16.8748 7.76907 16.8731 7.17407 16.7956C6.5974 16.7206 6.28573 16.5823 6.0574 16.369C5.8299 16.1556 5.67157 15.854 5.5574 15.284C5.44073 14.6956 5.3874 13.914 5.3124 12.7906L4.92907 7.04148Z"
                                                    fill="#ED0303"
                                                />
                                                <path
                                                    d="M7.85428 8.54511C8.01914 8.52859 8.18382 8.57821 8.31211 8.68306C8.44041 8.78792 8.52182 8.93942 8.53844 9.10428L8.95511 13.2709C8.96731 13.4335 8.91551 13.5944 8.81076 13.7193C8.70601 13.8442 8.55659 13.9233 8.39438 13.9396C8.23217 13.9559 8.07001 13.9082 7.94249 13.8066C7.81497 13.7051 7.73218 13.5577 7.71178 13.3959L7.29511 9.22928C7.27859 9.06441 7.32821 8.89973 7.43306 8.77144C7.53792 8.64314 7.68942 8.56174 7.85428 8.54511ZM12.1459 8.54511C12.3106 8.56174 12.462 8.64303 12.5668 8.77114C12.6717 8.89925 12.7214 9.06371 12.7051 9.22844L12.2884 13.3951C12.2678 13.5565 12.185 13.7036 12.0576 13.8049C11.9302 13.9062 11.7683 13.9538 11.6064 13.9377C11.4444 13.9215 11.2952 13.8428 11.1904 13.7183C11.0856 13.5938 11.0334 13.4333 11.0451 13.2709L11.4618 9.10428C11.4784 8.93958 11.5597 8.78821 11.6878 8.68338C11.8159 8.57855 11.9812 8.52882 12.1459 8.54511Z"
                                                    fill="#ED0303"
                                                />
                                            </svg>
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            <div className="custom-pagination">
                <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}
                <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default ServicesTable;