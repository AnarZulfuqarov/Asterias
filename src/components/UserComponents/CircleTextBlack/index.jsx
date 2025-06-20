import { useTranslation } from "react-i18next";
import "./index.scss";
import {useEffect, useState} from "react";

const CircleTextBlack = () => {
    const { t, i18n } = useTranslation();
    const circleText = t("circleTextBlack").split(" ").join(" * ");
    const [fontSize, setFontSize] = useState(16);
    const [textLength, setTextLength] = useState(350);

    useEffect(() => {
        const updateSize = () => {
            const width = window.innerWidth;
            let baseFont;
            let baseLength;

            if (i18n.language === "az") baseFont = 17;
            else if (i18n.language === "en") baseFont = 13.5;
            else baseFont = 12;

            if (width < 400) {
                setFontSize(baseFont * 0.75);
                setTextLength(280); // extra small
            } else if (width < 768) {
                setFontSize(baseFont * 0.9);
                setTextLength(320); // small devices
            } else {
                setFontSize(baseFont);
                setTextLength(350); // default
            }
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, [i18n.language]);
    return (
        <div className="circle-text-wrapperr-black">
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
                    fontSize={fontSize}
                    letterSpacing="1.4"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                >
                    <textPath
                        href="#circlePathBlack"
                        startOffset="50%"
                        textAnchor="middle"
                        textLength={textLength}
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
