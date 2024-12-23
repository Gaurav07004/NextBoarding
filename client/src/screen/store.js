import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "../redux/slices/booking/bookingslices.jsx";
import tokenMiddleware from '../redux/slices/booking/tokenMiddleware.jsx';

export const store = configureStore({
    reducer: {
        booking: bookingReducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(tokenMiddleware),
});

