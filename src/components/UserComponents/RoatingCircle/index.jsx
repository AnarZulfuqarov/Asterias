import React from 'react';
import './index.scss';

const RotatingCircle = () => {
    const text = "KEÇ, * BİZE * EŞLEME *";
    const characters = text.split('').map((char, index) => (
        <span key={index} style={{ transform: `rotate(${index * (360 / text.length)}deg) translateY(-75px)` }}>
      {char}
    </span>
    ));

    return (
        <div className="circle-container">
            <div className="phone-icon">📞</div>
            <div className="rotating-text">
                {characters}
            </div>
        </div>
    );
};

export default RotatingCircle;