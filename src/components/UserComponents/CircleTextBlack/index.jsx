import { useTranslation } from "react-i18next";
import "./index.scss";

const CircleTextBlack = () => {
    const { t, i18n } = useTranslation();
    const circleText = t("circleTextBlack").split(" ").join(" * ");
    const baseSize = i18n.language === "az" ? 17 : i18n.language === "en" ? 13.5 : 12;

    return (
        <div className="circle-text-wrapperr">
            <svg
                className="circle-text-svg"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Siyah arka plan */}
                <circle cx="100" cy="100" r="80" fill="#000" />

                <defs>
                    <path
                        id="circlePathBlack"
                        d="
              M100,100
              m-55,0
              a55,55 0 1,1 110,0
              a55,55 0 1,1 -110,0
            "
                        fill="none"
                        pathLength="345"
                    />
                </defs>

                <text
                    fill="#fff"
                    fontSize={baseSize}
                    letterSpacing="1.4"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                >
                    <textPath
                        href="#circlePathBlack"
                        startOffset="50%"
                        textAnchor="middle"
                        textLength="345"
                        lengthAdjust="spacingAndGlyphs"
                        dy="1"
                    >
                        {circleText}
                    </textPath>
                </text>
            </svg>

            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="43"
                height="43"
                viewBox="0 0 43 43"
                fill="none"
                className="center-icon"
            >
                <g clipPath="url(#clip0_142_790)">
                    <path
                        d="M31.0852 27.6483L33.7492 15.4299M33.7492 15.4299L22.4137 10.1488M33.7492 15.4299L9.24995 27.57"
                        stroke="white"
                        strokeWidth="1.95301"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
                <defs>
                    <clipPath id="clip0_142_790">
                        <rect
                            width="31.2482"
                            height="31.2482"
                            transform="translate(42.4365 28.562) rotate(153.64)"
                        />
                    </clipPath>
                </defs>
            </svg>
        </div>
    );
};

export default CircleTextBlack;
