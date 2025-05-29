import React, { useEffect, useRef } from 'react';
import gsap from 'gsap'; // Importa GSAP


const Hero = () => {
    // Referencias a los elementos que vamos a animar
    const heroContentRef = useRef(null);
    const titleLine1Ref = useRef(null);
    const titleLine2Ref = useRef(null);
    const paragraphRef = useRef(null);
    const buttonRef = useRef(null);
    const overlayRef = useRef(null); // Para animar la superposición

    useEffect(() => {
        // Asegurarse de que los elementos existen antes de animar
        if (
            !heroContentRef.current ||
            !titleLine1Ref.current ||
            !titleLine2Ref.current ||
            !paragraphRef.current ||
            !buttonRef.current ||
            !overlayRef.current
        ) {
            return;
        }

        // Crear una timeline de GSAP para secuenciar las animaciones
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // 1. Animación de la superposición oscura
        tl.fromTo(
            overlayRef.current,
            { opacity: 0 },
            { opacity: 0.5, duration: 1 }
        );

        // 2. Animación para la primera línea del título "Luces de Asia:"
        tl.fromTo(
            titleLine1Ref.current,
            { opacity: 0, y: 50, skewX: -10 }, // Estado inicial: invisible, desplazado hacia abajo, ligeramente inclinado
            { opacity: 1, y: 0, skewX: 0, duration: 0.8, delay: 0.2 }, // Estado final
            "-=0.5" // Inicia 0.5s antes de que termine la animación anterior (superposición)
        );

        // 3. Animación para la segunda línea del título "Un Viaje Neón"
        // Mantenemos el animate-pulse de Tailwind, GSAP se encargará de la aparición
        tl.fromTo(
            titleLine2Ref.current,
            { opacity: 0, y: 50, scale: 0.8 }, // Estado inicial: invisible, desplazado, escalado hacia abajo
            { opacity: 1, y: 0, scale: 1, duration: 0.8 },
            "-=0.6" // Superponer con la animación anterior para un efecto más fluido
        );

        // 4. Animación para el párrafo de descripción
        tl.fromTo(
            paragraphRef.current,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7 },
            "-=0.5" // Superponer
        );

        // 5. Animación para el botón
        tl.fromTo(
            buttonRef.current,
            { opacity: 0, y: 20, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6 },
            "-=0.4" // Superponer
        );

        // Limpieza de la animación al desmontar el componente (opcional para animaciones de entrada, pero buena práctica)
        return () => {
            tl.kill(); // Detiene y limpia la timeline para evitar problemas si el componente se desmonta y remonta
        };
    }, []); // El array vacío [] asegura que useEffect se ejecute solo una vez (al montar)

    return (
        <section
            id="hero"
            className="relative flex flex-col items-center justify-center h-screen text-center text-white bg-gray-900 overflow-hidden"
        >
            {/* Video de Fondo (Opcional) */}
            {/* <video ... /> */}

            {/* Superposición Oscura */}
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black opacity-0 z-10" // Inicia con opacidad 0 para GSAP
            ></div>

            {/* Contenido del Hero */}
            <div ref={heroContentRef} className="relative z-20 p-4 sm:p-8">
                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-4 leading-tight">
          <span ref={titleLine1Ref} className="block opacity-0"> {/* Inicia con opacidad 0 */}
              Luces de Asia:
          </span>
                    <span
                        ref={titleLine2Ref}
                        className="block text-sky-400 animate-pulse opacity-0" /* Inicia con opacidad 0 */
                    >
            Un Viaje Neón
          </span>
                </h1>
                <p
                    ref={paragraphRef}
                    className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto opacity-0" /* Inicia con opacidad 0 */
                >
                    Descubre el esplendor vibrante de las metrópolis más icónicas de Asia Oriental,
                    donde la tradición se encuentra con la innovación bajo un manto de luces deslumbrantes.
                </p>
                <div ref={buttonRef} className="space-x-4 opacity-0"> {/* Inicia con opacidad 0 */}
                    <button
                        type="button"
                        className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 text-lg"
                    >
                        Explorar Ciudades
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Hero;
