import React, { useState } from 'react';
import './index.scss';

const PhotoGallery = ({ images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const visibleImages = images.slice(currentIndex, currentIndex + 6);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex + 6 < images.length) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="photo-gallery">
            <h2>Foto Qalereya</h2>
            <div className="gallery-row">
                {visibleImages.map((image, i) => {
                    const positionClass = ['far-left', 'left', 'center-left', 'center-right', 'right', 'far-right'];

                    return (
                        <div className={`gallery-item ${positionClass[i]}`} key={i}>
                            <img src={image} alt={`img-${i}`} />
                            {i === 0 && <button className="nav-btn left" onClick={handlePrev}>Əvvəlki</button>}
                            {i === 5 && <button className="nav-btn right" onClick={handleNext}>Sonraki</button>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PhotoGallery;
