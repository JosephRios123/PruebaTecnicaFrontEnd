import { useState, useEffect, useRef } from 'react'; 
import axios from 'axios';
import Reserve from './Reserve';


function Flights() {
    const [departureCity, setDepartureCity] = useState("");
    const [arrivalCity, setArrivalCity] = useState("");
    const [departureDate, setDepartureDate] = useState("");
    const [adult] = useState(1);
    const [child] = useState(0);
    const [baby] = useState(0);
    const [flights, setFlights] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [airlineFilter, setAirlineFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [focusedInput, setFocusedInput] = useState(null);
    const [loadingDepartureSuggestions, setLoadingDepartureSuggestions] = useState(false);
    const [loadingArrivalSuggestions, setLoadingArrivalSuggestions] = useState(false);
    const departureInputRef = useRef(null);
    const arrivalInputRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);


    const handleReserve = (flight) => {
        console.log(flight); // Para verificar la estructura del objeto
        setSelectedFlight(flight);
        setIsModalOpen(true);
    };
    
    
    

    const fetchAirports = async (city, isDeparture) => {
        try {
            if (isDeparture) {
                setLoadingDepartureSuggestions(true);
            } else {
                setLoadingArrivalSuggestions(true);
            }
            const response = await axios.post('http://localhost:8000/api/airports', { code: city });
            setSuggestions(response.data); 
        } catch (error) {
            console.error("Error fetching airports:", error);
        } finally {
            if (isDeparture) {
                setLoadingDepartureSuggestions(false);
            } else {
                setLoadingArrivalSuggestions(false);
            }
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (focusedInput === 'departure' && departureCity) {
                fetchAirports(departureCity, true);
            } else if (focusedInput === 'arrival' && arrivalCity) {
                fetchAirports(arrivalCity, false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [departureCity, arrivalCity, focusedInput]);

    const getSuggestionStyle = () => {
        const inputRef = focusedInput === 'departure' ? departureInputRef : arrivalInputRef;
        if (!inputRef.current) return {};

        const rect = inputRef.current.getBoundingClientRect();
        return {
            position: 'absolute',
            top: `${rect.bottom + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
            backgroundColor: '#333',
            color: '#fff',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            padding: '10px',
            width: `${rect.width}px`,
            fontSize: '0.9em',
            zIndex: 1000,
        };
    };

    const itemsPerPage = 5;
    const filteredFlights = flights.filter((flight) => {
        const matchesAirline = airlineFilter ? flight.marketingCarrier.includes(airlineFilter) : true;
        const matchesDate = dateFilter ? flight.dateOfDeparture.startsWith(dateFilter) : true;
        return matchesAirline && matchesDate;
    });
    
    const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
    const paginatedFlights = filteredFlights.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Función para actualizar el total de pasajeros
    const qtyPassengers = adult + child + baby;


    const fetchFlights = () => {
        setError(null);
        const requestBody = {
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

        const totalPassengers = parseInt(adult) + parseInt(child) + parseInt(baby);
        if (totalPassengers !== parseInt(qtyPassengers)) {
            setError('La cantidad total de pasajeros debe ser la suma de los adultos, niños y bebés');
            return;
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

    const selectSuggestion = (iataCode, inputType) => {
        if (inputType === 'departure') {
            setDepartureCity(iataCode); // Guarda solo el IATA
        } else {
            setArrivalCity(iataCode); // Guarda solo el IATA
        }
        setSuggestions([]); // Limpia las sugerencias
        setFocusedInput(null);
    };

    return (
        <div className="App">
            <h2>Búsqueda de Vuelos</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div>
                <input 
                    type="text" 
                    value={departureCity} 
                    onChange={(e) => setDepartureCity(e.target.value)}
                    placeholder="Ciudad de Salida" 
                    ref={departureInputRef}
                    onFocus={() => setFocusedInput('departure')}
                    onBlur={() => setFocusedInput(null)}
                    style={inputStyle}
                />
                {loadingDepartureSuggestions && <span className="loader" style={{ marginLeft: '10px' }}>🔄</span>} {/* Icono de carga */}
            </div>
            <div>
                <input 
                    type="text" 
                    value={arrivalCity} 
                    onChange={(e) => setArrivalCity(e.target.value)}
                    placeholder="Ciudad de Llegada" 
                    ref={arrivalInputRef}
                    onFocus={() => setFocusedInput('arrival')}
                    onBlur={() => setFocusedInput(null)}
                    style={inputStyle}
                />
                {loadingArrivalSuggestions && <span className="loader" style={{ marginLeft: '10px' }}>🔄</span>} {/* Icono de carga */}
            </div>

                {/* Contenedor de Sugerencias */}
                {suggestions.length > 0 && focusedInput && (
                    <div style={getSuggestionStyle()}>
                        {suggestions.map((airport, index) => (
                            <div 
                                key={index} 
                                onMouseDown={() => selectSuggestion(airport.iata, focusedInput)} // Seleccionar IATA
                                style={{
                                    padding: '5px 10px',
                                    cursor: 'pointer',
                                    borderRadius: '4px',
                                    transition: 'background-color 0.2s',
                                }}
                            >
                                {airport.city} - {airport.country} ({airport.iata})
                            </div>
                        ))}
                    </div>
                )}

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
                <div>
                    <button type="submit" style={{ marginTop: '20px' }}>Buscar Vuelos</button>       
                </div>
            </form>

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
                {paginatedFlights.length > 0 ? (
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
                            <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Reservar</th>
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
                                <td style={{ padding: '12px' }}>{flight.locationId.departureCity}</td>
                                <td style={{ padding: '12px' }}>{flight.locationId.arrivalCity}</td>
                                <td>
                                    <button 
                                        onClick={() => handleReserve(flight)} // Llama a la función de reserva
                                        style={{ 
                                            backgroundColor: '#646CFF', 
                                            color: '#fff', 
                                            border: 'none', 
                                            borderRadius: '5px', 
                                            padding: '5px 10px',
                                            cursor: 'pointer'
                                        }}>
                                        Reservar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                ) : (
                    <p style={{ color: '#fff' }}>No se encontraron vuelos.</p>
                )}
            </div>

            {/* Mostrar modal solo si hay un vuelo seleccionado */}
            {isModalOpen && selectedFlight && (
                <Reserve 
                    flightData={selectedFlight} 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                />
            )}

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
