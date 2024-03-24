import { useSelector } from "react-redux";
import "../CssFolder/Bill.css";

const Bills = () => {
    const { departureFlight, departureAirline, flightDetail } = useSelector((state) => state.booking);

    return (
        <div className="billpanel font-sans mt-16">
                <div className="FlightBill">
                    <div className="departure_info">
                        <div>
                            <img src={departureAirline.logo_url} alt="logo" className="airline_logo" />
                        </div>
                        <div className="FlightInfo">
                            <div className="departure_airline">{departureAirline.name}</div>
                            <div className="flight_number">{departureFlight.flight_number}</div>
                        </div>
                    </div>
                    <hr />
                    <div className="FlightTime">
                        <div className="duration">{flightDetail.duration}</div>
                        <div className="duration">
                            {flightDetail?.departure || ""} - {flightDetail?.arrival || ""}
                        </div>
                        <div className="flight_number">{flightDetail?.stop}</div>
                    </div>
                    <hr />
                <div className="Amount">
                    <div className="AmountInfo">
                        <div className="departure_airline_bill">Subtotal</div>
                        <div className="departure_airline_bill">Taxes and Fees</div>
                        <div className="departure_airline_bill">Total</div>
                    </div>
                    <div className="AmountInfo">
                        <div className="departure_airline_bill">₹ {flightDetail?.Subprice || "0"}</div>
                        <div className="departure_airline_bill">₹ {flightDetail?.Taxes || "0"}</div>
                        <div className="departure_airline_bill">₹ {flightDetail?.price || "0"}</div>
                    </div>
                </div>
                </div>
        </div>
    );
};

export default Bills;
