import {useState} from 'react';
import './index.scss';
import flag from '/src/assets/usa.png';
import {FaChevronDown} from "react-icons/fa";

function Navbar() {
    const [open, setOpen] = useState(false);
    const [language, setLanguage] = useState('En');

    const handleSelect = (lang) => {
        setLanguage(lang);
        setOpen(false);
    };

    return (
        <div className={"navbarWrapper"}>
            <div className={"container"}>
                <section id="navbar">
                    <div className="language-selector" onClick={() => setOpen(!open)}>
                        <img src={flag} alt="flag"/>
                        <span>{language}</span>
                        <FaChevronDown className={"arrow"}/>
                        {open && (
                            <div className="dropdown">
                                <div onClick={() => handleSelect('En')}>English</div>
                                <div onClick={() => handleSelect('Az')}>Azərbaycan</div>
                                <div onClick={() => handleSelect('Ru')}>Русский</div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Navbar;
