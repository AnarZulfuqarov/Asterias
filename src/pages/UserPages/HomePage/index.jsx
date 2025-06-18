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
import CircleText from "../../../components/UserComponents/CircleText/index.jsx";

function HomePage() {
    const [isMobile, setIsMobile] = useState(false); // Mobil cihaz yoxlaması
    const navigate = useNavigate(); // Naviqasiya üçün hook

    // Offerləri çəkmək üçün RTK Query istifadəsi
    const { data: getAllOffers, isLoading, isError } = useGetAllOffersQuery();
    const offers = getAllOffers?.data || []; // Data null/undefined olarsa boş array

    const wedges = offers
        .map(offer => ({
            name: offer.name,
            id: offer.id,
            templateId: offer.templateId,
        }))
        .slice(0, offers?.length);

    // Ekran ölçüsünü yoxlamaq üçün useEffect
    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth <= 1100);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        // Komponent unmount olduqda event listener-i təmizləyirik
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    // Dilim klik edildikdə naviqasiya funksiyası
    const handleWedgeClick = (id, templateId) => {
        console.log('Klik olundu:', { id, templateId }); // Debug üçün
        if (!id || !templateId) {
            console.error('ID və ya templateId yoxdur:', { id, templateId });
            return;
        }
        if (templateId === '1') {
            navigate(`/serviceDetailOne/${id}`);
        } else if (templateId === '2') {
            navigate(`/serviceDetailTwo/${id}`);
        } else {
            console.error('Naməlum templateId:', templateId);
        }
    };

    // Data yüklənərkən və ya xəta olduqda UI
    if (isLoading) {
        return <div>Yüklənir...</div>;
    }

    if (isError) {
        return <div>Offerləri çəkməkdə xəta baş verdi</div>;
    }

    return (
        <div
            style={{
                width: '100%',
                height: '100dvh',
                overflow: 'hidden',
            }}
        >
            {/* Statik şəkillər */}
            <img src={denizAti} alt="Deniz Atı" className="denizAti" />
            <img src={mavi} alt="Mavi" className="mavi" />

            <Navbar />

            <div className="container">
                <section id="homePage">
                    <div className="row">
                        {/* Sol tərəfdəki mətn bloku */}
                        <div className="yazi col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="wordWrapper">
                                <span className="span">Bacarıqlarını</span>
                                <img src={qusImg} alt="Quş" className="image" />
                                <span className="span">Kəşf Et</span>
                            </div>
                            <div className="wordWrapper">
                                <span className="span">Güclü</span>
                                <img src={strongImg} alt="Güclü" className="image" />
                            </div>
                            <div className="wordWrapper">
                                <span className="span">Tərəflərini Ortaya Çıxar</span>
                            </div>
                            {!isMobile && (
                                <section className="item">
                                    <div className="text">
                                        <div className="line"></div>
                                        <span>Daha ətraflı məlumat üçün</span>
                                    </div>
                                    <CircleText/>
                                </section>
                            )}
                        </div>

                        {/* Sağ tərəfdəki çarx bloku */}
                        <div className="box col-6 col-md-6 col-sm-12 col-xs-12">
                            <div className="wheel-wrapper">
                                <div className="wheel rotating">
                                    {wedges.map((wedge, index) => (
                                        <div
                                            key={wedge.id} // Unikal ID istifadə edirik
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
                                            Asterias Training And
                                            <br />
                                            Development Center
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