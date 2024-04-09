import { useState } from "react";
import { Empty, Badge, Table, Button, Modal, Typography } from "keep-react";
import { useDispatch, useSelector } from "react-redux";
import Search from "../../assets/Search1.png";
import { NavLink } from "react-router-dom";
import { XCircle } from "phosphor-react";
import { setShowModel, setRouteData } from "../../redux/slices/booking/bookingslices.jsx";

function TableComponent() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const [tripIdToCancel, setTripIdToCancel] = useState(null);

    const upcomingRoutes = Object.values(state.booking.routeData).filter(route => route.status === "Upcoming");

    if (upcomingRoutes.length === 0) {
        return (
            <Empty>
                <Empty.Image>
                    <img src={Search} height={200} width={300} alt="404" />
                </Empty.Image>
                <Empty.Title className="text-2xl font-semibold">Looks empty, you have no upcoming bookings.</Empty.Title>
                <Empty.Description>When you book a trip, you will see your itinerary here.</Empty.Description>
                <NavLink to="/" className="no-underline w-fit block">
                    <Button className="mt-4 bg-amber-400 hover:bg-amber-300 focus:bg-amber-400 active:bg-amber-400 make_trip">Make a Trip</Button>
                </NavLink>
            </Empty>
        );
    }

    const handleCancelModal = (route) => {
        dispatch(setShowModel(true));
        setTripIdToCancel(route)
    };

    const handleCancelTrip = async () => {
    try {
        const token = state.booking.token;
        if (!token) {
            throw new Error("No token found. Please log in.");
        }

        const response = await fetch(`http://localhost:5000/api/auth/cancelTrips/${tripIdToCancel._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                tripId: tripIdToCancel._id,
                status: "Cancelled" 
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Something went wrong");
        }

        closeModal(); 
        const updatedRoutes = state.booking.routeData.map(route => {
            if (route.flight_Number === tripIdToCancel.flight_Number) {
                return { ...route, status: "Canceled" };
            }
            return route;
        });
        dispatch(setRouteData(updatedRoutes));
        console.log("Routes after cancellation:", updatedRoutes);
        console.log("Trip canceled successfully");
    } catch (error) {
        console.error("Error:", error.message);
    }
};



    const closeModal = () => {
        dispatch(setShowModel(!state.booking.showModel));
        setTripIdToCancel(null);
    };

    
    //console.log("tripIdToCancel", tripIdToCancel)

    console.log("Before tripToCancel", state.booking.routes)

    return (
        <>
            <Table showBorder={true} showBorderPosition="right" striped={true} hoverable={true}>
                <Table.Caption>
                    <div className="my-5 flex items-center justify-between">
                        <div className="flex items-center gap-5">
                            <p className="text-body-1 font-semibold text-metal-600">Team member</p>
                            <Badge size="sm" color="secondary">
                                100 Member
                            </Badge>
                        </div>
                    </div>
                </Table.Caption>
                <Table.Head>
                    <Table.HeadCell className="min-w-[210px]">
                        <p className="text-body-5 font-medium text-metal-400">Name</p>
                    </Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell className="min-w-[110px]">Date</Table.HeadCell>
                    <Table.HeadCell className="min-w-[140px]">From City</Table.HeadCell>
                    <Table.HeadCell className="min-w-[240px]">From Airport</Table.HeadCell>
                    <Table.HeadCell className="min-w-[140px]">To City</Table.HeadCell>
                    <Table.HeadCell className="min-w-[240px]">To Airport</Table.HeadCell>
                    <Table.HeadCell className="min-w-[240px]">Travel Class</Table.HeadCell>
                    <Table.HeadCell className="min-w-[240px]">Flight Number</Table.HeadCell>
                    <Table.HeadCell className="min-w-[240px]">Fare Type</Table.HeadCell>
                    <Table.HeadCell className="min-w-[240px]">Departure Time</Table.HeadCell>
                    <Table.HeadCell className="min-w-[240px]">Arrival Time</Table.HeadCell>
                    <Table.HeadCell className="min-w-[215px]">Duration</Table.HeadCell>
                    <Table.HeadCell className="min-w-[160px]">Airline Name</Table.HeadCell>
                    <Table.HeadCell className="min-w-[100px]">Stops</Table.HeadCell>
                    <Table.HeadCell className="min-w-[100px]"></Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-gray-25 divide-y">
                    {upcomingRoutes.map(
                        (route, routeIndex) =>
                            state.booking.flightBookingDetails &&
                            state.booking.flightBookingDetails.map(
                                (passengerData, passengerDataIndex) =>
                                    passengerData.passengers &&
                                    passengerData.passengers.map((passenger, passengerIndex) => (
                                        <Table.Row key={`${routeIndex}-${passengerDataIndex}-${passengerIndex}`} className="bg-white">
                                            <Table.Cell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-4">
                                                        <div>
                                                            <p className="-mb-0.5 text-body-4 font-medium text-metal-600">
                                                                {passenger.first_Name} {passenger.middle_Name} {passenger.last_Name}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <Badge color="warning" showIcon={true}>
                                                    {route.status}
                                                </Badge>
                                            </Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.travel_Date}</Table.Cell>
                                            <Table.Cell>
                                                <p className="text-body-4 font-medium text-metal-400">{route.departure_City}</p>
                                            </Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400 truncate">{route.departure_Airport}</Table.Cell>
                                            <Table.Cell>
                                                <p className="text-body-4 font-medium text-metal-400">{route.arrival_City}</p>
                                            </Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400 truncate">{route.arrival_Airport}</Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.traveller_Class}</Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.flight_Number}</Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.fare_Type}</Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.departure_Time}</Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.arrival_Time}</Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.total_duration}</Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.airline_Name}</Table.Cell>
                                            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.stop}</Table.Cell>
                                            <Table.Cell>
                                                <Badge variant="background" color="error" onClick={()=>handleCancelModal(route)}>
                                                    Cancel
                                                </Badge>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                            )
                    )}
                </Table.Body>
            </Table>
            <Modal isOpen={state.booking.showModel} onClose={closeModal}>
                    <Modal.Body className="flex flex-col items-center">
                        <Modal.Icon className="h-20 w-20 bg-error-50 text-error-500">
                            <XCircle size={60} />
                        </Modal.Icon>
                        <Modal.Content className="my-4 text-center">
                            <Typography variant="h3" className="mb-2 text-body-1 font-bold text-metal-900">
                                Are you sure you want to cancel this trip?
                            </Typography>
                            <Typography variant="p" className="text-body-4 font-normal text-metal-600">
                                This action cannot be undone. Are you sure you want to proceed with the cancellation?
                            </Typography>
                        </Modal.Content>
                        <Modal.Footer>
                            <Button onClick={closeModal} size="sm" color="error" className="mr-2">
                                No, Go Back
                            </Button>
                            <Button onClick={handleCancelTrip} type="submit" size="sm" color="success">
                                Yes, Cancel Trip
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>
            </Modal>
        </>
    );
}

export default TableComponent;