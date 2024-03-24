import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "../components/CssFolder/Search.css";
import { format } from "date-fns";
//import load from "../assets/load1.png"
import Container from "@mui/material/Container";
import { TailSpin } from "react-loader-spinner";
import { setPassengerInfoButton, setSaveInfoButton, setLoading } from "../redux/slices/booking/bookingslices.jsx";

const Navbar = React.lazy(() => import("../components/JsxFolder/Navbar.jsx"));
const Flight = React.lazy(() => import("../components/JsxFolder/Flight.jsx"));
const Bill = React.lazy(() => import("../components/JsxFolder/Bills.jsx"));
const Footer = React.lazy(() => import("../components/JsxFolder/Footer.jsx"));
const Fliter = React.lazy(() => import("../components/JsxFolder/Fliter.jsx"));

function Search() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const handleButtonClick = () => {
        dispatch(setPassengerInfoButton(!state.booking.passengerInfoButton));
        dispatch(setSaveInfoButton(!state.booking.saveInfoButton));
    };
    useEffect(() => {
        dispatch(setLoading(true));

        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 800);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            <section className="Screean_Container">
                <Container maxWidth="lg">
                    <div className="Booking_Status_Container font-sans">
                        <div className="Departure_Booking_Status">
                            <label htmlFor="DepartureCity">
                                <span className="Label">From</span>
                            </label>
                            <div className="Airport_Info">
                                <span className="Departure_City">{state.booking.departureAirport?.city || "Mumbai"}</span>
                                <span> - </span>
                                <span className="Departure_AirportName">{state.booking.departureAirport?.name || "Chhatrapati Shivaji Maharaj International"}</span>
                            </div>
                        </div>

                        <div className="Arrival_Booking_Status">
                            <label htmlFor="ArriavlCity">
                                <span className="Label">To</span>
                            </label>
                            <div className="Airport_Info">
                                <span className="Arrival_City">{state.booking.arrivalAirport?.city || "New Delhi"}</span>
                                <span> - </span>
                                <span className="Arrival_AirportName">{state.booking.arrivalAirport?.name || "Indira Gandhi International Airport"}</span>
                            </div>
                        </div>

                        <div className="TravellersClass_BookingSection">
                            <label htmlFor="DepartureDate">
                                <span className="Label">Departure</span>
                            </label>
                            <div className="DepartureDate">
                                <span className="day">{format(state.booking.currentDate, "EEE")},</span>
                                <span className="month">{format(state.booking.currentDate, "MMM")}</span>
                                <span className="date">{format(state.booking.currentDate, "dd ")},</span>
                                <span className="year">{format(state.booking.currentDate, "yyyy")}</span>
                            </div>
                        </div>

                        <div className="DepartureDate_BookingSection">
                            <label htmlFor="DepartureCity" className="Label">
                                <span className="DepartureLabel">Travellers & Class</span>
                            </label>
                            <div className="CountOfTravellers">
                                <span className="count">
                                    {(state.booking.selectedTravelDetails.selectedNoOfTravellers?.Adult ?? 1) + (state.booking.selectedTravelDetails.selectedNoOfTravellers?.Child ?? 0) + (state.booking.selectedTravelDetails.selectedNoOfTravellers?.Infant ?? 0)}
                                </span>
                                <span className="travellers"> Travellers, </span>
                                <span className="travellerClass">{state.booking.selectedTravelClass}</span>
                            </div>
                        </div>
                    </div>
                    {state.booking.loading ? (
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                            <TailSpin visible={true} height="60" width="60" color="#605dec" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" />
                            {/* <img src={load} alt="load" /> */}
                        </div>
                    ) : (
                        <Suspense fallback={<div>Loading...</div>}>
                            <div className="component_layout">
                                <div className="splitScreen">
                                    <Fliter />
                                    <Flight />
                                    <Bill />
                                </div>
                                {!state.booking.passengerInfoButton && (
                                    <div className="button_save">
                                        <button className="Save_and_close" onClick={handleButtonClick}>
                                            Save and close
                                        </button>
                                    </div>
                                )}
                                {state.booking.passengerInfoButton && (
                                    <div className="button_next">
                                        <button className="Save_and_close" onClick={handleButtonClick}>
                                            <NavLink className="passenger_info text-white" to="/PassengerInfo">
                                                Passenger information
                                            </NavLink>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </Suspense>
                    )}
                </Container>
                <Suspense fallback={<div>Loading...</div>}>
                    <div className="Adjustments">
                        <Footer />
                    </div>
                </Suspense>
            </section>
        </>
    );
}

export default Search;
