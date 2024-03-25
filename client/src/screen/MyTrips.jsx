import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../components/CssFolder/MyTrips.css";
import { MdArrowForwardIos } from "react-icons/md";
import { Button } from "keep-react";
import SuitCase from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/Suitcase.png";
import Ticket from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/Ticket.png";
import Complete from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/Complete.png";
import CompleteTrip from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/CompleteTrip.png";
import Cancel from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/Cancel.png";
import UpComing from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/UpComing.png";
import { TailSpin } from "react-loader-spinner";
import { setSelectedTripStatus,setLoading } from "../redux/slices/booking/bookingslices.jsx";
import {NavLink} from "react-router-dom";
import Container from "@mui/material/Container";

const Navbar = React.lazy(() => import("../components/JsxFolder/Navbar.jsx"));

function MyTrips() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const handleTripStatus = (status_name) => {
        dispatch(setSelectedTripStatus(status_name));
    };

    const getBannerWrapperClassName = () => {
        if (state.booking.selectedTripStatus === "UPCOMING") {
            return "myTripsBannerWrapper upcomingBanner";
        } else if (state.booking.selectedTripStatus === "CANCELLED") {
            return "myTripsBannerWrapper cancelledBanner";
        } else if (state.booking.selectedTripStatus === "COMPLETED") {
            return "myTripsBannerWrapper completedBanner";
        } else {
            return "myTripsBannerWrapper";
        }
    };
    useEffect(() => {
        dispatch(setLoading(true));

        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            {state.booking.loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <TailSpin visible={true} height="60" width="60" color="#605dec" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" />
                    </div>
                ) : (
                    <main className="MyTrip_section">
                <section className={getBannerWrapperClassName()}>
                    <Container maxWidth="lg">
                        <div className="Breadcrumb uppercase">
                            <span className="MyAccountlabel">My Account </span>
                            <span>
                                <MdArrowForwardIos />
                            </span>{" "}
                            <span>My Trips</span>
                        </div>
                    </Container>
                </section>
                <Container maxWidth="lg">
                <section className="TripStatus">
                    <ul className="TripStatus_Menu">
                        {[
                            { Image: SuitCase, Name: "UPCOMING" },
                            { Image: Ticket, Name: "CANCELLED" },
                            { Image: Complete, Name: "COMPLETED" },
                        ].map((status_name, index) => (
                            <li key={index} onClick={() => handleTripStatus(status_name.Name)} className={state.booking.selectedTripStatus === status_name.Name ? "active" : ""}>
                                <img src={status_name.Image} alt={status_name.Name} className={`Trips_image ${state.booking.selectedTripStatus !== status_name.Name ? "grayscale opacity-50" : ""}`} />
                                <span className={`font-semibold status_name ${state.booking.selectedTripStatus !== status_name.Name ? "grayscale opacity-50" : ""}`}>{status_name.Name}</span>
                            </li>
                        ))}
                    </ul>
                </section>
                <section className="TripStatusSection">
                    {[
                        { Image: UpComing, Name: "UPCOMING", title: "Looks empty, you've no upcoming bookings.", description: "When you book a trip, you will see your itinerary here." },
                        { Image: Cancel, Name: "CANCELLED", title: "Looks empty, you've no cancelled bookings.", description: "Great! Looks like you’ve no cancelled bookings." },
                        { Image: CompleteTrip, Name: "COMPLETED", title: "Looks empty, you've no completed bookings.", description: "Looks like You don’t have any completed trips." },
                    ].map((status, index) => (
                        <div className={`no-underline mb-2  ${state.booking.selectedTripStatus === status.Name ? "TripStatus_detail" : "hidden"}`} key={index}>
                            <div className="w-1/6 text-2xl mt-1 status_Image">
                                <img className="w-32 text-2xl mt-1 text-zinc-500 h-28" src={status.Image} alt={status.Name} />
                            </div>
                            <div className="w-5/6 status_Detail">
                                <p className="mb-1 text-slate-700 font-semibold text-2xl status_title">{status.title}</p>
                                <p className="mb-1 text-zinc-500 text-xs">{status.description}</p>
                                <NavLink to="/" className="no-underline w-fit block">
                                  <Button className="mt-4 bg-amber-400 hover:bg-amber-300 focus:bg-amber-400 active:bg-amber-400 make_trip">Make a Trip</Button>
                                </NavLink>
                            </div>
                        </div>
                    ))}
                </section>
            </Container>
            </main>
                )}
        </>
    );
}

export default MyTrips;
