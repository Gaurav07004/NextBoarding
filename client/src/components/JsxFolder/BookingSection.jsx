import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "keep-react";
import { format } from "date-fns";
import { NavLink } from "react-router-dom";
import { Calendar } from "react-calendar";
import Container from "@mui/material/Container";
import { CiWarning } from "react-icons/ci";
import { IoSearch } from "react-icons/io5";
import { LuPlaneLanding, LuPlaneTakeoff } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { GoArrowRight, GoArrowSwitch } from "react-icons/go";
import "react-calendar/dist/Calendar.css";
import "../CssFolder/BookingSection.css";

import FareTypeData from "../JsonFolder/FareTypeData.json";

import {
    setDepartureOption,
    setDepartureInput,
    setDepartureResults,
    setDepartureAirport,
    setArrivalOption,
    setArrivalInput,
    setArrivalResults,
    setArrivalAirport,
    setError,
    setCalendar,
    setCurrentDate,
    setTravellersClassOption,
    setDepartureClicked,
    setArrivalClicked,
    setDateClicked,
    setTravellersClassClicked,
    setSelectedNoOfTravellers,
    setSelectedTravelClass,
    setSelectedTravelDetails,
    setSelectedFares,
    fetch_API,
} from "../../redux/slices/booking/bookingslices.jsx";

function BookingPortal() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const departureAirportDetail = document.querySelector(".DepartureBookingSection");
            const arrivalAirportDetail = document.querySelector(".ArrivalBookingSection");
            const departureDateDetail = document.querySelector(".DepartureDateBookingSection");
            const travellersClassDetail = document.querySelector(".TravellersClassBookingSection");

            if (departureAirportDetail && !departureAirportDetail.contains(event.target)) {
                dispatch(setDepartureOption(false));
            }

            if (arrivalAirportDetail && !arrivalAirportDetail.contains(event.target)) {
                dispatch(setArrivalOption(false));
            }

            if (departureDateDetail && !departureDateDetail.contains(event.target)) {
                dispatch(setCalendar(false));
            }

            if (travellersClassDetail && !travellersClassDetail.contains(event.target)) {
                dispatch(setTravellersClassOption(false));
            }
        };

        document.addEventListener("click", handleOutsideClick);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [dispatch]);

    const fetchAirportAPI = async (input, type) => {
        try {
            const action = await dispatch(fetch_API(input));
            const data = action.payload;

            const filteredResults = data.filter((airport) => airport.city === input);

            type === "departure" ? dispatch(setDepartureResults(filteredResults)) : dispatch(setArrivalResults(filteredResults));
        } catch (error) {
            console.error("Error fetching airport data:", error);
        }
    };

    const handleInputChange = (input, type) => {
        if (type === "departure") {
            dispatch(setDepartureInput(input));
            fetchAirportAPI(input, type);
        } else {
            dispatch(setArrivalInput(input));
            fetchAirportAPI(input, type);
        }
    };

    const handleAirportClick = (airport, type) => {
        const setSelectedAirport = type === "departure" ? setDepartureAirport : setArrivalAirport;
        const isSameAirport = type === "arrival" && state.booking.departureAirport && airport.city === state.booking.departureAirport.city && airport.name === state.booking.departureAirport.name;

        if (isSameAirport) {
            dispatch(setError(true));
            type === "departure" ? dispatch(setDepartureOption(false)) : dispatch(setArrivalOption(false));
        } else {
            dispatch(setSelectedAirport(airport));
            type === "departure" ? dispatch(setDepartureOption(false)) : dispatch(setArrivalOption(false));
            dispatch(setError(false));
        }
    };
    // console.log(state.booking.departureResults)

    const handleSwitchAirport = () => {
        const currentDepartureAirport = {
            city: state.booking.departureAirport?.city,
            name: state.booking.departureAirport?.name,
        };
        dispatch(
            setDepartureAirport({
                city: state.booking.arrivalAirport?.city,
                name: state.booking.arrivalAirport?.name,
            })
        );
        dispatch(
            setArrivalAirport({
                city: currentDepartureAirport.city,
                name: currentDepartureAirport.name,
            })
        );
    };

    const handleColorChange = (type) => {
        dispatch(setDepartureClicked(type === "departure"));
        dispatch(setArrivalClicked(type === "arrival"));
        dispatch(setDateClicked(type === "departureDate"));
        dispatch(setTravellersClassClicked(type === "travellersClass"));
    };

    const handleNoOfTravellersClick = (count, type) => {
        dispatch(
            setSelectedNoOfTravellers({
                ...state.booking.selectedNoOfTravellers,
                [type]: count,
            })
        );
    };

    const handleTypeOfClass = (count) => {
        dispatch(setSelectedTravelClass(count));
    };

    const handleApplyButtonClick = () => {
        dispatch(
            setSelectedTravelDetails({
                selectedNoOfTravellers: state.booking.selectedNoOfTravellers.Totalcount,
                selectedTravelClass: state.booking.selectedTravelClass,
            })
        );
        dispatch(setTravellersClassOption(false));
    };

    const handleFareTypeToggle = (fare) => {
        dispatch(setSelectedFares(fare));
    };

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 2);

    const TrendingSearch = (cities, previousCity) => {
        const filteredCities = cities.filter((city) => city !== previousCity);
        const randomIndex = Math.floor(Math.random() * filteredCities.length);
        return filteredCities[randomIndex];
    };
    const previousCity1 = TrendingSearch(["Delhi", "Mumbai", "New York", "Ahmedabad", "Bengaluru", "Goa"]);
    const previousCity2 = TrendingSearch(["Singapore", "Tokyo", "New York", "Dubai", "Atlanta", "Bangkok", "Chicago"]);

    const Booking_section = (state_value) => {
        const sectionType = state_value === "departure" ? "Departure" : "Arrival";
        const isClicked = state_value === "departure" ? state.booking.departureClicked : state.booking.arrivalClicked;

        return (
            <div className={`${sectionType}BookingSection ${isClicked ? "clicked" : ""}`} onClick={() => handleColorChange(state_value)}>
                <div htmlFor={`${sectionType}City`} onClick={() => dispatch(state_value === "departure" ? setDepartureOption(!state.booking.showDepartureOptions) : setArrivalOption(!state.booking.showArrivalOptions))}>
                    <span className={`sectionLabel`}>{state_value === "departure" ? "From" : "To"}</span>
                    <div className="SelectedAirportInfo">
                        <div className={`${sectionType}City`}>{state_value === "departure" ? state.booking.departureAirport?.city || "Mumbai" : state.booking.arrivalAirport?.city || "New Delhi"}</div>
                        <div className={`${sectionType}AirportName`}>
                            {state_value === "departure" ? state.booking.departureAirport?.name || "Chhatrapati Shivaji Maharaj International" : state.booking.arrivalAirport?.name || "Indira Gandhi International Airport"}
                        </div>
                    </div>
                </div>
                {(state_value === "departure" ? state.booking.showDepartureOptions : state.booking.showArrivalOptions) && (
                    <div className={`${sectionType}OptionsContainer`}>
                        <div className="SearchField">
                            <IoSearch id="SearchIcon" />
                            <input
                                className={`${sectionType}Input`}
                                type="name"
                                placeholder={`Search ${sectionType} Airport`}
                                value={state_value === "departure" ? state.booking.departureInput : state.booking.arrivalInput}
                                onChange={(e) => handleInputChange(e.target.value, state_value)}
                            />
                        </div>
                        <article className={`${sectionType}Suggestions`}>
                            <p>SUGGESTIONS</p>
                            {(state_value === "departure" ? state.booking.departureResults : state.booking.arrivalResults).map((result, index) => (
                                <div key={index} className="AirportDetail" onClick={() => handleAirportClick(result, state_value)}>
                                    <div className="AirportDetailContainer">
                                        <div className="AiplaneIcon">{state_value === "departure" ? <LuPlaneTakeoff className="text-amber-400" /> : <LuPlaneLanding className="text-amber-400" />}</div>
                                        <div className="AirportInfo">
                                            <div className="City">
                                                {result.city}
                                                <span className="airport_iata">{result.iata}</span>
                                            </div>
                                            <div className="AirportName">{result.name}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </article>
                    </div>
                )}
                {state_value === "arrival" && (
                    <>
                        <GoArrowSwitch className="GoArrowSwitch" onClick={() => handleSwitchAirport()} />
                        {state.booking.showError && (
                            <div className="ErrorMessage">
                                <div className="ErrorIcon">
                                    <CiWarning />
                                </div>
                                <p>From & To airports cannot be the same</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         // const token = localStorage.getItem("token");
    //         const token = state.booking.token;
    //         if (!token) {
    //             throw new Error("No token found. Please log in.");
    //         }

    //         const response = await fetch("http://localhost:5000/api/auth/RouteData", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`, // Include token in Authorization header
    //             },
    //             body: JSON.stringify({
    //                 departure_City: state.booking.departureAirport.city,
    //                 departure_Airport: state.booking.departureAirport.name,
    //                 arrival_City: state.booking.arrivalAirport.city,
    //                 arrival_Airport: state.booking.arrivalAirport.name,
    //                 travel_Date: state.booking.currentDate,
    //                 traveller_Number: state.booking.selectedNoOfTravellers.Totalcount,
    //                 traveller_Class: state.booking.selectedTravelClass,
    //                 fare_Type: state.booking.selectedFares,
    //             }),
    //         });

    //         if (!response.ok) {
    //             const errorData = await response.json();
    //             throw new Error(errorData.error || "Something went wrong");
    //         }

    //         console.log("Data stored successfully");
    //     } catch (error) {
    //         console.error("Error:", error.message);
    //         // Display error message in the UI
    //     }

    //     // Log the data being sent in the request
    //     console.log("Form data:", {
    //         departure_City: state.booking.departureAirport.city,
    //         departure_Airport: state.booking.departureAirport.name,
    //         arrival_City: state.booking.arrivalAirport.city,
    //         arrival_Airport: state.booking.arrivalAirport.name,
    //         travel_Date: state.booking.currentDate,
    //         traveller_Number: state.booking.selectedNoOfTravellers.Totalcount,
    //         traveller_Class: state.booking.selectedTravelClass,
    //         fare_Type: state.booking.selectedFares,
    //     });
    // };

    return (
        <Container fluid>
            <main>
                {/* <form > */}
                    <section className="Booking_Section">
                        <div className="BookingInfo">
                            <span>Book International and Domestic Flights</span>
                        </div>
                        <div className="BookingContainer">
                            <section>{Booking_section("departure")}</section>
                            <section>{Booking_section("arrival")}</section>

                            <div className={`DepartureDateBookingSection ${state.booking.dateClicked ? "clicked" : ""}`} onClick={() => handleColorChange("departureDate")}>
                                <div onClick={() => dispatch(setCalendar(!state.booking.showCalendar))}>
                                    <div className="DateSection">
                                        <span className="sectionLabel">Departure</span>
                                        <IoIosArrowDown className="Departure-Date-Icon" />
                                    </div>
                                    <div className="DepartureDate">
                                        <span className="Date">{format(new Date(state.booking.currentDate), "dd")}</span>
                                        <span className="Month">{format(new Date(state.booking.currentDate), "MMM")}'</span>
                                        <span className="Year">{format(new Date(state.booking.currentDate), "yy")}</span>
                                    </div>
                                    <span className="Day">{format(state.booking.currentDate, "EEEE")}</span>
                                </div>

                                {state.booking.showCalendar && (
                                    <article className="CalendarSection">
                                        <Calendar defaultValue={state.booking.currentDate} onChange={(date) => dispatch(setCurrentDate(date))} minDate={new Date()} maxDate={maxDate} />
                                    </article>
                                )}
                            </div>
                            <div className={`TravellersClassBookingSection ${state.booking.travellersClassClicked ? "clicked" : ""}`} onClick={() => handleColorChange("travellersClass")}>
                                <div
                                    htmlFor="TravellersClass"
                                    onClick={() => {
                                        dispatch(setTravellersClassOption(!state.booking.travellersClassOption));
                                    }}
                                >
                                    <div className="DateSection">
                                        <span className="sectionLabel">Travellers & Class</span>
                                        <IoIosArrowDown className="Departure-Date-Icon" />
                                    </div>
                                    <div>
                                        <div className="CountOfTravellers">
                                            <span className="Count">{state.booking.selectedTravelDetails?.selectedNoOfTravellers || 1}</span>
                                            <span className="Travellers">Travellers</span>
                                        </div>
                                        <main className="TravellerClass">{state.booking.selectedTravelDetails?.selectedTravelClass || "Economy"}</main>
                                    </div>
                                </div>
                                {state.booking.travellersClassOption && (
                                    <section className="TravellersClassBookingContainer">
                                        <div className="TravellersClassSuggestion">
                                            <div className="CountOfAdults">
                                                <p className="PassengerYear">ADULTS (12y+)</p>
                                                <p className="TravelDay">on the day of travel</p>
                                                <ul className="NoOfTravellers">
                                                    {[1, 2, 3, 4, 5, 6, 7, 8].map((count, index, arr) => (
                                                        <li
                                                            key={index}
                                                            className={`NoOfCount ${state.booking.selectedNoOfTravellers.Adult === count || (!state.booking.selectedNoOfTravellers.Adult && count === arr[0]) ? "Selected" : ""}`}
                                                            onClick={() => handleNoOfTravellersClick(count, "Adult")}
                                                        >
                                                            {count}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="CountOfChildInfant">
                                                <div className="CountOfChild">
                                                    <p className="PassengerYear">CHILDREN (2y - 12y )</p>
                                                    <p className="TravelDay">on the day of travel</p>
                                                    <ul className="NoOfTravellers">
                                                        {[0, 1, 2, 3, 4, 5, 6].map((count, index, arr) => (
                                                            <li
                                                                key={index}
                                                                className={`NoOfCount ${state.booking.selectedNoOfTravellers.Child === count || (!state.booking.selectedNoOfTravellers.Child && count === arr[0]) ? "Selected" : ""}`}
                                                                onClick={() => handleNoOfTravellersClick(count, "Child")}
                                                            >
                                                                {count}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                                <div className="CountOfInfant">
                                                    <p className="PassengerYear">INFANTS (below 2y)</p>
                                                    <p className="TravelDay">on the day of travel</p>
                                                    <ul className="NoOfTravellers">
                                                        {[0, 1, 2, 3, 4, 5, 6].map((count, index, arr) => (
                                                            <li
                                                                key={index}
                                                                className={`NoOfCount ${state.booking.selectedNoOfTravellers.Infant === count || (!state.booking.selectedNoOfTravellers.Infant && count === arr[0]) ? "Selected" : ""}`}
                                                                onClick={() => handleNoOfTravellersClick(count, "Infant")}
                                                            >
                                                                {count}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="TravelClassName">
                                                <p className="TravelClass">CHOOSE TRAVEL CLASS</p>
                                                <ul className="Classes">
                                                    {["Economy", "Business"].map((count, index) => (
                                                        <li
                                                            key={index}
                                                            className={`TypeOfClass ${state.booking.selectedTravelClass === count || (!state.booking.selectedTravelClass && count === 0) ? "Selected" : ""}`}
                                                            onClick={() => handleTypeOfClass(count)}
                                                        >
                                                            {count}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <button className="ApplyButton" onClick={() => handleApplyButtonClick()}>
                                                    Apply
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                        <section className="makeFlex">
                            <div className="Fare-Container">
                                <span className="Select-A-Fare-Type">
                                    <div>Select A</div>
                                    <div>Fare Type:</div>
                                </span>
                                <span className="Select-A-Fare-Type-mobile">
                                    <div>Select A Fare Type:</div>
                                </span>
                                <ul className="SpecialNewFares">
                                    {["Regular Fare", "Armed Forces Fares", "Student Fares", "Senior Citizen Fares", "Doctors & Nurses Fares"].map((fare, index) => (
                                        <li
                                            key={index}
                                            className={`FareTypes ${state.booking.selectedFares === fare || (!state.booking.selectedFares && fare === "Regular Fare") ? "activeItem" : ""}`}
                                            onClick={() => handleFareTypeToggle(fare)}
                                        >
                                            <div>
                                                {fare.split(" ").map((word, wordIndex, array) => (
                                                    <React.Fragment key={wordIndex}>
                                                        {wordIndex === array.length - 1 ? <br /> : " "}
                                                        {word}
                                                    </React.Fragment>
                                                ))}
                                            </div>
                                            {FareTypeData.FareDetail.map((fareDetail, index) => (
                                                <React.Fragment key={index}>
                                                    {fare === fareDetail.FareName && (
                                                        <div className="SpecialNewFaresDetail">
                                                            <p className="FareName">{fareDetail.FareName}</p>
                                                            <p className="FareDetail">{fareDetail.FareDetail}</p>
                                                        </div>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="Trending-Search-Container">
                                <span className="Trending-Search">Trending Search: </span>
                                <ul className="Trending-Option">
                                    <li className="Trending-Flight">
                                        <p>
                                            {previousCity1}
                                            <GoArrowRight className="GoArrow" />
                                            {TrendingSearch(["Amsterdam", "Dubai", "Frankfurt", "Mexico", "Istanbul", "London", "Paris"], previousCity1)}
                                        </p>
                                    </li>
                                    <li className="Trending-Flight">
                                        <p>
                                            {previousCity2}
                                            <GoArrowRight className="GoArrow" />
                                            {TrendingSearch(["Jakarta", "Helsinki", "New York", "Barcelona", "Goa", "Madrid"], previousCity2)}
                                        </p>
                                    </li>
                                </ul>
                            </div>
                        </section>
                    </section>
                        <NavLink className="Search p-0" to="/Search">
                            <Button type="submit" className="SearchBtn">
                                SEARCH
                            </Button>
                        </NavLink>
                {/* </form> */}
            </main>
        </Container>
    );
}

export default BookingPortal;
