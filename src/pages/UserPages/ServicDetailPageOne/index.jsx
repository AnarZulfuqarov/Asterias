import "./index.scss";
import backBak from "/src/assets/Group42.png";
import icon from "/src/assets/icon1.png";
import { useNavigate, useParams } from "react-router-dom";
import frame from "/src/assets/Frame1703876721.png";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import flagAz from "../../../assets/azerbaijan.png";
import flagEn from "../../../assets/uk.png";
import flagRu from "../../../assets/circle.png";
import flagTr from "../../../assets/turkey.png";
import { FaChevronDown } from "react-icons/fa";
import elli from "../../../assets/Ellipse 2.png";
import { useGetOffersByIdQuery } from "../../../services/userApi.jsx";
import { OFFER_IMAGES } from "../../../contants.js";
import CircleTextAsterias from "../../../components/UserComponents/CircleTextWhite/index.jsx";
import icon2 from "/src//assets/Star25.png";
import icon3 from "/src//assets/Rectangle477.png";

function ServDetailPageOne() {
    const { id } = useParams();
    const { data: getOffersById, isLoading, error } = useGetOffersByIdQuery(id);
    const offer = getOffersById?.data;
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [langTimeoutId, setLangTimeoutId] = useState(null);

    const toggleLangDropdown = () => {
        setLangDropdownOpen(!langDropdownOpen);
    };

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
        <div id={"servDetailOne"}>
            <img className={"elli"} src={elli} alt="Ellipse" />
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
                <div className={"row"} style={{ alignItems: "center" }}>
                    <div
                        className={"col-6 col-md-12 col-sm-12 col-xs-12"}
                        style={{ alignItems: "center", position: "relative", zIndex: 120 }}
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
                                    <img src={icon} alt="icon" /> {offerName}
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
                                            <rect width="121" height="90" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <p>{offerDescription}</p>
                            <div className={"functions"}>
                                <div className={"icon1"}>
                                    <div className={"overlay"}></div>
                                    <div className={"content"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22"
                                             viewBox="0 0 22 22" fill="none">
                                            <path
                                                d="M9.79843 19.3173V4.6643C9.79843 4.07226 9.88724 2.88818 8.46634 2.88818C7.06556 2.88818 6.76954 4.54533 7.57828 5.24572M9.79843 19.3173C8.21334 19.3173 7.6892 17.9027 8.22603 16.9671M7.01349 4.14333C6.61086 4.06984 6.19459 4.11234 5.80158 4.26707C5.40856 4.4218 5.05091 4.68397 4.76032 5.03038C4.46973 5.37678 4.25517 5.79672 4.13563 6.253C4.01609 6.70927 3.99528 7.1878 4.07502 7.64619C4.15477 8.10459 4.33262 8.5287 4.59282 8.88096C4.85302 9.23322 5.18753 9.50275 5.56673 9.66569M5.54911 15.3516C5.41725 15.607 5.35166 15.9015 5.35814 16.2091C5.36462 16.5166 5.44299 16.8278 5.58628 17.115C5.72958 17.4021 5.9334 17.6565 6.17967 17.8554C6.42594 18.0543 6.70707 18.1917 6.99816 18.2555C7.28925 18.3192 7.5813 18.3073 7.84846 18.2207M4.60413 9.08439C4.34991 9.11313 4.10817 9.21208 3.90033 9.37248C3.69248 9.53287 3.52494 9.74976 3.41254 10.0039C3.30015 10.2581 3.24637 10.5417 3.25598 10.8296C3.26558 11.1176 3.33826 11.4009 3.46759 11.6546C3.59693 11.9083 3.77891 12.1244 3.99743 12.284C4.21594 12.4435 4.46425 12.5415 4.72035 12.5692M4.2323 12.5166C3.98167 12.6883 3.7773 12.9192 3.63731 13.1889C3.49732 13.4586 3.42602 13.7588 3.42973 14.0628C3.43344 14.3669 3.51204 14.6653 3.65858 14.9319C3.80512 15.1984 4.01506 15.4247 4.26981 15.5908C4.52457 15.7569 4.81627 15.8577 5.11909 15.8841"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round" />
                                            <path
                                                d="M6.81095 11.1557C7.07666 11.1657 7.34042 11.1005 7.57886 10.966C7.81729 10.8315 8.02305 10.6317 8.17791 10.3845C8.33276 10.1373 8.43193 9.85015 8.46663 9.54859C8.50133 9.24703 8.4705 8.94033 8.37685 8.65567C8.2832 8.371 8.12964 8.11715 7.92975 7.9166"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M9.75952 13.4948C9.48278 13.4951 9.21656 13.5584 8.98442 13.6791C8.75229 13.7999 8.5614 13.9743 8.42868 14.187C8.29596 14.3996 8.2255 14.644 8.22353 14.8984"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M5.85216 12.9858C6.00355 12.9841 6.14853 13.0211 6.27426 13.0934C6.39999 13.1657 6.50259 13.2712 6.57298 13.4004C6.64336 13.5297 6.67936 13.6788 6.67778 13.8345"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M6.69052 6.44038C6.58139 6.40672 6.46473 6.40444 6.35087 6.43374C6.237 6.46304 6.12944 6.52303 6.03772 6.60838C5.946 6.69373 5.87295 6.80181 5.82503 6.92305C5.77712 7.04429 5.75582 7.17495 5.76303 7.30345C5.77023 7.43195 5.80572 7.55432 5.86635 7.65973"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M11.5756 19.3173V4.6643C11.5756 4.07226 11.4868 2.88818 12.9077 2.88818C14.2929 2.88818 14.5978 4.50874 13.8223 5.22205M11.5756 19.3173C13.1607 19.3173 13.6848 17.9027 13.148 16.9671M14.3605 4.14333C14.7632 4.06984 15.1794 4.11234 15.5724 4.26707C15.9655 4.4218 16.3231 4.68397 16.6137 5.03038C16.9043 5.37678 17.1189 5.79672 17.2384 6.253C17.3579 6.70927 17.3787 7.1878 17.299 7.64619C17.2193 8.10459 17.0414 8.5287 16.7812 8.88096C16.521 9.23322 16.1865 9.50275 15.8073 9.66569M15.8249 15.3516C15.9568 15.607 16.0224 15.9015 16.0159 16.2091C16.0094 16.5166 15.9311 16.8278 15.7878 17.115C15.6445 17.4021 15.4407 17.6565 15.1944 17.8554C14.9481 18.0543 14.667 18.1917 14.3759 18.2555C14.0848 18.3192 13.7927 18.3073 13.5256 18.2207M16.7699 9.08439C17.0241 9.11313 17.2659 9.21208 17.4737 9.37248C17.6815 9.53287 17.8491 9.74976 17.9615 10.0039C18.0739 10.2581 18.1276 10.5417 18.118 10.8296C18.1084 11.1176 18.0358 11.4009 17.9064 11.6546C17.7771 11.9083 17.5951 12.1244 17.3766 12.284C17.1581 12.4435 16.9098 12.5415 16.6537 12.5692M17.1417 12.5166C17.3924 12.6883 17.5967 12.9192 17.7367 13.1889C17.8767 13.4586 17.948 13.7588 17.9443 14.0628C17.9406 14.3669 17.862 14.6653 17.7154 14.9319C17.5689 15.1984 17.359 15.4247 17.1042 15.5908C16.8495 15.7569 16.5577 15.8577 16.2549 15.8841"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round" />
                                            <path
                                                d="M15.0266 10.9392C14.7664 10.9935 14.4954 10.9734 14.2378 10.8807C13.9802 10.788 13.7439 10.6256 13.5498 10.4077C13.3558 10.1899 13.2099 9.92346 13.1252 9.63197C13.0405 9.34048 13.0196 9.03295 13.0642 8.73662"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M13.701 15.0546C13.9775 15.0429 14.2409 14.9686 14.4679 14.8384C14.6948 14.7081 14.8783 14.526 15.0022 14.308C15.126 14.09 15.1863 13.843 15.1778 13.5888"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M13.2031 12.2782C13.1474 12.419 13.13 12.5676 13.1526 12.7109C13.1752 12.8541 13.237 12.9877 13.3326 13.0996C13.4281 13.2116 13.5545 13.2985 13.7004 13.3527"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M14.8553 6.75468C14.9599 6.80051 15.0497 6.87502 15.1167 6.9716C15.1838 7.06819 15.226 7.18388 15.2396 7.30843C15.2533 7.43297 15.238 7.56252 15.195 7.68561C15.152 7.80869 15.0828 7.92151 14.9934 8.01407C14.9039 8.10663 14.7971 8.17607 14.6823 8.21624"
                                                stroke="#00689C" stroke-width="0.88806" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={"icon2"}>
                                    <div className={"overlay"}></div>
                                    <div className={"content"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                             viewBox="0 0 20 20" fill="none">
                                            <path
                                                d="M15.546 8.26364L16.1811 7.62856C16.6862 7.12336 16.97 6.43816 16.97 5.72369C16.97 5.00922 16.6862 4.32402 16.1811 3.81881C15.6759 3.31361 14.9907 3.02979 14.2763 3.02979C13.5618 3.02979 12.8767 3.31361 12.3715 3.81881L11.7365 4.45388L5.89846 10.2908C5.50318 10.6868 5.30521 10.8848 5.13531 11.1026C4.93486 11.3599 4.76283 11.638 4.62221 11.9323C4.5037 12.1816 4.41533 12.4474 4.23858 12.9777L3.48914 15.2255M15.546 8.26364C15.546 8.26364 14.1972 8.18417 13.0065 6.99349C11.8159 5.8035 11.7371 4.45388 11.7371 4.45388M15.546 8.26364L9.70871 14.1006C9.31343 14.4958 9.11545 14.6938 8.89761 14.8637C8.64039 15.0642 8.36224 15.2362 8.06801 15.3769C7.81865 15.4954 7.55354 15.5838 7.02263 15.7605L4.77498 16.51M4.77498 16.51L4.22557 16.6936C4.0975 16.7365 3.95999 16.7429 3.8285 16.712C3.69701 16.6811 3.57675 16.6141 3.48124 16.5186C3.38573 16.4231 3.31875 16.3028 3.28783 16.1713C3.25691 16.0398 3.26329 15.9023 3.30623 15.7742L3.48982 15.2248L4.77498 16.51Z"
                                                stroke="black" stroke-width="1.14179" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={"icon3"}>
                                    <div className={"overlay"}></div>
                                    <div className={"content"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                             viewBox="0 0 18 18" fill="none">
                                            <path
                                                d="M13.8097 5.69897C14.7585 5.69897 15.5276 4.92984 15.5276 3.98108C15.5276 3.03231 14.7585 2.26318 13.8097 2.26318C12.8609 2.26318 12.0918 3.03231 12.0918 3.98108C12.0918 4.92984 12.8609 5.69897 13.8097 5.69897Z"
                                                stroke="#595959" stroke-width="1.23134" />
                                            <path
                                                d="M15.356 7.41695V11.0245C15.356 12.118 14.9216 13.1667 14.1484 13.9399C13.3752 14.7131 12.3265 15.1475 11.233 15.1475H6.7665C5.67302 15.1475 4.62434 14.7131 3.85114 13.9399C3.07793 13.1667 2.64355 12.118 2.64355 11.0245V6.558C2.64355 5.46453 3.07793 4.41584 3.85114 3.64264C4.62434 2.86944 5.67302 2.43506 6.7665 2.43506H10.3741"
                                                stroke="#595959" stroke-width="1.23134" stroke-linecap="round" />
                                            <path
                                                d="M5.74902 10.8832L7.2642 8.86709C7.35699 8.74294 7.49301 8.65815 7.64534 8.62952C7.79767 8.60088 7.9552 8.63049 8.08673 8.71248L9.56481 9.64633C9.70139 9.73331 9.86665 9.76325 10.0251 9.72971C10.1835 9.69618 10.3224 9.60185 10.4121 9.46698L11.9334 7.17188"
                                                stroke="#595959" stroke-width="1.23134" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                                <div className={"icon4"}>
                                    <div className={"overlay"}></div>
                                    <div className={"content"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19"
                                             viewBox="0 0 19 19" fill="none">
                                            <path
                                                d="M2.67578 9.91082C2.67578 6.5306 2.67578 4.83974 3.72578 3.78974C4.77577 2.73975 6.46588 2.73975 9.84685 2.73975C13.2271 2.73975 14.9179 2.73975 15.9679 3.78974C17.0179 4.83974 17.0179 6.52985 17.0179 9.91082C17.0179 13.291 17.0179 14.9819 15.9679 16.0319C14.9179 17.0819 13.2278 17.0819 9.84685 17.0819C6.46664 17.0819 4.77577 17.0819 3.72578 16.0319C2.67578 14.9819 2.67578 13.2918 2.67578 9.91082Z"
                                                stroke="#5B8700" stroke-width="1.29851" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                            <path
                                                d="M4.94043 10.2884L5.29898 10.0499C5.65603 9.81134 5.83493 9.69208 6.00703 9.74492C6.17838 9.79851 6.2584 9.99779 6.41843 10.3971L7.5824 13.3078L9.15853 8.57867C9.49066 7.58227 9.65673 7.08407 10.0523 6.79949C10.4478 6.51491 10.9732 6.51416 12.0232 6.51416H14.7535M13.6212 9.91098L12.4889 11.0433M12.4889 11.0433L11.3567 12.1755M12.4889 11.0433L13.6212 12.1755M12.4889 11.0433L11.3567 9.91098"
                                                stroke="#5B8700" stroke-width="1.29851" stroke-linecap="round"
                                                stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12"} style={{ textAlign: "end" }}>
                        <div className={"image"}>
                            <div className={"frame"}>
                                <img src={frame} alt="Frame" />
                            </div>
                            <div className={"mainImage"}>
                                <img src={offerImage} alt={offerName} />
                            </div>
                            <div className={"circleee"}>
                                <CircleTextAsterias />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conditional rendering based on subOffers */}
                {hasMultipleSubOffers ? (
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
                    <div className={"description-section row"}>
                        <img src={icon3} alt="Icon3" />
                        <div className={"col-12 description-column"}>
                            {offer?.subTitle && (
                                <div
                                    className="sub-title"
                                    dangerouslySetInnerHTML={{
                                        __html: i18n.language?.startsWith("en")
                                            ? offer?.subTitleEng || offer?.subTitle
                                            : i18n.language?.startsWith("ru")
                                                ? offer?.subTitleRu || offer?.subTitle
                                                : i18n.language?.startsWith("tr")
                                                    ? offer?.subTitleTur || offer?.subTitle
                                                    : offer?.subTitle
                                    }}
                                />
                            )}
                            <button onClick={() => navigate("/contact")}>
                                {t("servDetailOne.button") || "Əlaqə"}
                            </button>
                        </div>
                    </div>
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
    );
}

export default ServDetailPageOne;