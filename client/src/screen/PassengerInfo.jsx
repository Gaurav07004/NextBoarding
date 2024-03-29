import React, { Suspense, useEffect } from "react";
import "../components/CssFolder/PassengerInfo.css";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaMinus } from "react-icons/fa6";
import bags from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/bags.png";
import { useNavigate, NavLink } from "react-router-dom";
import { Button } from "keep-react";
import { TailSpin } from "react-loader-spinner";
import { setSelectedBags, setLoading, setPassengerForm, setPassengerEmergency, setSaveInfoButton, setPassengerDetailButton } from "../redux/slices/booking/bookingslices.jsx";

const Navbar = React.lazy(() => import("../components/JsxFolder/Navbar.jsx"));
const PaymentBreakdown = React.lazy(() => import("../components/JsxFolder/PaymentBreakdown.jsx"));
const Footer = React.lazy(() => import("../components/JsxFolder/Footer.jsx"));

function PassengerInfo() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    //const navigate = useNavigate();

    const passengerCount = state.booking.selectedNoOfTravellers.Totalcount;

    useEffect(() => {
        dispatch(setLoading(true));
        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1000);
        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);

    useEffect(() => {
        if (state.booking.passengerForm.length !== passengerCount) {
            const passengerForms = Array.from({ length: passengerCount }, (_, index) => createPassengerForm(index + 1));
            dispatch(setPassengerForm(passengerForms));
        }
    }, [dispatch, passengerCount, state.booking.passengerForm.length]);

    const createPassengerForm = (passengerNumber) => {
        return {
            firstName: "",
            middleName: "",
            lastName: "",
            gender: "",
            email: "",
            phoneNumber: "",
            address: "",
            passengerNumber: passengerNumber,
        };
    };

const handleChange = (e, passengerIndex, isEmergency = false) => {
    const { name, value } = e.target;
    if (isEmergency) {
        dispatch(
            setPassengerEmergency({
                ...state.booking.passengerEmergency,
                [name]: value,
            })
        );
    } else {
        const updatedPassengerForms = [...state.booking.passengerForm];
        updatedPassengerForms[passengerIndex] = {
            ...updatedPassengerForms[passengerIndex],
            [name]: value,
        };
        dispatch(setPassengerForm(updatedPassengerForms));
    }
};
        
    console.log("passengers", state.booking.passengerForm);
    console.log("passengerEmergency", state.booking.passengerEmergency);
    const HandleChangecount = (count) => {
        const currentCount = state.booking.selectedBags.count;
        let updatedCount = currentCount + count;
        if (updatedCount < 1) {
            return updatedCount;
        } else if (updatedCount > 20) {
            return updatedCount;
        }

        dispatch(
            setSelectedBags({
                ...state.booking.selectedBags,
                count: updatedCount,
            })
        );
    };

    const handleButtonClick = () => {
        dispatch(setPassengerDetailButton(!state.booking.passengerDetailButton));
        dispatch(setSaveInfoButton(!state.booking.saveInfoButton));
    };

    const fieldPlaceholders = {
        firstName: "First Name*",
        lastName: "Last Name*",
        dob: "Date of Birth*",
        middleName: "Middle Name*",
        email: "Email address*",
        phoneNumber: "Phone Number*",
    };


// const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//         const token = state.booking.token;
//         if (!token) {
//             throw new Error("No token found. Please log in.");
//         }

//         const passengerData = state.booking.passengerForm.map(passenger => ({
//             first_Name: passenger.firstName,
//             middle_Name: passenger.middleName,
//             last_Name: passenger.lastName,
//             email_Address: passenger.email,
//             phone_Number: passenger.phoneNumber,
//             gender: passenger.gender,
//             residential_Address: passenger.address,
            
//         }));

//         const emergencyContacts = {
//             emergency_FirstName: state.booking.passengerEmergency.firstName,
//             emergency_LastName: state.booking.passengerEmergency.lastName,
//             emergency_EmailAddress: state.booking.passengerEmergency.email,
//             emergency_PhoneNumber: state.booking.passengerEmergency.phoneNumber,
//         };

//         const response = await fetch("http://localhost:5000/api/auth/PassengerData", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//                 passengers: passengerData,
//                 emergencyContacts: emergencyContacts,
//                 checked_Bags: state.booking.selectedBags.count,
//             }),
//         });

//         if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData.error || "Something went wrong");
//         }
//         navigate("/SelectSeat");
//         console.log("Data stored successfully");
//         console.log(passengerData,
//                     emergencyContacts,
//                     state.booking.selectedBags.count,)
//     } catch (error) {
//         console.error("Error:", error.message);
//     }
// };

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
                    <main className="screen_split">
                        <section className="user_container font-sans">
                            <p className=" font-bold tracking-wider text-lg pt-3 text-amber-400 Passenger_info_label">Passenger information</p>
                            <p className="user_related_info">Enter the required information for each traveler and be sure that it exactly matches the government-issued ID presented at the airport.</p>
                                <section className="passenger_info_form">
                                    {/* <form onSubmit={handleSubmit}> */}
                                    {state.booking.passengerForm.map((passengerForm, index) => (
                                        <div key={index}>
                                            <p className="Passenger_no mb-4">Passenger {passengerForm.passengerNumber}</p>
                                            <div className="Name_info">
                                                {["firstName", "middleName", "lastName", "email", "phoneNumber", "gender"].map((field) => (
                                                    <input
                                                        key={field}
                                                        type={field === "email" ? "email" : "text"}
                                                        name={field}
                                                        autoComplete="off"
                                                        value={state.booking.passengerForm[index][field]}
                                                        onChange={(e) => handleChange(e, index)}
                                                        className="name"
                                                        required
                                                        placeholder={fieldPlaceholders[field] || `${field.charAt(0).toUpperCase()}${field.slice(1)}*`}
                                                    />
                                                ))}
                                            </div>
                                            <div className="Another_info">
                                                {["address"].map((field) => (
                                                    <input
                                                        key={field}
                                                        type="text"
                                                        name={field}
                                                        required
                                                        value={state.booking.passengerForm[index][field]}
                                                        autoComplete="off"
                                                        onChange={(e) => handleChange(e, index)}
                                                        className="otherInfo"
                                                        placeholder={`${field === "address" ? "Residential address" : fieldPlaceholders[field] || `${field.charAt(0).toUpperCase()}${field.slice(1)}*`}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    <p className="Passenger_no mb-4">Emergency contact information</p>
                                    <div className="Another_info_about_Emergency">
                                        {["firstName", "lastName", "phoneNumber", "email"].map((field, index) => (
                                            <input
                                                key={field}
                                                type="text"
                                                name={field}
                                                autoComplete="off"
                                                required
                                                value={state.booking.passengerEmergency[field]}
                                                onChange={(e) => handleChange(e,index, true)}
                                                className="otherInfo"
                                                placeholder={fieldPlaceholders[field] || `${field.charAt(0).toUpperCase()}${field.slice(1)}*`}
                                            />
                                        ))}
                                    </div>
                                    <p className="Passenger_no mb-4">Bag information</p>
                                    <p className="user_related_info mb-4">
                                        Each passenger is allowed one free carry-on bag and one personal item. The first checked bag for each passenger is also free. Second bag check fees are waived for loyalty program members.
                                    </p>
                                    <div className="check_bag_info">
                                        <div>
                                            <p className="Passenger_no">Passenger {passengerCount}</p>
                                            <p className="class_name">{state.booking.selectedTravelClass}</p>
                                        </div>
                                        <div>
                                            <p className="Passenger_no">Checked bags</p>
                                            <div className="Check_bags_count">
                                                <FaMinus className="text-amber-500 minus" onClick={() => HandleChangecount(-1)} />
                                                <p className="class_name m-0">{state.booking.selectedBags.count}</p>
                                                <FaPlus className="text-amber-500 plus" onClick={() => HandleChangecount(1)} />
                                            </div>
                                        </div>
                                    </div>
                                {!state.booking.passengerDetailButton && (
                                    <div className="button_save_and_close">
                                        <button className="Save_and_close" onClick={handleButtonClick}>
                                            Save and close
                                        </button>
                                    </div>
                                )}
                                {state.booking.passengerDetailButton && (
                                    <Button color="primary" className="button_next_to_seat" type="submit">
                                        <NavLink to="/SelectSeat">Select Seat</NavLink>
                                    </Button>
                                )}
                                    {/* </form> */}
                                </section>
                        </section>
                        <section className="second_container p-2">
                            <Suspense fallback={<div>Loading...</div>}>
                                <PaymentBreakdown />
                            </Suspense>
                            <div className="bags_info">
                                <img src={bags} className="Bags" alt={bags} />
                            </div>
                        </section>
                    </main>
                )}
            </Container>
            <Suspense fallback={<div>Loading...</div>}>
                <Footer />
            </Suspense>
        </main>
    );
}

export default PassengerInfo;
