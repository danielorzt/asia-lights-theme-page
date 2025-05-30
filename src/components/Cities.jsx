import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// --- PASO 1: Importa tus videos ---
// Asegúrate de que estas rutas y nombres de archivo sean EXACTOS
// y que los archivos existan en src/assets/videos/
import tokyoVideo from '../assets/videos/tokyo_city.mp4'; // Para Tokio
import seoulVideo from '../assets/videos/seoul_city.mp4'; // Para Seúl
// Necesitarás un video para Shanghái. Si usas el de Osaka temporalmente:
import shanghaiVideoPlaceholder from '../assets/videos/shanghai_city.mp4';
import hongKongVideo from '../assets/videos/hong_kong_city.mp4';
import singaporeVideo from '../assets/videos/singapore_city.mp4';

gsap.registerPlugin(ScrollTrigger);

const citiesData = [
    {
        id: 1,
        name: 'Tokio, Japón',
        description: 'La futurista y tradicional capital de Japón, un torbellino de neón, templos serenos y cultura pop inigualable.',
        videoSrc: tokyoVideo,
    },
    {
        id: 2,
        name: 'Seúl, Corea del Sur',
        description: 'Una metrópolis vibrante donde la alta tecnología K-Beauty y el K-Pop se encuentran con palacios históricos y mercados bulliciosos.',
        videoSrc: seoulVideo,
    },
    {
        id: 3,
        name: 'Shanghái, China',
        description: 'El deslumbrante centro financiero de China, con su icónico skyline del Bund que brilla sobre el río Huangpu.',
        videoSrc: shanghaiVideoPlaceholder, // REEMPLAZA con tu video real de Shanghái si lo tienes
    },
    {
        id: 4,
        name: 'Hong Kong',
        description: 'Una ciudad de contrastes espectaculares, con rascacielos que se elevan sobre un puerto legendario y montañas exuberantes.',
        videoSrc: hongKongVideo,
    },
    {
        id: 5,
        name: 'Singapur',
        description: 'La "Ciudad Jardín" de Asia, una maravilla de la arquitectura sostenible, superárboles brillantes y una diversidad cultural fascinante.',
        videoSrc: singaporeVideo, // REEMPLAZA con tu video real de Singapur o una variable importada

    },
];

const Cities = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const sliderContainerRef = useRef(null);

    const slideRefs = useRef([]);
    slideRefs.current = citiesData.map((_, i) => slideRefs.current[i] ?? React.createRef());

    const videoRefs = useRef([]);
    videoRefs.current = citiesData.map((_, i) => videoRefs.current[i] ?? React.createRef());

    // Animación de entrada para el título y el contenedor del slider
    useEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const sliderEl = sliderContainerRef.current;

        const tlEntrance = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top center+=200',
                toggleActions: 'play none none none',
            },
        });

        tlEntrance
            .fromTo(titleEl, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .fromTo(sliderEl, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }, "-=0.5");

        return () => { tlEntrance.kill(); }
    }, []);

    // Animación para las transiciones de slides, contenido interno y reproducción de video
    useEffect(() => {
        videoRefs.current.forEach((videoRef, index) => {
            const videoEl = videoRef.current;
            if (videoEl) {
                if (index !== currentIndex) {
                    videoEl.pause();
                    if (videoEl.readyState > 0 && !videoEl.seeking) videoEl.currentTime = 0;
                }
            }
        });

        const currentVideoEl = videoRefs.current[currentIndex]?.current;
        if (currentVideoEl) {
            currentVideoEl.currentTime = 0; // Rebobinar antes de reproducir
            const playPromise = currentVideoEl.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.warn(`Autoplay del video ${citiesData[currentIndex].name} bloqueado:`, error);
                });
            }
        }

        slideRefs.current.forEach((slideRef, index) => {
            const slideEl = slideRef.current;
            if (!slideEl) return;
            const nameEl = slideEl.querySelector('.slide-city-name');
            const descEl = slideEl.querySelector('.slide-city-description');
            gsap.killTweensOf([slideEl, nameEl, descEl]);

            if (index === currentIndex) {
                gsap.fromTo(slideEl,
                    { opacity: 0, xPercent: index > (currentIndex -1 < 0 ? citiesData.length -1 : currentIndex -1) ? 30 : -30 },
                    { opacity: 1, xPercent: 0, duration: 0.7, ease: 'power3.inOut', delay: 0.1 }
                );
                if (nameEl && descEl) {
                    gsap.fromTo([nameEl, descEl],
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.2, delay: 0.5 }
                    );
                }
            } else {
                gsap.set(slideEl, { opacity: 0, xPercent: 0 });
            }
        });

        return () => { // Limpieza para este useEffect
            videoRefs.current.forEach(videoRef => {
                const videoEl = videoRef.current;
                if(videoEl) videoEl.pause();
            });
            slideRefs.current.forEach(slideRef => {
                if(slideRef.current) {
                    const nameEl = slideRef.current.querySelector('.slide-city-name');
                    const descEl = slideRef.current.querySelector('.slide-city-description');
                    gsap.killTweensOf([slideRef.current, nameEl, descEl]);
                }
            });
        }

    }, [currentIndex]);

    const changeSlide = (newIndex) => {
        const oldIndex = currentIndex;
        const oldSlideEl = slideRefs.current[oldIndex]?.current;
        const oldVideoEl = videoRefs.current[oldIndex]?.current;

        if (oldVideoEl) oldVideoEl.pause();
        if (oldSlideEl) {
            gsap.to(oldSlideEl, {
                opacity: 0,
                xPercent: newIndex > oldIndex ? -30 : 30,
                duration: 0.5,
                ease: 'power3.inOut'
            });
        }
        setCurrentIndex(newIndex);
    };

    const prevSlide = () => changeSlide(currentIndex === 0 ? citiesData.length - 1 : currentIndex - 1);
    const nextSlide = () => changeSlide(currentIndex === citiesData.length - 1 ? 0 : currentIndex + 1);

    return (
        <section ref={sectionRef} id="cities-slider" className="py-16 md:py-24 bg-gray-800 text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-center mb-12 text-sky-400 opacity-0">
                    Explora las Joyas de Asia Oriental
                </h2>
                <div ref={sliderContainerRef} className="relative max-w-4xl mx-auto aspect-video overflow-hidden rounded-xl shadow-2xl opacity-0">
                    {citiesData.map((city, index) => (
                        <div
                            key={city.id}
                            ref={slideRefs.current[index]}
                            className="absolute inset-0"
                            style={{ opacity: 0 }}
                        >
                            <video
                                ref={videoRefs.current[index]}
                                src={city.videoSrc} // Aquí se usa la variable o la URL del placeholder
                                loop
                                muted
                                playsInline
                                preload="metadata"
                                className="w-full h-full object-cover"
                                // No onError aquí, los errores se manejan en la consola por el .catch() del play()
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-6 md:p-10 text-white">
                                <h3 className="slide-city-name text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg opacity-0">{city.name}</h3>
                                <p className="slide-city-description text-sm md:text-base text-gray-200 drop-shadow-md max-w-xl opacity-0">{city.description}</p>
                            </div>
                        </div>
                    ))}
                    <button onClick={prevSlide} aria-label="Diapositiva anterior" className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-sky-500/70 text-white p-2 md:p-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400">
                        <ChevronLeftIcon className="h-6 w-6 md:h-8 md:w-8" />
                    </button>
                    <button onClick={nextSlide} aria-label="Siguiente diapositiva" className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 z-20 bg-black/40 hover:bg-sky-500/70 text-white p-2 md:p-3 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400">
                        <ChevronRightIcon className="h-6 w-6 md:h-8 md:w-8" />
                    </button>
                </div>
                <div className="flex justify-center mt-8 space-x-2">
                    {citiesData.map((_, index) => (
                        <button key={`dot-${index}`} onClick={() => changeSlide(index)} aria-label={`Ir a la diapositiva ${index + 1}`}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ease-in-out ${ currentIndex === index ? 'bg-sky-400 scale-125 ring-2 ring-sky-300 ring-offset-2 ring-offset-gray-800' : 'bg-gray-500 hover:bg-gray-400'}`}
                        ></button>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Cities;
