import { useState } from 'react';
import PropTypes from 'prop-types';
import './Reserve.css'; // Importar estilos
import Swal from 'sweetalert2';

function Reserve({ flightData, isOpen, onClose }) {
    // Estado para los datos de los pasajeros
    const [passengerData, setPassengerData] = useState({
        qty_passengers: 1,
        adult: 1,
        child: 0,
        baby: 0,
    });

    // Calcular la cantidad total de pasajeros desde passengerData
    const qtyPassengers = passengerData.adult + passengerData.child + passengerData.baby;

    const handleAdultChange = (newAdultCount) => {
        setPassengerData((prevData) => {
            const newQtyPassengers = newAdultCount + prevData.child + prevData.baby;
            return {
                ...prevData,
                adult: newAdultCount,
                qty_passengers: newQtyPassengers,
            };
        });
    };

    const handleChildChange = (newChildCount) => {
        setPassengerData((prevData) => {
            const newQtyPassengers = prevData.adult + newChildCount + prevData.baby;
            return {
                ...prevData,
                child: newChildCount,
                qty_passengers: newQtyPassengers,
            };
        });
    };

    const handleBabyChange = (newBabyCount) => {
        setPassengerData((prevData) => {
            const newQtyPassengers = prevData.adult + prevData.child + newBabyCount;
            return {
                ...prevData,
                baby: newBabyCount,
                qty_passengers: newQtyPassengers,
            };
        });
    };

    // Verificar si flightData es null o indefinido y manejar el caso
    if (!flightData || !flightData.locationId || !flightData.locationId.departureCity) {
        return null; // o podrías mostrar un mensaje de error
    }

    const handleReserve = async () => {
        const itineraries = [
            {
                departureCity: flightData.locationId.departureCity,
                arrivalCity: flightData.locationId.arrivalCity,
                hour: `${flightData.dateOfDeparture}T${flightData.timeOfDeparture}`,
            },
        ];

        try {
            const response = await fetch('http://localhost:8000/api/reserve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    qty_passengers: passengerData.qty_passengers,
                    adult: passengerData.adult,
                    child: passengerData.child,
                    baby: passengerData.baby,
                    itineraries: itineraries,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.join(', '));
            }

            const data = await response.json();
            // Mensaje de éxito con SweetAlert
            Swal.fire({
                title: 'Éxito!',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'Aceptar',
            });
            onClose(); // Cerrar el modal después de la reserva
        } catch (error) {
            // Mensaje de error con SweetAlert
            Swal.fire({
                title: 'Error!',
                text: `Error: ${error.message}`,
                icon: 'error',
                confirmButtonText: 'Aceptar',
            });
        }
    };

    return (
        <div className={`modal ${isOpen ? 'is-active' : ''}`}>
            <div className="modal-background" onClick={onClose}></div>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Detalles de Reserva</h2>
                </div>
                <div className="modal-body">
                    <p><strong>Ciudad de Salida:</strong> {flightData.locationId.departureCity}</p>
                    <p><strong>Ciudad de Llegada:</strong> {flightData.locationId.arrivalCity}</p>
                    <p><strong>Fecha de Salida:</strong> {new Date(`${flightData.dateOfDeparture}T${flightData.timeOfDeparture}`).toLocaleString()}</p>
                    <p><strong>Aerolínea:</strong> {flightData.marketingCarrier}</p>

                    <div style={{ marginTop: '20px' }}>
                        <h3>Pasajeros: {qtyPassengers}</h3>
                        {qtyPassengers >= 9 && (
                            <p style={{ color: 'red' }}>¡No puedes agregar más de 9 pasajeros!</p>
                        )}
                        <div className="passenger-controls">
                            <div className="passenger-group">
                                <label>Adultos (12 años o más)</label>
                                <button
                                    type="button"
                                    onClick={() => handleAdultChange(passengerData.adult - 1)}
                                    disabled={passengerData.adult <= 1}
                                >
                                    -
                                </button>
                                <span>{passengerData.adult}</span>
                                <button
                                    type="button"
                                    onClick={() => handleAdultChange(passengerData.adult + 1)}
                                    disabled={qtyPassengers >= 9}
                                >
                                    +
                                </button>
                            </div>
                            <div className="passenger-group">
                                <label>Niños (2 a 11 años)</label>
                                <button
                                    type="button"
                                    onClick={() => handleChildChange(passengerData.child - 1)}
                                    disabled={passengerData.child <= 0}
                                >
                                    -
                                </button>
                                <span>{passengerData.child}</span>
                                <button
                                    type="button"
                                    onClick={() => handleChildChange(passengerData.child + 1)}
                                    disabled={qtyPassengers >= 9}
                                >
                                    +
                                </button>
                            </div>
                            <div className="passenger-group">
                                <label>Bebés (0 a 23 meses)</label>
                                <button
                                    type="button"
                                    onClick={() => handleBabyChange(passengerData.baby - 1)}
                                    disabled={passengerData.baby <= 0}
                                >
                                    -
                                </button>
                                <span>{passengerData.baby}</span>
                                <button
                                    type="button"
                                    onClick={() => handleBabyChange(passengerData.baby + 1)}
                                    disabled={qtyPassengers >= 9}
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="modal-button" onClick={onClose}>Cerrar</button>
                    <button className="modal-button" onClick={handleReserve}>Reservar</button>
                </div>
            </div>
        </div>
    );
}

// Definición de las propTypes para asegurarse de que se pasan las props correctas
Reserve.propTypes = {
    flightData: PropTypes.shape({
        dateOfDeparture: PropTypes.string.isRequired,
        timeOfDeparture: PropTypes.string.isRequired,
        locationId: PropTypes.shape({
            departureCity: PropTypes.string.isRequired,
            arrivalCity: PropTypes.string.isRequired,
        }).isRequired,
        marketingCarrier: PropTypes.string.isRequired,
    }),
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default Reserve;
