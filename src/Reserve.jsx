import { useState } from 'react';

function GuardarReservas() {
    const [qtyPassengers, setQtyPassengers] = useState('');
    const [adult, setAdult] = useState('');
    const [child, setChild] = useState('');
    const [baby, setBaby] = useState('');
    const [departureCity, setDepartureCity] = useState('');
    const [arrivalCity, setArrivalCity] = useState('');
    const [departureHour, setDepartureHour] = useState('');
    const [errors, setErrors] = useState([]); // Cambiado a errors
    const [successMessage, setSuccessMessage] = useState('');

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

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]); // Limpiar errores
        setSuccessMessage('');

        const requestBody = {
            qty_passengers: Number(qtyPassengers),
            adult: Number(adult),
            child: Number(child),
            baby: Number(baby),
            itineraries: [
                {
                    departureCity,
                    arrivalCity,
                    hour: departureHour,
                },
            ],
        };

        fetch("http://localhost:8000/api/reserve", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error.join('\n')); // Suponiendo que `data.error` es un array
                    });
                }
                return response.json();
            })
            .then(data => {
                setSuccessMessage(data.message);
                setErrors([]); // Limpiar errores
            })
            .catch(err => {
                setErrors(err.message.split('\n')); // Guarda el mensaje de error como un array
                setSuccessMessage('');
            });
    };

    return (
        <div className="App">
            <h2>Guardar Reservas</h2>
            <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                <input 
                    type="number" 
                    value={qtyPassengers} 
                    onChange={(e) => setQtyPassengers(e.target.value)} 
                    placeholder="Cantidad de Pasajeros" 
                    min="1" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="number" 
                    value={adult} 
                    onChange={(e) => setAdult(e.target.value)} 
                    placeholder="Cantidad de Adultos" 
                    min="1" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="number" 
                    value={child} 
                    onChange={(e) => setChild(e.target.value)} 
                    placeholder="Cantidad de Niños" 
                    min="0" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
                <input 
                    type="number" 
                    value={baby} 
                    onChange={(e) => setBaby(e.target.value)} 
                    placeholder="Cantidad de Bebés" 
                    min="0" 
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
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
                    type="datetime-local" 
                    value={departureHour} 
                    onChange={(e) => setDepartureHour(e.target.value)} 
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
                }}>Guardar Reserva</button>            </form>

            {/* Mostrar errores en texto rojo, uno debajo del otro y centrados */}
            {errors.length > 0 && (
                <div style={{ color: 'red', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                    {errors.map((err, index) => (
                        <p key={index} style={{ margin: '0' }}>{err}</p>
                    ))}
                </div>
            )}

            {/* Mostrar mensaje de éxito en texto verde */}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </div>
    );
}

export default GuardarReservas;
