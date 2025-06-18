// src/components/PhotoGallery/PhotoGallery.jsx
import React from 'react'
import Carousel from '../Carousel' // Mevcut Carousel’ini kullanıyoruz
import './index.scss'

export default function PhotoGallery({ images }) {
    return (
        <div className="photo-gallery">
            <h3 className="pg-title">Foto Qalereya</h3>
            <Carousel
                items={images?.map((src, i) => (
                    <div key={i} className="pg-item">
                        <img src={src} alt={`gallery-${i}`} />
                    </div>
                ))}
                curved={true}
                arrowPrevLabel="« Əvvəlki"
                arrowNextLabel="Sonrakı »"
            />
        </div>
    )
}
