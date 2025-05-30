import "./index.scss";
import { Upload, Switch, Image, Select } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import image1 from "../../../assets/profile.png";
import { useNavigate } from "react-router-dom";
import { useGetAllOffersQuery, usePostOffersMutation } from "../../../services/userApi.jsx";

function AdminServCreate() {
    // Image/template states
    const [singleFileList, setSingleFileList] = useState([]);
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]);
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);

    // Offer type state
    const [isSubOffer, setIsSubOffer] = useState(false);
    const [parentOfferId, setParentOfferId] = useState(null);

    // Rich-text states for subtitles
    const [subTitleAz, setSubTitleAz] = useState("");
    const [subTitleRu, setSubTitleRu] = useState("");
    const [subTitleEng, setSubTitleEng] = useState("");
    const [subTitleTur, setSubTitleTur] = useState("");

    const navigate = useNavigate();
    const [postOffers, { isLoading, isError, error }] = usePostOffersMutation();
    const { data: offers, isLoading: offersLoading } = useGetAllOffersQuery();

    // ReactQuill toolbar configuration
    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{ header: [1, 2, false] }],
            ["link", "image"],
            [{ list: "ordered" }, { list: "bullet" }],
        ],
    };
    const quillFormats = [
        "header",
        "bold",
        "italic",
        "underline",
        "link",
        "image",
        "list",
        "bullet",
    ];

    // Handlers for template switches
    const handleSingleSwitchChange = (checked) => {
        setSingleImageSwitch(checked);
        setTripleImageSwitch(!checked);
        if (checked) setTripleFileLists([[], [], []]);
    };
    const handleTripleSwitchChange = (checked) => {
        setTripleImageSwitch(checked);
        setSingleImageSwitch(!checked);
        if (checked) setSingleFileList([]);
    };

    // Handlers for image uploads
    const handleSingleImageChange = ({ fileList }) => {
        setSingleFileList(fileList);
    };
    const handleTripleImageChange = (index) => ({ fileList }) => {
        setTripleFileLists((prev) => {
            const lists = [...prev];
            lists[index] = fileList;
            return lists;
        });
    };

    // Offer type switch
    const handleSubOfferSwitch = (checked) => {
        setIsSubOffer(checked);
        if (checked) {
            setSingleFileList([]);
            setTripleFileLists([[], [], []]);
            setSingleImageSwitch(true);
            setTripleImageSwitch(false);
        } else {
            setParentOfferId(null);
        }
    };

    const handleParentOfferChange = (value) => {
        setParentOfferId(value);
    };

    // Preview handler
    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    // Form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Validations
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

        // Prepare FormData
        const offerData = new FormData();
        // Text fields
        offerData.append("name", formData.get("name"));
        offerData.append("nameEng", formData.get("nameEng"));
        offerData.append("nameRu", formData.get("nameRu"));
        offerData.append("nameTur", formData.get("nameTur"));
        offerData.append("description", formData.get("description"));
        offerData.append("descriptionEng", formData.get("descriptionEng"));
        offerData.append("descriptionRu", formData.get("descriptionRu"));
        offerData.append("descriptionTur", formData.get("descriptionTur"));
        // Rich-text subtitles as HTML
        offerData.append("subTitle", subTitleAz);
        offerData.append("subTitleEng", subTitleEng);
        offerData.append("subTitleRu", subTitleRu);
        offerData.append("subTitleTur", subTitleTur);

        // Template & images for main offers
        if (!isSubOffer) {
            offerData.append("templateId", singleImageSwitch ? "1" : "2");
            if (singleImageSwitch && singleFileList[0]?.originFileObj) {
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
        // Parent for sub-offer
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
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <UploadOutlined style={{ fontSize: 24 }} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <>
            <div className="right">
                <div className="adminTopBar">
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={image1} alt="Profile" />
                        <div><p>Admin</p></div>
                    </div>
                    <div className="navigation-bar">
                        <h2 className="nav-title">
                            <span className="nav-link" onClick={() => navigate("/admin/services")}>Xidmətlər</span>
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
                        style={{ marginLeft: 10 }}
                    />
                </div>

                {isSubOffer && (
                    <div>
                        <label>Ana Xidmət Seçin:</label>
                        <Select
                            style={{ width: '100%' }}
                            placeholder="Ana xidmət seçin"
                            onChange={handleParentOfferChange}
                            loading={offersLoading}
                            disabled={offersLoading}
                        >
                            {offers?.data
                                ?.filter((o) => !o.parentOfferId)
                                .map((o) => (
                                    <Select.Option key={o.id} value={o.id}>
                                        {o.name}
                                    </Select.Option>
                                ))}
                        </Select>
                    </div>
                )}

                <div><label>Xidmət (AZ):</label><input type="text" name="name" required /></div>
                <div><label>Xidmət (RU):</label><input type="text" name="nameRu" required /></div>
                <div><label>Xidmət (ENG):</label><input type="text" name="nameEng" required /></div>
                <div><label>Xidmət (TR):</label><input type="text" name="nameTur" required /></div>

                <div><label>Açıqlama (AZ):</label><textarea name="description" required /></div>
                <div><label>Açıqlama (RU):</label><textarea name="descriptionRu" required /></div>
                <div><label>Açıqlama (ENG):</label><textarea name="descriptionEng" required /></div>
                <div><label>Açıqlama (TR):</label><textarea name="descriptionTur" required /></div>

                {/* Rich-text editors */}
                <div>
                    <label>Alt Başlıq (AZ):</label>
                    <ReactQuill
                        theme="snow"
                        value={subTitleAz}
                        onChange={setSubTitleAz}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Mətn daxil edin..."
                    />
                </div>
                <div>
                    <label>Alt Başlıq (RU):</label>
                    <ReactQuill
                        theme="snow"
                        value={subTitleRu}
                        onChange={setSubTitleRu}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Введите текст..."
                    />
                </div>
                <div>
                    <label>Alt Başlıq (ENG):</label>
                    <ReactQuill
                        theme="snow"
                        value={subTitleEng}
                        onChange={setSubTitleEng}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Enter text..."
                    />
                </div>
                <div>
                    <label>Alt Başlıq (TR):</label>
                    <ReactQuill
                        theme="snow"
                        value={subTitleTur}
                        onChange={setSubTitleTur}
                        modules={quillModules}
                        formats={quillFormats}
                        placeholder="Metin girin..."
                    />
                </div>

                {/* Template switches & uploads */}
                {!isSubOffer && (
                    <>
                        <div className="row" style={{ marginTop: 16 }}>
                            <div className="col-6 pd00" style={{ display: 'flex', alignItems: 'center' }}>
                                <label>Şəkil şablonu 1 (1 şəkil)</label>
                                <Switch checked={singleImageSwitch} onChange={handleSingleSwitchChange} style={{ marginLeft: 10 }} />
                            </div>
                            <div className="col-6 pd01" style={{ display: 'flex', alignItems: 'center' }}>
                                <label>Şəkil şablonu 2 (3 şəkil)</label>
                                <Switch checked={tripleImageSwitch} onChange={handleTripleSwitchChange} style={{ marginLeft: 10 }} />
                            </div>
                        </div>
                        <div className="row" style={{ marginTop: 16 }}>
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
                            <div className="col-6 pd01" style={{ display: 'flex', gap: 10 }}>
                                {[0,1,2].map((i) => (
                                    <Upload
                                        key={i}
                                        listType="picture-card"
                                        fileList={tripleFileLists[i]}
                                        onPreview={handlePreview}
                                        onChange={handleTripleImageChange(i)}
                                        beforeUpload={() => false}
                                        disabled={singleImageSwitch}
                                    >
                                        {tripleFileLists[i].length >= 1 ? null : uploadButton}
                                    </Upload>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* Preview (hidden wrapper) */}
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{ visible: previewOpen, onVisibleChange: v => !v && setPreviewImage("") }}
                        src={previewImage}
                    />
                )}

                {/* Submit */}
                <button type="submit" className="button" disabled={isLoading}>
                    {isLoading ? (<><LoadingOutlined style={{ marginRight: 8 }} />Yadda saxlanılır…</>) : "Yadda saxla"}
                </button>
                {isError && <p style={{ color: 'red' }}>Error: {error?.data?.message || "Failed to submit"}</p>}
            </form>
        </>
    );
}

export default AdminServCreate;
