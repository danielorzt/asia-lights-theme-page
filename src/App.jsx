import React from 'react';
import NavBar from './components/NavBar'; // Importa la NavBar
import Hero from './components/Hero';
import Cities from './components/Cities';
import Featured from './components/Featured';
import Attention from './components/Attention';
import Gallery from './components/Gallery';
import NeonSignsShowcase from './components/NeonSignsShowcase';
import TechPulseAsia from './components/TechPulseAsia';
import CulturalEchoes from './components/CulturalEchoes';
import Footer from './components/Footer';

function App() {
	return (
		<div className="bg-gray-900 text-gray-100">
			<NavBar /> {/* Añade la NavBar aquí, fuera de cualquier sección principal */}
			<Hero />
			<Cities />
			<Featured />
			<Attention />
			<Gallery />
			<NeonSignsShowcase />
			<TechPulseAsia />
			<CulturalEchoes />
			<Footer />
		</div>
	);
}

export default App;
