import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../CssFolder/Fliter.css";
import { PiSunHorizonDuotone, PiSunDuotone, PiCloudSunDuotone, PiCloudMoonDuotone } from "react-icons/pi";
import { setSelectedFliter } from "../../redux/slices/booking/bookingslices.jsx";

const Fliter = () => {
    const { departureAirport, departureAirlineResult, departureLogoResult, selectedFliter } = useSelector((state) => state.booking);
    const dispatch = useDispatch();

    const getUniqueAirlines = () => {
        const uniqueAirlines = [];

        departureAirlineResult.forEach((airline) => {
            const matchingLogo = departureLogoResult.find((airlinelogo) => airlinelogo.logo_url && airlinelogo.iata === airline.airline_iata);

            if (matchingLogo && !uniqueAirlines.some((unique) => unique.name === matchingLogo.name)) {
                uniqueAirlines.push({
                    name: matchingLogo.name,
                    logo_url: matchingLogo.logo_url,
                });
            }
        });

        return uniqueAirlines;
    };

    const uniqueAirlines_data = getUniqueAirlines();
    const price = () => {
        let price = 0;
        price = Math.floor(Math.random() * (8000 - 5000 + 1)) + 5000;
        return price;
    };

    const [selectedDepartureTime, setSelectedDepartureTime] = useState("");
    const [selectedAirline, setSelectedAirline] = useState("");

    const fliter_stops = (value) => {
        dispatch(setSelectedFliter(value));
    };

    const fliter_Airline = (airlineName) => {
        const currentlySelectedAirline = selectedAirline;

        if (currentlySelectedAirline === airlineName) {
            setSelectedAirline("");
        } else {
            setSelectedAirline(airlineName);
        }
    };

    const handleDepartureTimeChange = (time) => {
        setSelectedDepartureTime((prevTime) => (prevTime === time ? "" : time));
    };

    // console.log("Value_stop", selectedFliter);
    // console.log("Value_airline", selectedAirline);
    // console.log("Value_time", selectedDepartureTime);

    return (
        <main className="Fliterpanel font-sans cursor-pointer">
            <p className="text-zinc-600 font-bold tracking-wider text-sl m-2 pt-6 pr-8 pb-0 pl-2">
                Popular <span className="text-amber-400">Fliter</span>
            </p>
            <section className="Fliter_Container">
                <div className="Fliter_Departure_Stop_container">
                    <label className="Fliter_Departure_Stop_label">Stops From {departureAirport?.city || "Mumbai"}</label>
                    <div className="Stop_NonStop">
                        <input type="checkbox" className= "check_box" checked={selectedFliter === "Stop"} onChange={() => fliter_stops("Stop")} />
                        <div className="checkbox_label">Stop</div>
                        <input type="checkbox" className= "check_box" checked={selectedFliter === "Non Stop"} onChange={() => fliter_stops("Non Stop")} />
                        <div className="checkbox_label">Non Stop</div>
                    </div>
                </div>
                <div className="Fliter_Departure_Time_container">
                    <label className="Fliter_Departure_Time_label">Departure From {departureAirport?.city || "Mumbai"}</label>
                    <div className="Fliter_Depature_Times">
                        <div className={`Departure_Time ${selectedDepartureTime === "Before 06 AM" && "activeItem"}`} onClick={() => handleDepartureTimeChange("Before 06 AM")}>
                            <PiSunHorizonDuotone />
                            <div className="time">Before 06 AM</div>
                        </div>
                        <div className={`Departure_Time ${selectedDepartureTime === "06 AM - 12 PM" && "activeItem"}`} onClick={() => handleDepartureTimeChange("06 AM - 12 PM")}>
                            <PiSunDuotone />
                            <div className="time">06 AM - 12 PM</div>
                        </div>
                        <div className={`Departure_Time ${selectedDepartureTime === "12 PM - 06 PM" && "activeItem"}`} onClick={() => handleDepartureTimeChange("12 PM - 06 PM")}>
                            <PiCloudSunDuotone />
                            <div className="time">12PM - 06 PM</div>
                        </div>
                        <div className={`Departure_Time ${selectedDepartureTime === "After 06 PM" && "activeItem"}`} onClick={() => handleDepartureTimeChange("After 06 PM")}>
                            <PiCloudMoonDuotone />
                            <div className="time">After 06 PM</div>
                        </div>
                    </div>
                </div>
                <div className="Fliter_Airline_container">
                    <label htmlFor="Fliter_Airline" className="Fliter_Airline_label">
                        Airlines
                    </label>
                    {uniqueAirlines_data.map((uniqueAirline) => (
                        <React.Fragment className="Airline_detail" key={uniqueAirline}>
                            <label className="Airline">
                                <input type="checkbox" checked={selectedAirline === uniqueAirline.name} onChange={() => fliter_Airline(uniqueAirline.name)} />
                                <img src={uniqueAirline.logo_url} alt="logo" className="airlinelogosmall" />
                                <div className="Airline_name">{uniqueAirline.name}</div>
                                <div className="Airline_avg_price">₹ {price()}</div>
                            </label>
                        </React.Fragment>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Fliter;
