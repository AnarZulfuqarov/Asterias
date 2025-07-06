import "./index.scss";
import {Upload, Switch, Image, Select} from "antd";
import {UploadOutlined, LoadingOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {useState} from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import image1 from "../../../assets/profile.png";
import {useNavigate} from "react-router-dom";
import {useGetAllOffersQuery, usePostOffersMutation} from "../../../services/userApi.jsx";

const {Panel} = Collapse;
import {Collapse, Button, Space} from "antd";

function AdminServCreate() {
    // Image/template states
    const [singleFileList, setSingleFileList] = useState([]);
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]);
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [templateId, setTemplateId] = useState("1");
    const [multiFileLists, setMultiFileLists] = useState({
        2: [[], [], []],
        3: [[], [], [], [], []],
    });
    // Offer type state
    const [isSubOffer, setIsSubOffer] = useState(false);
    const [parentOfferId, setParentOfferId] = useState(null);
    const [galleryTemplateId, setGalleryTemplateId] = useState("1");
    const [galleryFileList, setGalleryFileList] = useState([]);
    const [galleryMultiple, setGalleryMultiple] = useState(false);
// sponsor (icon) üçün
    const [iconsMultiple, setIconsMultiple] = useState(false);
    const [iconFileLists, setIconFileLists] = useState([[], [], [], []]);
    const [subTitles, setSubTitles] = useState([
        {text: "", textEng: "", textRu: "", textTur: ""}
    ]);
    const navigate = useNavigate();
    const [postOffers, {isLoading, isError, error}] = usePostOffersMutation();
    const {data: offers, isLoading: offersLoading} = useGetAllOffersQuery();

    // ReactQuill toolbar configuration
    const quillModules = {
        toolbar: [
            ["bold", "italic", "underline"],
            [{header: [1, 2, 3, 4, false]}],
            ["link", "image"],
            [{list: "ordered"}, {list: "bullet"}],
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
    const handleMultiChange = (template, idx) => ({fileList}) => {
        setMultiFileLists((prev) => ({
            ...prev,
            [template]: prev[template].map((list, i) => (i === idx ? fileList : list)),
        }));
    };
    const handleIconChange = (idx) => ({fileList}) => {
        setIconFileLists((prev) => prev.map((list, i) => (i === idx ? fileList : list)));
    };

    // Handlers for template switches

    const updateSubtitle = (index, lang, value) => {
        setSubTitles(prev => {
            const copy = [...prev];
            copy[index] = {...copy[index], [lang]: value};
            return copy;
        });
    };

    const addSubtitle = () => {
        setSubTitles(prev => [
            ...prev,
            {text: "", textEng: "", textRu: "", textTur: ""}
        ]);
    };
    const removeSubtitle = idx => {
        setSubTitles(prev => prev.filter((_, i) => i !== idx));
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
            if (templateId === "1" && singleFileList.length === 0) {
                alert("Please upload a single image for the main offer");
                return;
            }
            if ((templateId === "2" || templateId === "3") &&
                multiFileLists[templateId].every((list) => list.length === 0)
            ) {
                alert("Please upload at least one image for this template");
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
        offerData.append("subTitleJson", JSON.stringify(subTitles));
        offerData.append("templateId", templateId);

        // Template & images for main offers
        if (templateId === "1" && singleFileList[0]?.originFileObj) {
            offerData.append("offerImages", singleFileList[0].originFileObj);
        }
        if (templateId === "2" || templateId === "3") {
            multiFileLists[templateId]
                .filter((list) => list.length > 0)
                .forEach((list) => offerData.append("offerImages", list[0].originFileObj));
        }

        // Gallery Images
        offerData.append("galaryTemplateId", galleryTemplateId);
        galleryFileList.forEach((file) => {
            if (file.originFileObj) {
                offerData.append("offerIGalary", file.originFileObj);
            }
        });

        // Icons
        iconFileLists
            .filter((list) => list.length > 0)
            .forEach((list) => offerData.append("offerIcons", list[0].originFileObj));

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
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <UploadOutlined style={{fontSize: 24}}/>
            <div style={{marginTop: 8}}>Upload</div>
        </div>
    );

    return (
        <>
            <div className="right">
                <div className="adminTopBar">
                    <div style={{display: "flex", alignItems: "center", gap: 10}}>
                        <img src={image1} alt="Profile"/>
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
                        style={{marginLeft: 10}}
                    />
                </div>

                {isSubOffer && (
                    <div>
                        <label>Ana Xidmət Seçin:</label>
                        <Select
                            style={{width: '100%'}}
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

                <div><label>Xidmət (AZ):</label><input type="text" name="name" required/></div>
                <div><label>Xidmət (RU):</label><input type="text" name="nameRu" required/></div>
                <div><label>Xidmət (ENG):</label><input type="text" name="nameEng" required/></div>
                <div><label>Xidmət (TR):</label><input type="text" name="nameTur" required/></div>

                <div><label>Açıqlama (AZ):</label><textarea name="description" required/></div>
                <div><label>Açıqlama (RU):</label><textarea name="descriptionRu" required/></div>
                <div><label>Açıqlama (ENG):</label><textarea name="descriptionEng" required/></div>
                <div><label>Açıqlama (TR):</label><textarea name="descriptionTur" required/></div>

                {/* Rich-text editors */}
                <label>Alt Başlıqlar:</label>
                <Collapse accordion>
                    {subTitles.map((item, idx) => (
                        <Panel
                            key={idx}
                            header={
                                <Space>
                                    Alt Başlıq #{idx + 1}
                                    <DeleteOutlined
                                        style={{color: "red"}}
                                        onClick={e => {
                                            e.stopPropagation(); // panelin açılmasını önlə
                                            removeSubtitle(idx);
                                        }}
                                    />
                                </Space>
                            }
                        >
                            {/* Daxildəki redaktorlar */}
                            <div style={{marginBottom: 16}}>
                                <h4>AZ</h4>
                                <ReactQuill
                                    value={item.text}
                                    onChange={html => updateSubtitle(idx, "text", html)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="AZ mətn daxil edin…"
                                />
                            </div>
                            <div style={{marginBottom: 16}}>
                                <h4>RU</h4>
                                <ReactQuill
                                    value={item.textRu}
                                    onChange={html => updateSubtitle(idx, "textRu", html)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="RU mətn daxil edin…"
                                />
                            </div>
                            <div style={{marginBottom: 16}}>
                                <h4>ENG</h4>
                                <ReactQuill
                                    value={item.textEng}
                                    onChange={html => updateSubtitle(idx, "textEng", html)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="ENG mətn daxil edin…"
                                />
                            </div>
                            <div style={{marginBottom: 16}}>
                                <h4>TR</h4>
                                <ReactQuill
                                    value={item.textTur}
                                    onChange={html => updateSubtitle(idx, "textTur", html)}
                                    modules={quillModules}
                                    formats={quillFormats}
                                    placeholder="TR mətn daxil edin…"
                                />
                            </div>
                        </Panel>
                    ))}

                    {/* Yeni alt başlıq düyməsi */}
                    <Panel
                        key="add"
                        header={
                            <Button
                                type="dashed"
                                block
                                icon={<PlusOutlined/>}
                                onClick={addSubtitle}
                            >
                                Yeni Alt Başlıq
                            </Button>
                        }
                    />
                </Collapse>

                {/* Template switches & uploads */}
                {!isSubOffer && (
                    <>
                        <div>
                            <label>Şablon Tipi:</label>
                            <Select
                                value={templateId}
                                onChange={setTemplateId}
                                style={{width: 200}}
                            >
                                <Option value="1">Şablon 1 (1 Image)</Option>
                                <Option value="2">Şablon 2 (3 Images)</Option>
                                <Option value="3">Şablon 3 (5 Images)</Option>
                            </Select>
                        </div>
                        {/* Image Uploads for Template */}
                        {templateId === "1" && (
                            <Upload
                                listType="picture-card"
                                fileList={singleFileList}
                                onChange={({fileList}) => setSingleFileList(fileList)}
                                beforeUpload={() => false}
                            >
                                {singleFileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        )}
                        {(templateId === "2" || templateId === "3") && (
                            <div className="row" style={{display: 'flex', gap: 10}}>
                                {multiFileLists[templateId].map((list, idx) => (
                                    <Upload
                                        key={idx}
                                        listType="picture-card"
                                        fileList={list}
                                        onChange={handleMultiChange(templateId, idx)}
                                        beforeUpload={() => false}
                                    >
                                        {list.length >= 1 ? null : uploadButton}
                                    </Upload>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Preview (hidden wrapper) */}
                {previewImage && (
                    <Image
                        wrapperStyle={{display: 'none'}}
                        preview={{visible: previewOpen, onVisibleChange: v => !v && setPreviewImage("")}}
                        src={previewImage}
                    />
                )}
                <div>
                    <label>Galeri və ya Sponsor Şablonu: </label>
                    <Select
                        value={galleryTemplateId}
                        onChange={setGalleryTemplateId}
                        style={{width: 200}}
                    >
                        <Option value="1">Galeri</Option>
                        <Option value="2">Sponsor Logoları</Option>
                    </Select>
                </div>
                <Upload
                    multiple                     // sadece çoklu yüklemeyi aktif et
                    listType="picture-card"
                    fileList={galleryFileList}
                    onChange={({fileList}) => setGalleryFileList(fileList)}
                    beforeUpload={() => false}
                >
                    {uploadButton}
                </Upload>


                <div>
                    <label>Offer Icons:</label>
                    <div className="row" style={{display: 'flex', gap: 10}}>
                        {iconFileLists?.map((list, idx) => (
                            <Upload
                                key={idx}
                                listType="picture-card"
                                fileList={list}
                                onChange={handleIconChange(idx)}
                                beforeUpload={() => false}
                            >
                                {list.length >= 1 ? null : uploadButton}
                            </Upload>
                        ))}
                    </div>
                </div>
                {/* Submit */}
                <button type="submit" className="button" disabled={isLoading}>
                    {isLoading ? (<><LoadingOutlined style={{marginRight: 8}}/>Yadda saxlanılır…</>) : "Yadda saxla"}
                </button>
                {isError && <p style={{color: 'red'}}>Error: {error?.data?.message || "Failed to submit"}</p>}
            </form>
        </>
    );
}

export default AdminServCreate;
