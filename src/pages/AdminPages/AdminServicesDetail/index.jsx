import "./index.scss";
import { Upload, Switch, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import 'antd/dist/reset.css';

function AdminServDetail() {
    const [singleFileList, setSingleFileList] = useState([]); // For single image upload
    const [tripleFileLists, setTripleFileLists] = useState([[], [], []]); // For triple image uploads
    const [singleImageSwitch, setSingleImageSwitch] = useState(true);
    const [tripleImageSwitch, setTripleImageSwitch] = useState(false);
    const [previewImage, setPreviewImage] = useState(''); // For image preview
    const [previewOpen, setPreviewOpen] = useState(false); // For controlling preview visibility

    const handleSingleImageChange = ({ fileList: newFileList }) => {
        setSingleFileList(newFileList);
        console.log('Single Image File List:', newFileList);
    };

    const handleTripleImageChange = (index) => ({ fileList: newFileList }) => {
        setTripleFileLists(prev => {
            const newLists = [...prev];
            newLists[index] = newFileList;
            return newLists;
        });
        console.log(`Triple Image File List for slot ${index + 1}:`, newFileList);
    };

    const handleSingleSwitchChange = (checked) => {
        setSingleImageSwitch(checked);
        setTripleImageSwitch(!checked); // Toggle the other switch off
        if (checked) {
            setTripleFileLists([[], [], []]); // Reset triple images when switching to single
        }
    };

    const handleTripleSwitchChange = (checked) => {
        setTripleImageSwitch(checked);
        setSingleImageSwitch(!checked); // Toggle the other switch off
        if (checked) {
            setSingleFileList([]); // Reset single image when switching to triple
        }
    };

    const handlePreview = (file) => {
        setPreviewImage(file.url || file.thumbUrl);
        setPreviewOpen(true);
    };

    const uploadButton = (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <UploadOutlined style={{ fontSize: '24px' }} />
            <div style={{ marginTop: '8px' }}>Upload</div>
        </div>
    );

    return (
        <div className="container1">
            <div id="admin-services-detail">
                <div>
                    <label>Xidmət (AZ):</label>
                    <input type="text" value="Tələbə (Akademik Kouçluq)" readOnly />
                </div>

                <div>
                    <label>Xidmət (RU):</label>
                    <input type="text" value="Студент (Академический Коучинг)" readOnly />
                </div>

                <div>
                    <label>Xidmət (ENG):</label>
                    <input type="text" value="Student (Academic Coaching)" readOnly />
                </div>

                <div>
                    <label>Alt Başlıq (AZ):</label>
                    <textarea
                        value="Yeniyetmələrə özünə daha yaxşı başa düşməyə, müəyyən bacanaq, bilik və təcrübə əldə etməyə Tələbə (Akademik) Kouçluğu, qabiliyyətləri inkişaf etdirməyə, məqsədlər qarşı qəbul etməyə və macədərlərə catmaq üçün yaradıcı yollaranı təklif edən tələbə və kouç arasında fərdi sessiyalardan ibarətdir."
                        readOnly
                    />
                </div>

                <div>
                    <label>Alt Başlıq (RU):</label>
                    <textarea
                        value="Подросткам для лучшего понимания себя, приобретения определенных навыков, знаний и опыта через Студент (Академический) Коучинг, развития своих способностей, принятия целей и достижения их через творческие пути, предлагаемые в индивидуальных сессиях между студентом и коучем."
                        readOnly
                    />
                </div>

                <div>
                    <label>Alt Başlıq (ENG):</label>
                    <textarea
                        value="For teenagers to better understand themselves, acquire certain skills, knowledge, and experience through Student (Academic) Coaching, develop their abilities, set goals, and achieve them through creative pathways offered in individual sessions between the student and the coach."
                        readOnly
                    />
                </div>

                <div className="row">
                    <div className="col-6 pd00">
                        <label>Keçirilmə müddəti (AZ):</label>
                        <input type="text" value="6-9 ay" readOnly />
                        <label>Keçirilmə müddəti (RU):</label>
                        <input type="text" value="6-9 месяцев" readOnly />
                        <label>Keçirilmə müddəti (ENG):</label>
                        <input type="text" value="6-9 months" readOnly />
                    </div>

                    <div className="col-6 pd01">
                        <label>Yek:</label>
                        <input type="text" value="11+" readOnly />
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

                <button className="button">Dayişiklikləri yadda saxla</button>
            </div>
        </div>
    );
}

export default AdminServDetail;