import { useTranslation } from "react-i18next";
import { FaPhone } from "react-icons/fa";
import "./index.scss";
import { useNavigate } from "react-router";

const CircleText = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    return (
        <div className="circle-text-wrapper" onClick={() => navigate("/contact")} style={{ cursor: "pointer" }}>
            <svg
                className="circle-text-svg"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Add a filled circle for the background */}
                <circle cx="100" cy="100" r="80" fill="#AFFBA9" /> {/* Light green background */}

                <defs>
                    {/* Circular path for the text */}
                    <path
                        id="circlePath"
                        d="
                            M 100,100
                            m -70,0
                            a 70,70 0 1,1 140,0
                            a 70,70 0 1,1 -140,0
                        "
                    />
                </defs>

                {/* Text along the circular path */}
                {/*<text*/}
                {/*    fill="#333"*/}
                {/*    fontSize={*/}
                {/*        localStorage.getItem("sssLanguage") === "az"*/}
                {/*            ? "13"*/}
                {/*            : localStorage.getItem("sssLanguage") === "en"*/}
                {/*                ? "13.5"*/}
                {/*                : "11"*/}
                {/*    }*/}
                {/*    letterSpacing="1.4" // Adjusted for tighter spacing*/}
                {/*    fontFamily="sans-serif"*/}
                {/*    fontWeight="bold"*/}
                {/*>*/}
                {/*    <textPath*/}
                {/*        xlinkHref="#circlePath"*/}
                {/*        startOffset="48%" // Slight adjustment for better text positioning*/}
                {/*        textAnchor="middle"*/}
                {/*    >*/}
                {/*        {t("circleText").replace(/\s/g, " * ")} /!* Add stars between words *!/*/}
                {/*    </textPath>*/}
                {/*</text>*/}
            </svg>

            {/* Phone icon in the center */}
            <FaPhone className="center-icon" />
        </div>
    );
};

export default CircleText;