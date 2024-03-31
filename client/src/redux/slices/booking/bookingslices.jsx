import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    showProfileModal: false,
    showSideNavbar: false,
    showDepartureOptions: false,
    departureInput: "",
    departureResults: [],
    departureAirport: [],
    departureAirlineResult: [],
    departureLogoResult: [],
    departureFlight: [],
    departureAirline: [],
    showArrivalOptions: false,
    arrivalInput: "",
    arrivalResults: [],
    arrivalAirport: [],
    showError: false,
    showCalendar: false,
    currentDate: new Date(),
    travellersClassOption: false,
    departureClicked: false,
    arrivalClicked: false,
    dateClicked: false,
    travellersClassClicked: false,
    selectedNoOfTravellers: {
        Adult: null,
        Child: null,
        Infant: null,
        Totalcount: 1,
    },
    selectedTravelClass: "Economy",
    selectedUpgradeClass: "Economy",
    selectedTravelDetails: {},
    selectedFares: "Regular Fare",
    flightHours: null,
    flightPrice: null,
    noofstop: null,
    duration: null,
    passengerInfoButton: false,
    saveInfoButton: false,
    flightDetail: [],
    isLoading: false,
    data: null,
    isError: false,
    selectedFliter: {
        stop: false,
        nonStop: false,
    },
    selectedBags: {
        count: 1,
    },
    passengerForm: [],
    passengerEmergency: {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: ""
    },
    passengerDetailButton: false,
    selectSeat: {
        Business: [],
        Economy: [],
        business_seat: false,
        economy_seat: false,
    },
    passengerData: [],
    showModel: false,
    paymentMethod: "Credit Card",
    offerContainer: false,
    cardDetail: {
        cardName: "",
        cardNumber: "",
        expiredate: "",
        ccv: "",
    },
    cardError: [],
    loading: false,
    flightLoading: false,
    citiesToShow: 9,
    conditionCheck: false,
    showPasswordModal: false,
    showPassword: "password",
    selectedTripStatus: "Account Details",
    selectedImages: [],
    passengerAccInfo: [
        {
            Fullname: "",
            PhoneNumber: "",
            MaritalStatus: "",
            EmailAddress: "",
            Gender: "",
            Address: "",
        },
    ],
    passengerRegistration: {
        username: "",
        email: "",
        password: "",
    },
    passengerLogin: {
        email: "",
        password: "",
    },
    selectedProfileLabel: "Account Details",
    showSidebar: false,
    forgetEmail: {
        email: "",
        password: "",
    },
    OTP: {
        OTP_1: "",
        OTP_2: "",
        OTP_3: "",
        OTP_4: "",
        OTP_5: "",
        OTP_6: "",
        Totalcount: "",
    },
    token: null,
    totalAmount: "",
};
export const fetch_API = createAsyncThunk("fetch_API", async (input) => {
    try {
        const response = await fetch(`https://api.api-ninjas.com/v1/airports?city=${input}`, {
            headers: { "X-Api-Key": "rcoyz2soalxg3vhat4s0uDTcSSoS7pSLmwSOaZbS" },
        });

        const data = await response.json();

        // Filter the results to include only those with a non-empty IATA code
        const filteredData = data.filter((item) => item.iata);

        return filteredData;
    } catch (error) {
        console.error("Error fetching airport data:", error);
        throw error;
    }
});

export const fetchAirlineData = createAsyncThunk("fetchAirlineData", async ({ input_1, input_2, selected_Date }) => {
    try {
        const airlineResponse = await fetch(`https://airlabs.co/api/v9/routes?dep_iata=${input_1}&arr_iata=${input_2}&api_key=7eca91c2-3cd2-4cf1-b3e1-823f570f56f8`);

        if (!airlineResponse.ok) {
            console.error(`HTTP error! Status: ${airlineResponse.status}, Response:`, await airlineResponse.text());
            throw new Error(`HTTP error! Status: ${airlineResponse.status}`);
        }

        const airlineJson = await airlineResponse.json();
        const airlineData = airlineJson.response || [];

        const filteredAirlineData = airlineData.filter((airline) => {
            const current__Date = new Date();

            const depTimeParts = airline.dep_time.split(":");
            const depHours = parseInt(depTimeParts[0], 10);
            const depMinutes = parseInt(depTimeParts[1], 10);

            const depDateTime = selected_Date;
            depDateTime.setHours(depHours);
            depDateTime.setMinutes(depMinutes);

            return depDateTime > current__Date;
        });

        let uniqueAirlineIATAs = Array.from(new Set(filteredAirlineData.map((airline) => airline.airline_iata)));

        const logoPromises = uniqueAirlineIATAs.map((iata) =>
            fetch(`https://api.api-ninjas.com/v1/airlines?iata=${iata}`, {
                headers: { "X-Api-Key": "jHZDe0DFoNiM9VAXlUCXXA==QWK2rajpFnwE22aS" },
            })
                .then((response) => {
                    if (!response.ok) {
                        console.error(`HTTP error! Status: ${response.status}, Response:`, response.text());
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then((json) => json.filter((airlinelogo) => airlinelogo && airlinelogo.iata)[0])
                .catch((error) => {
                    console.error("Error fetching logo data:", error);
                    return null;
                })
        );

        return { logoPromises, filteredAirlineData };
    } catch (error) {
        console.error("Error fetching airline data:", error);
        throw error;
    }
});

export const Passenger_seat = createAsyncThunk("Passengers_seat", async (selectSeat) => {
    try {
        const getSeatInfo = (seatType) => {
            const selectedSeat = selectSeat?.[seatType];

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
    } catch (error) {
        console.error("Error in Passengers_seat thunk:", error);
        throw error;
    }
});

// export const UserAuthentication = createAsyncThunk("booking/UserAuthentication", async (_, thunkAPI) => {
//     try {
//         const state = thunkAPI.getState();
//         const data = await userAuthentication(state.booking.token);
//         return data;
//     } catch (error) {
//         return thunkAPI.rejectWithValue(error.message);
//     }
// });


const bookingSlice = createSlice({
    name: "booking",
    initialState,
    reducers: {
        setShowProfileModal: (state, action) => {
            state.showProfileModal = action.payload;
        },
        setShowSideNavbar: (state, action) => {
            state.showSideNavbar = action.payload;
        },
        setDepartureOption: (state, action) => {
            state.showDepartureOptions = action.payload;
        },
        setDepartureInput: (state, action) => {
            state.departureInput = action.payload;
        },
        setDepartureResults: (state, action) => {
            state.departureResults = action.payload;
        },
        setDepartureAirport: (state, action) => {
            state.departureAirport = action.payload;
        },
        setDepartureAirlineResult: (state, action) => {
            state.departureAirlineResult = action.payload;
        },
        setDepartureLogoResult: (state, action) => {
            state.departureLogoResult = action.payload;
        },
        setDepartureFlight: (state, action) => {
            state.departureFlight = action.payload;
        },
        setDepartureAirline: (state, action) => {
            state.departureAirline = action.payload;
        },
        setArrivalOption: (state, action) => {
            state.showArrivalOptions = action.payload;
        },
        setArrivalInput: (state, action) => {
            state.arrivalInput = action.payload;
        },
        setArrivalResults: (state, action) => {
            state.arrivalResults = action.payload;
        },
        setArrivalAirport: (state, action) => {
            state.arrivalAirport = action.payload;
        },
        setError: (state, action) => {
            state.showError = action.payload;
        },
        setCalendar: (state, action) => {
            state.showCalendar = action.payload;
        },
        setCurrentDate: (state, action) => {
            state.currentDate = action.payload;
        },
        setTravellersClassOption: (state, action) => {
            state.travellersClassOption = action.payload;
        },
        setDepartureClicked: (state, action) => {
            state.departureClicked = action.payload;
        },
        setArrivalClicked: (state, action) => {
            state.arrivalClicked = action.payload;
        },
        setDateClicked: (state, action) => {
            state.dateClicked = action.payload;
        },
        setTravellersClassClicked: (state, action) => {
            state.travellersClassClicked = action.payload;
        },
        setSelectedNoOfTravellers: (state, action) => {
            const { Adult, Child, Infant } = action.payload;
            const Totalcount = Adult + Child + Infant;
            state.selectedNoOfTravellers.Adult = Adult;
            state.selectedNoOfTravellers.Child = Child;
            state.selectedNoOfTravellers.Infant = Infant;
            state.selectedNoOfTravellers.Totalcount = Totalcount;
        },
        setSelectedTravelClass: (state, action) => {
            state.selectedTravelClass = action.payload;
        },
        setSelectedUpgradeClass: (state, action) => {
            state.selectedUpgradeClass = action.payload;
        },
        setSelectedTravelDetails: (state, action) => {
            state.selectedTravelDetails = action.payload;
        },
        setSelectedFares: (state, action) => {
            state.selectedFares = action.payload;
        },
        setFlightHours: (state, action) => {
            state.flightHours = action.payload;
        },
        setFlightPrice: (state, action) => {
            state.flightPrice = action.payload;
        },
        setNoofStop: (state, action) => {
            state.noofstop = action.payload;
        },
        setduration: (state, action) => {
            state.duration = action.payload;
        },
        setPassengerInfoButton: (state, action) => {
            state.passengerInfoButton = action.payload;
        },
        setSaveInfoButton: (state, action) => {
            state.saveInfoButton = action.payload;
        },
        setFlightDetail: (state, action) => {
            state.flightDetail = action.payload;
        },
        setSelectedFliter: (state, action) => {
            state.selectedFliter = action.payload;
        },
        setSelectedBags: (state, action) => {
            state.selectedBags = action.payload;
        },
        setPassengerForm: (state, action) => {
            state.passengerForm = action.payload;
        },
        setPassengerEmergency: (state, action) => {
            state.passengerEmergency = action.payload;
        },
        setPassengerDetailButton: (state, action) => {
            state.passengerDetailButton = action.payload;
        },
        setSelectSeat: (state, action) => {
            state.selectSeat = action.payload;
        },
        setPassengerData: (state, action) => {
            state.passengerData.push(action.payload);
        },
        setShowModel: (state, action) => {
            state.showModel = action.payload;
        },
        setPaymentMethod: (state, action) => {
            state.paymentMethod = action.payload;
        },
        setOfferContainer: (state, action) => {
            state.offerContainer = action.payload;
        },
        setCardDetail: (state, action) => {
            state.cardDetail = action.payload;
        },
        setCardError: (state, action) => {
            state.cardError = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setFlightLoading: (state, action) => {
            state.flightLoading = action.payload;
        },
        setCitiesToShow: (state, action) => {
            state.citiesToShow = action.payload;
        },
        setConditionCheck: (state, action) => {
            state.conditionCheck = action.payload;
        },
        setShowPasswordModal: (state, action) => {
            state.showPasswordModal = action.payload;
        },
        setShowPassword: (state, action) => {
            state.showPassword = action.payload;
        },
        setSelectedTripStatus: (state, action) => {
            state.selectedTripStatus = action.payload;
        },
        setSelectedImages: (state, action) => {
            state.selectedImages = action.payload;
        },
        setPassengerAccInfo: (state, action) => {
            state.passengerForm = action.payload;
        },
        setPassengerRegistration: (state, action) => {
            state.passengerRegistration = action.payload;
        },
        setPassengerLogin: (state, action) => {
            state.passengerLogin = action.payload;
        },
        setSelectedProfileLabel: (state, action) => {
            state.selectedProfileLabel = action.payload;
        },
        setShowSidebar: (state, action) => {
            state.showSidebar = action.payload;
        },
        setForgetEmail: (state, action) => {
            state.forgetEmail = action.payload;
        },
        setOTP: (state, action) => {
            const { OTP_1, OTP_2, OTP_3, OTP_4, OTP_5, OTP_6 } = action.payload;
            const Totalcount = `${OTP_1}${OTP_2}${OTP_3}${OTP_4}${OTP_5}${OTP_6}`;

            return {
                ...state,
                OTP: {
                    OTP_1,
                    OTP_2,
                    OTP_3,
                    OTP_4,
                    OTP_5,
                    OTP_6,
                    Totalcount,
                },
            };
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setTotalAmount: (state, action) => {
            state.totalAmount = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetch_API.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        });
        builder.addCase(fetch_API.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetch_API.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            console.error("Error", action.payload);
        });
        builder.addCase(fetchAirlineData.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        });
        builder.addCase(fetchAirlineData.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchAirlineData.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            console.error("Error", action.payload);
        });
        builder.addCase(Passenger_seat.fulfilled, (state, action) => {
            state.isLoading = false;
            state.data = action.payload;
        });
        builder.addCase(Passenger_seat.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(Passenger_seat.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            console.error("Error in Passengers_seat thunk:", action.payload);
        });
    },
});

export const {
    setShowProfileModal,
    setShowSideNavbar,
    setDepartureOption,
    setDepartureInput,
    setDepartureResults,
    setDepartureAirport,
    setDepartureAirlineResult,
    setDepartureLogoResult,
    setDepartureFlight,
    setDepartureAirline,
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
    setSelectedUpgradeClass,
    setSelectedTravelDetails,
    setSelectedFares,
    setFlightHours,
    setFlightPrice,
    setNoofStop,
    setduration,
    setPassengerInfoButton,
    setSaveInfoButton,
    setFlightDetail,
    setSelectedFliter,
    setSelectedBags,
    setPassengerEmergency,
    setPassengerForm,
    setSelectSeat,
    setPassengerData,
    setPassengerDetailButton,
    setShowModel,
    setPaymentMethod,
    setOfferContainer,
    setCardDetail,
    setLoading,
    setFlightLoading,
    setCitiesToShow,
    setCardError,
    setConditionCheck,
    setShowPasswordModal,
    setShowPassword,
    setSelectedTripStatus,
    setSelectedImages,
    setPassengerAccInfo,
    setPassengerRegistration,
    setPassengerLogin,
    setSelectedProfileLabel,
    setShowSidebar,
    setForgetEmail,
    setOTP,
    setToken,
    setTotalAmount,
} = bookingSlice.actions;

export default bookingSlice.reducer;
