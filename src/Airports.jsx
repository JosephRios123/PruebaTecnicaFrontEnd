import { useState } from 'react';
import './App.css';

function Airports() {
    const [data, setData] = useState([]); // Cambiar a un array para manejar múltiples aeropuertos
    const [code, setCode] = useState(""); // Estado para almacenar el código de la ciudad
    const [error, setError] = useState(null); // Estado para manejar errores
    const [currentPage, setCurrentPage] = useState(1); // Estado para la página actual
    const [itemsPerPage] = useState(5); // Número de aeropuertos por página
    const [filter, setFilter] = useState(""); // Estado para el filtro

    const fetchAirports = () => {
        fetch("http://localhost:8000/api/airports", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Indicar el tipo de contenido
            },
            body: JSON.stringify({ code }) // Enviar el código en el cuerpo de la solicitud
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Hace falta el nombre de la ciudad');
                }
                return response.json();
            })
            .then(data => {
                setData(data); // Almacenar los datos obtenidos
                setError(null); // Limpiar el error
            })
            .catch(err => {
                setError(err.message); // Manejar el error
                setData([]); // Limpiar los datos
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        fetchAirports(); // Llamar a la función para obtener aeropuertos
    };

    // Cálculo de paginación
    const indexOfLastItem = currentPage * itemsPerPage; // Último índice del ítem
    const indexOfFirstItem = indexOfLastItem - itemsPerPage; // Primer índice del ítem
    const currentItems = data.slice(indexOfFirstItem, indexOfLastItem); // Ítems actuales a mostrar

    // Cambio de página
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Filtrar datos
    const filteredData = currentItems.filter(airport => 
        airport.name.toLowerCase().includes(filter.toLowerCase()) ||
        airport.city.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="App">
            <h2>Búsqueda de Aeropuertos</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} // Actualizar el estado con el valor del input
                    placeholder="Ingresa el nombre de la ciudad" 
                    style={{
                        padding: '12px 15px', // Mayor padding para comodidad
                        marginRight: '10px',
                        border: '2px solid #444', // Borde oscuro
                        borderRadius: '25px', // Bordes más redondeados para un look más suave
                        width: '300px',
                        fontSize: '1em',
                        fontFamily: 'Arial, sans-serif', // Fuente moderna
                        backgroundColor: '#1a1a1a', // Fondo negro
                        color: '#fff', // Texto blanco
                        transition: 'border-color 0.25s, box-shadow 0.25s, background-color 0.25s', // Transiciones suaves
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = '#646CFF'; // Color del borde al enfocar
                        e.target.style.boxShadow = '0 0 8px rgba(100, 108, 255, 0.6)'; // Sombra al enfocar
                        e.target.style.backgroundColor = '#2a2a2a'; // Fondo gris oscuro al enfocar
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = '#444'; // Restablecer color del borde al perder foco
                        e.target.style.boxShadow = 'none'; // Quitar sombra al perder foco
                        e.target.style.backgroundColor = '#1a1a1a'; // Volver al fondo negro
                    }}
                />
                <button type="submit" style={{
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    backgroundColor: '#646CFF',
                    color: '#fff',
                    fontSize: '1em',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                }}>Buscar Aeropuertos</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar error si hay */}
            <div style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    value={filter} 
                    onChange={(e) => setFilter(e.target.value)} // Actualizar el filtro
                    placeholder="Filtrar por nombre o ciudad" 
                    style={{
                        padding: '12px 15px',
                        marginRight: '10px',
                        border: '2px solid #444',
                        borderRadius: '25px',
                        width: '300px',
                        fontSize: '1em',
                        fontFamily: 'Arial, sans-serif',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                    }}
                />
            </div>
            <div className="card" style={{ marginTop: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}>
                {filteredData.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#1a1a1a', color: '#fff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#646CFF', color: '#fff', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>ID</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Aeropuerto</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Ciudad</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>País</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>IATA</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((airport) => (
                                <tr key={airport.id} style={{ borderBottom: '1px solid #444', transition: 'background-color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2a2a2a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1a1a1a'}>
                                    <td style={{ padding: '12px' }}>{airport.id}</td>
                                    <td style={{ padding: '12px' }}>{airport.name}</td>
                                    <td style={{ padding: '12px' }}>{airport.city}</td>
                                    <td style={{ padding: '12px' }}>{airport.country}</td>
                                    <td style={{ padding: '12px' }}>{airport.iata}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#fff' }}>No se encontraron aeropuertos.</p>
                )}
            </div>
            {/* Paginación */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
                <button 
                    onClick={() => paginate(1)} 
                    disabled={currentPage === 1} 
                    style={{ margin: '0 5px', padding: '10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                    {'<<'} {/* Flecha a la primera página */}
                </button>
                <button 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1} 
                    style={{ margin: '0 5px', padding: '10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                    {'<'} {/* Flecha hacia la página anterior */}
                </button>

                {/* Calcula el rango de páginas a mostrar */}
                {(() => {
                    const totalPages = Math.ceil(data.length / itemsPerPage);
                    const startPage = Math.max(1, currentPage - 2); // Empieza 2 páginas antes de la actual
                    const endPage = Math.min(totalPages, startPage + 4); // Muestra un máximo de 5 páginas

                    return [...Array(endPage - startPage + 1).keys()].map(index => (
                        <button 
                            key={startPage + index} 
                            onClick={() => paginate(startPage + index)} 
                            style={{
                                padding: '10px',
                                margin: '0 5px',
                                border: 'none',
                                borderRadius: '5px',
                                backgroundColor: currentPage === startPage + index ? '#646CFF' : '#444', // Color activo
                                color: '#fff',
                                cursor: 'pointer',
                            }}
                        >
                            {startPage + index}
                        </button>
                    ));
                })()}

                <button 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === Math.ceil(data.length / itemsPerPage)} 
                    style={{ margin: '0 5px', padding: '10px', cursor: currentPage === Math.ceil(data.length / itemsPerPage) ? 'not-allowed' : 'pointer' }}>
                    {'>'} {/* Flecha hacia la página siguiente */}
                </button>
                <button 
                    onClick={() => paginate(Math.ceil(data.length / itemsPerPage))} 
                    disabled={currentPage === Math.ceil(data.length / itemsPerPage)} 
                    style={{ margin: '0 5px', padding: '10px', cursor: currentPage === Math.ceil(data.length / itemsPerPage) ? 'not-allowed' : 'pointer' }}>
                    {'>>'} {/* Flecha a la última página */}
                </button>
            </div>

        </div>
    );
}

export default Airports;
