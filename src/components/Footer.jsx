import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
// Importa iconos de Lucide-React si los vas a usar
import { Github, Linkedin, Twitter, Youtube } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const SocialLink = ({ href, icon: Icon, label, neonColorClass }) => {
    const linkRef = useRef(null);

    useEffect(() => {
        const el = linkRef.current;
        if (!el) return;

        const iconEl = el.querySelector('svg');

        const tl = gsap.timeline({ paused: true });
        tl.to(iconEl, { scale: 1.2, duration: 0.2, ease: 'power1.inOut' })
            .to(el, { filter: `drop-shadow(0 0 10px var(--neon-glow-color)) drop-shadow(0 0 5px var(--neon-glow-color))`, duration: 0.2 }, "<");

        const handleMouseEnter = () => {
            // Extraer el color base del texto para el brillo
            const currentColor = window.getComputedStyle(el).color;
            el.style.setProperty('--neon-glow-color', currentColor);
            tl.play();
        }
        const handleMouseLeave = () => tl.reverse();

        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            el.removeEventListener('mouseenter', handleMouseEnter);
            el.removeEventListener('mouseleave', handleMouseLeave);
            tl.kill();
            gsap.killTweensOf(el);
        };
    }, [neonColorClass]);

    return (
        <a
            ref={linkRef}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`p-2 transition-colors duration-300 hover:opacity-100 ${neonColorClass || 'text-gray-400 hover:text-sky-400'}`}
            style={{ filter: 'drop-shadow(0 0 3px transparent)' }} // Estado inicial para GSAP
        >
            <Icon size={24} strokeWidth={2} />
        </a>
    );
};


const Footer = () => {
    const footerRef = useRef(null);
    const brandRef = useRef(null);
    const copyrightRef = useRef(null);
    const madeWithRef = useRef(null);
    const socialLinksRef = useRef(null);
    const dividerRef = useRef(null);

    const currentYear = new Date().getFullYear();

    useEffect(() => {
        const footerEl = footerRef.current;
        if (!footerEl) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: footerEl,
                start: 'top bottom-=100px', // Inicia cuando 100px desde abajo del footer entra en el viewport
                toggleActions: 'play none none none',
                // markers: true, // Para depuración
            },
            defaults: { ease: 'power2.out', duration: 0.8 }
        });

        // 1. Animación de la línea divisoria
        tl.fromTo(dividerRef.current,
            { width: '0%' },
            { width: '100%', duration: 1, ease: 'power3.inOut' }
        );

        // 2. Animación del "logo" o nombre de la página
        tl.fromTo(brandRef.current,
            { opacity: 0, y: 20, filter: 'drop-shadow(0 0 0px transparent)' },
            {
                opacity: 1,
                y: 0,
                filter: 'drop-shadow(0 0 8px #0ea5e9) drop-shadow(0 0 3px #0ea5e9)', // Efecto neón sky
                duration: 1,
                delay: 0.2
            },
            "-=0.7" // Superponer con la línea
        );
        // Pequeño parpadeo para el logo
        gsap.to(brandRef.current, {
            opacity: 0.8,
            filter: 'drop-shadow(0 0 5px #0ea5e9)',
            duration: 0.1,
            repeat: -1,
            yoyo: true,
            delay: 2, // Comienza después de la animación de entrada
            ease: 'rough({strength: 1, points: 5, template: none.out, taper: none, randomize: true, clamp: false})'
        });


        // 3. Animación del texto "Hecho con..."
        if (madeWithRef.current) {
            const madeWithText = madeWithRef.current;
            const words = madeWithText.textContent.split(" ");
            madeWithText.innerHTML = ""; // Limpiar el contenido original
            words.forEach(word => {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = word + " ";
                wordSpan.style.display = "inline-block"; // Necesario para transformaciones individuales
                wordSpan.style.opacity = "0";
                wordSpan.style.transform = "translateY(10px)";
                madeWithText.appendChild(wordSpan);
            });

            tl.to(madeWithText.children, {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                duration: 0.5
            }, "-=0.5");
        }

        // 4. Animación de los iconos sociales
        if (socialLinksRef.current) {
            tl.fromTo(socialLinksRef.current.children,
                { opacity: 0, y: 15, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.5 },
                "-=0.3"
            );
        }


        // 5. Animación del texto de copyright
        tl.fromTo(copyrightRef.current,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.6 },
            "-=0.4"
        );

        return () => {
            tl.kill();
            gsap.killTweensOf([brandRef.current, dividerRef.current, copyrightRef.current, madeWithRef.current, socialLinksRef.current?.children]);
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === footerEl) {
                    trigger.kill();
                }
            });
        }

    }, []);

    return (
        <footer
            ref={footerRef}
            className="relative bg-black text-gray-400 py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
        >
            {/* Línea divisoria superior animada */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-sky-500 to-transparent" ref={dividerRef} style={{width: '0%'}}></div>

            <div className="container mx-auto text-center">
                <div
                    ref={brandRef}
                    className="mb-6 text-3xl md:text-4xl font-black tracking-wider opacity-0"
                    // Estilo neón base aplicado aquí, GSAP lo refinará
                    style={{ color: '#0ea5e9' }} // Color base del neón (sky-500)
                >
                    ASIA <span className="text-pink-400" style={{filter: 'drop-shadow(0 0 8px #ec4899)'}}>LIGHTS</span>
                </div>

                <div ref={socialLinksRef} className="flex justify-center space-x-6 mb-6">
                    <SocialLink href="#" icon={Github} label="GitHub" neonColorClass="text-purple-400 hover:text-purple-300" />
                    <SocialLink href="#" icon={Linkedin} label="LinkedIn" neonColorClass="text-sky-400 hover:text-sky-300" />
                    <SocialLink href="#" icon={Twitter} label="Twitter" neonColorClass="text-teal-400 hover:text-teal-300" />
                    <SocialLink href="#" icon={Youtube} label="YouTube" neonColorClass="text-red-500 hover:text-red-400" />
                </div>

                <p ref={madeWithRef} className="mb-4 text-sm text-gray-500 opacity-0">
                    Hecho con <span className="font-semibold text-sky-400" style={{filter: 'drop-shadow(0 0 4px #0ea5e9)'}}>React</span>, <span className="font-semibold text-teal-400" style={{filter: 'drop-shadow(0 0 4px #34d399)'}}>Tailwind</span>, <span className="font-semibold text-green-400" style={{filter: 'drop-shadow(0 0 4px #4ade80)'}}>GSAP</span> & <span className="font-semibold text-orange-400" style={{filter: 'drop-shadow(0 0 4px #fb923c)'}}>Rspack</span>.
                </p>

                <p ref={copyrightRef} className="text-xs text-gray-600 opacity-0">
                    &copy; {currentYear} Asia Lights Explorer. Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
