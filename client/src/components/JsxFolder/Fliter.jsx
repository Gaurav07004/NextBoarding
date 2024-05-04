import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../CssFolder/Fliter.css";
import { PiSunHorizonDuotone, PiSunDuotone, PiCloudSunDuotone, PiCloudMoonDuotone } from "react-icons/pi";
import { setSelectedFliter, setSelectedDepartureTime, setSelectedAirline } from "../../redux/slices/booking/bookingslices.jsx";
import { TbFilterEdit } from "react-icons/tb";
import { IoCloseOutline } from "react-icons/io5";

const Fliter = () => {
    const { departureAirport, departureAirlineResult, departureLogoResult, selectedFliter, selectedDepartureTime, selectedAirline } = useSelector((state) => state.booking);
    const dispatch = useDispatch();

    const getUniqueAirlines = () => {
        const uniqueAirlines = [];

        departureAirlineResult.forEach((airline) => {
            const matchingLogo = departureLogoResult.find((airlinelogo) => airlinelogo.logo_url && airlinelogo.iata === airline.airline_iata);
            if (matchingLogo && !uniqueAirlines.some((unique) => unique.logo_url === matchingLogo.logo_url)) {
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

    // const [selectedAirline, setSelectedAirline] = useState("");
    const [filterShow, setFilterShow] = useState(false);

    const fliter_stops = (value) => {
        let updatedFilter = { ...selectedFliter };
        updatedFilter[value] = !updatedFilter[value];
        dispatch(setSelectedFliter(updatedFilter));
    };

    // console.log("stop", selectedFliter);

    const fliter_Airline = (airlineName) => {
        const currentlySelectedAirline = selectedAirline;

        if (currentlySelectedAirline === airlineName) {
            dispatch(setSelectedAirline(""));
        } else {
            dispatch(setSelectedAirline(airlineName));
        }
    };

    const handleDepartureTimeChange = (time) => {
        dispatch(
            setSelectedDepartureTime({
                ...selectedDepartureTime,
                [time]: !selectedDepartureTime[time],
            })
        );
    };

    // console.log("Value_stop", selectedFliter);
    // console.log("Value_airline", selectedAirline);
    // console.log("Value_time", selectedDepartureTime);

    const Filter = () => {
        return (
            <section className="Fliter_Container">
                <div className="Fliter_Departure_Stop_container">
                    <label className="Fliter_Departure_Stop_label">Stops From {departureAirport?.city || "Mumbai"}</label>
                    <div className="Stop_NonStop">
                        <input type="checkbox" className="check_box" checked={selectedFliter.stop} onChange={() => fliter_stops("stop")} />
                        <div className="checkbox_label">Stop</div>
                        <input type="checkbox" className="check_box" checked={selectedFliter.nonStop} onChange={() => fliter_stops("nonStop")} />
                        <div className="checkbox_label">Non Stop</div>
                        <input type="checkbox" className="check_box" checked={selectedFliter.both} onChange={() => fliter_stops("both")} />
                        <div className="checkbox_label">Both</div>
                    </div>
                </div>
                <div className="Fliter_Departure_Time_container">
                    <label className="Fliter_Departure_Time_label">Departure From {departureAirport?.city || "Mumbai"}</label>
                    <div className="Fliter_Depature_Times">
                        <div className={`Departure_Time ${selectedDepartureTime.earlyMorning && "activeItem"}`} onClick={() => handleDepartureTimeChange("earlyMorning")}>
                            <PiSunHorizonDuotone />
                            <div className="time">Before 06 AM</div>
                        </div>
                        <div className={`Departure_Time ${selectedDepartureTime.morning && "activeItem"}`} onClick={() => handleDepartureTimeChange("morning")}>
                            <PiSunDuotone />
                            <div className="time">06 AM - 12 PM</div>
                        </div>
                        <div className={`Departure_Time ${selectedDepartureTime.afternoon && "activeItem"}`} onClick={() => handleDepartureTimeChange("afternoon")}>
                            <PiCloudSunDuotone />
                            <div className="time">12PM - 06 PM</div>
                        </div>
                        <div className={`Departure_Time ${selectedDepartureTime.evening && "activeItem"}`} onClick={() => handleDepartureTimeChange("evening")}>
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
                                <input type="checkbox" className="check_box" checked={selectedAirline === uniqueAirline.name} onChange={() => fliter_Airline(uniqueAirline.name)} />
                                <img src={uniqueAirline.logo_url} alt="logo" className="airlinelogosmall" />
                                <div className="Airline_name">{uniqueAirline.name}</div>
                                <div className="Airline_avg_price">₹ {price()}</div>
                            </label>
                        </React.Fragment>
                    ))}
                </div>
            </section>
        );
    };

    // console.log("selectedAirline", selectedAirline)

    return (
        <>
            <main className="Fliterpanel_desktop font-sans cursor-pointer">
                <p className="text-zinc-600 font-bold tracking-wider text-sl m-2 pt-6 pr-8 pb-0 pl-2">
                    Popular <span className="text-amber-400">Fliter</span>
                </p>
                <Filter />
            </main>

            <main className="Fliterpanel_moblie">
                <div className="flex gap-3 items-center w-24 border-2 rounded p-2" onClick={() => setFilterShow(!filterShow)}>
                    <TbFilterEdit className="w-4 h-auto text-neutral-500" />
                    <span className="text-amber-400 font-bold tracking-wider text-sm">Filter</span>
                </div>
                {filterShow && (
                    <main className="Fliterpanel font-sans cursor-pointer">
                        <IoCloseOutline className="float-right w-9 h-auto p-2" onClick={() => setFilterShow(!filterShow)} />
                        <Filter />
                    </main>
                )}
            </main>
        </>
    );
};

export default Fliter;
