import "./index.scss";
import { Upload, Switch, Image, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import image1 from "../../../assets/profile.png";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOffersByIdQuery, usePutOffersMutation } from "../../../services/userApi.jsx";
import { OFFER_IMAGES } from "../../../contants.js";

function AdminServDetail() {
    const { id } = useParams();
    const { data: getOffersById } = useGetOffersByIdQuery(id);
    const offer = getOffersById?.data;
    const [putOffer] = usePutOffersMutation();
    const navigate = useNavigate();

    // State for form fields
    const [formData, setFormData] = useState({
        name: "",
        nameEng: "",
        nameRu: "",
        description: "",
        descriptionEng: "",
        descriptionRu: "",
        period: "",
        periodEng: "",
        periodRu: "",
        ageLimit: "",
        templateId: "",
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

    // Initialize form data and file lists when offer data is fetched
    useEffect(() => {
        if (offer) {
            const newFormData = {
                name: offer.name || "",
                nameEng: offer.nameEng || "",
                nameRu: offer.nameRu || "",
                description: offer.description || "",
                descriptionEng: offer.descriptionEng || "",
                descriptionRu: offer.descriptionRu || "",
                period: offer.period || "",
                periodEng: offer.periodEng || "",
                periodRu: offer.periodRu || "",
                ageLimit: offer.ageLimit || "",
                templateId: offer.templateId || "",
            };
            setFormData(newFormData);
            setInitialData(newFormData);

            // Update switches
            setSingleImageSwitch(offer.templateId === "1");
            setTripleImageSwitch(offer.templateId === "2");

            // Update file lists
            let newSingleFileList = [];
            let newTripleFileLists = [[], [], []];
            if (offer?.offerImageNames && offer.offerImageNames.length > 0) {
                if (offer.templateId === "1") {
                    newSingleFileList = [
                        { uid: "-1", name: offer.offerImageNames[0], url: `${OFFER_IMAGES}${offer.offerImageNames[0]}` },
                    ];
                } else if (offer.templateId === "2") {
                    offer.offerImageNames.slice(0, 3).forEach((image, index) => {
                        newTripleFileLists[index] = [{ uid: `-${index + 1}`, name: image, url: `${OFFER_IMAGES}${image}` }];
                    });
                }
            }
            setSingleFileList(newSingleFileList);
            setTripleFileLists(newTripleFileLists);
            setInitialSingleFileList(newSingleFileList);
            setInitialTripleFileLists(newTripleFileLists);
        }
    }, [offer]);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle single image switch
    const handleSingleSwitchChange = (checked) => {
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
    };

    // Handle triple image switch
    const handleTripleSwitchChange = (checked) => {
        setTripleImageSwitch(checked);
        setSingleImageSwitch(!checked);
        setFormData((prev) => ({ ...prev, templateId: checked ? "2" : "1" }));
        if (checked) {
            setSingleFileList([]);
            setDeleteOfferImageNames((prev) =>
                singleFileList.length > 0 ? [...prev, ...singleFileList.map((file) => file.name)] : prev
            );
        }
    };

    // Handle single image change
    const handleSingleImageChange = ({ fileList: newFileList }) => {
        const newList = newFileList.slice(0, 1); // Limit to one image
        setSingleFileList(newList);
        if (newList.length === 0 && singleFileList.length > 0) {
            setDeleteOfferImageNames((prev) => [...prev, singleFileList[0].name]);
        }
    };

    // Handle triple image change
    const handleTripleImageChange = (index) => ({ fileList: newFileList }) => {
        setTripleFileLists((prev) => {
            const newLists = [...prev];
            newLists[index] = newFileList.slice(0, 1); // Limit to one image per slot
            if (newFileList.length === 0 && prev[index].length > 0) {
                setDeleteOfferImageNames((prevNames) => [...prevNames, prev[index][0].name]);
            }
            return newLists;
        });
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
            "description",
            "descriptionEng",
            "descriptionRu",
            "period",
            "periodEng",
            "periodRu",
            "ageLimit",
            "templateId",
        ];
        stringFields.forEach((key) => {
            if (formData[key] !== initialData[key]) {
                formDataPayload.append(key, formData[key]);
            }
        });

        // Handle images for templateId 1
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
        }
        // Handle images for templateId 2
        else if (formData.templateId === "2") {
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

        return formDataPayload;
    };

    // Handle form submission
    const handleSubmit = async () => {
        const payload = getChangedFields();
        // Log payload entries for debugging
        console.log("Payload:", Object.fromEntries(payload));
        if (payload.has("name") ||
            payload.has("nameEng") ||
            payload.has("nameRu") ||
            payload.has("description") ||
            payload.has("descriptionEng") ||
            payload.has("descriptionRu") ||
            payload.has("period") ||
            payload.has("periodEng") ||
            payload.has("periodRu") ||
            payload.has("ageLimit") ||
            payload.has("templateId") ||
            payload.has("OfferImageNames") ||
            payload.has("DeleteOfferImageNames")) {
            // Ensure there's something to send besides Id
            try {
                const response = await putOffer(payload).unwrap();
                if (response?.statusCode === 200) {
                    alert("Changes saved successfully!");
                    navigate("/admin/services");
                } else {
                    alert("Failed to save changes.");
                }
            } catch (error) {
                console.error("Failed to save changes:", error);
                alert("Failed to save changes.");
            }
        } else {
            alert("No changes detected.");
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
                        <img src={image1} alt="profile" />
                        <div>
                            <p>Admin</p>
                            <p className="p">sabina.heidarovaa@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id="admin-services-detail">
                <div>
                    <label>Xidmət (AZ):</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Xidmət (RU):</label>
                    <input
                        type="text"
                        name="nameRu"
                        value={formData.nameRu}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Xidmət (ENG):</label>
                    <input
                        type="text"
                        name="nameEng"
                        value={formData.nameEng}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Alt Başlıq (AZ):</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Alt Başlıq (RU):</label>
                    <textarea
                        name="descriptionRu"
                        value={formData.descriptionRu}
                        onChange={handleInputChange}
                    />
                </div>

                <div>
                    <label>Alt Başlıq (ENG):</label>
                    <textarea
                        name="descriptionEng"
                        value={formData.descriptionEng}
                        onChange={handleInputChange}
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
                        />
                        <label>Keçirilmə müddəti (RU):</label>
                        <input
                            type="text"
                            name="periodRu"
                            value={formData.periodRu}
                            onChange={handleInputChange}
                        />
                        <label>Keçirilmə müddəti (ENG):</label>
                        <input
                            type="text"
                            name="periodEng"
                            value={formData.periodEng}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="col-6 pd01">
                        <label>Yaş:</label>
                        <input
                            type="text"
                            name="ageLimit"
                            value={formData.ageLimit}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="row" style={{ marginTop: "16px" }}>
                    <div className="col-6 pd00" style={{ display: "flex", alignItems: "center" }}>
                        <label>Xidmət şəhifəsi nümunə 1 (bir şəkilin olduğu)</label>
                        <Switch
                            checked={singleImageSwitch}
                            onChange={handleSingleSwitchChange}
                            style={{ marginLeft: "10px" }}
                        />
                    </div>
                    <div className="col-6 pd01" style={{ display: "flex", alignItems: "center" }}>
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

                <Button type="primary" onClick={handleSubmit} className="button">
                    Dəyişiklikləri yadda saxla
                </Button>
            </div>
        </>
    );
}

export default AdminServDetail;