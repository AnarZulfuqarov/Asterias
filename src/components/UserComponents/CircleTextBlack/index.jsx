import { useTranslation } from "react-i18next";
import { FaPhone } from "react-icons/fa"; // Changed to phone icon
import "./index.scss";

const CircleTextBlack = () => {
    const { t } = useTranslation();
    return (
        <div className="circle-text-wrapperr" >
            <svg
                className="circle-text-svg"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Add a filled circle for the background */}
                <circle cx="100" cy="100" r="80" fill="#000000" /> {/* Light green background */}

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
                <text
                    fill="#fff"
                    fontSize={
                        localStorage.getItem("sssLanguage") === "az"
                            ? "13"
                            : localStorage.getItem("sssLanguage") === "en"
                                ? "13.5"
                                : "11"
                    }
                    letterSpacing="1.6"
                    fontFamily="sans-serif"
                    fontWeight="bold" // Added for bold text
                >
                    <textPath
                        xlinkHref="#circlePath"
                        startOffset="50%"
                        textAnchor="middle"
                    >
                        {t("circleText").replace(/\s/g, " * ")} {/* Add stars between words */}
                    </textPath>
                </text>
            </svg>

            {/* Phone icon in the center */}
            <svg xmlns="http://www.w3.org/2000/svg" width="43" height="43" viewBox="0 0 43 43" fill="none" className="center-icon">
                <g clip-path="url(#clip0_142_790)">
                    <path d="M31.0852 27.6483L33.7492 15.4299M33.7492 15.4299L22.4137 10.1488M33.7492 15.4299L9.24995 27.57" stroke="white" stroke-width="1.95301" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                    <clipPath id="clip0_142_790">
                        <rect width="31.2482" height="31.2482" fill="white" transform="translate(42.4365 28.562) rotate(153.64)"/>
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};

export default CircleTextBlack;