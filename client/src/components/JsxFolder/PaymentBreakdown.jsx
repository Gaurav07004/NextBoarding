//import Container from "@mui/material/Container";
import { setTotalAmount } from "../../redux/slices/booking/bookingslices";
import "../CssFolder/PaymentBreakdown.css";
import { useSelector, useDispatch } from "react-redux";

function PaymentBreakdown() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const Baggage_fees = () => {
        const total_bags = state.booking.selectedBags.count;
        const passengerCount = state.booking.selectedNoOfTravellers.Totalcount;
        let Baggagefees = 0;

        if (total_bags > passengerCount) {
            Baggagefees = (total_bags - passengerCount) * 200;
        }

        return Baggagefees;
    };

    const Seat_upgrade = () => {
        const SeatUpgrade = state.booking.selectedUpgradeClass;
        if (SeatUpgrade !== state.booking.selectedTravelClass && state.booking.selectedTravelClass === "Economy") {
            return 5000;
        } else {
            return 0;
        }
    };
    const getPrice = () => {
        return state.booking.flightDetail?.price || 0;
    };

    const calculateTotalBaggageFees = () => {
        return Baggage_fees();
    };

    const calculateTotalSeatUpgrade = () => {
        return Seat_upgrade();
    };

    const calculateFares = () => {
        const fare = state.booking.selectedFares;
        let fare_price = 0;

        if(fare !== "Regular Fare") {
            fare_price = -1000;
        }

        return fare_price;
    };

    const calculateSubtotal = () => {
        const price = getPrice();
        const baggageFees = calculateTotalBaggageFees();
        const seatUpgrade = calculateTotalSeatUpgrade();
        const fares = calculateFares();

        return price + baggageFees + seatUpgrade + fares;
    };

    const getTaxes = () => {
        return state.booking.flightDetail.Taxes || 0;
    };

    const calculateTotalAmount = () => {
    // Calculate subtotal
        const subtotal = calculateSubtotal();

        // Calculate taxes
        const taxes = getTaxes();

        // Calculate total amount
        const TotalAmount = subtotal + taxes;

        // Dispatch an action to update the state with the total amount
        dispatch(setTotalAmount(TotalAmount));

        // Return the total amount
        return TotalAmount;
    };

    console.log("TotalAmount", state.booking.totalAmount)

    return (
        <section className="price_container pt-3">
            <section className="Price_breakdown_container ">
                <p className="Flight_summary_label m-0">Price breakdown</p>
                <section className="Amount_value">
                    <div className="AmountTile">
                        {["Departing Flight", "Baggage fees", "Seat upgrade (business)", state.booking.selectedFares, "Subtotal", "Taxes"].map((AmountTile, index) => (
                            <div key={index} className="bill_label">
                                {AmountTile}
                            </div>
                        ))}
                    </div>
                    <div className="AmountTile">
                        {[getPrice(), calculateTotalBaggageFees(), calculateTotalSeatUpgrade(), calculateFares(), calculateSubtotal(), getTaxes()].map((AmountTile, index) => (
                            <div key={index} className="bill_label">
                                ₹ {AmountTile}
                            </div>
                        ))}
                    </div>
                </section>
                <section className="Total_Amount_value">
                    <div className="AmountTile">
                        <div className="bill_label">Amount paid</div>
                    </div>
                    <div className="AmountTile">
                        <div className="bill_label">₹ {calculateTotalAmount()}</div>
                    </div>
                </section>
            </section>
        </section>
    );
}

export default PaymentBreakdown;
