import "./index.scss";
import { Upload, Switch, Image, Button, Select } from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import image1 from "/src/assets/profile.png";
import { useNavigate, useParams } from "react-router-dom";
import {useGetAllOffersQuery, useGetOffersByIdQuery, usePutOffersMutation} from "../../../services/userApi.jsx";
import {OFFER_IMAGES} from "../../../contants.js";


function AdminServDetail() {
    const { id } = useParams();
    const { data: getOffersById, refetch: getAllOffersRefetch, isLoading: isOfferLoading } =
        useGetOffersByIdQuery(id);
    const { data: offers, isLoading: offersLoading } = useGetAllOffersQuery();
    const offer = getOffersById?.data;
    const [putOffer, { isLoading: isSubmitting, isError, error }] = usePutOffersMutation();
    const navigate = useNavigate();

    useEffect(() => {
        getAllOffersRefetch();
    }, [getAllOffersRefetch]);

    // State for form fields
    const [formData, setFormData] = useState({
        name: "",
        nameEng: "",
        nameRu: "",
        nameTur: "",
        description: "",
        descriptionEng: "",
        descriptionRu: "",
        descriptionTur: "",
        period: "",
        periodEng: "",
        periodRu: "",
        periodTur: "",
        ageLimit: "",
        templateId: "",
        parentOfferId: "",
    });

    // State for initial data to track changes
    const [initialData, setInitialData] = useState({});
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [singleFileList, setSingleFileList] = useState([]);
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]);
    const [deleteOfferImageNames, setDeleteOfferImageNames] = useState([]);
    const [previewImage, setPreviewImage] = useState("");
    const [previewOpen, setPreviewOpen] = useState(false);
    const [initialSingleFileList, setInitialSingleFileList] = useState([]);
    const [initialTripleFileLists, setInitialTripleFileLists] = useState([[], [], []]);
    const [isSubOffer, setIsSubOffer] = useState(false);

    // New state to store template and images when switching to sub-offer
    const [savedTemplateData, setSavedTemplateData] = useState({
        templateId: "",
        singleFileList: [],
        tripleFileLists: [[], [], []],
        deleteOfferImageNames: [],
    });

    // Initialize form data and file lists when offer data is fetched
    useEffect(() => {
        if (offer && offers?.data) {
            // Determine parentOfferId by checking if the offer is a subOffer
            let parentOfferId = offer.parentOfferId || "";
            if (!parentOfferId) {
                const parentOffer = offers.data.find((mainOffer) =>
                    mainOffer.subOffers?.some((subOffer) => subOffer.id === id)
                );
                if (parentOffer) {
                    parentOfferId = parentOffer.id;
                }
            }

            const newFormData = {
                name: offer.name || "",
                nameEng: offer.nameEng || "",
                nameRu: offer.nameRu || "",
                nameTur: offer.nameTur || "",
                description: offer.description || "",
                descriptionEng: offer.descriptionEng || "",
                descriptionRu: offer.descriptionRu || "",
                descriptionTur: offer.descriptionTur || "",
                period: offer.period || "",
                periodEng: offer.periodEng || "",
                periodRu: offer.periodRu || "",
                periodTur: offer.periodTur || "",
                ageLimit: offer.ageLimit || "",
                templateId: offer.templateId || "",
                parentOfferId,
            };
            setFormData(newFormData);
            setInitialData(newFormData);
            const isSub = !!parentOfferId;
            setIsSubOffer(isSub);

            // Update switches and file lists only if not a sub-offer
            if (!isSub) {
                setSingleImageSwitch(offer.templateId === "1");
                setTripleImageSwitch(offer.templateId === "2");

                let newSingleFileList = [];
                let newTripleFileLists = [[], [], []];
                if (offer?.offerImageNames && offer.offerImageNames.length > 0) {
                    if (offer.templateId === "1") {
                        newSingleFileList = [
                            {
                                uid: "-1",
                                name: offer.offerImageNames[0],
                                url: `${OFFER_IMAGES}${offer.offerImageNames[0]}`,
                            },
                        ];
                    } else if (offer.templateId === "2") {
                        offer.offerImageNames.slice(0, 3).forEach((image, index) => {
                            newTripleFileLists[index] = [
                                { uid: `-${index + 1}`, name: image, url: `${OFFER_IMAGES}${image}` },
                            ];
                        });
                    }
                }
                setSingleFileList(newSingleFileList);
                setTripleFileLists(newTripleFileLists);
                setInitialSingleFileList(newSingleFileList);
                setInitialTripleFileLists(newTripleFileLists);

                // Save template data
                setSavedTemplateData({
                    templateId: offer.templateId || "",
                    singleFileList: newSingleFileList,
                    tripleFileLists: newTripleFileLists,
                    deleteOfferImageNames: [],
                });
            } else {
                // Clear template-related data for sub-offer
                setSingleFileList([]);
                setTripleFileLists([[], [], []]);
                setSingleImageSwitch(true);
                setTripleImageSwitch(false);
                setFormData((prev) => ({ ...prev, templateId: "" }));
            }
        }
    }, [offer, offers]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle main/sub-offer switch
    const handleSubOfferSwitch = (checked) => {
        setIsSubOffer(checked);
        if (checked) {
            // Save current template data before switching to sub-offer
            setSavedTemplateData({
                templateId: formData.templateId,
                singleFileList: singleFileList,
                tripleFileLists: tripleFileLists,
                deleteOfferImageNames: deleteOfferImageNames,
            });
            // Clear template-related data
            setFormData((prev) => ({ ...prev, templateId: "", parentOfferId: prev.parentOfferId }));
            setSingleFileList([]);
            setTripleFileLists([[], [], []]);
            setSingleImageSwitch(true);
            setTripleImageSwitch(false);
            setDeleteOfferImageNames([]);
        } else {
            // Restore saved template data when switching to main offer
            setFormData((prev) => ({ ...prev, templateId: savedTemplateData.templateId, parentOfferId: "" }));
            setSingleFileList(savedTemplateData.singleFileList);
            setTripleFileLists(savedTemplateData.tripleFileLists);
            setSingleImageSwitch(savedTemplateData.templateId === "1");
            setTripleImageSwitch(savedTemplateData.templateId === "2");
            setDeleteOfferImageNames(savedTemplateData.deleteOfferImageNames);
        }
    };

    // Handle parent offer selection
    const handleParentOfferChange = (value) => {
        setFormData((prev) => ({ ...prev, parentOfferId: value || "" }));
    };

    // Handle single image switch
    const handleSingleSwitchChange = (checked) => {
        if (!isSubOffer) {
            setSingleImageSwitch(checked);
            setTripleImageSwitch(!checked);
            setFormData((prev) => ({ ...prev, templateId: checked ? "1" : "2" }));
            if (checked) {
                setTripleFileLists([[], [], []]);
                setDeleteOfferImageNames((prev) =>
                    tripleFileLists.flat().length > 0
                        ? [...prev, ...tripleFileLists.flat().map((file) => file.name)]
                        : prev
                );
            }
        }
    };

    // Handle triple image switch
    const handleTripleSwitchChange = (checked) => {
        if (!isSubOffer) {
            setTripleImageSwitch(checked);
            setSingleImageSwitch(!checked);
            setFormData((prev) => ({ ...prev, templateId: checked ? "2" : "1" }));
            if (checked) {
                setSingleFileList([]);
                setDeleteOfferImageNames((prev) =>
                    singleFileList.length > 0 ? [...prev, ...singleFileList.map((file) => file.name)] : prev
                );
            }
        }
    };

    // Handle single image change
    const handleSingleImageChange = ({ fileList: newFileList }) => {
        if (!isSubOffer) {
            const newList = newFileList.slice(0, 1);
            setSingleFileList(newList);
            if (newList.length === 0 && singleFileList.length > 0) {
                setDeleteOfferImageNames((prev) => [...prev, singleFileList[0].name]);
            }
        }
    };

    // Handle triple image change
    const handleTripleImageChange = (index) => ({ fileList: newFileList }) => {
        if (!isSubOffer) {
            setTripleFileLists((prev) => {
                const newLists = [...prev];
                newLists[index] = newFileList.slice(0, 1);
                if (newFileList.length === 0 && prev[index].length > 0) {
                    setDeleteOfferImageNames((prevNames) => [...prevNames, prev[index][0].name]);
                }
                return newLists;
            });
        }
    };

    // Handle image preview
    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    // Construct payload with changed fields only as FormData
    const getChangedFields = () => {
        const formDataPayload = new FormData();
        formDataPayload.append("id", id);

        // Include changed string fields
        const stringFields = [
            "name",
            "nameEng",
            "nameRu",
            "nameTur",
            "description",
            "descriptionEng",
            "descriptionRu",
            "descriptionTur",
            "period",
            "periodEng",
            "periodRu",
            "periodTur",
            "ageLimit",
            // Only include templateId and parentOfferId based on isSubOffer
            ...(isSubOffer ? ["parentOfferId"] : ["templateId", "parentOfferId"]),
        ];
        stringFields.forEach((key) => {
            if (formData[key] !== initialData[key]) {
                formDataPayload.append(key, formData[key]);
            }
        });

        // Handle images only if not a sub-offer
        if (!isSubOffer) {
            if (formData.templateId === "1") {
                const currentImages = singleFileList.map((file) => file.originFileObj || file.name);
                const initialImages = initialSingleFileList.map((file) => file.name);
                if (JSON.stringify(currentImages) !== JSON.stringify(initialImages)) {
                    singleFileList.forEach((file) => {
                        if (file.originFileObj) {
                            formDataPayload.append("OfferImageNames", file.originFileObj);
                        } else {
                            formDataPayload.append("OfferImageNames", file.name);
                        }
                    });
                }
            } else if (formData.templateId === "2") {
                const currentImages = tripleFileLists
                    .flat()
                    .map((file) => file.originFileObj || file.name)
                    .filter(Boolean);
                const initialImages = initialTripleFileLists.flat().map((file) => file.name);
                if (JSON.stringify(currentImages) !== JSON.stringify(initialImages)) {
                    tripleFileLists.flat().forEach((file) => {
                        if (file.originFileObj) {
                            formDataPayload.append("OfferImageNames", file.originFileObj);
                        } else {
                            formDataPayload.append("OfferImageNames", file.name);
                        }
                    });
                }
            }

            // Include deleted images if any
            if (deleteOfferImageNames.length > 0) {
                deleteOfferImageNames.forEach((name) => {
                    formDataPayload.append("DeleteOfferImageNames", name);
                });
            }
        }

        return formDataPayload;
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (isSubOffer && !formData.parentOfferId) {
            alert("Zəhmət olmasa alt xidmət üçün ana xidmət seçin");
            return;
        }

        const payload = getChangedFields();
        // Log payload entries for debugging
        console.log("Payload:", Object.fromEntries(payload));
        if (
            payload.has("name") ||
            payload.has("nameEng") ||
            payload.has("nameRu") ||
            payload.has("nameTur") ||
            payload.has("description") ||
            payload.has("descriptionEng") ||
            payload.has("descriptionRu") ||
            payload.has("descriptionTur") ||
            payload.has("period") ||
            payload.has("periodEng") ||
            payload.has("periodRu") ||
            payload.has("periodTur") ||
            payload.has("ageLimit") ||
            (!isSubOffer && payload.has("templateId")) ||
            payload.has("parentOfferId") ||
            (!isSubOffer && payload.has("OfferImageNames")) ||
            (!isSubOffer && payload.has("DeleteOfferImageNames"))
        ) {
            try {
                const response = await putOffer(payload).unwrap();
                if (response?.statusCode === 200) {
                    alert("Dəyişikliklər uğurla yadda saxlanıldı!");
                    navigate("/admin/services");
                } else {
                    alert("Dəyişiklikləri yadda saxlamaq alınmadı.");
                }
            } catch (error) {
                console.error("Dəyişiklikləri yadda saxlamaq alınmadı:", error);
                alert(`Xəta: ${error?.data?.message || "Dəyişiklikləri yadda saxlamaq alınmadı"}`);
            }
        } else {
            alert("Heç bir dəyişiklik aşkar edilmədi.");
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
            <div style={{ marginTop: "8px" }}>Yüklə</div>
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
                        <img src={image1} alt="profile" />
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
                            <span className="nav-subtitle">{offer?.name || "Yüklənir..."}</span>
                        </h2>
                    </div>
                </div>
            </div>
            <div id="admin-services-detail">
                {isOfferLoading ? (
                    <div className="loading-spinner">
                        <LoadingOutlined style={{ fontSize: "24px", marginBottom: "16px" }} />
                        <p>Yüklənir...</p>
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: "16px" }}>
                            <label>Ana Xidmət / Alt Xidmət:</label>
                            <Switch
                                checked={isSubOffer}
                                onChange={handleSubOfferSwitch}
                                checkedChildren="Alt Xidmət"
                                unCheckedChildren="Ana Xidmət"
                                style={{ marginLeft: "10px" }}
                                disabled={isSubmitting}
                            />
                        </div>
                        {isSubOffer && (
                            <div style={{ marginBottom: "16px" }}>
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
                                        ?.filter((offer) => offer.id !== id && !offer.parentOfferId)
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
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Xidmət (RU):</label>
                            <input
                                type="text"
                                name="nameRu"
                                value={formData.nameRu}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Xidmət (ENG):</label>
                            <input
                                type="text"
                                name="nameEng"
                                value={formData.nameEng}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Xidmət (TR):</label>
                            <input
                                type="text"
                                name="nameTur"
                                value={formData.nameTur}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Alt Başlıq (AZ):</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Alt Başlıq (RU):</label>
                            <textarea
                                name="descriptionRu"
                                value={formData.descriptionRu}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Alt Başlıq (ENG):</label>
                            <textarea
                                name="descriptionEng"
                                value={formData.descriptionEng}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div>
                            <label>Alt Başlıq (TR):</label>
                            <textarea
                                name="descriptionTur"
                                value={formData.descriptionTur}
                                onChange={handleInputChange}
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="row">
                            <div className="col-6 pd00">
                                <label>Keçirilmə müddəti (AZ):</label>
                                <input
                                    type="text"
                                    name="period"
                                    value={formData.period}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                                <label>Keçirilmə müddəti (RU):</label>
                                <input
                                    type="text"
                                    name="periodRu"
                                    value={formData.periodRu}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                                <label>Keçirilmə müddəti (ENG):</label>
                                <input
                                    type="text"
                                    name="periodEng"
                                    value={formData.periodEng}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                                <label>Keçirilmə müddəti (TR):</label>
                                <input
                                    type="text"
                                    name="periodTur"
                                    value={formData.periodTur}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                            <div className="col-6 pd01">
                                <label>Yaş:</label>
                                <input
                                    type="text"
                                    name="ageLimit"
                                    value={formData.ageLimit}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        {/* Show template and image sections only for main offer */}
                        {!isSubOffer && (
                            <>
                                <div className="row" style={{ marginTop: "16px" }}>
                                    <div className="col-6 pd00" style={{ display: "flex", alignItems: "center" }}>
                                        <label>Xidmət şəhifəsi nümunə 1 (bir şəkilin olduğu)</label>
                                        <Switch
                                            checked={singleImageSwitch}
                                            onChange={handleSingleSwitchChange}
                                            style={{ marginLeft: "10px" }}
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="col-6 pd01" style={{ display: "flex", alignItems: "center" }}>
                                        <label>Xidmət şəhifəsi nümunə 2 (üç şəkilin olduğu)</label>
                                        <Switch
                                            checked={tripleImageSwitch}
                                            onChange={handleTripleSwitchChange}
                                            style={{ marginLeft: "10px" }}
                                            disabled={isSubmitting}
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
                                            disabled={tripleImageSwitch || isSubmitting}
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
                                                disabled={singleImageSwitch || isSubmitting}
                                            >
                                                {tripleFileLists[index].length >= 1 ? null : uploadButton}
                                            </Upload>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        {/* Optional message when sub-offer is selected */}
                        {isSubOffer && (
                            <p style={{ color: "#888", marginTop: "16px" }}>
                                Alt xidmətlər üçün şəkil yükləmə və şablon seçimi deaktivdir.
                            </p>
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
                        {isError && (
                            <p style={{ color: "red", marginTop: "16px" }}>
                                Xəta: {error?.data?.message || "Dəyişiklikləri yadda saxlamaq alınmadı"}
                            </p>
                        )}
                        <Button
                            type="primary"
                            onClick={handleSubmit}
                            className="button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <span>
                  <LoadingOutlined style={{ marginRight: "8px" }} />
                  Dəyişikliklər saxlanılır...
                </span>
                            ) : (
                                "Dəyişiklikləri yadda saxla"
                            )}
                        </Button>
                    </>
                )}
            </div>
        </>
    );
}

export default AdminServDetail;