import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../CssFolder/Bill.css";
import { Divider } from "keep-react";
import { Button } from "keep-react";
import { setPassengerInfoButton, setSaveInfoButton } from "../../redux/slices/booking/bookingslices.jsx";

const Bills = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const navigate = useNavigate();

    const handleButtonClick = () => {
        dispatch(setPassengerInfoButton(!state.booking.passengerInfoButton));
        dispatch(setSaveInfoButton(!state.booking.saveInfoButton));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // const token = localStorage.getItem("token");
            const token = state.booking.token;
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await fetch("http://localhost:5000/api/auth/RouteData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Include token in Authorization header
                },
                body: JSON.stringify({
                    departure_City: state.booking.departureAirport.city,
                    departure_Airport: state.booking.departureAirport.name,
                    arrival_City: state.booking.arrivalAirport.city,
                    arrival_Airport: state.booking.arrivalAirport.name,
                    travel_Date: state.booking.currentDate,
                    traveller_Number: state.booking.selectedNoOfTravellers.Totalcount,
                    traveller_Class: state.booking.selectedTravelClass,
                    fare_Type: state.booking.selectedFares,
                    airline_Name: state.booking.departureAirline.name,
                    flight_Number: state.booking.departureFlight.flight_number,
                    departure_Time: state.booking.flightDetail.departure,
                    arrival_Time: state.booking.flightDetail.arrival,
                    total_duration: state.booking.flightDetail.time,
                    stop: state.booking.flightDetail.stop,
                    status: state.booking.routeStatus,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Something went wrong");
            }
            navigate("/PassengerInfo");
            console.log("Data stored successfully");
        } catch (error) {
            console.error("Error:", error.message);
            // Display error message in the UI
        }

        // Log the data being sent in the request
        console.log("Form data:", {
            departure_City: state.booking.departureAirport.city,
            departure_Airport: state.booking.departureAirport.name,
            arrival_City: state.booking.arrivalAirport.city,
            arrival_Airport: state.booking.arrivalAirport.name,
            travel_Date: state.booking.currentDate,
            traveller_Number: state.booking.selectedNoOfTravellers.Totalcount,
            traveller_Class: state.booking.selectedTravelClass,
            fare_Type: state.booking.selectedFares,
            airline_Name: state.booking.departureAirline.name,
            flight_Number: state.booking.departureFlight.flight_number,
            departure_Time: state.booking.flightDetail.departure,
            arrival_Time: state.booking.flightDetail.arrival,
            total_duration: state.booking.flightDetail.time,
            stop: state.booking.flightDetail.stop,
        });
    };

    return (
        <div className="billpanel font-sans mt-16">
            <form onSubmit={handleSubmit}>
                <div className="FlightBill">
                    <div className="departure_info">
                        <div>
                            <img src={state.booking.departureAirline.logo_url} alt="logo" className="airline_logo" />
                        </div>
                        <div className="FlightInfo">
                            <div className="departure_airline">{state.booking.departureAirline.name}</div>
                            <div className="flight_number">{state.booking.departureFlight.flight_number}</div>
                        </div>
                    </div>
                    <Divider size="lg" />
                    <div className="FlightTime">
                        <div className="duration">
                            {state.booking.flightDetail?.departure || ""} - {state.booking.flightDetail?.arrival || ""}
                        </div>
                        <div className="duration">{state.booking.flightDetail.time}</div>
                        <div className="flight_number"> {state.booking.flightDetail?.stop}</div>
                    </div>
                    <Divider size="lg" />
                    <div className="Amount">
                        <div className="AmountInfo">
                            <div className="departure_airline_bill">Subtotal</div>
                            <div className="departure_airline_bill">Taxes and Fees</div>
                            <div className="departure_airline_bill">Total</div>
                        </div>
                        <div className="AmountInfo">
                            <div className="departure_airline_bill">₹ {state.booking.flightDetail?.Subprice || "0"}</div>
                            <div className="departure_airline_bill">₹ {state.booking.flightDetail?.Taxes || "0"}</div>
                            <div className="departure_airline_bill">₹ {state.booking.flightDetail?.price || "0"}</div>
                        </div>
                    </div>
                </div>
                {!state.booking.passengerInfoButton && (
                    <div className="button_save">
                        <button className="Save_and_close" onClick={handleButtonClick}>
                            Save and close
                        </button>
                    </div>
                )}
                {state.booking.passengerInfoButton && (
                    <Button color="primary" className="button_next" type="submit">
                        Passenger information
                    </Button>
                )}
            </form>
        </div>
    );
};

export default Bills;
