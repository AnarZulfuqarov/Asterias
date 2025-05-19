import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import CircleText from "../../../components/UserComponents/CircleText/index.jsx";
import image1 from "/src/assets/Blobs 24px.svg";
import image2 from "/src/assets/Color.png";
import star from "/src/assets/Mask group.svg";
import starBack from "/src/assets/starBack.png";
import arrowBack from "/src/assets/arrowBack.png";
import { useTranslation } from 'react-i18next';
import flagAz from '/src/assets/azerbaijan.png';
import flagEn from '/src/assets/uk.png';
import flagRu from '/src/assets/circle.png';
import { FaChevronDown } from "react-icons/fa";

function HomePage() {
    const [rotation, setRotation] = useState(0);
    const [segments, setSegments] = useState([]);
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [langTimeoutId, setLangTimeoutId] = useState(null);

    const fetchSegments = () => {
        const backendResponse = {
            labels: [
                t('homepage.segments.training'),
                t('homepage.segments.coaching'),
                t('homepage.segments.public_speaking'),
                t('homepage.segments.leadership'),
                t('homepage.segments.team_building'),
                t('homepage.segments.team_building'),
                t('homepage.segments.team_building'),
                t('homepage.segments.team_building'),
                t('homepage.segments.team_building'),
            ],
            colors: [
                "#FF6F61",
                "#FF9800",
                "#FFD700",
                "#4CAF50",
                "#2196F3",
                "#2196F3",
            ],
            types: [1, 2, 1, 2, 1, 2, 1, 2, 1],
        };

        const defaultColors = [
            "#FF6F61",
            "#FF9800",
            "#FFD700",
            "#4CAF50",
            "#2196F3",
            "#9C27B0",
            "#00BCD4",
            "#E91E63",
            "#FF5722",
        ];
        const segmentCount = backendResponse.labels.length;
        const colors = backendResponse.colors.length >= segmentCount
            ? backendResponse.colors
            : Array(segmentCount).fill().map((_, i) => defaultColors[i % defaultColors.length]);

        setSegments(
            backendResponse.labels.map((label, index) => ({
                label,
                color: colors[index],
                type: backendResponse.types[index],
            }))
        );
    };

    useEffect(() => {
        fetchSegments();
    }, [t]);

    useEffect(() => {
        const animate = () => {
            setRotation((prev) => (prev + 0.5) % 360);
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, []);

    const segmentAngle = segments.length > 0 ? 360 / segments.length : 0;
    const toggleLangDropdown = () => {
        setLangDropdownOpen(!langDropdownOpen);
    };

    const handleSegmentClick = (id, type) => {
        if (type === 1) {
            navigate(`/serviceDetailOne/${encodeURIComponent(id)}`);
        } else if (type === 2) {
            navigate(`/serviceDetailTwo/${encodeURIComponent(id)}`);
        } else {
            console.error("Invalid segment type:", type);
        }
    };

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('asteriasLang', lng);
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

    return (
        <div id="homePage">
            <div className="head-text">
                <h1>
                    {t('homepage.title1')} <img src={image1} alt="icon" /> {t('homepage.title1.2')}
                </h1>
                <h1>
                    {t('homepage.title2')} <img src={image2} alt="icon2" /> {t('homepage.title2.2')}
                </h1>
            </div>
            <div className="arrow">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="10vw"
                    height="7.83vw"
                    viewBox="0 0 180 141"
                    fill="none"
                >
                    <g clipPath="url(#clip0_189_538)">
                        <path
                            d="M126.922 64.7057C123.053 66.7513 118.534 66.4017 114.855 64.4697C110.778 62.3312 108.197 58.7024 106.948 54.4568C105.452 49.3872 105.862 43.893 107.012 38.6912C108.002 34.2005 109.526 29.7565 111.605 25.5716C115.564 17.5961 121.982 9.67773 130.774 6.17672C134.906 4.52748 139.512 3.88084 143.675 5.37482C147.839 6.8688 150.632 10.0787 152.478 13.6945C156.816 22.2271 156.557 32.7499 155.085 42.1279C153.571 51.8026 150.346 61.4086 146.082 70.3998C137.576 88.3028 123.825 104.304 105.341 113.633C95.8493 118.424 85.3304 121.401 74.7434 121.749C64.0804 122.096 53.6319 119.912 43.5902 117.108C41.0798 116.407 38.5911 115.648 36.1086 114.877C34.8261 114.481 34.8651 110.559 36.3918 111.006C45.8186 113.743 55.375 116.453 65.2974 117.372C75.2198 118.290 85.1135 117.16 94.6298 113.937C113.252 107.631 128.484 94.2744 138.619 78.2477C143.458 70.5941 147.209 62.3129 149.885 53.8214C152.719 44.8504 154.513 35.475 153.634 26.2422C152.929 18.7838 149.623 9.9043 140.778 8.70281C131.934 7.50132 123.944 13.5526 118.815 19.7349C113.212 26.5021 109.621 35.0462 108.398 43.4293C107.74 47.9493 107.898 52.8541 110.531 56.6849C112.642 59.762 116.476 62.0293 120.427 62.2647C122.401 62.378 124.349 62.0085 126.115 61.0824C127.493 60.3583 128.13 64.1039 126.922 64.7358L126.922 64.7057Z"
                            fill="black"
                        />
                        <path
                            d="M38.0888 123.065L22.3612 113.596C21.413 113.028 21.1158 111.067 21.8785 110.186C23.4414 108.38 25.6172 107.606 27.886 106.968C30.6887 106.176 33.5109 105.437 36.3236 104.702C41.9901 103.226 47.6695 101.785 53.3688 100.458C54.5953 100.171 54.981 103.727 53.6284 104.081C48.278 105.481 42.9109 106.778 37.5605 108.178C34.9722 108.852 32.3809 109.547 29.7992 110.268C27.4799 110.914 24.7543 111.447 23.1128 113.332L22.6301 109.922L38.3512 119.372C39.0925 119.815 39.2778 120.822 39.2144 121.619C39.1855 121.981 38.8207 123.511 38.0793 123.068L38.0888 123.065Z"
                            fill="black"
                        />
                    </g>
                    <defs>
                        <clipPath id="clip0_189_538">
                            <rect
                                width="92.7757"
                                height="157.03"
                                fill="white"
                                transform="matrix(-0.342927 -0.939362 -0.939362 0.342927 179.508 87.1499)"
                            />
                        </clipPath>
                    </defs>
                </svg>
            </div>
            <div className="spinner-container">
                <div className="spinner">
                    {segments.map((segment, index) => (
                        <div
                            key={index}
                            className="segment"
                            style={{
                                backgroundColor: segment.color,
                                transform: `rotate(${index * segmentAngle + rotation}deg)`,
                                filter: `drop-shadow(0.3vw 0.3vw 0.5vw ${segment.color}80)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                            onClick={() => handleSegmentClick(segment.label, segment.type)}
                        >
                            <span
                                className="segment-label"
                                style={{
                                    marginLeft: "0",
                                    marginTop: "3.3vw",
                                    rotate: `${-segmentAngle / 2}deg`,
                                    width: "10vw",
                                    transform: segments.length > 9 ? "rotate(-15deg)" : undefined,
                                }}
                            >
                                {segment.label}
                            </span>
                        </div>
                    ))}
                    <div className="center-circle">
                        <div className="circleFirst">
                            <div className="circleSecond">
                                <span>{t('homepage.center_text')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <img src={star} className="star" alt="star" />
            <img src={starBack} className="starBack" alt="starBack" />
            <img src={arrowBack} className="arrow-back" alt="arrowBack" />
            <div className={`head lang-${i18n.language}`}>
                <div className="hr"></div>
                <h5>{t('homepage.more_info')}</h5>
                <CircleText />
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
                    <div className={`dropdown-content ${langDropdownOpen ? 'show' : ''}`}>
                        <div onClick={() => handleLanguageChange('az')}>
                            <img src={flagAz} alt="AZ Flag" /> {t('navbar.languages.az')}
                        </div>
                        <div onClick={() => handleLanguageChange('en')}>
                            <img src={flagEn} alt="EN Flag" /> {t('navbar.languages.en')}
                        </div>
                        <div onClick={() => handleLanguageChange('ru')}>
                            <img src={flagRu} alt="RU Flag" /> {t('navbar.languages.ru')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;