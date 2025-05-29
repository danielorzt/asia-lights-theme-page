import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Importa ScrollTrigger

// Registra el plugin ScrollTrigger con GSAP
// Esto solo necesita hacerse una vez en tu aplicación, pero es seguro hacerlo aquí.
gsap.registerPlugin(ScrollTrigger);

const Attention = () => {
    const sectionRef = useRef(null);
    const headingRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const sectionElement = sectionRef.current;
        const headingElement = headingRef.current;
        const textElement = textRef.current;

        // Animación para el encabezado
        const tlHeading = gsap.timeline({
            scrollTrigger: {
                trigger: sectionElement,
                start: 'top center+=100', // Comienza cuando el 100px por debajo del centro del viewport alcanza la parte superior de la sección
                end: 'bottom center',    // Termina cuando el centro del viewport alcanza la parte inferior de la sección
                scrub: 1,                // Suaviza la animación con el scroll (1 segundo de "retraso")
                // markers: true,        // Descomenta para ver los marcadores de ScrollTrigger (útil para depurar)
            },
        });

        tlHeading
            .fromTo(
                headingElement,
                { opacity: 0, y: 100, scale: 0.8, skewX: -15 },
                { opacity: 1, y: 0, scale: 1, skewX: 0, duration: 1, ease: 'power3.out' }
            )
            .fromTo( // Efecto de "brillo" o cambio de color en el texto del span
                headingElement.querySelector('.highlight-text'),
                { color: '#67e8f9' }, // Color inicial (sky-400)
                { color: '#f472b6', duration: 1, yoyo: true, repeat: -1, ease: 'sine.inOut'}, // Color final (pink-400), yoyo y repetición infinita
                "<" // Inicia al mismo tiempo que la animación anterior del heading
            );


        // Animación para el texto descriptivo (aparece un poco después)
        const tlText = gsap.timeline({
            scrollTrigger: {
                trigger: sectionElement,
                start: 'top center', // Comienza un poco después que el heading
                end: 'bottom center',
                scrub: 1.5,
                // markers: true, // Descomenta para depurar
            },
        });

        tlText.fromTo(
            textElement,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
        );

        // Limpieza al desmontar el componente
        return () => {
            tlHeading.kill();
            tlText.kill();
            ScrollTrigger.getAll().forEach(trigger => trigger.kill()); // Mata todos los triggers para evitar problemas
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            id="attention-grabbing"
            className="min-h-screen py-20 md:py-32 bg-gradient-to-br from-gray-900 via-purple-900 to-sky-900 text-white flex flex-col items-center justify-center overflow-hidden"
        >
            <div className="container mx-auto px-4 text-center">
                <h2
                    ref={headingRef}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 opacity-0" // Inicia invisible
                    style={{ transform: 'translateY(100px) scale(0.8) skewX(-15deg)' }} // Estado inicial para GSAP
                >
                    Despierta tus <span className="highlight-text">Sentidos</span>
                </h2>
                <p
                    ref={textRef}
                    className="text-xl sm:text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto leading-relaxed opacity-0" // Inicia invisible
                    style={{ transform: 'translateY(50px)' }} // Estado inicial para GSAP
                >
                    Sumérgete en una experiencia visual sin precedentes. Las luces de Asia te esperan para revelarte sus secretos más brillantes y sus noches más enigmáticas.
                </p>
            </div>
        </section>
    );
};

export default Attention;
