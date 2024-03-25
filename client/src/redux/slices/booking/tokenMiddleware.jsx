import { setToken } from "./bookingslices.jsx";

const tokenMiddleware = store => next => action => {
  if (action && action.type === setToken.type) {
    localStorage.setItem('token', action.payload);
  }
  return next(action);
};

export default tokenMiddleware;
