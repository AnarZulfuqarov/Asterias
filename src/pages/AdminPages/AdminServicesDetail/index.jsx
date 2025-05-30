import "./index.scss";
import { Upload, Switch, Image, Button, Select } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import image1 from "/src/assets/profile.png";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllOffersQuery, useGetOffersByIdQuery, usePutOffersMutation } from "../../../services/userApi.jsx";
import { OFFER_IMAGES } from "../../../contants.js";

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
    const [subTitleAz, setSubTitleAz] = useState("");
    const [subTitleRu, setSubTitleRu] = useState("");
    const [subTitleEng, setSubTitleEng] = useState("");
    const [subTitleTur, setSubTitleTur] = useState("");

    // Image/template handling
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [singleFileList, setSingleFileList] = useState([]);
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]);
    const [deleteOfferImageNames, setDeleteOfferImageNames] = useState([]);
    const [initialSingleFileList, setInitialSingleFileList] = useState([]);
    const [initialTripleFileLists, setInitialTripleFileLists] = useState([[], [], []]);

    // Sub-offer flag and saved template data
    const [isSubOffer, setIsSubOffer] = useState(false);
    const [savedTemplateData, setSavedTemplateData] = useState({ templateId: "", singleFileList: [], tripleFileLists: [[], [], []], deleteOfferImageNames: [] });

    // Preview
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);

    // Refetch all offers on mount
    useEffect(() => {
        getAllOffersRefetch();
    }, [getAllOffersRefetch]);

    // Initialize when offer loads
    useEffect(() => {
        if (offer && offers?.data) {
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
            setSubTitleAz(offer.subTitle || "");
            setSubTitleRu(offer.subTitleRu || "");
            setSubTitleEng(offer.subTitleEng || "");
            setSubTitleTur(offer.subTitleTur || "");

            // Sub-offer toggle
            const sub = !!parentId;
            setIsSubOffer(sub);

            if (!sub) {
                // Template switches
                setSingleImageSwitch(offer.templateId === "1");
                setTripleImageSwitch(offer.templateId === "2");

                // Single image list
                const sf = offer.offerImageNames?.slice(0, 1).map(name => ({ uid: '-1', name, url: OFFER_IMAGES + name })) || [];
                // Triple image lists
                const tf = [[], [], []];
                if (offer.templateId === "2") {
                    offer.offerImageNames.slice(0, 3).forEach((name, idx) => {
                        tf[idx] = [{ uid: `-${idx+1}`, name, url: OFFER_IMAGES + name }];
                    });
                }
                setSingleFileList(sf);
                setTripleFileLists(tf);
                setInitialSingleFileList(sf);
                setInitialTripleFileLists(tf);
                setSavedTemplateData({ templateId: offer.templateId, singleFileList: sf, tripleFileLists: tf, deleteOfferImageNames: [] });
            } else {
                // Clear if sub-offer
                setSingleFileList([]);
                setTripleFileLists([[], [], []]);
                setSingleImageSwitch(true);
                setTripleImageSwitch(false);
            }
        }
    }, [offer, offers, id]);

    // Input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Main/sub-offer switch
    const handleSubOfferSwitch = (checked) => {
        setIsSubOffer(checked);
        if (checked) {
            setSavedTemplateData({ templateId: formData.templateId, singleFileList, tripleFileLists, deleteOfferImageNames });
            setFormData(prev => ({ ...prev, templateId: "" }));
            setSingleFileList([]);
            setTripleFileLists([[], [], []]);
            setDeleteOfferImageNames([]);
        } else {
            setFormData(prev => ({ ...prev, templateId: savedTemplateData.templateId, parentOfferId: "" }));
            setSingleFileList(savedTemplateData.singleFileList);
            setTripleFileLists(savedTemplateData.tripleFileLists);
            setDeleteOfferImageNames(savedTemplateData.deleteOfferImageNames);
            setSingleImageSwitch(savedTemplateData.templateId === "1");
            setTripleImageSwitch(savedTemplateData.templateId === "2");
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

    const handleTripleImageChange = idx => ({ fileList }) => {
        if (!isSubOffer) {
            setTripleFileLists(prev => {
                const copy = [...prev];
                if (!fileList.length && prev[idx].length) {
                    setDeleteOfferImageNames(p => [...p, prev[idx][0].name]);
                }
                copy[idx] = fileList.slice(0,1);
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
        // text & subtitle fields
        [
            "name","nameEng","nameRu","nameTur",
            "description","descriptionEng","descriptionRu","descriptionTur",
            "subTitle","subTitleEng","subTitleRu","subTitleTur",
            ...(isSubOffer? ["parentOfferId"] : ["templateId","parentOfferId"])
        ].forEach(key => {
            const val = key.startsWith('subTitle')
                ? { subTitle: subTitleAz, subTitleEng, subTitleRu, subTitleTur }[key]
                : formData[key];
            if (val !== initialData[key]) payload.append(key, val || "");
        });

        if (!isSubOffer) {
            // images
            if (formData.templateId === "1") {
                const curr = singleFileList.map(f => f.originFileObj || f.name);
                const init = initialSingleFileList.map(f => f.name);
                if (JSON.stringify(curr) !== JSON.stringify(init)) {
                    singleFileList.forEach(f => payload.append("OfferImageNames", f.originFileObj || f.name));
                }
            }
            if (formData.templateId === "2") {
                const curr = tripleFileLists.flat().map(f => f.originFileObj || f.name);
                const init = initialTripleFileLists.flat().map(f => f.name);
                if (JSON.stringify(curr) !== JSON.stringify(init)) {
                    tripleFileLists.flat().forEach(f => payload.append("OfferImageNames", f.originFileObj || f.name));
                }
            }
            deleteOfferImageNames.forEach(name => payload.append("DeleteOfferImageNames", name));
        }

        return payload;
    };

    // Submit
    const handleSubmit = async () => {
        if (isSubOffer && !formData.parentOfferId) {
            alert("Zəhmət olmasa alt xidmət üçün ana xidmət seçin");
            return;
        }
        const payload = getChangedFields();
        const hasChanges = Array.from(payload.keys()).length > 1;
        if (!hasChanges) {
            alert("Heç bir dəyişiklik aşkar edilmədi.");
            return;
        }
        try {
            const res = await putOffer(payload).unwrap();
            if (res.statusCode === 200) {
                alert("Dəyişikliklər uğurla yadda saxlanıldı!");
                navigate("/admin/services");
            } else {
                alert("Dəyişiklikləri yadda saxlamaq alınmadı.");
            }
        } catch (err) {
            alert(`Xəta: ${err?.data?.message || "Dəyişiklikləri yadda saxlamaq alınmadı"}`);
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
                        <div>
                            <label>Alt Başlıq (AZ):</label>
                            <ReactQuill theme="snow" value={subTitleAz} onChange={setSubTitleAz} modules={quillModules} formats={quillFormats} placeholder="Mətn daxil edin..." />
                        </div>
                        <div>
                            <label>Alt Başlıq (RU):</label>
                            <ReactQuill theme="snow" value={subTitleRu} onChange={setSubTitleRu} modules={quillModules} formats={quillFormats} placeholder="Введите текст..." />
                        </div>
                        <div>
                            <label>Alt Başlıq (ENG):</label>
                            <ReactQuill theme="snow" value={subTitleEng} onChange={setSubTitleEng} modules={quillModules} formats={quillFormats} placeholder="Enter text..." />
                        </div>
                        <div>
                            <label>Alt Başlıq (TR):</label>
                            <ReactQuill theme="snow" value={subTitleTur} onChange={setSubTitleTur} modules={quillModules} formats={quillFormats} placeholder="Metin girin..." />
                        </div>

                        {!isSubOffer && (
                            <>  {/* Template switches & uploads */}
                                <div className="row" style={{ marginTop: 16 }}>
                                    <div className="col-6 pd00" style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>Şəkil şablonu 1 (1 şəkil)</label>
                                        <Switch checked={singleImageSwitch} onChange={handleSingleSwitchChange} style={{ marginLeft: 10 }} disabled={isSubmitting} />
                                    </div>
                                    <div className="col-6 pd01" style={{ display: 'flex', alignItems: 'center' }}>
                                        <label>Şəkil şablonu 2 (3 şəkil)</label>
                                        <Switch checked={tripleImageSwitch} onChange={handleTripleSwitchChange} style={{ marginLeft: 10 }} disabled={isSubmitting} />
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: 16 }}>
                                    <div className="col-6 pd00">
                                        <Upload listType="picture-card" fileList={singleFileList} onPreview={handlePreview} onChange={handleSingleImageChange} beforeUpload={() => false} disabled={tripleImageSwitch || isSubmitting}>
                                            {singleFileList.length >= 1 ? null : uploadButton}
                                        </Upload>
                                    </div>
                                    <div className="col-6 pd01" style={{ display: 'flex', gap: 10 }}>
                                        {tripleFileLists.map((list, i) => (
                                            <Upload key={i} listType="picture-card" fileList={list} onPreview={handlePreview} onChange={handleTripleImageChange(i)} beforeUpload={() => false} disabled={singleImageSwitch || isSubmitting}>
                                                {list.length >= 1 ? null : uploadButton}
                                            </Upload>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {isSubOffer && <p style={{ color: '#888', marginTop: 16 }}>Alt xidmətlər üçün şəkil yükləmə və şablon seçimi deaktivdir.</p>}

                        {previewImage && <Image wrapperStyle={{ display: 'none' }} preview={{ visible: previewOpen, onVisibleChange: v => { if (!v) setPreviewImage(''); setPreviewOpen(v); }}} src={previewImage} />}

                        {isError && <p style={{ color: 'red', marginTop: 16 }}>Xəta: {error?.data?.message || 'Dəyişiklikləri yadda saxlamaq alınmadı'}</p>}

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