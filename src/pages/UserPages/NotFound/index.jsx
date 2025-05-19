import image from "/src/assets/NotFound.png";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NotFound(props) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <div id={"notFound"}>
            <div className={"notFound"}>
                <div className={"image"}>
                    <img src={image} alt="Not Found" />
                </div>
                <div className={"notFoundContent"}>
                    <h3>{t('notFound.header')}</h3>
                    <p>{t('notFound.description')}</p>
                </div>
                <button onClick={() => navigate("/")}>
                    {t('notFound.button')}
                </button>
            </div>
        </div>
    );
}

export default NotFound;