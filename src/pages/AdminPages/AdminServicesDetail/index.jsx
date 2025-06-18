import "./index.scss";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import image1 from "/src/assets/profile.png";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllOffersQuery, useGetOffersByIdQuery, usePutOffersMutation } from "../../../services/userApi.jsx";
import { OFFER_IMAGES } from "../../../contants.js";
import { Collapse, Button, Space, Upload, Switch, Image, Select } from "antd";
import { UploadOutlined, LoadingOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const quillModules = {
    toolbar: [
        ["bold", "italic", "underline"],
        [{ header: [1, 2, 3, 4, false] }],
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
const { Panel } = Collapse;

function AdminServDetail() {
    const { id } = useParams();
    const { data: getOffersById, refetch: getAllOffersRefetch, isLoading: isOfferLoading } = useGetOffersByIdQuery(id);
    const { data: offers, isLoading: offersLoading } = useGetAllOffersQuery();
    const offer = getOffersById?.data;
    const [putOffer, { isLoading: isSubmitting, isError, error }] = usePutOffersMutation();
    const navigate = useNavigate();

    // Form fields
    const [formData, setFormData] = useState({
        name: "", nameEng: "", nameRu: "", nameTur: "",
        description: "", descriptionEng: "", descriptionRu: "", descriptionTur: "",
        templateId: "", parentOfferId: ""
    });
    const [initialData, setInitialData] = useState({});

    // Rich-text subtitle states
    const [subTitles, setSubTitles] = useState([{ text: "", textEng: "", textRu: "", textTur: "" }]);

    // Image/template handling
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [singleFileList, setSingleFileList] = useState([]);
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]);
    const [deleteOfferImageNames, setDeleteOfferImageNames] = useState([]);
    const [multiFileLists, setMultiFileLists] = useState({
        2: [[], [], []],
        3: [[], [], [], [], []]
    });
    const [initialMultiFileLists, setInitialMultiFileLists] = useState({
        2: [[], [], []],
        3: [[], [], [], [], []]
    });

    // Sub-offer flag and saved template data
    const [isSubOffer, setIsSubOffer] = useState(false);
    const [savedTemplateData, setSavedTemplateData] = useState({
        templateId: "",
        singleFileList: [],
        multiFileLists: { 2: [[], [], []], 3: [[], [], [], [], []] },
        deleteOfferImageNames: [],
        galleryTemplateId: "1",
        galleryFileList: [],
        deleteOfferGalaryNames: [],
        iconFileLists: [[], [], [], []],
        deleteOfferIconNames: []
    });
    // Preview
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [galleryTemplateId, setGalleryTemplateId] = useState("1");
    const [galleryFileList, setGalleryFileList] = useState([]);
    const [initialGalleryFileList, setInitialGalleryFileList] = useState([]);
    const [deleteOfferGalaryNames, setDeleteOfferGalaryNames] = useState([]);
    const [iconFileLists, setIconFileLists] = useState([[], [], [], []]);
    const [initialIconFileLists, setInitialIconFileLists] = useState([[], [], [], []]);
    const [deleteOfferIconNames, setDeleteOfferIconNames] = useState([]);
    const [initialSubTitles, setInitialSubTitles] = useState([]);

    // Refetch all offers on mount
    useEffect(() => {
        getAllOffersRefetch();
    }, [getAllOffersRefetch]);

    // Initialize when offer loads
    useEffect(() => {
        if (offer && offers?.data) {
            console.log("Offer data:", offer);
            // Figure out parentOfferId
            let parentId = offer.parentOfferId || "";
            if (!parentId) {
                const parent = offers.data.find(o => o.subOffers?.some(s => s.id === id));
                if (parent) parentId = parent.id;
            }

            // Base form data
            const baseData = {
                name: offer.name || "",
                nameEng: offer.nameEng || "",
                nameRu: offer.nameRu || "",
                nameTur: offer.nameTur || "",
                description: offer.description || "",
                descriptionEng: offer.descriptionEng || "",
                descriptionRu: offer.descriptionRu || "",
                descriptionTur: offer.descriptionTur || "",
                templateId: offer.templateId || "",
                parentOfferId: parentId,
            };
            setFormData(baseData);
            setInitialData(baseData);

            // Subtitle fields
            let parsedSubTitles = [{ text: "", textEng: "", textRu: "", textTur: "" }]; // Default value
            if (offer.subTitleJson) {
                try {
                    const parsed = JSON.parse(offer.subTitleJson);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        parsedSubTitles = parsed.map(sub => ({
                            text: sub.text || "",
                            textEng: sub.textEng || "",
                            textRu: sub.textRu || "",
                            textTur: sub.textTur || ""
                        }));
                    } else {
                        console.warn("subTitleJson is invalid or empty:", offer.subTitleJson);
                    }
                } catch (e) {
                    console.error("subTitleJson parse error:", e, "Raw data:", offer.subTitleJson);
                }
            } else {
                console.log("No subTitleJson found, using default.");
            }
            console.log("Initialized subTitles:", parsedSubTitles);
            setSubTitles(parsedSubTitles);
            setInitialSubTitles(parsedSubTitles);

            setGalleryTemplateId(offer.galaryTemplateId || "1");
            const gf = offer.offerGalaryNames?.map((name, idx) => ({
                uid: `-${idx + 1}`,
                name,
                url: OFFER_IMAGES + name
            })) || [];
            setGalleryFileList(gf);
            setInitialGalleryFileList(gf);

            const icons = [[], [], [], []];
            offer.offerIconNames?.slice(0, 4).forEach((name, idx) => {
                icons[idx] = [{ uid: `-${idx + 1}`, name, url: OFFER_IMAGES + name }];
            });
            setIconFileLists(icons);
            setInitialIconFileLists(icons);
            // Sub-offer toggle
            const sub = !!parentId;
            setIsSubOffer(sub);

            const mf = { 2: [[], [], []], 3: [[], [], [], [], []] };
            if (offer.templateId === "2" || offer.templateId === "3") {
                const max = offer.templateId === "2" ? 3 : 5;
                offer.offerImageNames?.slice(0, max).forEach((name, idx) => {
                    mf[offer.templateId][idx] = [{ uid: `-${idx + 1}`, name, url: OFFER_IMAGES + name }];
                });
            }
            setMultiFileLists(mf);
            setInitialMultiFileLists(mf);
        }
    }, [offer, offers, id]);

    // Input change
    const updateSubtitle = (index, lang, value) => {
        setSubTitles(prev => {
            const copy = [...prev];
            if (!copy[index]) {
                copy[index] = { text: "", textEng: "", textRu: "", textTur: "" };
            }
            copy[index] = { ...copy[index], [lang]: value || "" };
            console.log("Updated subTitles:", copy);
            return copy;
        });
    };

    const addSubtitle = () => {
        setSubTitles(prev => [
            ...prev,
            { text: "", textEng: "", textRu: "", textTur: "" }
        ]);
    };

    const removeSubtitle = idx => {
        setSubTitles(prev => {
            const newSubTitles = prev.filter((_, i) => i !== idx);
            const result = newSubTitles.length > 0 ? newSubTitles : [{ text: "", textEng: "", textRu: "", textTur: "" }];
            console.log("After remove subTitles:", result);
            return result;
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Main/sub-offer switch
    const handleSubOfferSwitch = (checked) => {
        setIsSubOffer(checked);
        if (checked) {
            setSavedTemplateData({
                templateId: formData.templateId,
                singleFileList,
                multiFileLists,
                deleteOfferImageNames,
                galleryTemplateId,
                galleryFileList,
                deleteOfferGalaryNames,
                iconFileLists,
                deleteOfferIconNames
            });
            setFormData(prev => ({ ...prev, templateId: "", parentOfferId: "" }));
            setSingleFileList([]);
            setMultiFileLists({ 2: [[], [], []], 3: [[], [], [], [], []] });
            setDeleteOfferImageNames([]);
            setGalleryTemplateId("1");
            setGalleryFileList([]);
            setDeleteOfferGalaryNames([]);
            setIconFileLists([[], [], [], []]);
            setDeleteOfferIconNames([]);
        } else {
            setFormData(prev => ({ ...prev, templateId: savedTemplateData.templateId, parentOfferId: "" }));
            setSingleFileList(savedTemplateData.singleFileList);
            setMultiFileLists(savedTemplateData.multiFileLists);
            setDeleteOfferImageNames(savedTemplateData.deleteOfferImageNames);
            setSingleImageSwitch(savedTemplateData.templateId === "1");
            setTripleImageSwitch(savedTemplateData.templateId === "2" || savedTemplateData.templateId === "3");
            setGalleryTemplateId(savedTemplateData.galleryTemplateId);
            setGalleryFileList(savedTemplateData.galleryFileList);
            setDeleteOfferGalaryNames(savedTemplateData.deleteOfferGalaryNames);
            setIconFileLists(savedTemplateData.iconFileLists);
            setDeleteOfferIconNames(savedTemplateData.deleteOfferIconNames);
        }
    };

    // Parent offer select
    const handleParentOfferChange = (val) => setFormData(prev => ({ ...prev, parentOfferId: val || "" }));

    // Switch toggles
    const handleSingleSwitchChange = (checked) => {
        if (!isSubOffer) {
            setSingleImageSwitch(checked);
            setTripleImageSwitch(!checked);
            setFormData(prev => ({ ...prev, templateId: checked ? "1" : "2" }));
            if (checked && tripleFileLists.flat().length) {
                setDeleteOfferImageNames(prev => [...prev, ...tripleFileLists.flat().map(f => f.name)]);
            }
        }
    };

    const handleTripleSwitchChange = (checked) => {
        if (!isSubOffer) {
            setTripleImageSwitch(checked);
            setSingleImageSwitch(!checked);
            setFormData(prev => ({ ...prev, templateId: checked ? "2" : "1" }));
            if (checked && singleFileList.length) {
                setDeleteOfferImageNames(prev => [...prev, ...singleFileList.map(f => f.name)]);
            }
        }
    };

    // Image changes
    const handleSingleImageChange = ({ fileList }) => {
        if (!isSubOffer) {
            if (!fileList.length && singleFileList.length) {
                setDeleteOfferImageNames(prev => [...prev, singleFileList[0].name]);
            }
            setSingleFileList(fileList.slice(0,1));
        }
    };

    const handleMultiImageChange = (template, idx) => ({ fileList }) => {
        if (!isSubOffer) {
            setMultiFileLists(prev => {
                const copy = { ...prev };
                const removed = initialMultiFileLists[template][idx].filter(i => !fileList.some(f => f.name === i.name)).map(f => f.name);
                setDeleteOfferImageNames(p => [...new Set([...p, ...removed])]);
                copy[template][idx] = fileList.slice(0, 1);
                return copy;
            });
        }
    };

    // Preview
    const handlePreview = file => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    // Build payload
    const getChangedFields = () => {
        const payload = new FormData();
        payload.append("id", id);

        // Metin alanları
        payload.append("name", formData.name || "");
        payload.append("nameEng", formData.nameEng || "");
        payload.append("nameRu", formData.nameRu || "");
        payload.append("nameTur", formData.nameTur || "");
        payload.append("description", formData.description || "");
        payload.append("descriptionEng", formData.descriptionEng || "");
        payload.append("descriptionRu", formData.descriptionRu || "");
        payload.append("descriptionTur", formData.descriptionTur || "");

        // Ensure subTitleJson is always sent with data
        const subTitlesToSend = subTitles.length > 0 ? subTitles : [{ text: "", textEng: "", textRu: "", textTur: "" }];
        if (subTitlesToSend.length === 0) {
            subTitlesToSend.push({ text: "", textEng: "", textRu: "", textTur: "" });
        }
        console.log("Sending subTitles:", subTitlesToSend);
        payload.append("subTitleJson", JSON.stringify(subTitlesToSend));

        // Şablon ve resimler
        if (!isSubOffer) {
            payload.append("templateId", formData.templateId || "");
            payload.append("galaryTemplateId", galleryTemplateId || "1");

            // Tek resim
            if (formData.templateId === "1") {
                singleFileList.forEach(f => payload.append("offerImageNames", f.originFileObj || f.name));
            }
            // Çoklu resimler
            if (formData.templateId === "2" || formData.templateId === "3") {
                multiFileLists[formData.templateId].flat().forEach(f => payload.append("offerImageNames", f.originFileObj || f.name));
            }
            // Silinen resimler
            deleteOfferImageNames.forEach(name => payload.append("deleteOfferImageNames", name));

            // Galeri resimleri
            galleryFileList.forEach(f => payload.append("offerGalary", f.originFileObj || f.name));
            deleteOfferGalaryNames.forEach(name => payload.append("deleteOfferGalaryNames", name));

            // İkonlar
            iconFileLists.flat().forEach(f => payload.append("offerIcons", f.originFileObj || f.name));
            deleteOfferIconNames.forEach(name => payload.append("deleteOfferIconNames", name));
        } else {
            payload.append("parentOfferId", formData.parentOfferId || "");
        }

        // FormData içeriğini logla
        console.log("Sending FormData:", Array.from(payload.entries()));
        return payload;
    };

    // Submit
    const handleSubmit = async () => {
        if (isSubOffer && !formData.parentOfferId) {
            alert("Lütfen alt hizmet için ana hizmet seçin");
            return;
        }
        if (!isSubOffer) {
            if (formData.templateId === "1" && singleFileList.length === 0) {
                alert("Lütfen ana teklif için tek bir resim yükleyin");
                return;
            }
            if ((formData.templateId === "2" || formData.templateId === "3") && multiFileLists[formData.templateId].every(list => list.length === 0)) {
                alert("Lütfen çoklu resim modu için en az bir resim yükleyin");
                return;
            }
        }
        const payload = getChangedFields();
        const hasChanges = Array.from(payload.keys()).length > 1;
        if (!hasChanges) {
            alert("Hiçbir değişiklik tespit edilmedi.");
            return;
        }
        try {
            const res = await putOffer(payload).unwrap();
            if (res.statusCode === 200) {
                alert("Değişiklikler başarıyla kaydedildi!");
                navigate("/admin/services");
            } else {
                alert("Değişiklikleri kaydetme başarısız oldu.");
            }
        } catch (err) {
            alert(`Hata: ${err?.data?.message || "Değişiklikleri kaydetme başarısız oldu"}`);
        }
    };

    const uploadButton = (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <UploadOutlined style={{ fontSize: 24 }} />
            <div style={{ marginTop: 8 }}>Yüklə</div>
        </div>
    );

    return (
        <>
            <div className="right">
                <div className="adminTopBar">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                        <img src={image1} alt="profile" />
                        <p>Admin</p>
                    </div>
                    <div className="navigation-bar">
                        <h2 className="nav-title">
                            <span className="nav-link" onClick={() => navigate("/admin/services")}>Xidmətlər</span>
                            <span className="nav-divider"> — </span>
                            <span className="nav-subtitle">{offer?.name || "Yüklənir..."}</span>
                        </h2>
                    </div>
                </div>
            </div>

            <div id="admin-services-detail">
                {isOfferLoading ? (
                    <div className="loading-spinner">
                        <LoadingOutlined style={{ fontSize: 24, marginBottom: 16 }} />
                        <p>Yüklənir...</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: 16 }}>
                            <label>Ana Xidmət / Alt Xidmət:</label>
                            <Switch
                                checked={isSubOffer}
                                onChange={handleSubOfferSwitch}
                                checkedChildren="Alt Xidmət"
                                unCheckedChildren="Ana Xidmət"
                                style={{ marginLeft: 10 }}
                                disabled={isSubmitting}
                            />
                        </div>

                        {isSubOffer && (
                            <div style={{ marginBottom: 16 }}>
                                <label>Ana Xidmət Seçin:</label>
                                <Select
                                    style={{ width: "100%" }}
                                    placeholder="Ana xidmət seçin"
                                    value={formData.parentOfferId || undefined}
                                    onChange={handleParentOfferChange}
                                    loading={offersLoading}
                                    disabled={offersLoading || isSubmitting}
                                    allowClear
                                >
                                    {offers?.data
                                        ?.filter(o => o.id !== id && !o.parentOfferId)
                                        .map(o => <Select.Option key={o.id} value={o.id}>{o.name}</Select.Option>)}
                                </Select>
                            </div>
                        )}

                        <div><label>Xidmət (AZ):</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} disabled={isSubmitting} /></div>
                        <div><label>Xidmət (RU):</label><input type="text" name="nameRu" value={formData.nameRu} onChange={handleInputChange} disabled={isSubmitting} /></div>
                        <div><label>Xidmət (ENG):</label><input type="text" name="nameEng" value={formData.nameEng} onChange={handleInputChange} disabled={isSubmitting} /></div>
                        <div><label>Xidmət (TR):</label><input type="text" name="nameTur" value={formData.nameTur} onChange={handleInputChange} disabled={isSubmitting} /></div>

                        <div><label>Açıqlama (AZ):</label><textarea name="description" value={formData.description} onChange={handleInputChange} disabled={isSubmitting} /></div>
                        <div><label>Açıqlama (RU):</label><textarea name="descriptionRu" value={formData.descriptionRu} onChange={handleInputChange} disabled={isSubmitting} /></div>
                        <div><label>Açıqlama (ENG):</label><textarea name="descriptionEng" value={formData.descriptionEng} onChange={handleInputChange} disabled={isSubmitting} /></div>
                        <div><label>Açıqlama (TR):</label><textarea name="descriptionTur" value={formData.descriptionTur} onChange={handleInputChange} disabled={isSubmitting} /></div>

                        {/* Rich-text subtitles */}
                        <label>Alt Başlıklar:</label>
                        <Collapse accordion>
                            {subTitles.map((item, idx) => (
                                <Panel
                                    key={idx}
                                    header={
                                        <Space>
                                            Alt Başlık #{idx + 1}
                                            <DeleteOutlined
                                                style={{ color: "red" }}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    removeSubtitle(idx);
                                                }}
                                            />
                                        </Space>
                                    }
                                >
                                    <div style={{ marginBottom: 16 }}>
                                        <h4>AZ</h4>
                                        <ReactQuill
                                            value={item.text || ""}
                                            onChange={html => updateSubtitle(idx, "text", html)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="AZ metin girin…"
                                            readOnly={isSubmitting}
                                        />
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <h4>RU</h4>
                                        <ReactQuill
                                            value={item.textRu || ""}
                                            onChange={html => updateSubtitle(idx, "textRu", html)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="RU metin girin…"
                                            readOnly={isSubmitting}
                                        />
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <h4>ENG</h4>
                                        <ReactQuill
                                            value={item.textEng || ""}
                                            onChange={html => updateSubtitle(idx, "textEng", html)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="ENG metin girin…"
                                            readOnly={isSubmitting}
                                        />
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <h4>TR</h4>
                                        <ReactQuill
                                            value={item.textTur || ""}
                                            onChange={html => updateSubtitle(idx, "textTur", html)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="TR metin girin…"
                                            readOnly={isSubmitting}
                                        />
                                    </div>
                                </Panel>
                            ))}
                            <Panel
                                key="add"
                                header={
                                    <Button
                                        type="dashed"
                                        block
                                        icon={<PlusOutlined />}
                                        onClick={addSubtitle}
                                        disabled={isSubmitting}
                                    >
                                        Yeni Alt Başlık
                                    </Button>
                                }
                            />
                        </Collapse>
                        {!isSubOffer && (
                            <>  {/* Template switches & uploads */}
                                <div style={{ marginTop: 16 }}>
                                    <label>Şablon Tipi:</label>
                                    <Select
                                        value={formData.templateId}
                                        onChange={(value) => {
                                            if (!isSubOffer) {
                                                setFormData(prev => ({ ...prev, templateId: value }));
                                                setSingleImageSwitch(value === "1");
                                                setTripleImageSwitch(value === "2" || value === "3");
                                                if (value === "1" && multiFileLists[formData.templateId].flat().length) {
                                                    setDeleteOfferImageNames(prev => [...prev, ...multiFileLists[formData.templateId].flat().map(f => f.name)]);
                                                } else if ((value === "2" || value === "3") && singleFileList.length) {
                                                    setDeleteOfferImageNames(prev => [...prev, ...singleFileList.map(f => f.name)]);
                                                }
                                            }
                                        }}
                                        style={{ width: 200 }}
                                        disabled={isSubmitting}
                                    >
                                        <Select.Option value="1">Şablon 1 (1 Resim)</Select.Option>
                                        <Select.Option value="2">Şablon 2 (3 Resim)</Select.Option>
                                        <Select.Option value="3">Şablon 3 (5 Resim)</Select.Option>
                                    </Select>
                                </div>
                                {formData.templateId === "1" && (
                                    <Upload
                                        listType="picture-card"
                                        fileList={singleFileList}
                                        onPreview={handlePreview}
                                        onChange={handleSingleImageChange}
                                        beforeUpload={() => false}
                                        disabled={isSubmitting}
                                    >
                                        {singleFileList.length >= 1 ? null : uploadButton}
                                    </Upload>
                                )}
                                {(formData.templateId === "2" || formData.templateId === "3") && (
                                    <div className="row" style={{ display: 'flex', gap: 10 }}>
                                        {multiFileLists[formData.templateId].map((list, idx) => (
                                            <Upload
                                                key={idx}
                                                listType="picture-card"
                                                fileList={list}
                                                onPreview={handlePreview}
                                                onChange={handleMultiImageChange(formData.templateId, idx)}
                                                beforeUpload={() => false}
                                                disabled={isSubmitting}
                                            >
                                                {list.length >= 1 ? null : uploadButton}
                                            </Upload>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {isSubOffer && <p style={{ color: '#888', marginTop: 16 }}>Alt xidmətlər üçün şəkil yükləmə və şablon seçimi deaktivdir.</p>}

                        {previewImage && <Image wrapperStyle={{ display: 'none' }} preview={{ visible: previewOpen, onVisibleChange: v => { if (!v) setPreviewImage(''); setPreviewOpen(v); }}} src={previewImage} />}

                        {isError && <p style={{ color: 'red', marginTop: 16 }}>Xəta: {error?.data?.message || 'Dəyişiklikləri yadda saxlamaq alınmadı'}</p>}
                        <div style={{ marginTop: 16 }}>
                            <label>Galeri veya Sponsor Şablonu:</label>
                            <Select
                                value={galleryTemplateId}
                                onChange={setGalleryTemplateId}
                                style={{ width: 200 }}
                                disabled={isSubmitting}
                            >
                                <Select.Option value="1">Galeri</Select.Option>
                                <Select.Option value="2">Sponsor Logoları</Select.Option>
                            </Select>
                        </div>
                        <Upload
                            multiple
                            listType="picture-card"
                            fileList={galleryFileList}
                            onPreview={handlePreview}
                            onChange={({ fileList }) => {
                                if (!isSubOffer) {
                                    const removed = initialGalleryFileList.filter(i => !fileList.some(f => f.name === i.name)).map(f => f.name);
                                    setDeleteOfferGalaryNames(prev => [...new Set([...prev, ...removed])]);
                                    setGalleryFileList(fileList);
                                }
                            }}
                            beforeUpload={() => false}
                            disabled={isSubmitting}
                        >
                            {uploadButton}
                        </Upload>

                        <div style={{ marginTop: 16 }}>
                            <label>Offer Icons:</label>
                            <div className="row" style={{ display: 'flex', gap: 10 }}>
                                {iconFileLists.map((list, idx) => (
                                    <Upload
                                        key={idx}
                                        listType="picture-card"
                                        fileList={list}
                                        onPreview={handlePreview}
                                        onChange={({ fileList }) => {
                                            if (!isSubOffer) {
                                                const removed = initialIconFileLists[idx].filter(i => !fileList.some(f => f.name === i.name)).map(f => f.name);
                                                setDeleteOfferIconNames(prev => [...new Set([...prev, ...removed])]);
                                                setIconFileLists(prev => prev.map((l, i) => i === idx ? fileList.slice(0, 1) : l));
                                            }
                                        }}
                                        beforeUpload={() => false}
                                        disabled={isSubmitting}
                                    >
                                        {list.length >= 1 ? null : uploadButton}
                                    </Upload>
                                ))}
                            </div>
                        </div>
                        <Button type="primary" onClick={handleSubmit} className="button" disabled={isSubmitting}>
                            {isSubmitting ? (<><LoadingOutlined style={{ marginRight: 8 }} />Dəyişikliklər saxlanılır...</>) : 'Dəyişiklikləri yadda saxla'}
                        </Button>
                    </>
                )}
            </div>
        </>
    );
}

export default AdminServDetail;