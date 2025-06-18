import './index.scss'
import CircleText from "../../CircleText/index.jsx";

function Footer() {
    return (
        <section id={"footer"}>
            <div className={"text"}>
                <div className={"line"}></div>
                <span>Daha ətraflı məlumat üçün</span>
            </div>
            <CircleText/>
        </section>
    );
}

export default Footer;