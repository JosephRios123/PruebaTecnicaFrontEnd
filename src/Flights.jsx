import { useState } from 'react';

function Flights() {
    const [departureCity, setDepartureCity] = useState(""); 
    const [arrivalCity, setArrivalCity] = useState(""); 
    const [departureDate, setDepartureDate] = useState(""); 
    const [qtyPassengers, setQtyPassengers] = useState(1); 
    const [adult, setAdult] = useState(1); 
    const [child, setChild] = useState(0); // Nuevo estado para niños
    const [baby, setBaby] = useState(0); // Nuevo estado para bebés
    const [searchs, setSearchs] = useState(2); 
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState(null); 
    const [currentPage, setCurrentPage] = useState(1);
    const [airlineFilter, setAirlineFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    const itemsPerPage = 5;
    const filteredFlights = flights.filter((flight) => {
        const matchesAirline = airlineFilter ? flight.marketingCarrier.includes(airlineFilter) : true;
        const matchesDate = dateFilter ? flight.dateOfDeparture.startsWith(dateFilter) : true; // Cambiado para usar startsWith en lugar de includes
        return matchesAirline && matchesDate;
    });
    

    const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
    const paginatedFlights = filteredFlights.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const fetchFlights = () => {
        setError(null);
    
        const requestBody = {
            searchs,
            qtyPassengers,
            adult,
            child,
            baby,
            itinerary: [{
                departureCity,
                arrivalCity,
                hour: new Date(departureDate).toISOString()
            }]
        };
    
        // Validación adicional para la suma de pasajeros
        const totalPassengers = parseInt(adult) + parseInt(child) + parseInt(baby);
        if (totalPassengers !== parseInt(qtyPassengers)) {
            setError('La cantidad total de pasajeros debe ser la suma de los adultos, niños y bebés');
            return; // Detener el flujo si hay error
        }
    
        fetch("http://localhost:8000/api/flights", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    console.error("Error en la respuesta:", data);
                    throw new Error("Intentelo de nuevo... Para más información, observe la consola del navegador.")
                });
            }
            return response.json();
        })
        .then(data => {
            setFlights(data.data);
            setError(null);
        })
        .catch(err => {
            console.error("Error en la solicitud:", err);
            setError(err.message);
            setFlights([]);
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchFlights();
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const inputStyle = {
        padding: '12px 15px',
        marginRight: '10px',
        border: '2px solid #444',
        borderRadius: '25px',
        width: '300px',
        fontSize: '1em',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        transition: 'border-color 0.25s, box-shadow 0.25s, background-color 0.25s',
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = '#646CFF';
        e.target.style.boxShadow = '0 0 8px rgba(100, 108, 255, 0.6)';
        e.target.style.backgroundColor = '#2a2a2a';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = '#444';
        e.target.style.boxShadow = 'none';
        e.target.style.backgroundColor = '#1a1a1a';
    };

    return (
        <div className="App">
            <h2>Búsqueda de Vuelos</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input 
                    type="text" 
                    value={departureCity} 
                    onChange={(e) => setDepartureCity(e.target.value)} 
                    placeholder="Ciudad de Salida (Ej. MDE)" 
                    required 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="text" 
                    value={arrivalCity} 
                    onChange={(e) => setArrivalCity(e.target.value)} 
                    placeholder="Ciudad de Llegada (Ej. BOG)" 
                    required 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="number" 
                    value={qtyPassengers === 1 ? '' : qtyPassengers} 
                    onChange={(e) => setQtyPassengers(e.target.value)} 
                    placeholder="Cantidad de Pasajeros" 
                    min="1" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="number" 
                    value={adult === 1 ? '' : adult}  
                    onChange={(e) => setAdult(e.target.value)} 
                    placeholder="Cantidad de Adultos" 
                    min="1" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="number" 
                    value={child === 0 ? '' : child}  // Cambiado para permitir el placeholder
                    onChange={(e) => setChild(e.target.value)} 
                    placeholder="Cantidad de Niños" 
                    min="0" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="number" 
                    value={baby === 0 ? '' : baby}  // Cambiado para permitir el placeholder
                    onChange={(e) => setBaby(e.target.value)} 
                    placeholder="Cantidad de Bebés" 
                    min="0" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="number" 
                    value={searchs === 2 ? '' : searchs}  
                    onChange={(e) => setSearchs(e.target.value)} 
                    placeholder="Cantidad de Resultados" 
                    min="1" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="datetime-local" 
                    value={departureDate} 
                    onChange={(e) => setDepartureDate(e.target.value)} 
                    placeholder='Fecha y hora del vuelo'
                    required 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
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
                }}>Buscar Vuelos</button>            </form>

            {/* Mostrar error en texto rojo */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    value={airlineFilter}
                    onChange={(e) => setAirlineFilter(e.target.value)}
                    placeholder="Filtrar por aerolínea"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    placeholder="Filtrar por fecha de salida"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            <div className="card" style={{ marginTop: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}>
                {paginatedFlights.length > 0 ? ( // Cambiar filteredFlights por paginatedFlights
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#1a1a1a', color: '#fff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#646CFF', color: '#fff', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Fecha de Salida</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Hora de Salida</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Fecha de Llegada</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Hora de Llegada</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Aerolínea</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Número de Vuelo</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Ciudad de Salida</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Ciudad de Llegada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFlights.map((flight, index) => ( 
                                <tr key={index} style={{ borderBottom: '1px solid #444' }}>
                                    <td style={{ padding: '12px' }}>{flight.dateOfDeparture}</td>
                                    <td style={{ padding: '12px' }}>{flight.timeOfDeparture}</td>
                                    <td style={{ padding: '12px' }}>{flight.dateOfArrival}</td>
                                    <td style={{ padding: '12px' }}>{flight.timeOfArrival}</td>
                                    <td style={{ padding: '12px' }}>
                                        <img 
                                            src={`https://pics.avs.io/60/60/${flight.marketingCarrier}.png`} 
                                            alt="Aerolínea" 
                                            style={{ width: '30px', height: '30px', marginRight: '10px' }}
                                        />
                                        {flight.marketingCarrier}
                                    </td>
                                    <td style={{ padding: '12px' }}>{flight.flightOrtrainNumber}</td>
                                    <td style={{ padding: '12px' }}>{flight.locationId.departureCity}</td> {/* Muestra la ciudad de salida */}
                                    <td style={{ padding: '12px' }}>{flight.locationId.arrivalCity}</td> {/* Muestra la ciudad de llegada */}
                                </tr>
                            ))}
                        </tbody>

                    </table>
                ) : (
                    <p style={{ color: '#fff' }}>No se encontraron vuelos.</p>
                )}
            </div>

            {/* Paginación centrada */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                {[...Array(totalPages).keys()].map((number) => (
                    <button
                        key={number + 1}
                        onClick={() => paginate(number + 1)}
                        style={{
                            padding: '10px',
                            margin: '0 5px',
                            border: 'none',
                            borderRadius: '5px',
                            backgroundColor: currentPage === number + 1 ? '#646CFF' : '#444', // Color activo
                            color: '#fff',
                            cursor: 'pointer',
                        }}
                    >
                        {number + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default Flights;
