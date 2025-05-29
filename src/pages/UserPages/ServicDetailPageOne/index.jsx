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
import elli1 from "../../../assets/Decoration1.png";
import { useGetOffersByIdQuery } from "../../../services/userApi.jsx";
import {OFFER_IMAGES} from "../../../contants.js";
import CircleTextAsterias from "../../../components/UserComponents/CircleTextWhite/index.jsx";

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
    if (i18n.language?.startsWith('en')) {
        currentTitle = "En";
        currentFlag = flagEn;
    } else if (i18n.language?.startsWith('ru')) {
        currentTitle = "Ru";
        currentFlag = flagRu;
    } else if (i18n.language?.startsWith('tr')) { // Türkçe için ekleme
        currentTitle = "Tr";
        currentFlag = flagTr;
    } else if (i18n.language?.startsWith('az')) {
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

    // Determine the text based on the current language
    // Determine the text based on the current language
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

    // Construct the image URL for the offer
    const offerImage = offer.offerImageNames?.[0]
        ? `${offer.offerImageNames[0]}`
        : main; // Fallback to default image if none provided

    return (
        <div id={"servDetailOne"}>
            <img className={"elli"} src={elli} />
            <img className={"elli1"} src={elli1} />
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
                                <div
                                    className={"function1"}
                                    style={{
                                        width:
                                            i18n.language === "az"
                                                ? "224px"
                                                : i18n.language === "en"
                                                    ? "224px"
                                                    : "300px",
                                    }}
                                >
                                    <div className={"overlay"}></div>
                                    <div className={"content"}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M6.8076 0C7.03038 0 7.24404 0.0884998 7.40157 0.24603C7.5591 0.403561 7.6476 0.617218 7.6476 0.84V2.4108H16.668V0.8508C16.668 0.628018 16.7565 0.414361 16.914 0.25683C17.0716 0.0992998 17.2852 0.0108 17.508 0.0108C17.7308 0.0108 17.9444 0.0992998 18.102 0.25683C18.2595 0.414361 18.348 0.628018 18.348 0.8508V2.4108H21.6C22.2363 2.4108 22.8466 2.66349 23.2966 3.11332C23.7467 3.56315 23.9997 4.17329 24 4.8096V21.6012C23.9997 22.2375 23.7467 22.8477 23.2966 23.2975C22.8466 23.7473 22.2363 24 21.6 24H2.4C1.76369 24 1.15342 23.7473 0.703368 23.2975C0.253315 22.8477 0.000318156 22.2375 0 21.6012L0 4.8096C0.000318156 4.17329 0.253315 3.56315 0.703368 3.11332C1.15342 2.66349 1.76369 2.4108 2.4 2.4108H5.9676V0.8388C5.96792 0.616226 6.05656 0.402877 6.21405 0.245606C6.37155 0.0883348 6.58503 -2.27116e-07 6.8076 0ZM1.68 9.2904V21.6012C1.68 21.6958 1.69862 21.7894 1.73481 21.8767C1.77099 21.9641 1.82403 22.0435 1.89088 22.1103C1.95774 22.1772 2.03711 22.2302 2.12447 22.2664C2.21182 22.3026 2.30545 22.3212 2.4 22.3212H21.6C21.6946 22.3212 21.7882 22.3026 21.8755 22.2664C21.9629 22.2302 22.0423 22.1772 22.1091 22.1103C22.176 22.0435 22.229 21.9641 22.2652 21.8767C22.3014 21.7894 22.32 21.6958 22.32 21.6012V9.3072L1.68 9.2904ZM8.0004 17.5428V19.542H6V17.5428H8.0004ZM12.9996 17.5428V19.542H11.0004V17.5428H12.9996ZM18 17.5428V19.542H15.9996V17.5428H18ZM8.0004 12.7704V14.7696H6V12.7704H8.0004ZM12.9996 12.7704V14.7696H11.0004V12.7704H12.9996ZM18 12.7704V14.7696H15.9996V12.7704H18ZM5.9676 4.0896H2.4C2.30545 4.0896 2.21182 4.10822 2.12447 4.14441C2.03711 4.18059 1.95774 4.23362 1.89088 4.30048C1.82403 4.36734 1.77099 4.44671 1.73481 4.53407C1.69862 4.62142 1.68 4.71505 1.68 4.8096V7.6116L22.32 7.6284V4.8096C22.32 4.71505 22.3014 4.62142 22.2652 4.53407C22.229 4.44671 22.176 4.36734 22.1091 4.30048C22.0423 4.23362 21.9629 4.18059 21.8755 4.14441C21.7882 4.10822 21.6946 4.0896 21.6 4.0896H18.348V5.2044C18.348 5.42718 18.2595 5.64084 18.102 5.79837C17.9444 5.9559 17.7308 6.0444 17.508 6.0444C17.2852 6.0444 17.0716 5.9559 16.914 5.79837C16.7565 5.64084 16.668 5.42718 16.668 5.2044V4.0896H7.6476V5.1936C7.6476 5.41638 7.5591 5.63004 7.40157 5.78757C7.24404 5.9451 7.03038 6.0336 6.8076 6.0336C6.58482 6.0336 6.37116 5.9451 6.21363 5.78757C6.0561 5.63004 5.9676 5.41638 5.9676 5.1936V4.0896Z"
                                                fill="#848484"
                                            />
                                        </svg>
                                        {t("servDetailOne.functions.duration_label")} :
                                        <span>{offerPeriod}</span>
                                    </div>
                                </div>
                                <div className={"function2"}>
                                    <div className={"overlay"}></div>
                                    <div className={"content"}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                            <path d="M6 8.5C6 7.83696 6.26339 7.20107 6.73223 6.73223C7.20107 6.26339 7.83696 6 8.5 6C9.16304 6 9.79893 6.26339 10.2678 6.73223C10.7366 7.20107 11 7.83696 11 8.5C11 9.16304 10.7366 9.79893 10.2678 10.2678C9.79893 10.7366 9.16304 11 8.5 11C7.83696 11 7.20107 10.7366 6.73223 10.2678C6.26339 9.79893 6 9.16304 6 8.5ZM8.5 4.5C7.43913 4.5 6.42172 4.92143 5.67157 5.67157C4.92143 6.42172 4.5 7.43913 4.5 8.5C4.5 9.56087 4.92143 10.5783 5.67157 11.3284C6.42172 12.0786 7.43913 12.5 8.5 12.5C9.56087 12.5 10.5783 12.0786 11.3284 11.3284C12.0786 10.5783 12.5 9.56087 12.5 8.5C12.5 7.43913 12.0786 6.42172 11.3284 5.67157C10.5783 4.92143 9.56087 4.5 8.5 4.5ZM16 9.5C16 9.10218 16.158 8.72064 16.4393 8.43934C16.7206 8.15804 17.1022 8 17.5 8C17.8978 8 18.2794 8.15804 18.5607 8.43934C18.842 8.72064 19 9.10218 19 9.5C19 9.89782 18.842 10.2794 18.5607 10.5607C18.2794 10.842 17.8978 11 17.5 11C17.1022 11 16.7206 10.842 16.4393 10.5607C16.158 10.2794 16 9.89782 16 9.5ZM17.5 6.5C16.7044 6.5 15.9413 6.81607 15.3787 7.37868C14.8161 7.94129 14.5 8.70435 14.5 9.5C14.5 10.2956 14.8161 11.0587 15.3787 11.6213C15.9413 12.1839 16.7044 12.5 17.5 12.5C18.2956 12.5 19.0587 12.1839 19.6213 11.6213C20.1839 11.0587 20.5 10.2956 20.5 9.5C20.5 8.70435 20.1839 7.94129 19.6213 7.37868C19.0587 6.81607 18.2956 6.5 17.5 6.5ZM4.75 14.5C4.15326 14.5 3.58097 14.7371 3.15901 15.159C2.73705 15.581 2.5 16.1533 2.5 16.75V17.028C2.50105 17.0975 2.50572 17.167 2.514 17.236C2.59712 17.98 2.86453 18.6915 3.292 19.306C4.11 20.474 5.672 21.5 8.5 21.5C9.876 21.5 10.953 21.257 11.79 20.873C11.5109 20.4542 11.3009 19.9934 11.168 19.508C10.542 19.798 9.683 20 8.5 20C6.078 20 5.014 19.15 4.52 18.445C4.24041 18.0412 4.06425 17.5748 4.007 17.087L4 17.007V16.75C4 16.5511 4.07902 16.3603 4.21967 16.2197C4.36032 16.079 4.55109 16 4.75 16H11.566C11.8658 15.4455 12.2719 14.9555 12.761 14.558C12.5934 14.5196 12.422 14.5002 12.25 14.5H4.75ZM23 18.25C23 17.2554 22.6049 16.3016 21.9017 15.5983C21.1984 14.8951 20.2446 14.5 19.25 14.5L19.148 14.507C18.9598 14.5329 18.7883 14.6293 18.6684 14.7767C18.5485 14.9241 18.489 15.1115 18.502 15.3011C18.5149 15.4907 18.5994 15.6683 18.7382 15.798C18.8771 15.9278 19.06 15.9999 19.25 16L19.404 16.005C19.9868 16.0439 20.5317 16.3079 20.9233 16.7413C21.315 17.1746 21.5228 17.7433 21.5028 18.327C21.4828 18.9108 21.2366 19.4639 20.8162 19.8694C20.3958 20.275 19.8341 20.5011 19.25 20.5L19.247 20.505L19.145 20.512C18.9562 20.5379 18.7844 20.6348 18.6644 20.7828C18.5444 20.9309 18.4853 21.1191 18.499 21.3091C18.5128 21.4992 18.5984 21.6769 18.7384 21.8062C18.8784 21.9354 19.0624 22.0065 19.253 22.005V22L19.453 21.995C20.4111 21.9431 21.3128 21.5258 21.9726 20.8292C22.6325 20.1326 23.0001 19.2095 23 18.25ZM16.5 15.25C16.5 15.0511 16.421 14.8603 16.2803 14.7197C16.1397 14.579 15.9489 14.5 15.75 14.5L15.55 14.505C14.5729 14.5555 13.6543 14.9858 12.9901 15.7042C12.3259 16.4225 11.9687 17.372 11.9948 18.35C12.0209 19.3281 12.4282 20.2572 13.1298 20.9391C13.8313 21.621 14.7716 22.0017 15.75 22L15.852 21.993C16.0402 21.9671 16.2117 21.8707 16.3316 21.7233C16.4515 21.5759 16.511 21.3885 16.498 21.1989C16.4851 21.0093 16.4006 20.8317 16.2618 20.702C16.1229 20.5722 15.94 20.5001 15.75 20.5L15.596 20.495C15.0132 20.4561 14.4683 20.1921 14.0767 19.7587C13.685 19.3254 13.4772 18.7567 13.4972 18.173C13.5172 17.5892 13.7634 17.0361 14.1838 16.6306C14.6042 16.225 15.1659 15.9989 15.75 16L15.852 15.993C16.0316 15.9684 16.1961 15.8795 16.3152 15.7429C16.4344 15.6063 16.5 15.4312 16.5 15.25ZM20 18.25C20 18.0511 19.921 17.8603 19.7803 17.7197C19.6397 17.579 19.4489 17.5 19.25 17.5H15.75L15.648 17.507C15.4598 17.5329 15.2883 17.6293 15.1684 17.7767C15.0485 17.9241 14.989 18.1115 15.002 18.3011C15.0149 18.4907 15.0994 18.6683 15.2382 18.798C15.3771 18.9278 15.56 18.9999 15.75 19H19.25L19.352 18.993C19.5316 18.9684 19.6961 18.8795 19.8152 18.7429C19.9344 18.6063 20 18.4312 20 18.25Z" fill="#676767"/>
                                        </svg>
                                        {t("servDetailOne.functions.age_label")} :
                                        <span>{offerAgeLimit}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => navigate("/contact")}>
                                {t("servDetailOne.button")}
                            </button>
                        </div>
                    </div>
                    <div className={"col-6 col-md-12 col-sm-12 col-xs-12"} style={{textAlign: "end"}}>
                        <div className={"image"}>
                            <div className={"frame"}>
                                <img src={frame} alt="Frame" />
                            </div>
                            <div className={"mainImage"}>
                                <img src={OFFER_IMAGES + offerImage} alt={offerName} />
                            </div>
                            <div className={"circleee"}>
                                <CircleTextAsterias/>
                            </div>
                        </div>
                    </div>
                </div>
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
                        <div onClick={() => handleLanguageChange('tr')}>
                            <img src={flagTr} alt="TR Flag" /> {t('navbar.languages.tr')}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ServDetailPageOne;