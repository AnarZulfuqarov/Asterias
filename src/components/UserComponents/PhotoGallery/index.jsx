import React, { useState, useEffect } from 'react';
import './index.scss';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const PhotoGallery = ({ images }) => {
    const getVisibleCount = () => {
        const width = window.innerWidth;
        if (width < 576) return 1;
        if (width < 768) return 2;
        if (width < 992) return 3;
        return 6;
    };

    const positionClass = ['far-left', 'left', 'center-left', 'center-right', 'right', 'far-right'];
    const [visibleCount, setVisibleCount] = useState(getVisibleCount());
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            setVisibleCount(getVisibleCount());
            setCurrentIndex(0);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    while (positionClass.length < visibleCount) {
        positionClass.push('');
    }

    const visibleImages = images.slice(currentIndex, currentIndex + visibleCount);

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex + visibleCount < images.length) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="photo-gallery">
            <div className="gallery-header">
                <h2>Foto Qalereya</h2>
            </div>

            <div className="gallery-wrapper">
                {visibleCount <= 3 && (
                    <button className="nav-button left" onClick={handlePrev} disabled={currentIndex === 0}>
                        <FaChevronLeft />
                    </button>
                )}

                <div className="gallery-row">
                    {visibleImages.map((src, i) => (
                        <div
                            className={`gallery-item ${positionClass[i] || ''}`}
                            key={currentIndex + i}
                            onClick={() => {
                                if (i === 0 && currentIndex > 0) handlePrev();
                                if (i === visibleCount - 1 && currentIndex + visibleCount < images.length) handleNext();
                            }}
                        >
                            <img src={src} alt={`gallery-${currentIndex + i}`} />
                        </div>
                    ))}
                </div>

                {visibleCount <= 3 && (
                    <button className="nav-button right" onClick={handleNext} disabled={currentIndex + visibleCount >= images.length}>
                        <FaChevronRight />
                    </button>
                )}
            </div>
        </div>
    );
};

export default PhotoGallery;
