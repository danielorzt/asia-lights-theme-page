import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Datos de las ciudades (RECUERDA REEMPLAZAR IMAGEURLS)
const citiesData = [
    {
        id: 1,
        name: 'Tokio, Japón',
        description: 'La futurista y tradicional capital de Japón, un torbellino de neón, templos serenos y cultura pop inigualable.',
        imageUrl: 'https://placehold.co/1200x700/1A202C/E2E8F0?text=Tokio+Neón&font=raleway',
        altText: 'Imagen de las luces nocturnas de Tokio',
    },
    {
        id: 2,
        name: 'Seúl, Corea del Sur',
        description: 'Una metrópolis vibrante donde la alta tecnología K-Beauty y el K-Pop se encuentran con palacios históricos y mercados bulliciosos.',
        imageUrl: 'https://placehold.co/1200x700/2D3748/F7FAFC?text=Seúl+Moderno&font=raleway',
        altText: 'Imagen del moderno skyline de Seúl por la noche',
    },
    {
        id: 3,
        name: 'Shanghái, China',
        description: 'El deslumbrante centro financiero de China, con su icónico skyline del Bund que brilla sobre el río Huangpu.',
        imageUrl: 'https://placehold.co/1200x700/4A5568/EDF2F7?text=Shanghái+Bund&font=raleway',
        altText: 'Imagen del Bund de Shanghái iluminado',
    },
    {
        id: 4,
        name: 'Hong Kong',
        description: 'Una ciudad de contrastes espectaculares, con rascacielos que se elevan sobre un puerto legendario y montañas exuberantes.',
        imageUrl: 'https://placehold.co/1200x700/718096/E2E8F0?text=Hong+Kong+Puerto&font=raleway',
        altText: 'Imagen del puerto Victoria de Hong Kong de noche',
    },
    {
        id: 5,
        name: 'Singapur',
        description: 'La "Ciudad Jardín" de Asia, una maravilla de la arquitectura sostenible, superárboles brillantes y una diversidad cultural fascinante.',
        imageUrl: 'https://placehold.co/1200x700/2C5282/BEE3F8?text=Singapur+Gardens&font=raleway',
        altText: 'Imagen de Gardens by the Bay en Singapur',
    },
];

const Cities = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const sliderContainerRef = useRef(null);
    const slideRefs = useRef([]); // Array para las referencias de cada slide
    slideRefs.current = citiesData.map((_, i) => slideRefs.current[i] ?? React.createRef());

    // Animación de entrada para el título y el contenedor del slider
    useEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const sliderEl = sliderContainerRef.current;

        const tlEntrance = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top center+=200', // Un poco más abajo para que se vea el efecto
                toggleActions: 'play none none none', // Ejecuta la animación una vez
                // markers: true, // Para depuración
            },
        });

        tlEntrance
            .fromTo(titleEl, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .fromTo(sliderEl, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, "-=0.5");

        return () => {
            tlEntrance.kill();
            // No es estrictamente necesario matar ScrollTrigger aquí si toggleActions es 'play none none none'
            // pero es buena práctica si se vuelve más complejo.
        }
    }, []);

    // Animación para las transiciones de slides y contenido interno
    useEffect(() => {
        slideRefs.current.forEach((slideRef, index) => {
            const slideEl = slideRef.current;
            if (!slideEl) return;

            const nameEl = slideEl.querySelector('.slide-city-name');
            const descEl = slideEl.querySelector('.slide-city-description');

            gsap.killTweensOf([slideEl, nameEl, descEl]); // Matar animaciones previas de estos elementos

            if (index === currentIndex) {
                // Animación de entrada para el slide activo
                gsap.fromTo(slideEl,
                    { opacity: 0, xPercent: index > (currentIndex -1 < 0 ? citiesData.length -1 : currentIndex -1) ? 50 : -50 }, // Entra desde la derecha o izquierda
                    { opacity: 1, xPercent: 0, duration: 0.7, ease: 'power3.inOut', delay: 0.1 }
                );
                // Animación para el contenido del slide activo
                if (nameEl && descEl) {
                    gsap.fromTo([nameEl, descEl],
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.2, delay: 0.4 }
                    );
                }
            } else {
                // Asegurar que los slides no activos estén ocultos (GSAP los manejará)
                gsap.set(slideEl, { opacity: 0, xPercent: 0 }); // Resetear posición para la próxima vez
            }
        });
    }, [currentIndex]); // Se ejecuta cada vez que currentIndex cambia

    const changeSlide = (newIndex) => {
        const oldIndex = currentIndex;
        const oldSlideEl = slideRefs.current[oldIndex]?.current;

        if (oldSlideEl) {
            // Animación de salida para el slide anterior
            gsap.to(oldSlideEl, {
                opacity: 0,
                xPercent: newIndex > oldIndex ? -50 : 50, // Sale hacia la izquierda o derecha
                duration: 0.5,
                ease: 'power3.inOut'
            });
        }
        setCurrentIndex(newIndex);
    };

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? citiesData.length - 1 : currentIndex - 1;
        changeSlide(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === citiesData.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        changeSlide(newIndex);
    };

    return (
        <section ref={sectionRef} id="cities-slider" className="py-16 md:py-24 bg-gray-800 text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-center mb-12 text-sky-400 opacity-0">
                    Explora las Joyas de Asia Oriental
                </h2>

                <div ref={sliderContainerRef} className="relative max-w-4xl mx-auto aspect-video overflow-hidden rounded-xl shadow-2xl opacity-0">
                    {/* Contenedor de Slides */}
                    {citiesData.map((city, index) => (
                        <div
                            key={city.id}
                            ref={slideRefs.current[index]}
                            // GSAP controlará la opacidad y posición, removemos clases de Tailwind para eso
                            className="absolute inset-0"
                            style={{ opacity: 0 }} // Inicia invisible, GSAP lo maneja
                        >
                            <img
                                src={city.imageUrl}
                                alt={city.altText || `Imagen de ${city.name}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src="https://placehold.co/1200x700/FF0000/FFFFFF?text=Error+Imagen";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                                <h3 className="slide-city-name text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg opacity-0">{city.name}</h3>
                                <p className="slide-city-description text-sm md:text-base text-gray-200 drop-shadow-md max-w-xl opacity-0">{city.description}</p>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={prevSlide}
                        aria-label="Diapositiva anterior"
                        className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-sky-500/70 text-white p-2 md:p-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                        <ChevronLeftIcon className="h-6 w-6 md:h-8 md:w-8" />
                    </button>

                    <button
                        onClick={nextSlide}
                        aria-label="Siguiente diapositiva"
                        className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-sky-500/70 text-white p-2 md:p-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                    >
                        <ChevronRightIcon className="h-6 w-6 md:h-8 md:w-8" />
                    </button>
                </div>

                <div className="flex justify-center mt-8 space-x-2">
                    {citiesData.map((_, index) => (
                        <button
                            key={`dot-${index}`}
                            onClick={() => changeSlide(index)}
                            aria-label={`Ir a la diapositiva ${index + 1}`}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${
                                currentIndex === index ? 'bg-sky-400 scale-125 ring-2 ring-sky-300 ring-offset-2 ring-offset-gray-800' : 'bg-gray-500 hover:bg-gray-400'
                            }`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Cities;
