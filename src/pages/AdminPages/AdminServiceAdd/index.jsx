import "./index.scss";
import { Upload, Switch, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import image1 from "../../../assets/profile.png";
import { useNavigate } from "react-router-dom";

function AdminServCreate() {
    const [singleFileList, setSingleFileList] = useState([]);
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]);
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const navigate = useNavigate();

    const handleSingleImageChange = ({ fileList: newFileList }) => {
        setSingleFileList(newFileList);
    };

    const handleTripleImageChange = (index) => ({ fileList: newFileList }) => {
        setTripleFileLists(prev => {
            const newLists = [...prev];
            newLists[index] = newFileList;
            return newLists;
        });
    };

    const handleSingleSwitchChange = (checked) => {
        setSingleImageSwitch(checked);
        setTripleImageSwitch(!checked);
        if (checked) {
            setTripleFileLists([[], [], []]);
        }
    };

    const handleTripleSwitchChange = (checked) => {
        setTripleImageSwitch(checked);
        setSingleImageSwitch(!checked);
        if (checked) {
            setSingleFileList([]);
        }
    };

    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        // Validate image uploads
        if (singleImageSwitch && singleFileList.length === 0) {
            alert('Please upload a single image');
            return;
        }
        if (tripleImageSwitch && tripleFileLists.every(list => list.length === 0)) {
            alert('Please upload at least one image for triple image mode');
            return;
        }

        // Process images
        let offerCardImage = '';
        let offerImages = [];

        if (singleImageSwitch && singleFileList.length > 0) {
            offerCardImage = singleFileList[0].originFileObj;
        } else if (tripleImageSwitch) {
            offerImages = tripleFileLists
                .filter(list => list.length > 0)
                .map(list => list[0].originFileObj);
        }

        // Create data object
        const data = {
            Name: formData.get('name'),
            NameEng: formData.get('nameEng'),
            NameRu: formData.get('nameRu'),
            Description: formData.get('description'),
            DescriptionEng: formData.get('descriptionEng'),
            DescriptionRu: formData.get('descriptionRu'),
            OfferCardImage: offerCardImage,
            OfferImages: offerImages,
            Period: formData.get('period'),
            PeriodEng: formData.get('periodEng'),
            PeriodRu: formData.get('periodRu'),
            AgeLimit: formData.get('ageLimit'),
            TemplateId: singleImageSwitch ? '1' : '0'
        };

        console.log('Form Data:', data);
    };

    const uploadButton = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <UploadOutlined style={{ fontSize: '24px' }} />
            <div style={{ marginTop: '8px' }}>Upload</div>
        </div>
    );

    return (
        <>
            <div className="right">
                <div className="adminTopBar">
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                    }}>
                        <img src={image1} alt="profile" />
                        <div>
                            <p>Admin</p>
                            <p className="p">sabina.heidarovaa@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <form id="admin-services-create" onSubmit={handleSubmit}>
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

                <div className="row">
                    <div className="col-6 pd00">
                        <label>Keçirilmə müddəti (AZ):</label>
                        <input type="text" name="period" required />
                        <label>Keçirilmə müddəti (RU):</label>
                        <input type="text" name="periodRu" required />
                        <label>Keçirilmə müddəti (ENG):</label>
                        <input type="text" name="periodEng" required />
                    </div>

                    <div className="col-6 pd01">
                        <label>Yaş:</label>
                        <input type="text" name="ageLimit" required />
                    </div>
                </div>

                <div className="row" style={{ marginTop: '16px' }}>
                    <div className="col-6 pd00" style={{ display: 'flex', alignItems: 'center' }}>
                        <label>Xidmət şəhifəsi nümunə 1 (bir şəkilin olduğu)</label>
                        <Switch
                            checked={singleImageSwitch}
                            onChange={handleSingleSwitchChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                    <div className="col-6 pd01" style={{ display: 'flex', alignItems: 'center' }}>
                        <label>Xidmət şəhifəsi nümunə 2 (üç şəkilin olduğu)</label>
                        <Switch
                            checked={tripleImageSwitch}
                            onChange={handleTripleSwitchChange}
                            style={{ marginLeft: '10px' }}
                        />
                    </div>
                </div>

                <div className="row" style={{ marginTop: '16px' }}>
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
                    <div className="col-6 pd01" style={{ display: 'flex', gap: '10px' }}>
                        {[0, 1, 2].map(index => (
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
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: visible => setPreviewOpen(visible),
                            afterOpenChange: visible => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}

                <button type="submit" className="button">Yadda saxla</button>
            </form>
        </>
    );
}

export default AdminServCreate;