import { Routes, Route } from "react-router-dom";
import Home from "./screen/Home";
import SignUp from "./components/JsxFolder/SignUp";
import SignIn from "./components/JsxFolder/SignIn";
import MyTrips from "./screen/MyTrips";
import Profile from "./screen/Profile";
import Search from "./screen/Search";
import PassengerInfo from "./screen/PassengerInfo";
import SelectSeat from "./screen/SelectSeat";
import Payment from "./screen/Payment";
import ConfirmBooking from "./screen/ConfirmBooking";
import Account from "./screen/Account";

function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Search" element={<Search />} />
      <Route path="/PassengerInfo" element={<PassengerInfo />} />
      <Route path="/SelectSeat" element={<SelectSeat />} />
      <Route path="/Payment" element={<Payment />} />
      <Route path="/ConfirmBooking" element={<ConfirmBooking />} />
      <Route path="/Profile" element={<Profile />} />
      <Route path="/MyTrips" element={<MyTrips />} />
      <Route path="/Account" element={<Account />} />
    </Routes>
  );
}

export default App;
