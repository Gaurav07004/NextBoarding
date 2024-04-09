import { Empty, Badge, Table, Button } from "keep-react";
import { useSelector } from "react-redux";
import Search from "../../assets/Search1.png";
import { NavLink } from "react-router-dom";

function TableComponent() {
    const state = useSelector((state) => state);
    const cancelledRoutes = Object.values(state.booking.routeData).filter(route => route.status === "Cancelled");

    if (cancelledRoutes.length === 0) {
        return (
            <Empty>
                <Empty.Image>
                    <img src={Search} height={200} width={300} alt="404" />
                </Empty.Image>
                <Empty.Title className="text-2xl font-semibold">Looks empty, you have no cancelled bookings.</Empty.Title>
                <Empty.Description>When you book a trip, you will see your itinerary here.</Empty.Description>
                <NavLink to="/" className="no-underline w-fit block">
                    <Button className="mt-4 bg-amber-400 hover:bg-amber-300 focus:bg-amber-400 active:bg-amber-400 make_trip">Make a Trip</Button>
                </NavLink>
            </Empty>
        );
    }

    return (
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
                {/* <Table.HeadCell className="min-w-[120px]">Price</Table.HeadCell> */}
            </Table.Head>
            <Table.Body className="divide-gray-25 divide-y">
                {cancelledRoutes.map(
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
                                                <Badge color="error" showIcon={true}>
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
                                        </Table.Row>
                                    ))
                            )
                    )}
            </Table.Body>
        </Table>
    );
}

export default TableComponent;