import './index.scss';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import {useState} from "react";

const Carousel = ({ images, visibleCount = 5, gap = 120 }) => {
    const [currentIndex, setCurrentIndex] = useState(Math.floor(images?.length / 2));

    const prev = () => {
        setCurrentIndex(i => (i - 1 + images?.length) % images?.length);
    };
    const next = () => {
        setCurrentIndex(i => (i + 1) % images?.length);
    };

    return (
        <div className="carousel-container">
            <button className="nav left" onClick={prev}><FaChevronLeft /></button>
            <div className="carousel">
                {images?.map((src, i) => {
                    const diff = i - currentIndex;
                    // dönüştürme: merkezde diff=0 → ölçek 1, kenarlarda büyür
                    const scale = 1 + Math.max(0, (visibleCount / 2 - Math.abs(diff))) * 0.15;
                    const zIndex = visibleCount - Math.abs(diff);
                    const translateX = diff * gap;
                    const isEdge = Math.abs(diff) === Math.floor(visibleCount / 2);

                    return (
                        <div
                            key={i}
                            className={`item ${isEdge ? 'edge' : ''}`}
                            style={{
                                transform: `translateX(${translateX}px) scale(${scale})`,
                                zIndex,
                            }}
                        >
                            <img src={src} alt={`slide-${i}`} />
                            {isEdge && (
                                <div className="overlay">
                                    {diff > 0 ? <FaChevronRight /> : <FaChevronLeft />}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <button className="nav right" onClick={next}><FaChevronRight /></button>
        </div>
    );
};

export default Carousel;
