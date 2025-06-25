import "./index.scss";
import backBak from "/src/assets/Group42.png";
import icon from "/src/assets/icon1.png";
import {useNavigate, useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useState} from "react";
import flagAz from "../../../assets/azerbaijan.png";
import flagEn from "../../../assets/uk.png";
import flagRu from "../../../assets/circle.png";
import flagTr from "../../../assets/turkey.png";
import {FaChevronDown} from "react-icons/fa";
import elli from "../../../assets/Ellipse 2.png";
import {useGetOffersByIdQuery} from "../../../services/userApi.jsx";
import {DESCRIPTION_ICON, OFFER_GALERY, OFFER_IMAGES} from "../../../contants.js";
import icon2 from "/src//assets/Star25.png";
import icon3 from "/src//assets/Rectangle477.png";
import PhotoGallery from "../../../components/UserComponents/PhotoGallery/index.jsx";
import PartnerBubbles from "../../../components/UserComponents/PartnerBubbles/index.jsx";
import imageIcon from "/src/assets/DetailThreeIcon.png"
import imageIcon2 from "/src/assets/DetailThreeIcon2.png"
import imageIcon3 from "/src/assets/DetailThreeIcon3.png"
import imageIcon4 from "/src/assets/DetailThreeIcon4.png"
function ServDetailPageThree() {
    const {id} = useParams();
    const {data: getOffersById, isLoading, error} = useGetOffersByIdQuery(id);
    const offer = getOffersById?.data;
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [langTimeoutId, setLangTimeoutId] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const toggleLangDropdown = () => {
        setLangDropdownOpen(!langDropdownOpen);
    };
    const galleryTemplateId = offer?.galaryTemplateId
    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("asteriasLang", lng);
        setLangDropdownOpen(false);
    };
    const iconBgColors = [
        "#E5F1F2",   // Mavi-gri
        "#FBFFC1",   // Sarımsı
        "rgba(255, 140, 91, 0.53)", // Narıncı
        "#EFC",      // Açıq yaşıl
        "#FDE2E4",   // Çəhrayımsı
        "#E0BBE4",   // Açıq bənövşəyi
        "#CDEAC0",   // Açıq yaşıl
        "#FFD6A5"    // Portağal ton
    ];
    let currentFlag = flagAz;
    let currentTitle = "Az";
    if (i18n.language?.startsWith("en")) {
        currentTitle = "En";
        currentFlag = flagEn;
    } else if (i18n.language?.startsWith("ru")) {
        currentTitle = "Ru";
        currentFlag = flagRu;
    } else if (i18n.language?.startsWith("tr")) {
        currentTitle = "Tr";
        currentFlag = flagTr;
    } else if (i18n.language?.startsWith("az")) {
        currentTitle = "Az";
        currentFlag = flagAz;
    }

    const handleLangMouseEnter = () => {
        if (langTimeoutId) {
            clearTimeout(langTimeoutId);
            setLangTimeoutId(null);
        }
    };

    const handleLangMouseLeave = () => {
        const timeout = setTimeout(() => {
            setLangDropdownOpen(false);
        }, 1000);
        setLangTimeoutId(timeout);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !offer) {
        return <div>Error loading offer details or offer not found.</div>;
    }

    const offerName = i18n.language?.startsWith("en")
        ? offer.nameEng
        : i18n.language?.startsWith("ru")
            ? offer.nameRu
            : i18n.language?.startsWith("tr")
                ? offer.nameTur
                : offer.name;
    const offerDescription = i18n.language?.startsWith("en")
        ? offer.descriptionEng
        : i18n.language?.startsWith("ru")
            ? offer.descriptionRu
            : i18n.language?.startsWith("tr")
                ? offer.descriptionTur
                : offer.description;

    const offerImage = offer.offerImageNames?.[0]
        ? `${OFFER_IMAGES}${offer.offerImageNames[0]}`
        : "main"; // Fallback image

    const hasMultipleSubOffers = offer.subOffers && offer.subOffers.length >= 2;

    return (
        <>
            <div id={"servDetailThree"}>
                <img className={"elli"} src={elli} alt="Ellipse"/>
                <div className={"container"}>
                    <div className={"back"} onClick={() => navigate("/")}>
                        <img
                            src={backBak}
                            style={{
                                position: "relative",
                                zIndex: 9999,
                            }}
                            alt="Back"
                        />
                    </div>
                    <div className={"row ilkRow"} style={{alignItems: "center"}}>
                        <div
                            className={"col-6 col-md-12 col-sm-12 col-xs-12"}
                            style={{alignItems: "center", position: "relative", zIndex: 120}}
                        >
                            <div className={"text"}>
                                <div className={"head"}>
                                    <h2
                                        style={{
                                            fontSize:
                                                i18n.language === "az"
                                                    ? "48px"
                                                    : i18n.language === "en"
                                                        ? "36px"
                                                        : "34px",
                                        }}
                                    >
                                        <img src={icon} alt="icon"/> {offerName}
                                    </h2>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="121"
                                        height="90"
                                        viewBox="0 0 121 90"
                                        fill="none"
                                        className={"arrowDetail"}
                                    >
                                        <g clipPath="url(#clip0_142_515)">
                                            <path
                                                d="M30.0562 0.427308C21.6815 5.23487 14.6823 12.5045 10.1909 21.1876C7.94148 25.5291 5.61602 30.7794 6.61156 35.7967C7.52351 40.379 11.3841 43.0274 15.5182 44.2701C20.4275 45.7457 25.8004 45.5438 30.8465 45.1555C36.759 44.6972 42.6106 43.6487 48.5003 42.9187C51.3197 42.5692 54.1847 42.2041 57.027 42.243C59.3144 42.2663 61.6551 42.7633 63.1218 44.7205C65.7816 48.2544 63.9046 53.559 61.9971 56.9608C59.3144 61.7606 55.5906 65.8614 51.6465 69.5971C47.7023 73.3329 43.5378 76.6104 39.0464 79.4996C30.4513 85.0373 19.3864 90.5826 9.02822 87.2741C6.86235 86.5828 4.62048 85.3091 3.64774 83.1034C2.675 80.8976 3.11577 78.6375 4.11891 76.6337C6.37598 72.1135 10.9585 69.1777 15.2446 66.9487C19.9792 64.4945 25.0785 62.8635 30.2234 61.582C35.3683 60.3005 40.5283 59.3918 45.7568 58.8093C66.9292 56.456 88.5955 59.7956 108.202 68.2458C110.649 69.302 113.066 70.4359 115.452 71.632C116.091 71.9504 117.033 71.7097 117.603 71.3446C118.021 71.0728 118.515 70.4748 117.869 70.133C108.081 64.9915 97.5478 61.3179 86.7792 59.0345C76.0106 56.7511 64.7481 55.8424 53.668 56.4327C42.5878 57.0229 31.4849 58.8869 21.0431 62.6305C15.8298 64.5022 10.8141 67.0186 6.42917 70.4748C2.98658 73.1853 -0.828395 77.8376 0.159546 82.6296C1.23868 87.8876 7.47791 89.4565 11.9388 89.8837C17.5549 90.4118 23.2166 89.0759 28.4223 87.0178C38.7577 82.9403 48.3027 76.0435 56.1378 68.1059C59.93 64.2615 63.593 59.9898 65.8728 55.0036C67.5599 51.3222 68.5631 46.002 65.3561 42.8255C63.5398 41.0314 60.9255 40.5421 58.4937 40.4799C55.6059 40.41 52.68 40.7595 49.815 41.0935C43.743 41.808 37.7089 42.9264 31.6141 43.4313C26.5452 43.8507 20.9139 44.1147 16.0806 42.1886C14.0895 41.3964 12.2428 40.2081 10.9661 38.4218C9.4082 36.2471 9.08142 33.4744 9.44619 30.8571C10.1682 25.6922 12.8508 20.6827 15.6854 16.4266C18.5201 12.1705 21.8943 8.50463 25.7928 5.3669C27.6927 3.83687 29.7218 2.48547 31.8269 1.27387C32.2676 1.01757 32.6172 0.473908 32.0776 0.132175C31.5381 -0.209558 30.5653 0.116642 30.0562 0.404008V0.427308Z"
                                                fill="#595959"
                                            />
                                            <path
                                                d="M97.1146 70.824C104.304 71.6784 111.501 72.5327 118.743 72.8511C119.336 72.8744 121.942 71.9502 120.635 71.1347C117.162 68.96 113.788 66.6223 110.535 64.1136C107.283 61.605 104.304 58.809 101.127 56.2149C100.398 55.6169 97.487 56.5023 98.3306 57.4188C101.158 60.4711 104.547 63.0962 107.83 65.6126C111.113 68.129 114.563 70.5134 118.089 72.7191L119.982 71.0027C112.975 70.6998 106.006 69.8998 99.0449 69.0765C98.2926 68.9911 97.3806 69.1231 96.8107 69.6901C96.3775 70.1173 96.3927 70.7464 97.107 70.8318L97.1146 70.824Z"
                                                fill="#595959"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_142_515">
                                                <rect width="121" height="90" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <p>{offerDescription}</p>
                                <div className={"functions"}>
                                    {offer.offerIconNames?.map((iconName, i) => {
                                        const bgColor = iconBgColors[i % iconBgColors.length]; // Rənglər sırayla dönsün

                                        return (
                                            <div
                                                key={i}
                                                className={`icon-dynamic`}
                                                style={{
                                                    top: i % 2 === 0 ? "70px" : "0",
                                                    animationDelay: `${i * 0.2}s`,
                                                }}
                                            >
                                                <div
                                                    className={"overlay"}
                                                    style={{background: bgColor}}
                                                ></div>
                                                <div className={"content"}>
                                                    <img src={`${DESCRIPTION_ICON}${iconName}`} alt={`icon-${i}`}
                                                         width={20} height={20}/>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div>
                                    <button onClick={() => setShowDetails(true)}>Ətraflı bax <svg
                                        xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"
                                        fill="none">
                                        <path
                                            d="M11.0004 18.1039C10.9101 18.1044 10.8206 18.0868 10.7372 18.0521C10.6537 18.0175 10.5781 17.9665 10.5146 17.9023L5.0146 12.4023C4.89316 12.272 4.82704 12.0996 4.83019 11.9215C4.83333 11.7434 4.90548 11.5734 5.03144 11.4475C5.1574 11.3215 5.32734 11.2493 5.50545 11.2462C5.68356 11.2431 5.85594 11.3092 5.98626 11.4306L11.0004 16.4448L16.0146 11.4306C16.1449 11.3092 16.3173 11.2431 16.4954 11.2462C16.6735 11.2493 16.8435 11.3215 16.9694 11.4475C17.0954 11.5734 17.1675 11.7434 17.1707 11.9215C17.1738 12.0996 17.1077 12.272 16.9863 12.4023L11.4863 17.9023C11.4228 17.9665 11.3471 18.0175 11.2637 18.0521C11.1803 18.0868 11.0908 18.1044 11.0004 18.1039Z"
                                            fill="white"/>
                                        <path
                                            d="M11 18.1038C10.8184 18.1015 10.6449 18.0283 10.5165 17.8999C10.3881 17.7714 10.3149 17.5979 10.3125 17.4163V4.58301C10.3125 4.40067 10.3849 4.2258 10.5139 4.09687C10.6428 3.96794 10.8177 3.89551 11 3.89551C11.1823 3.89551 11.3572 3.96794 11.4861 4.09687C11.6151 4.2258 11.6875 4.40067 11.6875 4.58301V17.4163C11.6851 17.5979 11.6119 17.7714 11.4835 17.8999C11.3551 18.0283 11.1816 18.1015 11 18.1038Z"
                                            fill="white"/>
                                    </svg></button>
                                </div>
                            </div>
                        </div>
                        <div className={"col-6 col-md-12 col-sm-12 col-xs-12"} style={{textAlign: "end"}}>
                            <div className={"image"}>
                                <div className={"mainImage"}>
                                    <img src={offerImage} alt={offerName}/>
                                </div>
                                <div className={"mainImage2"}>
                                    <img src={offerImage} alt={offerName}/>
                                </div>
                                <div className={"mainImage3"}>
                                    <img src={offerImage} alt={offerName}/>
                                </div>
                                <div className={"mainImage4"}>
                                    <img src={offerImage} alt={offerName}/>
                                </div>
                                <div className={"mainImage5"}>
                                    <img src={offerImage} alt={offerName}/>
                                </div>
                                <div className={"iconn"}>
                                    <img src={imageIcon}/>
                                </div>
                                <div className={"iconn2"}>
                                    <img src={imageIcon2}/>
                                </div>
                                <div className={"iconn3"}>
                                    <img src={imageIcon3}/>
                                </div>
                                <div className={"iconn4"}>
                                    <img src={imageIcon4}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {showDetails && (
                        hasMultipleSubOffers ? (
                            <div className={"sub-offers-section row"}>
                                <div className={"col-12 header-sub"}>
                                    <h1>{t("subOffers.title") || "Bu xidmətimiz 6 başlığı özündə birləşdirir"}</h1>
                                    <div className={"ox-1"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="129" height="76"
                                             viewBox="0 0 129 76"
                                             fill="none">
                                            <g clip-path="url(#clip0_380_837)">
                                                <path
                                                    d="M17.6492 68.9154C15.0357 57.1247 23.979 46.2919 33.1624 39.9925C38.7907 36.1325 45.1494 33.3775 51.8156 31.889C55.1098 31.1516 58.5944 30.6196 61.9779 30.7138C65.1004 30.8 68.3416 31.592 70.5851 33.861C75.0544 38.3814 72.1438 45.8562 67.7936 49.4039C65.6273 51.1691 62.7584 52.2563 59.942 52.0644C57.1255 51.8724 54.6977 50.2801 53.3381 47.7867C50.6001 42.7596 52.0396 36.4452 54.6097 31.6346C57.5354 26.1497 62.2083 21.8453 67.5322 18.6719C73.7853 14.9453 80.8536 12.6917 87.8583 10.8368C95.236 8.88348 102.742 7.50464 110.26 6.1976C112.122 5.87516 113.981 5.55969 115.844 5.2425C116.372 5.15161 116.977 4.82648 117.235 4.34088C117.442 3.94784 117.285 3.57452 116.788 3.65503C108.644 4.98611 100.494 6.35392 92.4606 8.25942C84.7878 10.0822 77.0441 12.3177 70.0037 15.9348C63.7784 19.1347 58.1153 23.5179 54.2093 29.3633C50.8703 34.355 48.5769 40.8956 50.4 46.826C51.2253 49.4995 52.9188 51.9188 55.6 53.0098C58.6764 54.2685 62.2441 53.7035 65.2054 52.3594C70.8091 49.8101 75.645 43.5392 74.8857 37.1803C74.4928 33.9063 72.0226 31.374 69.034 30.1506C65.8417 28.8426 62.2643 28.928 58.882 29.2695C51.5172 30.0206 44.276 32.2842 37.769 35.8086C31.6768 39.1105 25.9752 43.4655 21.7163 48.9492C18.0411 53.6842 15.2631 59.4059 15.2086 65.4661C15.195 66.9361 15.3596 68.3945 15.6796 69.8254C15.8658 70.6661 17.8103 69.6072 17.6547 68.8961L17.6492 68.9154Z"
                                                    fill="#595959"/>
                                                <path
                                                    d="M17.6232 72.6344L13.9858 67.5866L12.236 65.1566L11.2922 63.8477C11.0972 63.574 10.6599 63.1875 10.6755 62.8393C10.6863 62.4403 10.0771 62.5169 9.863 62.5809C9.39627 62.7158 8.98414 63.0363 8.71415 63.4326C8.44417 63.8289 8.5135 64.1494 8.76932 64.5196C9.10001 64.9933 9.4449 65.4565 9.77918 65.9232L11.6666 68.541L15.5721 73.9607C16.0736 74.652 18.1072 73.3081 17.6232 72.6344Z"
                                                    fill="#595959"/>
                                                <path
                                                    d="M18.6945 71.8316C20.0346 68.632 21.5362 65.5134 22.9798 62.3614C23.1688 61.9508 23.0325 61.623 22.5259 61.672C22.0193 61.7209 21.3737 62.1177 21.1296 62.5753C19.4332 65.7807 17.9841 69.1322 16.5828 72.4682C16.361 72.9942 17.0963 73.016 17.4058 72.9208C17.9575 72.7583 18.4674 72.3593 18.6875 71.8281L18.6945 71.8316Z"
                                                    fill="#595959"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_380_837">
                                                    <rect width="122.049" height="39.5371" fill="white"
                                                          transform="translate(0 37.8545) rotate(-18.0686)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                    <div className={"ox-2"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="129" height="76"
                                             viewBox="0 0 129 76"
                                             fill="none">
                                            <g clip-path="url(#clip0_380_841)">
                                                <path
                                                    d="M110.644 68.9154C113.257 57.1247 104.314 46.2919 95.1305 39.9925C89.5023 36.1325 83.1436 33.3775 76.4774 31.889C73.1832 31.1516 69.6986 30.6196 66.3151 30.7138C63.1925 30.8 59.9513 31.592 57.7079 33.861C53.2385 38.3814 56.1491 45.8562 60.4994 49.4039C62.6656 51.1691 65.5345 52.2563 68.351 52.0644C71.1675 51.8724 73.5953 50.2801 74.9548 47.7867C77.6929 42.7596 76.2534 36.4452 73.6832 31.6346C70.7576 26.1497 66.0846 21.8453 60.7608 18.6719C54.5077 14.9453 47.4394 12.6917 40.4347 10.8368C33.057 8.88348 25.5506 7.50464 18.0325 6.1976C16.1707 5.87516 14.3124 5.55969 12.4488 5.2425C11.9207 5.15161 11.3163 4.82648 11.0578 4.34088C10.851 3.94784 11.008 3.57452 11.5047 3.65503C19.6491 4.98611 27.7991 6.35392 35.8324 8.25942C43.5052 10.0822 51.2488 12.3177 58.2892 15.9348C64.5145 19.1347 70.1776 23.5179 74.0836 29.3633C77.4227 34.355 79.7161 40.8956 77.8929 46.826C77.0677 49.4995 75.3741 51.9188 72.693 53.0098C69.6166 54.2685 66.0488 53.7035 63.0876 52.3594C57.4839 49.8101 52.648 43.5392 53.4073 37.1803C53.8001 33.9063 56.2704 31.374 59.2589 30.1506C62.4513 28.8426 66.0287 28.928 69.411 29.2695C76.7757 30.0206 84.017 32.2842 90.5239 35.8086C96.6161 39.1105 102.318 43.4655 106.577 48.9492C110.252 53.6842 113.03 59.4059 113.084 65.4661C113.098 66.9361 112.933 68.3945 112.613 69.8254C112.427 70.6661 110.483 69.6072 110.638 68.8961L110.644 68.9154Z"
                                                    fill="#595959"/>
                                                <path
                                                    d="M110.67 72.6344L114.307 67.5866L116.057 65.1566L117.001 63.8477C117.196 63.574 117.633 63.1875 117.617 62.8393C117.607 62.4403 118.216 62.5169 118.43 62.5809C118.897 62.7158 119.309 63.0363 119.579 63.4326C119.849 63.8289 119.779 64.1494 119.524 64.5196C119.193 64.9933 118.848 65.4565 118.514 65.9232L116.626 68.541L112.721 73.9607C112.219 74.652 110.186 73.3081 110.67 72.6344Z"
                                                    fill="#595959"/>
                                                <path
                                                    d="M109.598 71.8316C108.258 68.632 106.757 65.5134 105.313 62.3614C105.124 61.9508 105.26 61.623 105.767 61.672C106.274 61.7209 106.919 62.1177 107.163 62.5753C108.86 65.7807 110.309 69.1322 111.71 72.4682C111.932 72.9942 111.197 73.016 110.887 72.9208C110.335 72.7583 109.826 72.3593 109.605 71.8281L109.598 71.8316Z"
                                                    fill="#595959"/>
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_380_841">
                                                    <rect width="122.049" height="39.5371" fill="white"
                                                          transform="matrix(-0.950686 -0.310156 -0.310156 0.950686 128.293 37.8545)"/>
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </div>
                                </div>
                                {offer.subOffers.map((subOffer, index) => (
                                    <div
                                        key={subOffer.id}
                                        className={`col-6 col-md-12 col-sm-12 col-xs-12 sub-offer-column ${index % 2 === 0 ? "left-column" : "right-column"}`}
                                    >
                                        <img src={index % 2 === 0 ? icon2 : icon3} alt="Icon"/>
                                        <div className={"contentt"}>
                                            <h3>
                                                <h2 style={{fontWeight: "bold", fontSize: "30px"}}>
                                                    {i18n.language?.startsWith("en")
                                                        ? subOffer.nameEng || subOffer.name
                                                        : i18n.language?.startsWith("ru")
                                                            ? subOffer.nameRu || subOffer.name
                                                            : i18n.language?.startsWith("tr")
                                                                ? subOffer.nameTur || subOffer.name
                                                                : subOffer.name}
                                                </h2>
                                            </h3>
                                            {subOffer.subTitle[0] && (
                                                <div
                                                    className="sub-title"
                                                    dangerouslySetInnerHTML={{
                                                        __html: i18n.language?.startsWith("en")
                                                            ? subOffer.subTitle[0]?.textEng || subOffer.subTitle
                                                            : i18n.language?.startsWith("ru")
                                                                ? subOffer.subTitle[0]?.textRu || subOffer.subTitle
                                                                : i18n.language?.startsWith("tr")
                                                                    ? subOffer.subTitle[0]?.textTur || subOffer.subTitle
                                                                    : subOffer.subTitle[0]?.text
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <button
                                            className={index % 2 === 0 ? "" : "last-btn"}
                                            onClick={() => navigate("/contact")}
                                        >
                                            {t("servDetailOne.button") || "Əlaqə"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <>{showDetails && (
                                offer.subTitle?.length > 1 ? (
                                    <>
                                        <div className="sub-titles-grid">
                                            {offer.subTitle.map((sub, i) => {
                                                // kart başlığı için istersen sub.title gibi bir alan kullan
                                                const html = i18n.language.startsWith("en")
                                                    ? sub.textEng || sub.text
                                                    : i18n.language.startsWith("ru")
                                                        ? sub.textRu || sub.text
                                                        : i18n.language.startsWith("tr")
                                                            ? sub.textTur || sub.text
                                                            : sub.text;
                                                return (
                                                    <div key={sub.id}
                                                         className={`sub-title-card ${i % 2 ? 'alt-bg' : 'ust-bg'}`}>
                                                        <div
                                                            className="card-content"
                                                            dangerouslySetInnerHTML={{__html: html}}
                                                        />
                                                    </div>
                                                );
                                            })}

                                        </div>
                                        <div className={"yeniButton"}>
                                            <button onClick={()=>navigate("/contact")}>Müraciət et</button>
                                        </div>
                                    </>
                                ) : (
                                    <div className={"description-section row"}>
                                        <img src={icon3} alt="Icon3"/>
                                        <div className={"col-12 description-column"}>
                                            {Array.isArray(offer.subTitle) && offer.subTitle.length > 0 && (
                                                offer.subTitle.map(sub => (
                                                    <div
                                                        key={sub.id}
                                                        className="sub-title"
                                                        dangerouslySetInnerHTML={{
                                                            __html: i18n.language.startsWith("en")
                                                                ? sub.textEng || sub.text
                                                                : i18n.language.startsWith("ru")
                                                                    ? sub.textRu || sub.text
                                                                    : i18n.language.startsWith("tr")
                                                                        ? sub.textTur || sub.text
                                                                        : sub.text
                                                        }}
                                                    />
                                                ))
                                            )}
                                            <button onClick={() => navigate("/contact")}>
                                                {t("servDetailOne.button") || "Əlaqə"}
                                            </button>
                                        </div>
                                    </div>
                                )
                            )}</>

                        )
                    )}
                </div>
                <div className="language">
                    <div
                        className="dropdown"
                        onClick={toggleLangDropdown}
                        onMouseEnter={handleLangMouseEnter}
                        onMouseLeave={handleLangMouseLeave}
                    >
                        <button className="dropbtn">
                            <img src={currentFlag} alt="Current Flag"/>
                            {currentTitle}
                            <FaChevronDown className="zakirinChevronu"/>
                        </button>
                        <div className={`dropdown-content ${langDropdownOpen ? "show" : ""}`}>
                            <div onClick={() => handleLanguageChange("az")}>
                                <img src={flagAz} alt="AZ Flag"/> {t("navbar.languages.az")}
                            </div>
                            <div onClick={() => handleLanguageChange("en")}>
                                <img src={flagEn} alt="EN Flag"/> {t("navbar.languages.en")}
                            </div>
                            <div onClick={() => handleLanguageChange("ru")}>
                                <img src={flagRu} alt="RU Flag"/> {t("navbar.languages.ru")}
                            </div>
                            <div onClick={() => handleLanguageChange("tr")}>
                                <img src={flagTr} alt="TR Flag"/> {t("navbar.languages.tr")}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {offer?.offerGalaryNames?.length > 0 && (
                <div className={"container"}>
                    {galleryTemplateId == "1" && (
                        <PhotoGallery images={offer?.offerGalaryNames?.map(name => `${OFFER_GALERY}${name}`)}/>
                    )}

                    {galleryTemplateId == "2" && (
                        <PartnerBubbles logos={offer?.offerGalaryNames?.map(name => `${OFFER_GALERY}${name}`)}/>
                    )}
                </div>
            )}
        </>
    );
}

export default ServDetailPageThree;