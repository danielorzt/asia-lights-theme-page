import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Importa tus videos. Rspack los manejará.
import hongKongVideo from '../assets/videos/hong_kong_card.mp4';
import osakaVideo from '../assets/videos/osaka_card.mp4';
import seoulVideo from '../assets/videos/seoul_card.mp4';
import tokyoVideo from '../assets/videos/tokyo_card.mp4';

// Registra ScrollTrigger si no lo has hecho en un lugar más global
gsap.registerPlugin(ScrollTrigger);

const galleryItemsData = [
    {
        id: 'tokyo',
        title: 'Tokio Dinámico',
        videoSrc: tokyoVideo,
        // REEMPLAZA ESTA URL con la ruta a tu imagen de previsualización real
        posterSrc: 'https://placehold.co/600x400/1A202C/E2E8F0?text=Tokio+Preview&font=raleway',
        description: 'Neón y tradición en la metrópolis japonesa.',
    },
    {
        id: 'seoul',
        title: 'Seúl Innovador',
        videoSrc: seoulVideo,
        posterSrc: 'https://placehold.co/600x400/2D3748/F7FAFC?text=Seúl+Preview&font=raleway',
        description: 'K-Pop, tecnología y palacios ancestrales.',
    },
    {
        id: 'hongkong',
        title: 'Hong Kong Vibrante',
        videoSrc: hongKongVideo,
        posterSrc: 'https://placehold.co/600x400/4A5568/EDF2F7?text=Hong+Kong+Preview&font=raleway',
        description: 'Rascacielos imponentes y un puerto legendario.',
    },
    {
        id: 'osaka',
        title: 'Osaka Deliciosa',
        videoSrc: osakaVideo,
        posterSrc: 'https://placehold.co/600x400/718096/E2E8F0?text=Osaka+Preview&font=raleway',
        description: 'La capital gastronómica de Japón y su castillo.',
    },
];

const GalleryCard = ({ title, videoSrc, posterSrc, description }) => {
    const videoRef = useRef(null);
    const [isHovering, setIsHovering] = useState(false);

    const handleMouseEnter = () => {
        setIsHovering(true);
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                // Autoplay puede fallar si el usuario no ha interactuado con la página
                console.warn("Video autoplay failed:", error);
            });
        }
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0; // Opcional: rebobinar al salir
        }
    };

    return (
        <div
            className="relative aspect-video bg-gray-700 rounded-xl overflow-hidden shadow-xl group transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Video: se muestra solo en hover o si isHovering es true */}
            <video
                ref={videoRef}
                loop
                muted
                playsInline
                preload="metadata" // Carga metadatos para obtener dimensiones, etc.
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
                    isHovering ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
                // No se necesita poster aquí si la imagen de abajo lo cubre
            >
                <source src={videoSrc} type="video/mp4" />
                Tu navegador no soporta videos HTML5.
            </video>

            {/* Imagen de previsualización: se muestra cuando no se hace hover */}
            <img
                src={posterSrc}
                alt={`Previsualización de ${title}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
                    isHovering ? 'opacity-0' : 'opacity-100'
                }`}
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src="https://placehold.co/600x400/FF0000/FFFFFF?text=Error+Poster";
                }}
            />

            {/* Contenido de texto superpuesto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6 z-20">
                <h3 className="text-white text-xl md:text-2xl font-semibold drop-shadow-md">{title}</h3>
                <p className="text-gray-200 text-sm md:text-base mt-1 drop-shadow-sm">{description}</p>
            </div>
        </div>
    );
};

const Gallery = () => {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        const sectionEl = sectionRef.current;
        const titleEl = titleRef.current;
        const gridEl = gridRef.current;

        // Animación de entrada para el título y la galería
        const tlEntrance = gsap.timeline({
            scrollTrigger: {
                trigger: sectionEl,
                start: 'top center+=100',
                toggleActions: 'play none none none',
                // markers: true,
            },
        });

        tlEntrance
            .fromTo(titleEl, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
            .fromTo(
                gridEl.children, // Animar cada tarjeta de la galería
                { opacity: 0, y: 50, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'back.out(1.4)',
                    stagger: 0.2, // Animar las tarjetas una tras otra
                },
                "-=0.5"
            );

        return () => {
            tlEntrance.kill();
        }
    }, []);

    return (
        <section ref={sectionRef} id="video-gallery" className="py-16 md:py-24 bg-gray-900">
            <div className="container mx-auto px-4">
                <h2 ref={titleRef} className="text-4xl sm:text-5xl font-bold text-center mb-12 md:mb-16 text-sky-400 opacity-0">
                    Destellos Urbanos: Momentos Capturados
                </h2>
                <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    {galleryItemsData.map((item) => (
                        <GalleryCard
                            key={item.id}
                            title={item.title}
                            videoSrc={item.videoSrc}
                            posterSrc={item.posterSrc}
                            description={item.description}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
