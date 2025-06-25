import "./index.scss";
import backBak from "../../../assets/Group42.png";
import icon from "../../../assets/icob2.png";
import xet from "../../../assets/Path (top).png";
import xet1 from "../../../assets/Path (bottom).png";
import xet2 from "../../../assets/Path (top1).png";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import flagAz from "../../../assets/azerbaijan.png";
import flagEn from "../../../assets/uk.png";
import flagRu from "../../../assets/circle.png";
import flagTr from "../../../assets/turkey.png";
import { FaChevronDown } from "react-icons/fa";
import { useGetOffersByIdQuery } from "../../../services/userApi.jsx";
import {DESCRIPTION_ICON, OFFER_GALERY, OFFER_IMAGES} from "../../../contants.js";
import icon3 from "../../../assets/Rectangle477.png";
import icon2 from "../../../assets/Star25.png";
import PhotoGallery from "../../../components/UserComponents/PhotoGallery/index.jsx";
import PartnerBubbles from "../../../components/UserComponents/PartnerBubbles/index.jsx";
import elli from "../../../assets/Ellipse 2.png";

function ServDetailPageTwo() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [langTimeoutId, setLangTimeoutId] = useState(null);
    const { id } = useParams();
    const { data: getOffersById, isLoading, error } = useGetOffersByIdQuery(id);
    const offer = getOffersById?.data;
    const toggleLangDropdown = () => {
        setLangDropdownOpen(!langDropdownOpen);
    };
    const galleryTemplateId = offer?.galaryTemplateId
    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem("asteriasLang", lng);
        setLangDropdownOpen(false);
    };

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
    const [showDetails, setShowDetails] = useState(false);
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
    const offerPeriod = i18n.language?.startsWith("en")
        ? offer.periodEng
        : i18n.language?.startsWith("ru")
            ? offer.periodRu
            : i18n.language?.startsWith("tr")
                ? offer.periodTur
                : offer.period;
    const offerAgeLimit = offer.ageLimit;

    const images = offer.offerImageNames?.length
        ? offer.offerImageNames.map((imageName) => `${imageName}`)
        : ["main", "main", "main"]; // Fallback to main image if offerImageNames is empty

    const hasMultipleSubOffers = offer.subOffers && offer.subOffers.length >= 2;

    return (
        <>
        <div id={"servDetailTwo"}>
            <img className={"elli"} src={elli} alt="Ellipse"/>
            <div className={"container"}>
                <div className={"back"} onClick={() => navigate("/")}>
                    <img src={backBak} alt="Back" />
                </div>
                <div className={"row ilkRow"} style={{ alignItems: "start" }}>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                        <div className={"text"}>
                            <div className={"head"}>
                                <h2>
                                    <img src={icon} alt="Icon" /> {offerName}
                                </h2>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="134"
                                    height="94"
                                    viewBox="0 0 134 94"
                                    fill="none"
                                    className={"arrow"}
                                >
                                    <path d="M1.3745 6.09042C2.78779 11.1104 4.86466 15.9964 7.55206 20.6234C9.21199 23.6066 11.1854 26.8576 13.392 30.2665C15.7345 33.9263 18.3235 37.4505 21.1403 40.8135C22.6631 42.6194 24.2985 44.3387 26.0358 45.9602C27.8205 47.6624 29.7455 49.2215 31.7877 50.6187C33.8654 52.072 36.0911 53.3 38.4182 54.2769C40.7576 55.2947 43.1988 56.0146 45.6748 56.4168L46.0853 56.4729C46.052 56.3393 45.9911 56.201 45.9472 56.0603C44.3176 50.7392 44.4864 45.2256 46.4283 40.3489C47.4421 37.8884 48.9902 35.7036 50.9783 33.9274C53.0593 32.0654 55.6587 30.7977 58.5285 30.2453C60.0277 29.9089 61.5976 29.8107 63.179 29.9544C64.9512 30.103 66.7054 30.6363 68.3083 31.5137C69.8461 32.4013 71.2033 33.5733 72.2913 34.9532C73.3792 36.3331 74.1734 37.8897 74.6218 39.5214C75.4327 42.4775 75.1627 45.51 73.8588 48.0915C72.6797 50.4635 70.9997 52.5407 68.9147 54.2044C66.8811 55.859 64.5608 57.1748 62.0358 58.1053C58.881 59.2596 55.4893 59.8665 52.0061 59.9001C52.3888 60.6002 52.8172 61.2796 53.2885 61.9339C56.0416 65.8107 59.6001 69.1352 63.7065 71.667C67.5213 74.0512 71.6334 75.9007 75.9031 77.1526C79.6277 78.2639 83.4344 78.9459 87.2387 79.1834C90.4691 79.3138 93.6758 79.164 96.8199 78.7357C101.751 78.1155 106.542 76.9683 111.106 75.3146C114.179 74.23 117.138 72.9136 119.958 71.3768C122.211 70.128 123.79 69.144 124.993 68.3494C126.05 67.6784 126.725 67.2063 127.266 66.8648L126.253 66.8308C123.365 66.7339 120.75 66.5998 118.541 66.4359C114.131 66.0986 111.308 65.6993 111.262 65.1965C111.216 64.6936 113.798 64.3059 118.1 64.0282C120.257 63.8798 122.82 63.7708 125.684 63.6984L126.769 63.6707C127.236 63.6539 127.707 63.6761 128.178 63.7369C128.48 63.7807 128.78 63.8494 129.075 63.9421C129.45 64.0594 129.812 64.2249 130.149 64.4338C130.844 64.8641 131.4 65.4834 131.736 66.2017C132.105 67.1359 132.295 68.1112 132.294 69.0767L132.485 71.3288C133.306 83.8157 133.188 93.8768 132.182 93.7642C131.175 93.6515 129.679 83.4402 128.847 70.9461L128.755 69.3019C128.303 69.8051 127.814 70.2756 127.29 70.7103C125.762 72.0402 124.118 73.2459 122.374 74.3169C119.524 76.1104 116.481 77.6302 113.284 78.8569C108.518 80.7334 103.482 82.0393 98.278 82.7476C94.8568 83.2271 91.3641 83.3928 87.8451 83.2426C83.6421 83.0033 79.4339 82.2598 75.3186 81.0296C70.5597 79.636 65.9788 77.5676 61.7357 74.8965C56.9943 71.9532 52.8963 68.0875 49.7433 63.5838C48.8295 62.2892 48.0459 60.9219 47.4044 59.5027C46.8492 59.4319 46.2941 59.3611 45.7477 59.2546C42.9753 58.7659 40.2467 57.9259 37.6353 56.7571C35.0996 55.6331 32.6797 54.241 30.4245 52.6088C28.2595 51.0695 26.2255 49.3576 24.3474 47.4943C22.5649 45.771 20.8917 43.9473 19.3388 42.0351C16.5217 38.5436 13.9569 34.8823 11.6652 31.0809C9.50613 27.5562 7.62604 24.2435 6.02497 21.143C3.45534 16.3555 1.60128 11.2993 0.522799 6.13789C0.256526 4.76732 0.0987464 3.38966 0.0508557 2.01707C0.0477717 1.08549 0.0589086 0.635216 0.150561 0.614049C0.242213 0.592882 0.477453 2.59731 1.39571 6.10478L1.3745 6.09042ZM50.1774 55.5679C50.2943 55.9662 50.4453 56.3597 50.5962 56.7533C53.9707 56.7563 57.2539 56.158 60.2809 54.9885C62.4887 54.1291 64.512 52.9356 66.2807 51.4494C68.0321 50.008 69.4336 48.218 70.4046 46.1822C71.3388 44.2535 71.507 42.0026 70.8802 39.8175C70.5854 38.7421 70.0631 37.7159 69.3473 36.8057C68.6316 35.8955 67.7385 35.1217 66.7262 34.5348C64.5856 33.535 62.2127 33.3027 60.0697 33.8833C57.8028 34.3498 55.7573 35.3812 54.1284 36.8793C52.5247 38.3794 51.2869 40.207 50.4892 42.2529C49.6749 44.3014 49.2313 46.4989 49.1762 48.758C49.1055 51.0217 49.4368 53.3192 50.1562 55.5536" fill="#595959"/>
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
                                                style={{ background: bgColor }}
                                            ></div>
                                            <div className={"content"}>
                                                <img src={`${DESCRIPTION_ICON}${iconName}`} alt={`icon-${i}`} width={20} height={20} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <button className={"moreBtn"} onClick={() => setShowDetails(true)}>Ətraflı bax <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                    <path d="M11.0004 18.1039C10.9101 18.1044 10.8206 18.0868 10.7372 18.0521C10.6537 18.0175 10.5781 17.9665 10.5146 17.9023L5.0146 12.4023C4.89316 12.272 4.82704 12.0996 4.83019 11.9215C4.83333 11.7434 4.90548 11.5734 5.03144 11.4475C5.1574 11.3215 5.32734 11.2493 5.50545 11.2462C5.68356 11.2431 5.85594 11.3092 5.98626 11.4306L11.0004 16.4448L16.0146 11.4306C16.1449 11.3092 16.3173 11.2431 16.4954 11.2462C16.6735 11.2493 16.8435 11.3215 16.9694 11.4475C17.0954 11.5734 17.1675 11.7434 17.1707 11.9215C17.1738 12.0996 17.1077 12.272 16.9863 12.4023L11.4863 17.9023C11.4228 17.9665 11.3471 18.0175 11.2637 18.0521C11.1803 18.0868 11.0908 18.1044 11.0004 18.1039Z" fill="white"/>
                                    <path d="M11 18.1038C10.8184 18.1015 10.6449 18.0283 10.5165 17.8999C10.3881 17.7714 10.3149 17.5979 10.3125 17.4163V4.58301C10.3125 4.40067 10.3849 4.2258 10.5139 4.09687C10.6428 3.96794 10.8177 3.89551 11 3.89551C11.1823 3.89551 11.3572 3.96794 11.4861 4.09687C11.6151 4.2258 11.6875 4.40067 11.6875 4.58301V17.4163C11.6851 17.5979 11.6119 17.7714 11.4835 17.8999C11.3551 18.0283 11.1816 18.1015 11 18.1038Z" fill="white"/>
                                </svg></button>
                            </div>

                        </div>
                    </div>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12"}>
                        <div className={"images"}>
                            <div className={"image1"}>
                                <img src={OFFER_IMAGES + images[0]} alt={`${offerName} Image 1`} />
                            </div>
                            <div className={"image2"}>
                                <img src={OFFER_IMAGES + images[1] || images[0]} alt={`${offerName} Image 2`} />
                            </div>
                            <div className={"image3"}>
                                <img src={OFFER_IMAGES + images[2] || images[0]} alt={`${offerName} Image 3`} />
                            </div>
                            <div className={"image4"}>
                                <img src={xet} alt="Decorative Top Path" />
                            </div>
                            <div className={"image5"}>
                                <img src={xet1} alt="Decorative Bottom Path" />
                            </div>
                            <div className={"image6"}>
                                <img src={xet2} alt="Decorative Top Path 1" />
                            </div>
                        </div>
                    </div>
                </div>
                { showDetails && (
                    hasMultipleSubOffers ? (
                        <div className={"sub-offers-section row"}>
                            <div className={"col-12 header-sub"}>
                                <h1>{t("subOffers.title") || "Bu xidmətimiz 6 başlığı özündə birləşdirir"}</h1>
                                <div className={"ox-1"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="129" height="76" viewBox="0 0 129 76"
                                         fill="none">
                                        <g clip-path="url(#clip0_380_837)">
                                            <path
                                                d="M17.6492 68.9154C15.0357 57.1247 23.979 46.2919 33.1624 39.9925C38.7907 36.1325 45.1494 33.3775 51.8156 31.889C55.1098 31.1516 58.5944 30.6196 61.9779 30.7138C65.1004 30.8 68.3416 31.592 70.5851 33.861C75.0544 38.3814 72.1438 45.8562 67.7936 49.4039C65.6273 51.1691 62.7584 52.2563 59.942 52.0644C57.1255 51.8724 54.6977 50.2801 53.3381 47.7867C50.6001 42.7596 52.0396 36.4452 54.6097 31.6346C57.5354 26.1497 62.2083 21.8453 67.5322 18.6719C73.7853 14.9453 80.8536 12.6917 87.8583 10.8368C95.236 8.88348 102.742 7.50464 110.26 6.1976C112.122 5.87516 113.981 5.55969 115.844 5.2425C116.372 5.15161 116.977 4.82648 117.235 4.34088C117.442 3.94784 117.285 3.57452 116.788 3.65503C108.644 4.98611 100.494 6.35392 92.4606 8.25942C84.7878 10.0822 77.0441 12.3177 70.0037 15.9348C63.7784 19.1347 58.1153 23.5179 54.2093 29.3633C50.8703 34.355 48.5769 40.8956 50.4 46.826C51.2253 49.4995 52.9188 51.9188 55.6 53.0098C58.6764 54.2685 62.2441 53.7035 65.2054 52.3594C70.8091 49.8101 75.645 43.5392 74.8857 37.1803C74.4928 33.9063 72.0226 31.374 69.034 30.1506C65.8417 28.8426 62.2643 28.928 58.882 29.2695C51.5172 30.0206 44.276 32.2842 37.769 35.8086C31.6768 39.1105 25.9752 43.4655 21.7163 48.9492C18.0411 53.6842 15.2631 59.4059 15.2086 65.4661C15.195 66.9361 15.3596 68.3945 15.6796 69.8254C15.8658 70.6661 17.8103 69.6072 17.6547 68.8961L17.6492 68.9154Z"
                                                fill="#595959" />
                                            <path
                                                d="M17.6232 72.6344L13.9858 67.5866L12.236 65.1566L11.2922 63.8477C11.0972 63.574 10.6599 63.1875 10.6755 62.8393C10.6863 62.4403 10.0771 62.5169 9.863 62.5809C9.39627 62.7158 8.98414 63.0363 8.71415 63.4326C8.44417 63.8289 8.5135 64.1494 8.76932 64.5196C9.10001 64.9933 9.4449 65.4565 9.77918 65.9232L11.6666 68.541L15.5721 73.9607C16.0736 74.652 18.1072 73.3081 17.6232 72.6344Z"
                                                fill="#595959" />
                                            <path
                                                d="M18.6945 71.8316C20.0346 68.632 21.5362 65.5134 22.9798 62.3614C23.1688 61.9508 23.0325 61.623 22.5259 61.672C22.0193 61.7209 21.3737 62.1177 21.1296 62.5753C19.4332 65.7807 17.9841 69.1322 16.5828 72.4682C16.361 72.9942 17.0963 73.016 17.4058 72.9208C17.9575 72.7583 18.4674 72.3593 18.6875 71.8281L18.6945 71.8316Z"
                                                fill="#595959" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_380_837">
                                                <rect width="122.049" height="39.5371" fill="white"
                                                      transform="translate(0 37.8545) rotate(-18.0686)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div className={"ox-2"}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="129" height="76" viewBox="0 0 129 76"
                                         fill="none">
                                        <g clip-path="url(#clip0_380_841)">
                                            <path
                                                d="M110.644 68.9154C113.257 57.1247 104.314 46.2919 95.1305 39.9925C89.5023 36.1325 83.1436 33.3775 76.4774 31.889C73.1832 31.1516 69.6986 30.6196 66.3151 30.7138C63.1925 30.8 59.9513 31.592 57.7079 33.861C53.2385 38.3814 56.1491 45.8562 60.4994 49.4039C62.6656 51.1691 65.5345 52.2563 68.351 52.0644C71.1675 51.8724 73.5953 50.2801 74.9548 47.7867C77.6929 42.7596 76.2534 36.4452 73.6832 31.6346C70.7576 26.1497 66.0846 21.8453 60.7608 18.6719C54.5077 14.9453 47.4394 12.6917 40.4347 10.8368C33.057 8.88348 25.5506 7.50464 18.0325 6.1976C16.1707 5.87516 14.3124 5.55969 12.4488 5.2425C11.9207 5.15161 11.3163 4.82648 11.0578 4.34088C10.851 3.94784 11.008 3.57452 11.5047 3.65503C19.6491 4.98611 27.7991 6.35392 35.8324 8.25942C43.5052 10.0822 51.2488 12.3177 58.2892 15.9348C64.5145 19.1347 70.1776 23.5179 74.0836 29.3633C77.4227 34.355 79.7161 40.8956 77.8929 46.826C77.0677 49.4995 75.3741 51.9188 72.693 53.0098C69.6166 54.2685 66.0488 53.7035 63.0876 52.3594C57.4839 49.8101 52.648 43.5392 53.4073 37.1803C53.8001 33.9063 56.2704 31.374 59.2589 30.1506C62.4513 28.8426 66.0287 28.928 69.411 29.2695C76.7757 30.0206 84.017 32.2842 90.5239 35.8086C96.6161 39.1105 102.318 43.4655 106.577 48.9492C110.252 53.6842 113.03 59.4059 113.084 65.4661C113.098 66.9361 112.933 68.3945 112.613 69.8254C112.427 70.6661 110.483 69.6072 110.638 68.8961L110.644 68.9154Z"
                                                fill="#595959" />
                                            <path
                                                d="M110.67 72.6344L114.307 67.5866L116.057 65.1566L117.001 63.8477C117.196 63.574 117.633 63.1875 117.617 62.8393C117.607 62.4403 118.216 62.5169 118.43 62.5809C118.897 62.7158 119.309 63.0363 119.579 63.4326C119.849 63.8289 119.779 64.1494 119.524 64.5196C119.193 64.9933 118.848 65.4565 118.514 65.9232L116.626 68.541L112.721 73.9607C112.219 74.652 110.186 73.3081 110.67 72.6344Z"
                                                fill="#595959" />
                                            <path
                                                d="M109.598 71.8316C108.258 68.632 106.757 65.5134 105.313 62.3614C105.124 61.9508 105.26 61.623 105.767 61.672C106.274 61.7209 106.919 62.1177 107.163 62.5753C108.86 65.7807 110.309 69.1322 111.71 72.4682C111.932 72.9942 111.197 73.016 110.887 72.9208C110.335 72.7583 109.826 72.3593 109.605 71.8281L109.598 71.8316Z"
                                                fill="#595959" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_380_841">
                                                <rect width="122.049" height="39.5371" fill="white"
                                                      transform="matrix(-0.950686 -0.310156 -0.310156 0.950686 128.293 37.8545)" />
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
                                    <img src={index % 2 === 0 ? icon2 : icon3} alt="Icon" />
                                    <div className={"contentt"}>
                                        <h3>
                                            <h2 style={{ fontWeight: "bold",fontSize:"30px"  }}>
                                                {i18n.language?.startsWith("en")
                                                    ? subOffer.nameEng || subOffer.name
                                                    : i18n.language?.startsWith("ru")
                                                        ? subOffer.nameRu || subOffer.name
                                                        : i18n.language?.startsWith("tr")
                                                            ? subOffer.nameTur || subOffer.name
                                                            : subOffer.name}
                                            </h2>
                                        </h3>
                                        {subOffer.subTitle && (
                                            <div
                                                className="sub-title"
                                                dangerouslySetInnerHTML={{
                                                    __html: i18n.language?.startsWith("en")
                                                        ? subOffer.subTitleEng || subOffer.subTitle
                                                        : i18n.language?.startsWith("ru")
                                                            ? subOffer.subTitleRu || subOffer.subTitle
                                                            : i18n.language?.startsWith("tr")
                                                                ? subOffer.subTitleTur || subOffer.subTitle
                                                                : subOffer.subTitle
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
                                    <img src={icon2} alt="Icon3" />
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
                ) }
            </div>
            <div className="language">
                <div
                    className="dropdown"
                    onClick={toggleLangDropdown}
                    onMouseEnter={handleLangMouseEnter}
                    onMouseLeave={handleLangMouseLeave}
                >
                    <button className="dropbtn" style={{ cursor: "pointer" }}>
                        <img src={currentFlag} alt="Current Flag" />
                        {currentTitle}
                        <FaChevronDown className="zakirinChevronu" />
                    </button>
                    <div className={`dropdown-content ${langDropdownOpen ? "show" : ""}`}>
                        <div onClick={() => handleLanguageChange("az")}>
                            <img src={flagAz} alt="AZ Flag" /> {t("navbar.languages.az")}
                        </div>
                        <div onClick={() => handleLanguageChange("en")}>
                            <img src={flagEn} alt="EN Flag" /> {t("navbar.languages.en")}
                        </div>
                        <div onClick={() => handleLanguageChange("ru")}>
                            <img src={flagRu} alt="RU Flag" /> {t("navbar.languages.ru")}
                        </div>
                        <div onClick={() => handleLanguageChange("tr")}>
                            <img src={flagTr} alt="TR Flag" /> {t("navbar.languages.tr")}
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

export default ServDetailPageTwo;