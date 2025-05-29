import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TechCard from './TechCard'; // Importa el subcomponente

// Importa los iconos de lucide-react
import { BrainCircuit, Bot, TramFront, Building2, Gamepad2, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const techData = [
    {
        id: 'ai',
        icon: BrainCircuit,
        title: 'Inteligencia Artificial',
        description: 'IA que redefine ciudades, optimizando desde el tráfico hasta experiencias personalizadas.',
        color: 'sky',
    },
    {
        id: 'robotics',
        icon: Bot,
        title: 'Robótica Avanzada',
        description: 'Autómatas y robots integrados en la vida diaria, desde la industria hasta el servicio al cliente.',
        color: 'pink',
    },
    {
        id: 'smart-transport',
        icon: TramFront,
        title: 'Transporte Inteligente',
        description: 'Redes de movilidad futuristas, trenes bala y vehículos autónomos que conectan el mañana.',
        color: 'green',
    },
    {
        id: 'architecture',
        icon: Building2,
        title: 'Arquitectura Innovadora',
        description: 'Estructuras audaces y sostenibles que desafían la gravedad y redefinen el paisaje urbano.',
        color: 'purple',
    },
    {
        id: 'esports',
        icon: Gamepad2,
        title: 'Epicentro eSports',
        description: 'Estadios vibrantes y una cultura gamer que convierte la competición digital en un espectáculo masivo.',
        color: 'red',
    },
    {
        id: 'energy',
        icon: Zap,
        title: 'Energía del Futuro',
        description: 'Ciudades impulsadas por tecnologías limpias y redes energéticas inteligentes e interconectadas.',
        color: 'yellow',
    },
];

const TechPulseAsia = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const gridRef = useRef(null);
    const backgroundPatternRef = useRef(null);

    useEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const gridEl = gridRef.current;
        const bgPatternEl = backgroundPatternRef.current;

        if (bgPatternEl) {
            gsap.to(bgPatternEl, {
                backgroundPosition: "200px 200px",
                duration: 20,
                repeat: -1,
                ease: "linear",
                yoyo: true
            });
        }

        const tlEntrance = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top center+=100',
                toggleActions: 'play none none none',
                // markers: true,
            },
        });

        tlEntrance
            .fromTo(titleEl, { opacity: 0, y: 60, skewX: -5 }, { opacity: 1, y: 0, skewX: 0, duration: 0.8, ease: 'power3.out' })
            .fromTo(
                gridEl.children, // Animar cada TechCard
                { opacity: 0, y: 50, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'back.out(1.2)',
                    stagger: {
                        each: 0.15,
                        onStart: function() { // Se ejecuta para CADA tarjeta del stagger
                            const currentCard = this.targets()[0]; // La tarjeta actual en la iteración del stagger
                            const cardTitle = currentCard.querySelector('.card-title');
                            const cardDesc = currentCard.querySelector('.card-description');

                            // Asegurarse de que las animaciones previas en estos elementos estén limpias
                            gsap.killTweensOf([cardTitle, cardDesc]);

                            if(cardTitle && cardDesc) {
                                gsap.fromTo([cardTitle, cardDesc],
                                    { opacity: 0, y: 20 },
                                    {
                                        opacity: 1,
                                        y: 0,
                                        duration: 0.5,
                                        ease: 'power2.out',
                                        stagger: 0.1,
                                        delay: 0.2 // Pequeño delay después de que la tarjeta empiece a aparecer
                                    }
                                );
                            }
                        }
                    }
                },
                "-=0.4"
            );

        return () => {
            tlEntrance.kill();
            gsap.killTweensOf(bgPatternEl);
            // Es buena práctica también limpiar las animaciones de los hijos si se desmonta
            if (gridEl && gridEl.children) {
                gsap.utils.toArray(gridEl.children).forEach(child => {
                    const cardTitle = child.querySelector('.card-title');
                    const cardDesc = child.querySelector('.card-description');
                    if (cardTitle) gsap.killTweensOf(cardTitle);
                    if (cardDesc) gsap.killTweensOf(cardDesc);
                });
            }
        }

    }, []);

    return (
        <section
            ref={sectionRef}
            id="tech-pulse"
            className="relative py-20 md:py-32 bg-gray-900 text-white overflow-hidden"
        >
            <div
                ref={backgroundPatternRef}
                className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(#60a5fa 2px, transparent 2px)',
                    backgroundSize: '30px 30px',
                }}
            ></div>

            <div className="relative z-10 container mx-auto px-4">
                <h2
                    ref={titleRef}
                    className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 md:mb-20 opacity-0"
                >
                    <span className="block">El Pulso Tecnológico</span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-pink-400 to-purple-500 animate-gradient-x">
                        De Asia Oriental
                    </span>
                </h2>

                <div
                    ref={gridRef}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                >
                    {techData.map((item, index) => (
                        <TechCard
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            description={item.description}
                            color={item.color}
                            // animationDelay ya no es necesario aquí si el stagger lo maneja todo
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechPulseAsia;
