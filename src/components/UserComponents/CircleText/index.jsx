import {useTranslation} from "react-i18next";
import {FaPhone} from "react-icons/fa";
import "./index.scss";
import {useNavigate} from "react-router";

const CircleText = () => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();

    // Yıldızlarla birleştirilmiş metin
    const circleText = t("circleText").split(" ").join(" * ");
    const baseSize = i18n.language === "az" ? 17 : i18n.language === "en" ? 15 : 15;

    return (
        <div
            className="circle-text-wrapper"
            onClick={() => navigate("/contact")}
            style={{cursor: "pointer"}}
        >
            <svg
                className="circle-text-svg"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                <circle cx="100" cy="100" r="80" fill="#AFFBA9"/>

                <defs>
                    <path
                        id="circlePath"
                        d="
              M100,100
              m-50,0
              a50,50 0 1,1 100,0
              a50,50 0 1,1 -100,0
            "
                        fill="none"
                        pathLength="314"
                    />
                </defs>

                <text
                    fill="#000"
                    fontSize={baseSize}
                    letterSpacing="1.4"
                    fontFamily="sans-serif"
                    fontWeight="italis"
                >
                    <textPath
                        href="#circlePath"
                        startOffset="50%"
                        textAnchor="middle"
                        textLength="314"
                        lengthAdjust="spacingAndGlyphs"
                        dy="0"
                    >
                        {circleText}
                    </textPath>
                </text>
            </svg>
            <FaPhone className="center-icon"/>
        </div>
    );
};

export default CircleText;
