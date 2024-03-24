import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./slices/booking/bookingslices.jsx";
//import FetchAPIReducer from "./slices/FetchAPI/APIslices.jsx";

export const store = configureStore({
    reducer: {
        booking: bookingReducer,
        // API: FetchAPIReducer,
    },
});

