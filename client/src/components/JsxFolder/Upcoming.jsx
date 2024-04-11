import { useState } from "react";
import { Empty, Badge, Table, Button, Modal, Typography } from "keep-react";
import { useDispatch, useSelector } from "react-redux";
import Search from "../../assets/Search1.png";
import { NavLink } from "react-router-dom";
import { XCircle } from "phosphor-react";
import { setShowModel, setFlightBookingDetails } from "../../redux/slices/booking/bookingslices.jsx";

function TableComponent() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const [tripIdToCancel, setTripIdToCancel] = useState(null);
    const [passengerIdToCancel, setPassengerIdToCancel] = useState(null);

    const upcomingRoutes = state.booking.flightBookingDetails.filter((passengerData) => {
        const passengers = passengerData.passengers;
        return passengers && passengers.some((passenger) => passenger.status === "Upcoming");
    });

    //console.log("upcomingRoutes", upcomingRoutes);

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

    console.log("flightBookingDetails", state.booking.flightBookingDetails);

    const handleCancelModal = (passenger, matchingBooking) => {
        dispatch(setShowModel(true));
        setTripIdToCancel(matchingBooking);
        setPassengerIdToCancel(passenger);
    };

    const handleCancelTrip = async () => {
        try {
            const token = state.booking.token;
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await fetch(`http://localhost:5000/api/auth/cancelTrips/${tripIdToCancel.route_Id}/${passengerIdToCancel._id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    status: "Cancelled",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Something went wrong");
            }
            closeModal();
            const updatedRoutes = state.booking.flightBookingDetails.map((passengerData) => {
                const updatedPassengers = passengerData.passengers.map((passenger) => {
                    if (passenger._id === passengerIdToCancel._id) {
                        return { ...passenger, status: "Cancelled" };
                    }
                    return passenger;
                });

                return { ...passengerData, passengers: updatedPassengers };
            });

            dispatch(setFlightBookingDetails(updatedRoutes));
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

    //console.log("Before tripToCancel", state.booking.routes);

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
                    <Table.HeadCell className="min-w-[160px]">Travel Class</Table.HeadCell>
                    <Table.HeadCell className="min-w-[140px]">Flight Number</Table.HeadCell>
                    <Table.HeadCell className="min-w-[160px]">Fare Type</Table.HeadCell>
                    <Table.HeadCell className="min-w-[150px]">Departure Time</Table.HeadCell>
                    <Table.HeadCell className="min-w-[150px]">Arrival Time</Table.HeadCell>
                    <Table.HeadCell className="min-w-[150px]">Duration</Table.HeadCell>
                    <Table.HeadCell className="min-w-[160px]">Airline Name</Table.HeadCell>
                    <Table.HeadCell className="min-w-[100px]">Stops</Table.HeadCell>
                    <Table.HeadCell className="min-w-[100px]">Action</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-gray-25 divide-y">
                    {state.booking.routeData.map((route, routeIndex) => {
                        const matchingBooking = state.booking.flightBookingDetails.find((booking) => booking.route_Id === route._id);

                        if (!matchingBooking || matchingBooking.passengers.every((passenger) => passenger.status === "Cancelled" || passenger.status === "Completed")) {
                            return null;
                        }

                        return matchingBooking.passengers.map((passenger, passengerIndex) => {
                            if (passenger.status === "Cancelled" || passenger.status === "Completed") {
                                return null;
                            }

                            return (
                                <Table.Row key={`${routeIndex}-${passengerIndex}`} className="bg-white">
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
                                            {passenger.status}
                                        </Badge>
                                    </Table.Cell>
                                    <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{route.travel_Date.slice(0, 10)}</Table.Cell>
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
                                        <Badge variant="background" color="error" onClick={() => handleCancelModal(passenger, matchingBooking)}>
                                            Cancel
                                        </Badge>
                                    </Table.Cell>
                                </Table.Row>
                            );
                        });
                    })}
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
