import {useState} from 'react';
import './index.scss';
import {FaChevronDown} from "react-icons/fa";
import flagAz from "../../assets/azerbaijan.png";
import flagEn from "../../assets/uk.png";
import flagRu from "../../assets/circle.png";
import flagTr from "../../assets/turkey.png";
import {useTranslation} from "react-i18next";
import logo from "/src/assets/logo.png"
function Navbar() {
    const { t, i18n } = useTranslation();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    const [langTimeoutId, setLangTimeoutId] = useState(null);
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
    } else if (i18n.language?.startsWith('tr')) { // Türkçe için ekleme
        currentTitle = "Tr";
        currentFlag = flagTr;
    } else if (i18n.language?.startsWith('az')) {
        currentTitle = "Az";
        currentFlag = flagAz;
    }
    const toggleLangDropdown = () => {
        setLangDropdownOpen(!langDropdownOpen);
    };
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
        <div className={"navbarWrapper"}>
            <div className={"container"}>
                <section id="navbar">
                    <div className={"icon"}>
                        <img src={logo} alt="logo" />
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
                                <div onClick={() => handleLanguageChange('tr')}>
                                    <img src={flagTr} alt="TR Flag" /> {t('navbar.languages.tr')}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Navbar;
