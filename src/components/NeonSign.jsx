import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const NeonSign = ({ text, color = 'sky', initialDelay = 0, lang }) => {
  const signRef = useRef(null);

  let fontFamily = 'sans-serif';
  if (lang === 'ja') fontFamily = "'Noto Sans JP', sans-serif";
  if (lang === 'ko') fontFamily = "'Noto Sans KR', sans-serif";
  if (lang === 'zh') fontFamily = "'Noto Sans SC', sans-serif";

  // Solo las clases de color de texto y la sombra base. El hover lo manejará GSAP.
  const baseNeonColors = {
    sky: 'text-sky-400 filter drop-shadow-[0_0_5px_#0ea5e9]',
    pink: 'text-pink-400 filter drop-shadow-[0_0_5px_#ec4899]',
    green: 'text-green-400 filter drop-shadow-[0_0_5px_#4ade80]',
    purple: 'text-purple-400 filter drop-shadow-[0_0_5px_#a855f7]',
    red: 'text-red-400 filter drop-shadow-[0_0_5px_#f87171]',
    yellow: 'text-yellow-400 filter drop-shadow-[0_0_5px_#facc15]',
  };

  // Valores de sombra para GSAP
  const shadowValues = {
    sky: { base: 'drop-shadow(0px 0px 5px #0ea5e9)', hover: 'drop-shadow(0px 0px 20px #0ea5e9) drop-shadow(0px 0px 10px #0ea5e9)' },
    pink: { base: 'drop-shadow(0px 0px 5px #ec4899)', hover: 'drop-shadow(0px 0px 20px #ec4899) drop-shadow(0px 0px 10px #ec4899)' },
    green: { base: 'drop-shadow(0px 0px 5px #4ade80)', hover: 'drop-shadow(0px 0px 20px #4ade80) drop-shadow(0px 0px 10px #4ade80)' },
    purple: { base: 'drop-shadow(0px 0px 5px #a855f7)', hover: 'drop-shadow(0px 0px 20px #a855f7) drop-shadow(0px 0px 10px #a855f7)' },
    red: { base: 'drop-shadow(0px 0px 5px #f87171)', hover: 'drop-shadow(0px 0px 20px #f87171) drop-shadow(0px 0px 10px #f87171)' },
    yellow: { base: 'drop-shadow(0px 0px 5px #facc15)', hover: 'drop-shadow(0px 0px 20px #facc15) drop-shadow(0px 0px 10px #facc15)' },
  };

  const selectedShadows = shadowValues[color] || shadowValues.sky;

  useEffect(() => {
    const signElement = signRef.current;
    if (!signElement) return;

    // Limpiar animaciones previas en este elemento
    gsap.killTweensOf(signElement);

    // Animación de "encendido" del neón
    const tlOn = gsap.timeline();
    tlOn.fromTo(
        signElement,
        { opacity: 0, scale: 0.8, filter: 'drop-shadow(0 0 2px #000000)' },
        {
          opacity: 1,
          scale: 1,
          filter: selectedShadows.base, // Usa la sombra base definida para GSAP
          duration: 1,
          delay: initialDelay + 0.5,
          ease: 'elastic.out(1, 0.75)',
        }
    );

    // Sutil animación de "zumbido" o parpadeo
    const tlBuzz = gsap.timeline({ delay: initialDelay + 1.5, repeat: -1, yoyo: true });
    tlBuzz.to(signElement, {
      opacity: 0.9,
      duration: 0.15,
      ease: 'rough({ template: none.out, strength: 0.5, points: 10, taper: none, randomize: true, clamp: false})',
    }).to(signElement, { // Asegura que vuelva a la opacidad completa después del "bajón"
      opacity: 1,
      duration: 0.15,
    });


    // Event listeners para el hover con GSAP
    const handleMouseEnter = () => {
      gsap.to(signElement, {
        filter: selectedShadows.hover, // Aplica la sombra intensa
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(signElement, {
        filter: selectedShadows.base, // Vuelve a la sombra base
        duration: 0.3,
        ease: 'power2.inOut',
      });
    };

    signElement.addEventListener('mouseenter', handleMouseEnter);
    signElement.addEventListener('mouseleave', handleMouseLeave);

    // Limpieza al desmontar
    return () => {
      tlOn.kill();
      tlBuzz.kill();
      signElement.removeEventListener('mouseenter', handleMouseEnter);
      signElement.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(signElement); // Asegura que todas las animaciones de este elemento se detengan
    };
  }, [text, color, initialDelay, lang, selectedShadows]);

  return (
      <div
          ref={signRef}
          // Aplicamos solo la clase de color de texto base. El filtro lo maneja GSAP.
          className={`font-bold p-4 m-2 rounded-lg transition-colors duration-300 opacity-0 ${baseNeonColors[color] ? baseNeonColors[color].split(' ')[0] : 'text-sky-400'}`}
          style={{ fontFamily: fontFamily, fontSize: 'clamp(1.5rem, 5vw, 3rem)', filter: 'drop-shadow(0 0 2px #000000)' }} // Estado inicial del filtro para GSAP
      >
        {text}
      </div>
  );
};

export default NeonSign;
