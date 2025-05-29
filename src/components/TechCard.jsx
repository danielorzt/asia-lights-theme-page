import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const TechCard = ({ icon: IconComponent, title, description, color = 'sky', animationDelay = 0 }) => {
    const cardRef = useRef(null);
    const iconRef = useRef(null);

    // Colores de acento para los iconos y bordes (puedes expandir esto)
    const accentColors = {
        sky: 'hover:border-sky-400 group-hover:text-sky-400',
        pink: 'hover:border-pink-400 group-hover:text-pink-400',
        green: 'hover:border-green-400 group-hover:text-green-400',
        purple: 'hover:border-purple-400 group-hover:text-purple-400',
    };

    useEffect(() => {
        const cardElement = cardRef.current;
        const iconElement = iconRef.current;
        if (!cardElement || !iconElement) return;

        // Animación de hover para el icono
        const iconTimeline = gsap.timeline({ paused: true });
        iconTimeline
            .to(iconElement, { scale: 1.2, rotate: 15, duration: 0.2, ease: 'power1.inOut' })
            .to(iconElement.querySelector('svg'), { strokeWidth: 2.5, duration: 0.2 }, "<"); // Engrosar el trazo del icono

        const handleMouseEnter = () => iconTimeline.play();
        const handleMouseLeave = () => iconTimeline.reverse();

        cardElement.addEventListener('mouseenter', handleMouseEnter);
        cardElement.addEventListener('mouseleave', handleMouseLeave);

        // Animación de entrada para el contenido de la tarjeta (título y descripción)
        // Esto se activará por el ScrollTrigger del componente padre (TechPulseAsia)
        // Aquí solo definimos el estado inicial
        gsap.set(cardElement.querySelectorAll('.card-title, .card-description'), { opacity: 0, y: 20 });


        return () => {
            cardElement.removeEventListener('mouseenter', handleMouseEnter);
            cardElement.removeEventListener('mouseleave', handleMouseLeave);
            iconTimeline.kill();
            gsap.killTweensOf([cardElement.querySelectorAll('.card-title, .card-description')]);
        };
    }, []);


    return (
        <div
            ref={cardRef}
            className={`group bg-gray-800/70 backdrop-blur-sm p-6 rounded-xl border border-gray-700 transition-all duration-300 ${accentColors[color] || accentColors.sky} shadow-lg hover:shadow-2xl hover:shadow-${color}-500/30 opacity-0`} // Inicia invisible para GSAP
            style={{ transform: 'translateY(50px) scale(0.95)' }} // Estado inicial para GSAP
        >
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <div
                    ref={iconRef}
                    className={`mb-4 p-3 bg-gray-700/50 rounded-lg inline-block transition-colors duration-300 text-${color}-400`}
                >
                    <IconComponent size={40} strokeWidth={2} />
                </div>
                <h3 className={`card-title text-2xl font-semibold mb-2 text-white`}>{title}</h3>
                <p className={`card-description text-gray-400 text-sm leading-relaxed`}>{description}</p>
            </div>
        </div>
    );
};

export default TechCard;
