import "./index.scss";
import {useState, useEffect} from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import image1 from "/src/assets/profile.png";
import {useNavigate, useParams} from "react-router-dom";
import {useGetAllOffersQuery, useGetOffersByIdQuery, usePutOffersMutation} from "../../../services/userApi.jsx";
import {DESCRIPTION_ICON, OFFER_GALERY, OFFER_IMAGES} from "../../../contants.js";
import {Collapse, Button, Space, Upload, Switch, Image, Select} from "antd";
import {UploadOutlined, LoadingOutlined, DeleteOutlined, PlusOutlined} from "@ant-design/icons";

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
const {Panel} = Collapse;

function AdminServDetail() {
    const {id} = useParams();
    const {data: getOffersById, refetch: getAllOffersRefetch, isLoading: isOfferLoading} = useGetOffersByIdQuery(id);
    const {data: offers, isLoading: offersLoading} = useGetAllOffersQuery();
    const offer = getOffersById?.data;
    const [putOffer, {isLoading: isSubmitting, isError, error}] = usePutOffersMutation();
    const navigate = useNavigate();

    // Form fields
    const [formData, setFormData] = useState({
        name: "",
        nameEng: "",
        nameRu: "",
        nameTur: "",
        description: "",
        descriptionEng: "",
        descriptionRu: "",
        descriptionTur: "",
        templateId: "",
        parentOfferId: "",
    });
    const [initialData, setInitialData] = useState({});

    // Rich-text subtitle states
    const [subTitles, setSubTitles] = useState([{text: "", textEng: "", textRu: "", textTur: ""}]);
    const [initialSubTitles, setInitialSubTitles] = useState([]);

    // Image/template handling
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [singleFileList, setSingleFileList] = useState([]);
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]);
    const [deleteOfferImageNames, setDeleteOfferImageNames] = useState([]);
    const [multiFileLists, setMultiFileLists] = useState({
        2: [[], [], []],
        3: [[], [], [], [], []],
    });
    const [initialMultiFileLists, setInitialMultiFileLists] = useState({
        2: [[], [], []],
        3: [[], [], [], [], []],
    });

    // Sub-offer flag and saved template data
    const [isSubOffer, setIsSubOffer] = useState(false);
    const [savedTemplateData, setSavedTemplateData] = useState({
        templateId: "",
        singleFileList: [],
        multiFileLists: {2: [[], [], []], 3: [[], [], [], [], []]},
        deleteOfferImageNames: [],
        galleryTemplateId: "1",
        galleryFileList: [],
        deleteOfferGalaryNames: [],
        iconFileLists: [[], [], [], []],
        deleteOfferIconNames: [],
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

    // Refetch all offers on mount
    useEffect(() => {
        getAllOffersRefetch();
    }, [getAllOffersRefetch]);

    // Initialize when offer loads
    useEffect(() => {
        if (offer && offers?.data) {
            console.log("Offer data:", offer);

            // Determine parentOfferId
            let parentId = offer.parentOfferId || "";
            if (!parentId) {
                const parent = offers.data.find((o) => o.subOffers?.some((s) => s.id === id));
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
            let parsedSubTitles = [{text: "", textEng: "", textRu: "", textTur: ""}]; // Default value
            if (offer.subTitle && Array.isArray(offer.subTitle) && offer.subTitle.length > 0) {
                parsedSubTitles = offer.subTitle.map((sub) => ({
                    text: sub.text || "",
                    textEng: sub.textEng || "",
                    textRu: sub.textRu || "",
                    textTur: sub.textTur || "",
                }));
            } else {
                console.log("No valid subTitle found, using default.");
            }
            console.log("Initialized subTitles:", parsedSubTitles);
            setSubTitles(parsedSubTitles);
            setInitialSubTitles(parsedSubTitles);

            // Gallery template and images
            setGalleryTemplateId(offer.galaryTemplateId || "1");
            const gf = offer.offerGalaryNames?.map((name, idx) => ({
                uid: `-${idx + 1}`,
                name,
                url: OFFER_GALERY + name,
            })) || [];
            setGalleryFileList(gf);
            setInitialGalleryFileList(gf);

            // Icon images
            const icons = [[], [], [], []];
            offer.offerIconNames?.slice(0, 4).forEach((name, idx) => {
                icons[idx] = [{uid: `-${idx + 1}`, name, url: DESCRIPTION_ICON + name}];
            });
            setIconFileLists(icons);
            setInitialIconFileLists(icons);

            // Sub-offer toggle
            const sub = !!parentId;
            setIsSubOffer(sub);

            // Template images
            const mf = {2: [[], [], []], 3: [[], [], [], [], []]};
            if (offer.templateId === "1") {
                setSingleFileList(
                    offer.offerImageNames?.map((name, idx) => ({
                        uid: `-${idx + 1}`,
                        name,
                        url: OFFER_IMAGES + name,
                    })) || []
                );
                setSingleImageSwitch(true);
                setTripleImageSwitch(false);
            } else if (offer.templateId === "2" || offer.templateId === "3") {
                const max = offer.templateId === "2" ? 3 : 5;
                offer.offerImageNames?.slice(0, max).forEach((name, idx) => {
                    mf[offer.templateId][idx] = [{uid: `-${idx + 1}`, name, url: OFFER_IMAGES + name}];
                });
                setSingleImageSwitch(false);
                setTripleImageSwitch(true);
            }
            setMultiFileLists(mf);
            setInitialMultiFileLists(mf);
        }
    }, [offer, offers, id]);

    // Input change handlers
    const updateSubtitle = (index, lang, value) => {
        setSubTitles((prev) => {
            const copy = [...prev];
            if (!copy[index]) {
                copy[index] = {text: "", textEng: "", textRu: "", textTur: ""};
            }
            copy[index] = {...copy[index], [lang]: value || ""};
            console.log("Updated subTitles:", copy);
            return copy;
        });
    };

    const addSubtitle = () => {
        setSubTitles((prev) => [
            ...prev,
            {text: "", textEng: "", textRu: "", textTur: ""},
        ]);
    };

    const removeSubtitle = (idx) => {
        setSubTitles((prev) => {
            const newSubTitles = prev.filter((_, i) => i !== idx);
            const result = newSubTitles.length > 0 ? newSubTitles : [{text: "", textEng: "", textRu: "", textTur: ""}];
            console.log("After remove subTitles:", result);
            return result;
        });
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
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
                deleteOfferIconNames,
            });
            setFormData((prev) => ({...prev, templateId: "", parentOfferId: ""}));
            setSingleFileList([]);
            setMultiFileLists({2: [[], [], []], 3: [[], [], [], [], []]});
            setDeleteOfferImageNames([]);
            setGalleryTemplateId("1");
            setGalleryFileList([]);
            setDeleteOfferGalaryNames([]);
            setIconFileLists([[], [], [], []]);
            setDeleteOfferIconNames([]);
        } else {
            setFormData((prev) => ({...prev, templateId: savedTemplateData.templateId, parentOfferId: ""}));
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
    const handleParentOfferChange = (val) => setFormData((prev) => ({...prev, parentOfferId: val || ""}));

    // Switch toggles
    const handleSingleSwitchChange = (checked) => {
        if (!isSubOffer) {
            setSingleImageSwitch(checked);
            setTripleImageSwitch(!checked);
            setFormData((prev) => ({...prev, templateId: checked ? "1" : "2"}));
            if (checked && multiFileLists[formData.templateId].flat().length) {
                setDeleteOfferImageNames((prev) => [
                    ...prev,
                    ...multiFileLists[formData.templateId].flat().map((f) => f.name),
                ]);
            }
        }
    };

    const handleTripleSwitchChange = (checked) => {
        if (!isSubOffer) {
            setTripleImageSwitch(checked);
            setSingleImageSwitch(!checked);
            setFormData((prev) => ({...prev, templateId: checked ? "2" : "1"}));
            if (checked && singleFileList.length) {
                setDeleteOfferImageNames((prev) => [...prev, ...singleFileList.map((f) => f.name)]);
            }
        }
    };

    // Image changes
    const handleSingleImageChange = ({fileList}) => {
        if (!isSubOffer) {
            if (!fileList.length && singleFileList.length) {
                setDeleteOfferImageNames((prev) => [...prev, singleFileList[0].name]);
            }
            setSingleFileList(fileList.slice(0, 1));
        }
    };

    const handleMultiImageChange = (template, idx) => ({fileList}) => {
        if (!isSubOffer) {
            setMultiFileLists((prev) => {
                const copy = {...prev};
                const removed = initialMultiFileLists[template][idx]
                    .filter((i) => !fileList.some((f) => f.name === i.name))
                    .map((f) => f.name);
                setDeleteOfferImageNames((p) => [...new Set([...p, ...removed])]);
                copy[template][idx] = fileList.slice(0, 1);
                return copy;
            });
        }
    };

    // Preview
    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    // Build payload
    // DÜZƏLDİLMİŞ getChangedFields funksiyası

    const getChangedFields = () => {
        const payload = new FormData();
        payload.append("id", id);

        // Form məlumatları
        payload.append("name", formData.name || "");
        payload.append("nameEng", formData.nameEng || "");
        payload.append("nameRu", formData.nameRu || "");
        payload.append("nameTur", formData.nameTur || "");
        payload.append("description", formData.description || "");
        payload.append("descriptionEng", formData.descriptionEng || "");
        payload.append("descriptionRu", formData.descriptionRu || "");
        payload.append("descriptionTur", formData.descriptionTur || "");

        // Subtitles
        const subTitlesToSend = subTitles.length > 0 ? subTitles : [{text: "", textEng: "", textRu: "", textTur: ""}];
        payload.append("subTitleJson", JSON.stringify(subTitlesToSend));

        if (!isSubOffer) {
            payload.append("templateId", formData.templateId || "");
            payload.append("galaryTemplateId", galleryTemplateId || "1");

            // Şəkillər
            if (formData.templateId === "1") {
                singleFileList.forEach((f) => {
                    payload.append("offerImagesNames", f.originFileObj || f.name);
                });
            } else if (formData.templateId === "2" || formData.templateId === "3") {
                multiFileLists[formData.templateId].flat().forEach((f) => {
                    payload.append("offerImagesNames", f.originFileObj || f.name);
                });
            }

            // Silinmiş şəkillər
            deleteOfferImageNames.forEach((name) => payload.append("deleteOffersImageNames", name));

            // Qalereya şəkilləri
            galleryFileList.forEach((f) => payload.append("offerGallary", f.originFileObj || f.name));
            deleteOfferGalaryNames.forEach((name) => payload.append("deleteOfferGalaryNames", name));

            // Iconlar
            iconFileLists.flat().forEach((f) => payload.append("offerIcons", f.originFileObj || f.name));
            deleteOfferIconNames.forEach((name) => payload.append("deleteOffersIconNames", name));
        } else {
            payload.append("parentOfferId", formData.parentOfferId || "");
        }

        console.log("Sending FormData:", Array.from(payload.entries()));
        return payload;
    };


    // Submit

// ... (başlanğıc importlar və hook-lar eyni qalır)

    const handleSubmit = async () => {
        if (isSubOffer && !formData.parentOfferId) {
            alert("Please select a parent offer for sub-offer");
            return;
        }
        if (!isSubOffer) {
            if (formData.templateId === "1" && singleFileList.length === 0) {
                alert("Please upload an image for the main offer");
                return;
            }
            if (
                (formData.templateId === "2" || formData.templateId === "3") &&
                multiFileLists[formData.templateId].every((list) => list.length === 0)
            ) {
                alert("Please upload at least one image for multi-image mode");
                return;
            }
        }
        const payload = getChangedFields();
        const hasChanges = Array.from(payload.keys()).length > 1;
        if (!hasChanges) {
            alert("No changes detected.");
            return;
        }
        try {
            const res = await putOffer(payload).unwrap();
            if (res.statusCode === 200) {
                alert("Changes saved successfully!");
                navigate("/admin/services");
            } else {
                alert("Failed to save changes.");
            }
        } catch (err) {
            alert(`Error: ${err?.data?.message || "Failed to save changes"}`);
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
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 10}}>
                        <img src={image1} alt="profile"/>
                        <p>Admin</p>
                    </div>
                    <div className="navigation-bar">
                        <h2 className="nav-title">
                            <span className="nav-link" onClick={() => navigate("/admin/services")}>Services</span>
                            <span className="nav-divider"> — </span>
                            <span className="nav-subtitle">{offer?.name || "Loading..."}</span>
                        </h2>
                    </div>
                </div>
            </div>

            <div id="admin-services-detail">
                {isOfferLoading ? (
                    <div className="loading-spinner">
                        <LoadingOutlined style={{fontSize: 24, marginBottom: 16}}/>
                        <p>Loading...</p>
                    </div>
                ) : (
                    <>
                        <div style={{marginBottom: 16}}>
                            <label>Main Offer / Sub Offer:</label>
                            <Switch
                                checked={isSubOffer}
                                onChange={handleSubOfferSwitch}
                                checkedChildren="Sub Offer"
                                unCheckedChildren="Main Offer"
                                style={{marginLeft: 10}}
                                disabled={isSubmitting}
                            />
                        </div>

                        {isSubOffer && (
                            <div style={{marginBottom: 16}}>
                                <label>Select Parent Offer:</label>
                                <Select
                                    style={{width: "100%"}}
                                    placeholder="Select parent offer"
                                    value={formData.parentOfferId || undefined}
                                    onChange={handleParentOfferChange}
                                    loading={offersLoading}
                                    disabled={offersLoading || isSubmitting}
                                    allowClear
                                >
                                    {offers?.data
                                        ?.filter((o) => o.id !== id && !o.parentOfferId)
                                        .map((o) => (
                                            <Select.Option key={o.id} value={o.id}>
                                                {o.name}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </div>
                        )}

                        <div>
                            <label>Service (AZ):</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Service (RU):</label>
                            <input
                                type="text"
                                name="nameRu"
                                value={formData.nameRu}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Service (ENG):</label>
                            <input
                                type="text"
                                name="nameEng"
                                value={formData.nameEng}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Service (X):</label>
                            <input
                                type="text"
                                name="nameTur"
                                value={formData.nameTur}
                                onChange={handleInputChange}
                                disabled={isSubOffer}
                            />
                        </div>

                        <div>
                            <label>Description (AZ):</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Description (RU):</label>
                            <textarea
                                name="descriptionRu"
                                value={formData.descriptionRu}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Description (ENG):</label>
                            <textarea
                                name="descriptionEng"
                                value={formData.descriptionEng}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Description (X):</label>
                            <textarea
                                name="descriptionTur"
                                value={formData.descriptionTur}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>

                        {/* Rich-text subtitles */}
                        <label>Subtitles:</label>
                        <Collapse accordion>
                            {subTitles.map((subTitle, idx) => (
                                <Panel
                                    key={idx}
                                    header={<Space>
                                        Subtitle #{idx + 1}
                                        <DeleteOutlined
                                            style={{color: "red"}}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeSubtitle(idx);
                                            }}
                                        />
                                    </Space>
                                    }
                                >
                                    <div style={{marginBottom: 16}}>
                                        <h4>AZ:</h4>
                                        <ReactQuill
                                            value={subTitle.text || ""}
                                            onChange={(html) => updateSubtitle(idx, "text", html)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter AZ text…"
                                            readOnly={isSubmitting}
                                        />
                                    </div>
                                    <div style={{marginBottom: 16}}>
                                        <h4>RU:</h4>
                                        <ReactQuill
                                            value={subTitle.textRu || ""}
                                            onChange={(html) => updateSubtitle(idx, "textRu", html)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter RU text…"
                                            readOnly={isSubmitting}
                                        />
                                    </div>
                                    <div style={{marginBottom: 16}}>
                                        <h4>ENG:</h4>
                                        <ReactQuill
                                            value={subTitle.textEng || ""}
                                            onChange={(html) => updateSubtitle(idx, "textEng", html)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter ENG text…"
                                            readOnly={isSubmitting}
                                        />
                                    </div>
                                    <div style={{marginBottom: 16}}>
                                        <h4>X:</h4>
                                        <ReactQuill
                                            value={subTitle.textTur || ""}
                                            onChange={(html) => updateSubtitle(idx, "textTur", html)}
                                            modules={quillModules}
                                            formats={quillFormats}
                                            placeholder="Enter X text…"
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
                                        icon={<PlusOutlined/>}
                                        onClick={addSubtitle}
                                        disabled={isSubmitting}
                                    >
                                        New Subtitle
                                    </Button>
                                }
                            />
                        </Collapse>

                        {!isSubOffer && (
                            <>
                                {/* Template switches & uploads */}
                                <div style={{marginTop: 16}}>
                                    <label>Template Type:</label>
                                    <Select
                                        value={formData.templateId}
                                        onChange={(value) => {
                                            if (!isSubOffer) {
                                                setFormData((prev) => ({...prev, templateId: value}));
                                                setSingleImageSwitch(value === "1");
                                                setTripleImageSwitch(value === "2" || value === "3");
                                                if (value === "1" && multiFileLists[formData.templateId].flat().length) {
                                                    setDeleteOfferImageNames((prev) => [
                                                        ...prev,
                                                        ...multiFileLists[formData.templateId].flat().map((f) => f.name),
                                                    ]);
                                                } else if ((value === "2" || value === "3") && singleFileList.length) {
                                                    setDeleteOfferImageNames((prev) => [
                                                        ...prev,
                                                        ...singleFileList.map((f) => f.name),
                                                    ]);
                                                }
                                            }
                                        }}
                                        style={{width: 200}}
                                        disabled={isSubmitting}
                                    >
                                        <Select.Option value="1">Template 1 (1 Image)</Select.Option>
                                        <Select.Option value="2">Template 2 (3 Images)</Select.Option>
                                        <Select.Option value="3">Template 3 (5 Images)</Select.Option>
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
                                    <div className="row" style={{display: "flex", gap: 10}}>
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

                        {isSubOffer && (
                            <p style={{color: "#888", marginTop: 16}}>
                                Image upload and template selection are disabled for sub-offers.
                            </p>
                        )}

                        {previewImage && (
                            <Image
                                wrapperStyle={{display: "none"}}
                                preview={{
                                    visible: previewOpen,
                                    onVisibleChange: (v) => {
                                        if (!v) setPreviewImage("");
                                        setPreviewOpen(v);
                                    },
                                }}
                                src={previewImage}
                            />
                        )}

                        <div style={{marginTop: 16}}>
                            <label>Gallery or Sponsor Template:</label>
                            <Select
                                value={galleryTemplateId}
                                onChange={setGalleryTemplateId}
                                style={{width: 200}}
                                disabled={isSubmitting}
                            >
                                <Select.Option value="1">Gallery</Select.Option>
                                <Select.Option value="2">Sponsor Logos</Select.Option>
                            </Select>
                        </div>
                        <Upload
                            multiple
                            listType="picture-card"
                            fileList={galleryFileList}
                            onPreview={handlePreview}
                            onChange={({fileList}) => {
                                if (!isSubOffer) {
                                    const removed = initialGalleryFileList
                                        .filter((i) => !fileList.some((f) => f.name === i.name))
                                        .map((f) => f.name);
                                    setDeleteOfferGalaryNames((prev) => [...new Set([...prev, ...removed])]);
                                    setGalleryFileList(fileList);
                                }
                            }}
                            beforeUpload={() => false}
                            disabled={isSubmitting}
                        >
                            {uploadButton}
                        </Upload>

                        <div style={{marginTop: 16}}>
                            <label>Offer Icons:</label>
                            <div className="row" style={{display: "flex", gap: 10}}>
                                {iconFileLists.map((list, idx) => (
                                    <Upload
                                        key={idx}
                                        listType="picture-card"
                                        fileList={list}
                                        onPreview={handlePreview}
                                        onChange={({fileList}) => {
                                            if (!isSubOffer) {
                                                const removed = initialIconFileLists[idx]
                                                    .filter((i) => !fileList.some((f) => f.name === i.name))
                                                    .map((f) => f.name);
                                                setDeleteOfferIconNames((prev) => [
                                                    ...new Set([...prev, ...removed]),
                                                ]);
                                                setIconFileLists((prev) =>
                                                    prev.map((l, i) => (i === idx ? fileList.slice(0, 1) : l))
                                                );
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

                        {isError && (
                            <p style={{color: "red", marginTop: 16}}>
                                Error: {error?.data?.message || "Failed to save changes"}
                            </p>
                        )}

                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            className="button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingOutlined style={{marginRight: 8}}/>
                                    Saving changes...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </>
                )}
            </div>
        </>
    );
}

export default AdminServDetail;