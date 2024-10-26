import { useState, useEffect } from 'react';

function VerReservas() {
    const [reservas, setReservas] = useState([]);
    const [filteredReservas, setFilteredReservas] = useState([]);
    const [filters, setFilters] = useState({
        qtyPassengers: '',
        adult: '',
        child: '',
        baby: '',
        departureCity: '',
        arrivalCity: '',
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const totalPages = Math.ceil(filteredReservas.length / itemsPerPage);
    const paginatedReservas = filteredReservas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const inputStyle = {
        padding: '12px 15px',
        marginRight: '10px',
        border: '2px solid #444',
        borderRadius: '25px',
        width: '150px',
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

    const fetchReservas = () => {
        fetch("http://localhost:8000/api/obtenerReservas")
            .then(response => response.json())
            .then(data => {
                setReservas(data);
                setFilteredReservas(data); // Inicialmente muestra todas las reservas
            })
            .catch(error => {
                console.error("Error al obtener reservas:", error);
            });
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    useEffect(() => {
        const filtered = reservas.filter(reserva => {
            const matchesQtyPassengers = filters.qtyPassengers ? reserva.qty_passengers.toString() === filters.qtyPassengers : true;
            const matchesAdult = filters.adult ? reserva.adult.toString() === filters.adult : true;
            const matchesChild = filters.child ? reserva.child.toString() === filters.child : true;
            const matchesBaby = filters.baby ? reserva.baby.toString() === filters.baby : true;
            const matchesDeparture = filters.departureCity ? reserva.itineraries.some(itinerary => itinerary.departure_city.includes(filters.departureCity)) : true;
            const matchesArrival = filters.arrivalCity ? reserva.itineraries.some(itinerary => itinerary.arrival_city.includes(filters.arrivalCity)) : true;

            return matchesQtyPassengers && matchesAdult && matchesChild && matchesBaby && matchesDeparture && matchesArrival;
        });
        setFilteredReservas(filtered);
        setCurrentPage(1); // Reiniciar a la primera página al aplicar filtros
    }, [filters, reservas]);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="App">
            <h2>Ver Reservas</h2>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="number"
                    value={filters.qtyPassengers}
                    onChange={(e) => setFilters({ ...filters, qtyPassengers: e.target.value })}
                    placeholder="Filtrar por Cantidad de Pasajeros"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input
                    type="number"
                    value={filters.adult}
                    onChange={(e) => setFilters({ ...filters, adult: e.target.value })}
                    placeholder="Filtrar por Adultos"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input
                    type="number"
                    value={filters.child}
                    onChange={(e) => setFilters({ ...filters, child: e.target.value })}
                    placeholder="Filtrar por Niños"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input
                    type="number"
                    value={filters.baby}
                    onChange={(e) => setFilters({ ...filters, baby: e.target.value })}
                    placeholder="Filtrar por Bebés"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input
                    type="text"
                    value={filters.departureCity}
                    onChange={(e) => setFilters({ ...filters, departureCity: e.target.value })}
                    placeholder="Filtrar por Lugar de Salida"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input
                    type="text"
                    value={filters.arrivalCity}
                    onChange={(e) => setFilters({ ...filters, arrivalCity: e.target.value })}
                    placeholder="Filtrar por Lugar de Llegada"
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            </div>

            <div className="card" style={{ marginTop: '20px', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)' }}>
                {paginatedReservas.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', backgroundColor: '#1a1a1a', color: '#fff' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#646CFF', color: '#fff', textAlign: 'left' }}>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>ID</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Cantidad de Pasajeros</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Adultos</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Niños</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Bebés</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Fecha de Creación</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #444' }}>Itinerarios</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReservas.map((reserva) => (
                                <tr key={reserva.id} style={{ borderBottom: '1px solid #444' }}>
                                    <td style={{ padding: '12px' }}>{reserva.id}</td>
                                    <td style={{ padding: '12px' }}>{reserva.qty_passengers}</td>
                                    <td style={{ padding: '12px' }}>{reserva.adult}</td>
                                    <td style={{ padding: '12px' }}>{reserva.child}</td>
                                    <td style={{ padding: '12px' }}>{reserva.baby}</td>
                                    <td style={{ padding: '12px' }}>{new Date(reserva.created_at).toLocaleString()}</td>
                                    <td style={{ padding: '12px' }}>
                                        {reserva.itineraries.map((itinerary, index) => (
                                            <div key={index}>
                                                {itinerary.departure_city} - {itinerary.arrival_city} (Salida: {new Date(itinerary.departure_hour).toLocaleString()})
                                            </div>
                                        ))}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#fff' }}>No se encontraron reservas.</p>
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

export default VerReservas;
