import React, { useState, useEffect } from 'react';
import './index.scss';

export default function PartnerBubbles({ logos }) {
    const [positions, setPositions] = useState([]);

    const calculatePositions = (total) => {
        const newPositions = [];
        const maxAttempts = 300;
        const containerWidth = 1000; // px
        const containerHeight = 400; // px

        for (let i = 0; i < total; i++) {
            let top, left, size;
            let overlap = false;
            let attempts = 0;

            do {
                size = Math.floor(Math.random() * 40) + 60; // 60-100px
                top = Math.random() * (containerHeight - size);
                left = Math.random() * (containerWidth - size);

                overlap = false;
                for (let j = 0; j < newPositions.length; j++) {
                    const pos = newPositions[j];
                    const dx = pos.left - left;
                    const dy = pos.top - top;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const minDist = (pos.size + size) / 1.5; // Hafif boşluk bırak

                    if (distance < minDist) {
                        overlap = true;
                        break;
                    }
                }

                attempts++;
            } while (overlap && attempts < maxAttempts);

            if (!overlap) {
                newPositions.push({ top, left, size });
            } else {
                // fallback: düzgün sırayla koy
                newPositions.push({ top: (i * 100) % containerHeight, left: (i * 120) % containerWidth, size: 80 });
            }
        }

        setPositions(newPositions);
    };



    useEffect(() => {
        if (logos?.length) {
            calculatePositions(logos.length);
        }
    }, [logos]);

    const bubbleStyle = (index) => {
        if (!positions[index]) return {};

        const { top, left, size } = positions[index];
        const delay = (index % 5) * 0.5; // 0s - 2s arasında farklı delay

        return {
            position: 'absolute',
            top: `${top}px`,
            left: `${left}px`,
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            animationDelay: `${delay}s`,
        };
    };



    return (
        <div className="partner-bubbles">
            <div className="container">
                <div className="row" style={{justifyContent:"space-between"}}>
                    <div className="col-5 col-md-12 col-sm-12 col-xs-12">
                        <div className="content">
                            <h2>Tərəfdaşlarımızla Güclüyük</h2>
                            <p>
                                Birgə əməkdaşlıqla daha möhkəm addımlar atır, hər layihədə qarşılıqlı dəyər yaradırıq.
                            </p>
                        </div>
                    </div>
                    <div className="col-6 col-md-12 col-sm-12 col-xs-12 sponsorr" style={{ position: 'relative', height: '400px' }}>
                        {logos?.map((logo, i) => (
                            <div key={i} className="bubble" style={bubbleStyle(i)}>
                                <img src={logo} alt={`partner-${i}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}