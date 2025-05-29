import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import shanghaiVideo from '../assets/videos/shanghai_star.mp4';

// Registra el plugin ScrollTrigger si aún no lo has hecho en otro lugar principal
// Es seguro llamarlo múltiples veces, GSAP lo maneja.
gsap.registerPlugin(ScrollTrigger);

const Featured = () => {
    const sectionRef = useRef(null);
    const headingLine1Ref = useRef(null);
    const headingLine2Ref = useRef(null); // Para la línea con gradiente
    const paragraphRef = useRef(null);
    const videoOverlayRef = useRef(null); // Para animar la opacidad de la superposición

    useEffect(() => {
        const sectionEl = sectionRef.current;
        const heading1El = headingLine1Ref.current;
        const heading2El = headingLine2Ref.current;
        const paragraphEl = paragraphRef.current;
        const overlayEl = videoOverlayRef.current;

        // Timeline para las animaciones de esta sección
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top center+=150', // Comienza cuando 150px por debajo del centro del viewport alcanza la parte superior de la sección
                end: 'center center',    // Podríamos ajustar esto si queremos que la animación termine antes o después
                toggleActions: 'play none none none', // Ejecuta la animación una vez al entrar
                // markers: true, // Descomenta para depuración visual de ScrollTrigger
            },
            defaults: { ease: 'power3.out' }
        });

        // 1. Animar la superposición del video (si queremos que aparezca gradualmente)
        // Si ya tiene opacity-60 y se ve bien, este paso puede ser sutil o eliminarse.
        // Aquí la haremos un poco más oscura al inicio de la animación del texto.
        tl.fromTo(overlayEl,
            { opacity: 0.4 }, // Un poco más claro al inicio
            { opacity: 0.6, duration: 1 }, // Oscurece a su valor final
            "start" // Etiqueta para sincronizar
        );

        // 2. Animación para la primera línea del título "Explosión de Luz:"
        tl.fromTo(heading1El,
            { opacity: 0, y: 60, skewX: -8 },
            { opacity: 1, y: 0, skewX: 0, duration: 0.8 },
            "start+=0.2" // Inicia un poco después de la superposición
        );

        // 3. Animación para la segunda línea del título "El Alma de Shanghái" (la del gradiente)
        // La animación de gradiente es CSS, GSAP solo controla su aparición.
        tl.fromTo(heading2El,
            { opacity: 0, y: 40, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8 },
            "-=0.6" // Superponer con la animación anterior
        );

        // 4. Animación para el párrafo descriptivo
        tl.fromTo(paragraphEl,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7 },
            "-=0.5" // Superponer
        );

        // Limpieza
        return () => {
            tl.kill();
            // Si usas toggleActions que no sean 'play none none none', considera matar el trigger también:
            // ScrollTrigger.getById("featuredVideoTrigger")?.kill(); // Si le pones un ID al trigger
        };

    }, []);

    return (
        <section
            ref={sectionRef}
            id="featured-video"
            className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        >
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover"
            >
                <source src={shanghaiVideo} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
            </video>

            <div
                ref={videoOverlayRef}
                className="absolute inset-0 bg-black opacity-60 z-10" // Opacidad base
            ></div>

            <div className="relative z-20 text-center p-4">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3 leading-tight">
          <span ref={headingLine1Ref} className="block opacity-0"> {/* Inicia invisible para GSAP */}
              Explosión de Luz:
          </span>
                    <span
                        ref={headingLine2Ref}
                        className="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-pink-400 to-purple-500 animate-gradient-x opacity-0" /* Inicia invisible */
                    >
            El Alma de Shanghái
          </span>
                </h2>
                <p
                    ref={paragraphRef}
                    className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto font-light opacity-0" /* Inicia invisible */
                >
                    Sumérgete en la energía incesante de una ciudad que nunca duerme, donde cada rincón cuenta una historia de luz y sombra.
                </p>
            </div>
            {/* La animación CSS para animate-gradient-x ya debe estar en tu index.css */}
        </section>
    );
};

export default Featured;
