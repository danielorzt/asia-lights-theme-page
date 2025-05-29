import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Menu, X } from 'lucide-react'; // Iconos para el menú móvil

gsap.registerPlugin(ScrollTrigger);

const navLinks = [
    { href: '#hero', label: 'Inicio' },
    { href: '#cities-slider', label: 'Ciudades' },
    { href: '#featured-video', label: 'Destacado' },
    { href: '#attention-grabbing', label: 'Atención' },
    { href: '#video-gallery', label: 'Galería' },
    { href: '#neon-showcase', label: 'Neones' },
    { href: '#tech-pulse', label: 'Tecnología' },
    { href: '#cultural-echoes', label: 'Cultura' },
    // Añade más enlaces a medida que creas secciones
];

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navRef = useRef(null);
    const brandRef = useRef(null); // Para el logo/marca

    // Efecto de cambio de fondo de la navbar al hacer scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Comprobar estado inicial al cargar

        // Animación de entrada para la navbar
        if (navRef.current) {
            gsap.fromTo(navRef.current,
                { y: -100, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.5 }
            );
        }
        // Animación para el logo/marca
        if (brandRef.current) {
            gsap.fromTo(brandRef.current,
                { opacity: 0, scale: 0.5, filter: 'drop-shadow(0 0 0px transparent)' },
                {
                    opacity: 1,
                    scale: 1,
                    filter: 'drop-shadow(0 0 10px #0ea5e9) drop-shadow(0 0 3px #0ea5e9)', // Efecto neón sky
                    duration: 1,
                    delay: 1, // Después de que la navbar aparezca
                    ease: 'elastic.out(1, 0.7)'
                }
            );
        }


        return () => {
            window.removeEventListener('scroll', handleScroll);
            gsap.killTweensOf(navRef.current);
            gsap.killTweensOf(brandRef.current);
        };
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLinkClick = (e, href) => {
        e.preventDefault();
        const targetElement = document.querySelector(href);
        if (targetElement) {
            // Calcular la posición del elemento, considerando la altura de la navbar si es fija
            const navHeight = navRef.current ? navRef.current.offsetHeight : 0;
            const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navHeight - 20; // 20px de espacio extra

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
        if (isMenuOpen) {
            setIsMenuOpen(false); // Cerrar menú móvil después de hacer clic
        }
    };

    return (
        <nav
            ref={navRef}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out opacity-0 ${
                isScrolled || isMenuOpen ? 'bg-gray-900/90 backdrop-blur-md shadow-lg' : 'bg-transparent'
            }`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Marca/Logo */}
                    <a
                        ref={brandRef}
                        href="#hero"
                        onClick={(e) => handleLinkClick(e, '#hero')}
                        className="text-2xl md:text-3xl font-black tracking-wider opacity-0" // Inicia invisible
                        style={{ color: '#0ea5e9' }} // Color base del neón (sky-500)
                    >
                        ASIA<span className="text-pink-400" style={{filter: 'drop-shadow(0 0 6px #ec4899)'}}>LIGHTS</span>
                    </a>

                    {/* Enlaces de Navegación para Desktop */}
                    <div className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={(e) => handleLinkClick(e, link.href)}
                                className="text-gray-300 hover:text-sky-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 relative group"
                            >
                                {link.label}
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                                {/* Efecto neón sutil en hover */}
                                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{boxShadow: '0 0 10px 2px #0ea5e9, inset 0 0 5px #0ea5e9'}}></span>
                            </a>
                        ))}
                    </div>

                    {/* Botón de Menú Móvil */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            type="button"
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Panel de Menú Móvil */}
            <div
                className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                    isMenuOpen ? 'max-h-screen opacity-100 visible' : 'max-h-0 opacity-0 invisible'
                }`}
                id="mobile-menu"
            >
                <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${isScrolled || isMenuOpen ? 'bg-gray-900/90' : 'bg-transparent'}`}>
                    {navLinks.map((link) => (
                        <a
                            key={`mobile-${link.label}`}
                            href={link.href}
                            onClick={(e) => handleLinkClick(e, link.href)}
                            className="text-gray-300 hover:bg-sky-700/30 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
