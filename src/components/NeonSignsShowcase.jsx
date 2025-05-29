import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import NeonSign from './NeonSign'; // Importa el subcomponente

gsap.registerPlugin(ScrollTrigger);

const signsData = [
    { text: '東京', color: 'pink', lang: 'ja' }, // Tokio
    { text: '안녕하세요', color: 'sky', lang: 'ko' }, // Hola en Coreano
    { text: '上海', color: 'green', lang: 'zh' }, // Shanghái
    { text: '你好', color: 'red', lang: 'zh' }, // Hola en Chino
    { text: '未來', color: 'purple', lang: 'zh' }, // Futuro (Singapur - Mandarín)
    { text: '食', color: 'yellow', lang: 'ja' }, // Comida (Osaka)
    { text: '香港', color: 'sky', lang: 'zh' }, // Hong Kong
    { text: 'Konnichiwa', color: 'pink', lang: 'en' }, // Para contraste, inglés
];

const NeonSignsShowcase = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const gridRef = useRef(null); // Referencia al contenedor de los letreros

    useEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        // Los letreros individuales se animarán por su propio useEffect y delay

        const tlEntrance = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top center+=150',
                toggleActions: 'play none none none',
                // markers: true,
            },
        });

        tlEntrance.fromTo(
            titleEl,
            { opacity: 0, y: 60 },
            { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
        );

        // Limpieza
        return () => {
            tlEntrance.kill();
        }

    }, []);

    return (
        <section
            ref={sectionRef}
            id="neon-showcase"
            className="min-h-screen py-20 md:py-32 bg-black text-white flex flex-col items-center justify-center overflow-hidden"
        >
            <div className="container mx-auto px-4 text-center">
                <h2
                    ref={titleRef}
                    className="text-5xl sm:text-6xl font-black mb-12 md:mb-16 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-sky-500 opacity-0"
                >
                    Galería de Neones
                </h2>
                <div
                    ref={gridRef}
                    className="flex flex-wrap justify-center items-center gap-4 md:gap-6"
                >
                    {signsData.map((sign, index) => (
                        <NeonSign
                            key={index}
                            text={sign.text}
                            color={sign.color}
                            lang={sign.lang}
                            initialDelay={index * 0.15} // Delay escalonado para cada letrero
                        />
                    ))}
                </div>
                <p className="mt-12 md:mt-16 text-gray-400 text-lg">
                    Pasa el mouse sobre los letreros para verlos brillar con más intensidad.
                </p>
            </div>
        </section>
    );
};

export default NeonSignsShowcase;
