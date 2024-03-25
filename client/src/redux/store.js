import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./slices/booking/bookingslices.jsx";
import tokenMiddleware from './slices/booking/tokenMiddleware.jsx';

export const store = configureStore({
    reducer: {
        booking: bookingReducer,
    },
    middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(tokenMiddleware),
});

