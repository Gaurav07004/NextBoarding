import React, { Suspense, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import "../components/CssFolder/Home.css";
import { setLoading } from "../redux/slices/booking/bookingslices.jsx";

const Navbar = React.lazy(() => import("../components/JsxFolder/Navbar.jsx"));
const BookingSection = React.lazy(() => import("../components/JsxFolder/BookingSection.jsx"));
const ExploreStay = React.lazy(() => import("../components/JsxFolder/CityStay.jsx"));
const Footer = React.lazy(() => import("../components/JsxFolder/Footer.jsx"));

function Home() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    useEffect(() => {
        dispatch(setLoading(true));

        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);

    return (
        <>
            {state.booking.loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <TailSpin visible={true} height="60" width="60" color="#605dec" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" />
                </div>
            ) : (
                <>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Navbar />
                    </Suspense>
                    <div className="home-container">
                        <div className="background-image">
                            <div className="Text">
                                <b>It's more than</b>
                                <br />
                                <b>just a trip</b>
                            </div>
                            <Suspense fallback={<div>Loading...</div>}>
                                <BookingSection />
                                <ExploreStay />
                                <Footer />
                            </Suspense>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default Home;
