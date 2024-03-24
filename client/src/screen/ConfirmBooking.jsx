import React, { Suspense, useEffect } from "react";
import Container from "@mui/material/Container";
import { Alert } from "keep-react";
import { useDispatch, useSelector } from "react-redux";
//import { RiVisaLine } from "react-icons/ri";
import { format } from "date-fns";
//import UPI_payment_Image from "../assets/Upi.webp";
import { TailSpin } from "react-loader-spinner";
import "../components/CssFolder/ConfirmBooking.css";
import { setLoading } from "../redux/slices/booking/bookingslices.jsx";

const Navbar = React.lazy(() => import("../components/JsxFolder/Navbar.jsx"));
const PaymentBreakdown = React.lazy(() => import("../components/JsxFolder/PaymentBreakdown.jsx"));
const Footer = React.lazy(() => import("../components/JsxFolder/Footer.jsx"));

function ConfirmBooking() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    useEffect(() => {
        dispatch(setLoading(true));

        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);

    const Passenger_seat = () => {
        const getSeatInfo = (seatType) => {
            const selectedSeat = state.booking.selectSeat?.[seatType];

            if (selectedSeat && selectedSeat.length !== 0) {
                const seat = selectedSeat[0] || "--";
                const morePassengers = selectedSeat.length > 1 ? ` & more ${selectedSeat.length - 1} passenger` : "";
                return `${seat}${morePassengers}`;
            }

            return null;
        };

        const businessSeatInfo = getSeatInfo("Business");
        const economySeatInfo = getSeatInfo("Economy");

        return businessSeatInfo || economySeatInfo || "--";
    };

    const Flight_summary = (State_value) => {
        return (
            <>
                <p className="label_name p-0">
                    {State_value} <span>{format(state.booking.currentDate, "MMMM")} </span>
                    <span>{State_value === "Departing" ? format(state.booking.currentDate, "Do") : state.booking.flightDetail?.date}, </span>
                    <span>{format(state.booking.currentDate, "yyy ")}</span>
                </p>
                <section className="Departure_info border-2 rounded mb-3">
                    <div className="airline_logo_container">
                        <img src={state.booking.departureAirline?.logo_url || "--"} alt="logo" className="airline_logo m-3" />
                    </div>
                    <div className="airlineInfo">
                        <div className="duration">{state.booking.flightDetail?.time || "--"}</div>
                        <div className="Departure_airline">{state.booking.departureAirline?.name || "--"}</div>
                    </div>
                    <div className="Departure_arrival_time">
                        {state.booking.flightDetail?.departure || "--"} - {state.booking.flightDetail?.arrival || "--"}
                    </div>
                    <div className="stopInfo">
                        <div className="stops">{state.booking.flightDetail?.stop || "--"}</div>
                    </div>
                    <div className="Departure_price">₹ {state.booking.flightDetail?.price || "--"}</div>
                </section>
                <p className="seat_detail p-0">
                    <span className="user_related_info p-0">{Passenger_seat()}</span>
                    <span className="user_related_info p-0"> ({state.booking.selectedTravelClass}),</span>
                    <span className="user_related_info p-0"> {state.booking.selectedBags.count} checked bag</span>
                </p>
            </>
        );
    };

    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            <Container maxWidth="lg">
                {state.booking.loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <TailSpin visible={true} height="60" width="60" color="#605dec" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" />
                    </div>
                ) : (
                    <section className="screen_split font-sans">
                        <section className="user_container">
                            <Alert className="!max-w-[70rem] mb-4" color="success" withBg={true}>
                                <Alert.Container className="flex items-start">
                                    <Alert.Icon />
                                    <Alert.Body className="flex flex-col items-start gap-3">
                                    <Alert.Title className="text-body-2">Confirmation!</Alert.Title>
                                    <Alert.Description className="block w-full sm:line-clamp-none warning_message">
                                        Apologies for the inconvenience, our Scan n Pay server is temporarily unavailable; please use credit card details for transactions.
                                    </Alert.Description>
                                    </Alert.Body>
                                </Alert.Container>
                            </Alert>
                            <p className=" font-bold tracking-wider text-lg text-amber-400 pt-4 payment_label">Save Journey, {state.booking.passengerForm[0]?.firstName || "--"}!</p>
                            <p className="label_name p-0">Confirmation number: #381029404387</p>
                            <p className="user_related_info">
                                Thank you for booking your travel with FlyEase! Below is a summary of your trip to {state.booking.arrivalAirport?.iata || "DEl"} airport in {state.booking.arrivalAirport?.city || "New Delhi"},{" "}
                                {state.booking.arrivalAirport?.country || "India"}. We’ve sent a copy of your booking confirmation to your email address.
                            </p>
                            <section className="Flight summary">
                                <p className="Flight_summary_label">Flight summary</p>
                                <section>{Flight_summary("Departing")}</section>
                                <section>{Flight_summary("Arriving")}</section>
                            </section>
                        </section>
                        <section className="second_container p-2">
                            <section className="price_container">
                                <Suspense fallback={<div>Loading...</div>}>
                                    <PaymentBreakdown />
                                </Suspense>
                            </section>
                            {/* <section className="Payment_Method">
                                <p className="Flight_summary_label">Payment Method</p>
                                <div className={`Credit_card ${state.booking.paymentMethod === "Credit Card" ? "" : "disable"}`}>
                                    <RiVisaLine className="Visa_Icon" />
                                    <div className="Card_detail pt-4">
                                        <p>Gaurav</p>
                                        <div className="flex_info">
                                            <p>••••••••••••3456</p>
                                            <p>10/23</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <img className={`Gpayment ${state.booking.paymentMethod === "Credit Card" ? "disable" : ""}`} src={UPI_payment_Image} alt="Gpayment_Image" />
                                </div>
                            </section> */}
                        </section>
                    </section>
                )}
            </Container>
            <Suspense fallback={<div>Loading...</div>}>
                <Footer />
            </Suspense>
        </main>
    );
}

export default ConfirmBooking;
