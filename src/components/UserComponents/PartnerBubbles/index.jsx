// src/components/PartnerBubbles/PartnerBubbles.jsx
import React from 'react'
import './index.scss'

export default function PartnerBubbles({ logos }) {
    console.log(logos)
    return (
        <div className="partner-bubbles">
            {logos?.map((logo, i) => (
                <div key={i} className="bubble" style={bubbleStyle(i, logos.length)}>
                    <img src={logo} alt={`partner-${i}`} />
                </div>
            ))}
        </div>
    )
}

// basitçe her balonun açısını rastgele dağıtan bir fonksiyon
function bubbleStyle(index, total) {
    const angle = (360 / total) * index
    const radius = 120  // çember yarıçapı
    const rad = (angle * Math.PI) / 180
    return {
        position: 'absolute',
        top: `${50 + Math.sin(rad) * radius}%`,
        left: `${50 + Math.cos(rad) * radius}%`,
        transform: 'translate(-50%, -50%)',
    }
}
