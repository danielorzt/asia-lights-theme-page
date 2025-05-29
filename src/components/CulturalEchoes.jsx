import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Podrías usar un icono de Lucide si quieres, por ejemplo, para un pequeño adorno
// import { Feather } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Datos para los elementos culturales (podrías expandir esto)
const culturalElements = {
    templeSilhouette: {
        // Idealmente, aquí iría la ruta a un SVG o imagen PNG de una silueta de templo/pagoda
        // Por ahora, usaremos un placeholder o un div estilizado si no tienes una imagen.
        // Ejemplo: src: '/assets/images/temple_silhouette.svg',
        alt: 'Silueta de templo tradicional',
    },
    lanterns: [
        { id: 'lantern1', color: 'bg-red-500/70', glowColor: 'rgba(255,100,100,0.7)' },
        { id: 'lantern2', color: 'bg-orange-500/70', glowColor: 'rgba(255,180,100,0.7)' },
        { id: 'lantern3', color: 'bg-yellow-500/70', glowColor: 'rgba(255,255,100,0.7)' },
    ],
};

const CulturalEchoes = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const textRef = useRef(null);
    const templeRef = useRef(null); // Para la silueta del templo
    const lanternsContainerRef = useRef(null); // Para el contenedor de los farolillos
    const particlesContainerRef = useRef(null); // Para las partículas

    useEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const textEl = textRef.current;
        const templeEl = templeRef.current;
        const lanternsContEl = lanternsContainerRef.current;
        const particlesContEl = particlesContainerRef.current;

        // --- Animación de Partículas Flotantes (Sutil) ---
        if (particlesContEl) {
            const particleCount = 30;
            for (let i = 0; i < particleCount; i++) {
                let particle = document.createElement('div');
                particle.className = 'absolute rounded-full';
                const size = gsap.utils.random(2, 5);
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.backgroundColor = `hsla(${gsap.utils.random(20, 40)}, 100%, 70%, ${gsap.utils.random(0.3, 0.8)})`; // Tonos dorados/naranjas
                particle.style.left = `${gsap.utils.random(0, 100)}%`;
                particle.style.top = `${gsap.utils.random(0, 100)}%`;
                particlesContEl.appendChild(particle);

                gsap.to(particle, {
                    y: `-=${gsap.utils.random(50, 150)}`, // Movimiento ascendente
                    opacity: 0,
                    duration: gsap.utils.random(3, 7),
                    delay: gsap.utils.random(0, 5),
                    repeat: -1,
                    ease: 'linear',
                    modifiers: {
                        y: gsap.utils.unitize(y => parseFloat(y) % (sectionEl.offsetHeight + 150) - 150) // Loop vertical
                    }
                });
                gsap.to(particle, {
                    x: `+=${gsap.utils.random(-30, 30)}`, // Ligero vaivén horizontal
                    duration: gsap.utils.random(3, 5),
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut'
                });
            }
        }

        // --- Animación de Entrada de la Sección y Texto ---
        const tlEntrance = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top center+=100',
                toggleActions: 'play none none none',
                // markers: true,
            },
        });

        tlEntrance
            .fromTo(titleEl, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
            .fromTo(textEl, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, "-=0.7");

        // --- Animación Parallax y de Elementos Culturales ---
        if (templeEl) {
            gsap.fromTo(templeEl,
                { opacity: 0, y: 100, filter: 'blur(5px)' },
                {
                    opacity: 0.15, // Hacerla sutil, como una silueta distante
                    y: 50, // Menor movimiento para efecto de lejanía
                    filter: 'blur(2px)',
                    scrollTrigger: {
                        trigger: sectionEl,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5, // Más lento para el fondo
                    },
                    ease: 'none'
                }
            );
            // Sutil iluminación del borde al entrar
            gsap.fromTo(templeEl,
                { boxShadow: '0 0 0px rgba(255,223,186,0)' },
                {
                    boxShadow: '0 0 30px rgba(255,223,186,0.3)', // Un brillo dorado suave
                    duration: 2,
                    scrollTrigger: {
                        trigger: sectionEl,
                        start: 'top center+=200',
                        toggleActions: 'play none none reverse',
                    },
                    ease: 'power2.inOut'
                }
            );
        }

        if (lanternsContEl && lanternsContEl.children.length > 0) {
            const lanterns = gsap.utils.toArray(lanternsContEl.children);
            lanterns.forEach((lantern, index) => {
                // Parallax para farolillos (más movimiento que el templo)
                gsap.to(lantern, {
                    yPercent: gsap.utils.random(-30, -60), // Se mueven más hacia arriba
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionEl,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 0.8 + index * 0.2, // Diferentes velocidades de scrub
                    },
                });

                // Animación de entrada y brillo pulsante
                gsap.fromTo(lantern,
                    { opacity: 0, scale: 0.5 },
                    {
                        opacity: 1,
                        scale: 1,
                        duration: 1,
                        delay: 0.5 + index * 0.2, // Entrada escalonada
                        ease: 'elastic.out(1, 0.7)',
                        scrollTrigger: {
                            trigger: sectionEl,
                            start: 'top center',
                            toggleActions: 'play none none none',
                        }
                    }
                );
                gsap.to(lantern.querySelector('.lantern-glow'), {
                    opacity: 0.8,
                    scale: 1.1,
                    boxShadow: `0 0 25px 10px ${culturalElements.lanterns[index]?.glowColor || 'rgba(255,215,0,0.7)'}`, // Usar glowColor
                    duration: 1.5 + Math.random(),
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                    delay: 1.5 + index * 0.2 + Math.random(),
                });
            });
        }

        return () => {
            tlEntrance.kill();
            gsap.killTweensOf([templeEl, lanternsContEl, particlesContEl]);
            if (particlesContEl) particlesContEl.innerHTML = ''; // Limpiar partículas
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === sectionEl) {
                    trigger.kill();
                }
            });
        }

    }, []);

    return (
        <section
            ref={sectionRef}
            id="cultural-echoes"
            className="relative min-h-screen py-20 md:py-32 bg-gradient-to-b from-gray-900 to-indigo-900 text-white flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Contenedor de Partículas */}
            <div ref={particlesContainerRef} className="absolute inset-0 z-0 pointer-events-none"></div>

            {/* Silueta del Templo (Fondo) */}
            {/* REEMPLAZA ESTO con tu <img/> o SVG si tienes uno */}
            <div
                ref={templeRef}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 md:w-1/2 max-w-3xl z-10 opacity-0"
                style={{ height: '60vh' }} // Ajusta según tu imagen/SVG
            >
                {/* Placeholder visual si no tienes imagen */}
                <div className="w-full h-full bg-black/30 rounded-t-full" style={{
                    clipPath: 'polygon(50% 0%, 100% 70%, 100% 100%, 0 100%, 0 70%)' // Forma de pagoda simple
                }}></div>
            </div>


            {/* Contenedor de Farolillos (Primer Plano) */}
            <div ref={lanternsContainerRef} className="absolute inset-0 z-30 pointer-events-none">
                {culturalElements.lanterns.map((lantern, index) => (
                    <div
                        key={lantern.id}
                        className={`absolute w-16 h-24 md:w-20 md:h-32 rounded-t-full rounded-b-lg opacity-0 ${lantern.color}`}
                        style={{
                            // Posicionamiento aleatorio para los farolillos
                            top: `${10 + index * 15 + gsap.utils.random(-5, 5)}%`,
                            left: `${15 + index * 25 + gsap.utils.random(-10, 10)}%`,
                            transformOrigin: 'top center',
                        }}
                    >
                        <div className="lantern-glow absolute inset-0 rounded-full opacity-0 scale-50" style={{backgroundColor: lantern.glowColor}}></div>
                        {/* Detalles del farolillo (opcional) */}
                        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 w-2 h-4 bg-yellow-700"></div>
                    </div>
                ))}
            </div>

            {/* Contenido de Texto */}
            <div className="relative z-20 container mx-auto px-4 text-center max-w-3xl">
                <h2
                    ref={titleRef}
                    className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-6 opacity-0 leading-tight"
                    style={{ textShadow: '0 2px 10px rgba(255,223,186,0.5)'}} // Sombra de texto dorada
                >
                    Ecos de Tradición, Luces del Presente
                </h2>
                <p
                    ref={textRef}
                    className="text-lg sm:text-xl text-gray-300 leading-relaxed opacity-0"
                >
                    En el corazón de la modernidad asiática, la sabiduría ancestral y la belleza atemporal
                    resplandecen, guiando el camino hacia un futuro iluminado por su rica herencia.
                </p>
                {/* <Feather size={48} className="mx-auto mt-8 text-yellow-400 opacity-70" /> */}
            </div>
        </section>
    );
};

export default CulturalEchoes;
