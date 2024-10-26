import { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Airports from './Airports';
import Flights from './Flights';
import Reserve from './Reserve';
import ObtenerReservas from './ObtenerReservas';

function App() {
    const [hoveredButtonIndex, setHoveredButtonIndex] = useState(null); // Cambiar a índice de botón

    const buttonStyle = {
        borderRadius: '8px',
        padding: '0.6em 1.2em',
        fontSize: '1em',
        fontWeight: '500',
        fontFamily: 'inherit',
        backgroundColor: '#1a1a1a',
        color: '#ffffff', // Texto blanco
        cursor: 'pointer',
        transition: 'border-color 0.25s, background-color 0.25s', // Añadido para la transición del fondo
        textDecoration: 'none', // Para quitar el subrayado del enlace
        border: '1px solid transparent', // Estilo base sin borde visible
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ color: '#ffffff' }}>Sistema de Búsqueda de Vuelos</h1>
            <div style={{
                marginTop: '20px',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                backgroundColor: '#2a2a2a', // Fondo de la tarjeta
                padding: '20px'
            }}>
                <nav>
                    <ul style={{ listStyleType: 'none', padding: '0' }}>
                        {['/airports', '/flights', '/reserve', '/obtenerReservas'].map((path, index) => (
                            <li key={index} style={{ marginBottom: '20px' }}>
                                <Link
                                    to={path}
                                    style={{
                                        ...buttonStyle,
                                        border: hoveredButtonIndex === index ? '1px solid #646CFF' : '1px solid transparent'
                                    }} // Color morado en hover
                                    onMouseEnter={() => setHoveredButtonIndex(index)} // Cambiar a hovered
                                    onMouseLeave={() => setHoveredButtonIndex(null)} // Cambiar a no hovered
                                >
                                    {path === '/airports' && 'Obtener Aeropuertos'}
                                    {path === '/flights' && 'Obtener Vuelos'}
                                    {path === '/reserve' && 'Guardar una Reserva'}
                                    {path === '/obtenerReservas' && 'Ver Reservas'}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
            <Routes>
                <Route path="/airports" element={<Airports />} />
                <Route path="/flights" element={<Flights />} />
                <Route path="/reserve" element={<Reserve />} />
                <Route path="/obtenerReservas" element={<ObtenerReservas />} />
                {/* Otras rutas comentadas */}
            </Routes>
        </div>
    );
}

export default App;
