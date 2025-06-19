import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import wedgeImg from '/src/assets/lecek.png';
import qusImg from '/src/assets/qus.png';
import strongImg from '/src/assets/strong.png';
import denizAti from '/src/assets/denizAti.png';
import mavi from '/src/assets/mavi.png';
import Footer from '../../../components/UserComponents/components/Footer/index.jsx';
import Navbar from '../../../components/Navbar/index.jsx';
import { useGetAllOffersQuery } from '../../../services/userApi.jsx';
import CircleText from '../../../components/UserComponents/CircleText/index.jsx';
import { useTranslation } from 'react-i18next'; // i18n hook

function HomePage() {
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation(); // Çeviri hook'u
    const currentLanguage = i18n.language; // Mevcut dil

    // Offerleri çek
    const { data: getAllOffers, isLoading, isError } = useGetAllOffersQuery();
    const offers = getAllOffers?.data || [];

    // Offer isimlerini dil seçimine göre wedges'e map et
    const wedges = offers
        .map((offer) => ({
            name:
                currentLanguage === 'en'
                    ? offer.nameEng
                    : currentLanguage === 'ru'
                        ? offer.nameRu
                        : currentLanguage === 'tr'
                            ? offer.nameTur
                            : offer.name, // Varsayılan: Azerbaycan dili
            id: offer.id,
            templateId: offer.templateId,
        }))
        .slice(0, offers?.length);

    // Ekran boyutunu kontrol et
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 1100);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Dilim tıklama işlevi
    const handleWedgeClick = (id, templateId) => {
        console.log('Tıklandı:', { id, templateId });
        if (!id || !templateId) {
            console.error('ID veya templateId eksik:', { id, templateId });
            return;
        }
        if (templateId === '1') {
            navigate(`/serviceDetailOne/${id}`);
        } else if (templateId === '2') {
            navigate(`/serviceDetailTwo/${id}`);
        } else {
            console.error('Bilinmeyen templateId:', templateId);
        }
    };

    // Yükleniyor ve hata durumları
    if (isLoading) {
        return <div>{t('loading')}</div>;
    }

    if (isError) {
        return <div>{t('error')}</div>;
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100dvh',
                overflow: 'hidden',
            }}
        >
            {/* Statik resimler */}
            <img src={denizAti} alt="Deniz Atı" className="denizAti" />
            <img src={mavi} alt="Mavi" className="mavi" />

            <Navbar />

            <div className="container">
                <section id="homePage">
                    <div className="row">
                        {/* Sol taraftaki metin bloğu */}
                        <div className="yazi col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="wordWrapper">
                                <span className="span">{t('homepage.title1')}</span>
                                <img src={qusImg} alt="Kuş" className="image" />
                                <span className="span">{t('homepage.title1.2')}</span>
                            </div>
                            <div className="wordWrapper">
                                <span className="span">{t('homepage.title2')}</span>
                                <img src={strongImg} alt="Güçlü" className="image" />
                            </div>
                            <div className="wordWrapper">
                                <span className="span">{t('homepage.title2.2')}</span>
                            </div>
                            {!isMobile && (
                                <section className="item">
                                    <div className="text">
                                        <div className="line"></div>
                                        <span>{t('homepage.more_info')}</span>
                                    </div>
                                    <CircleText />
                                </section>
                            )}
                        </div>

                        {/* Sağ taraftaki çark bloğu */}
                        <div className="box col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="wheel-wrapper">
                                <div className="wheel rotating">
                                    {wedges.map((wedge, index) => (
                                        <div
                                            key={wedge.id}
                                            className="slice"
                                            style={{
                                                transform: `rotate(${index * (360 / wedges.length)}deg)`,
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => handleWedgeClick(wedge.id, wedge.templateId)}
                                        >
                                            <img
                                                src={wedgeImg}
                                                alt="Dilim"
                                                className="wedge-img"
                                                style={{
                                                    filter: `hue-rotate(${index * (360 / wedges.length)}deg)`,
                                                }}
                                            />
                                            <div className="slice-text">{wedge.name}</div>
                                        </div>
                                    ))}
                                </div>
                                <div className="center-text">
                                    <div className="circle-center">
                                        <div className="circle-center-content">
                                            {t('homepage.center_text')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* Mobil cihazlarda footer */}
            {isMobile && <Footer />}
        </div>
    );
}

export default HomePage;