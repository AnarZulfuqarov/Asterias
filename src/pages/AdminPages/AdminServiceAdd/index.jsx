import "./index.scss";
import { Upload, Switch, Image, Select } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import image1 from "../../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import { useGetAllOffersQuery, usePostOffersMutation } from "../../../services/userApi.jsx";

function AdminServCreate() {
    const [singleFileList, setSingleFileList] = useState([]);
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]);
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [isSubOffer, setIsSubOffer] = useState(false);
    const [parentOfferId, setParentOfferId] = useState(null);

    const navigate = useNavigate();
    const [postOffers, { isLoading, isError, error }] = usePostOffersMutation();
    const { data: offers, isLoading: offersLoading } = useGetAllOffersQuery();

    // Handle single image change
    const handleSingleImageChange = ({ fileList: newFileList }) => {
        setSingleFileList(newFileList);
    };

    // Handle triple image change
    const handleTripleImageChange = (index) => ({ fileList: newFileList }) => {
        setTripleFileLists((prev) => {
            const newLists = [...prev];
            newLists[index] = newFileList;
            return newLists;
        });
    };

    // Handle single image switch
    const handleSingleSwitchChange = (checked) => {
        setSingleImageSwitch(checked);
        setTripleImageSwitch(!checked);
        if (checked) {
            setTripleFileLists([[], [], []]);
        }
    };

    // Handle triple image switch
    const handleTripleSwitchChange = (checked) => {
        setTripleImageSwitch(checked);
        setSingleImageSwitch(!checked);
        if (checked) {
            setSingleFileList([]);
        }
    };

    // Handle main/sub-offer switch
    const handleSubOfferSwitch = (checked) => {
        setIsSubOffer(checked);
        if (checked) {
            setSingleFileList([]); // Clear single image list
            setTripleFileLists([[], [], []]); // Clear triple image lists
            setSingleImageSwitch(true); // Reset to default template
            setTripleImageSwitch(false);
        } else {
            setParentOfferId(null); // Reset parent offer ID
        }
    };

    // Handle parent offer selection
    const handleParentOfferChange = (value) => {
        setParentOfferId(value);
    };

    // Handle image preview
    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Validate inputs
        if (isSubOffer && !parentOfferId) {
            alert("Please select a parent offer for the sub-offer");
            return;
        }
        if (!isSubOffer) {
            if (singleImageSwitch && singleFileList.length === 0) {
                alert("Please upload a single image for the main offer");
                return;
            }
            if (tripleImageSwitch && tripleFileLists.every((list) => list.length === 0)) {
                alert("Please upload at least one image for triple image mode");
                return;
            }
        }

        // Prepare FormData for backend
        const offerData = new FormData();

        // Append text fields
        offerData.append("name", formData.get("name"));
        offerData.append("nameEng", formData.get("nameEng"));
        offerData.append("nameRu", formData.get("nameRu"));
        offerData.append("nameTur", formData.get("nameTur"));
        offerData.append("description", formData.get("description"));
        offerData.append("descriptionEng", formData.get("descriptionEng"));
        offerData.append("descriptionRu", formData.get("descriptionRu"));
        offerData.append("descriptionTur", formData.get("descriptionTur"));
        offerData.append("period", formData.get("period"));
        offerData.append("periodEng", formData.get("periodEng"));
        offerData.append("periodRu", formData.get("periodRu"));
        offerData.append("periodTur", formData.get("periodTur"));
        offerData.append("ageLimit", formData.get("ageLimit"));

        // Append templateId and images only for main offers
        if (!isSubOffer) {
            offerData.append("templateId", singleImageSwitch ? "1" : "2");
            if (singleImageSwitch && singleFileList.length > 0) {
                offerData.append("offerImages", singleFileList[0].originFileObj);
            }
            if (tripleImageSwitch) {
                tripleFileLists
                    .filter((list) => list.length > 0)
                    .forEach((list) => {
                        offerData.append("offerImages", list[0].originFileObj);
                    });
            }
        }

        // Append parentOfferId for sub-offers
        if (isSubOffer && parentOfferId) {
            offerData.append("parentOfferId", parentOfferId);
        }

        try {
            await postOffers(offerData).unwrap();
            alert("Offer created successfully!");
            navigate("/admin/services");
        } catch (err) {
            console.error("Failed to create offer:", err);
            alert(`Error: ${err?.data?.message || "Failed to create offer"}`);
        }
    };

    const uploadButton = (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            <UploadOutlined style={{ fontSize: "24px" }} />
            <div style={{ marginTop: "8px" }}>Upload</div>
        </div>
    );

    return (
        <>
            <div className="right">
                <div className="adminTopBar">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "10px",
                        }}
                    >
                        <img src={image1} alt="Profile" />
                        <div>
                            <p>Admin</p>
                        </div>
                    </div>
                    <div className="navigation-bar">
                        <h2 className="nav-title">
                            <span className="nav-link" onClick={() => navigate("/admin/services")}>
                                Xidmətlər
                            </span>
                            <span className="nav-divider"> — </span>
                            <span className="nav-subtitle">Yeni xidmət əlavə et</span>
                        </h2>
                    </div>
                </div>
            </div>
            <form id="admin-services-create" onSubmit={handleSubmit}>
                <div>
                    <label>Ana Xidmət / Alt Xidmət:</label>
                    <Switch
                        checked={isSubOffer}
                        onChange={handleSubOfferSwitch}
                        checkedChildren="Alt Xidmət"
                        unCheckedChildren="Ana Xidmət"
                        style={{ marginLeft: "10px" }}
                    />
                </div>
                {isSubOffer && (
                    <div>
                        <label>Ana Xidmət Seçin:</label>
                        <Select
                            style={{ width: "100%" }}
                            placeholder="Ana xidmət seçin"
                            onChange={handleParentOfferChange}
                            loading={offersLoading}
                            disabled={offersLoading}
                        >
                            {offers?.data
                                ?.filter((offer) => !offer.parentOfferId) // Only show main offers
                                .map((offer) => (
                                    <Select.Option key={offer.id} value={offer.id}>
                                        {offer.name}
                                    </Select.Option>
                                ))}
                        </Select>
                    </div>
                )}
                <div>
                    <label>Xidmət (AZ):</label>
                    <input type="text" name="name" required />
                </div>
                <div>
                    <label>Xidmət (RU):</label>
                    <input type="text" name="nameRu" required />
                </div>
                <div>
                    <label>Xidmət (ENG):</label>
                    <input type="text" name="nameEng" required />
                </div>
                <div>
                    <label>Xidmət (TR):</label>
                    <input type="text" name="nameTur" required />
                </div>
                <div>
                    <label>Alt Başlıq (AZ):</label>
                    <textarea name="description" required />
                </div>
                <div>
                    <label>Alt Başlıq (RU):</label>
                    <textarea name="descriptionRu" required />
                </div>
                <div>
                    <label>Alt Başlıq (ENG):</label>
                    <textarea name="descriptionEng" required />
                </div>
                <div>
                    <label>Alt Başlıq (TR):</label>
                    <textarea name="descriptionTur" required />
                </div>
                <div className="row">
                    <div className="col-6 pd00">
                        <label>Keçirilmə müddəti (AZ):</label>
                        <input type="text" name="period" required />
                        <label>Keçirilmə müddəti (RU):</label>
                        <input type="text" name="periodRu" required />
                        <label>Keçirilmə müddəti (ENG):</label>
                        <input type="text" name="periodEng" required />
                        <label>Keçirilmə müddəti (TR):</label>
                        <input type="text" name="periodTur" required />
                    </div>
                    <div className="col-6 pd01">
                        <label>Yaş:</label>
                        <input type="text" name="ageLimit" required />
                    </div>
                </div>
                {!isSubOffer && (
                    <>
                        <div className="row" style={{ marginTop: "16px" }}>
                            <div
                                className="col-6 pd00"
                                style={{ display: "flex", alignItems: "center" }}
                            >
                                <label>Xidmət şəhifəsi nümunə 1 (bir şəkilin olduğu)</label>
                                <Switch
                                    checked={singleImageSwitch}
                                    onChange={handleSingleSwitchChange}
                                    style={{ marginLeft: "10px" }}
                                />
                            </div>
                            <div
                                className="col-6 pd01"
                                style={{ display: "flex", alignItems: "center" }}
                            >
                                <label>Xidmət şəhifəsi nümunə 2 (üç şəkilin olduğu)</label>
                                <Switch
                                    checked={tripleImageSwitch}
                                    onChange={handleTripleSwitchChange}
                                    style={{ marginLeft: "10px" }}
                                />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: "16px" }}>
                            <div className="col-6 pd00">
                                <Upload
                                    listType="picture-card"
                                    fileList={singleFileList}
                                    onPreview={handlePreview}
                                    onChange={handleSingleImageChange}
                                    beforeUpload={() => false}
                                    disabled={tripleImageSwitch}
                                >
                                    {singleFileList.length >= 1 ? null : uploadButton}
                                </Upload>
                            </div>
                            <div className="col-6 pd01" style={{ display: "flex", gap: "10px" }}>
                                {[0, 1, 2].map((index) => (
                                    <Upload
                                        key={index}
                                        listType="picture-card"
                                        fileList={tripleFileLists[index]}
                                        onPreview={handlePreview}
                                        onChange={handleTripleImageChange(index)}
                                        beforeUpload={() => false}
                                        disabled={singleImageSwitch}
                                    >
                                        {tripleFileLists[index].length >= 1 ? null : uploadButton}
                                    </Upload>
                                ))}
                            </div>
                        </div>
                    </>
                )}
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: "none" }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(""),
                        }}
                        src={previewImage}
                    />
                )}
                <button type="submit" className="button" disabled={isLoading}>
                    {isLoading ? (
                        <span>
                            <LoadingOutlined style={{ marginRight: "8px" }} />
                            Yadda saxlanılır...
                        </span>
                    ) : (
                        "Yadda saxla"
                    )}
                </button>
                {isError && (
                    <p style={{ color: "red" }}>
                        Error: {error?.data?.message || "Failed to submit"}
                    </p>
                )}
            </form>
        </>
    );
}

export default AdminServCreate;