import { Badge, Table } from 'keep-react';

function TableComponent() {
  const tableData = [
    {
      name: 'Ralph Edwards',
      status: 'Cancelled',
      Date: "22 Mar'24",
      From_City: 'Mumbai',
      From_Airport: 'Chhatrapati Shivaji Maharaj International Airport',
      To_City: 'New Delhi',
      To_Airport: 'Indira Gandhi International Airport',
      time: "02:30 PM - 04:00 PM",
      Airline_name: "AirIndia",
      stop: "1",
      price: "₹7854"
    },
    {
      name: 'Ralph Edwards',
      status: 'Cancelled',
      Date: "22 Mar'24",
      From_City: 'Mumbai',
      From_Airport: 'Chhatrapati Shivaji Maharaj International Airport',
      To_City: 'New Delhi',
      To_Airport: 'Indira Gandhi International Airport',
      time: "02:30 PM - 04:00 PM",
      Airline_name: "AirIndia",
      stop: "1",
      price: "₹7854"
    },
    {
      name: 'Ralph Edwards',
      status: 'Cancelled',
      Date: "22 Mar'24",
      From_City: 'Mumbai',
      From_Airport: 'Chhatrapati Shivaji Maharaj International Airport',
      To_City: 'New Delhi',
      To_Airport: 'Indira Gandhi International Airport',
      time: "02:30 PM - 04:00 PM",
      Airline_name: "AirIndia",
      stop: "1",
      price: "₹7854"
    },
    {
      name: 'Ralph Edwards',
      status: 'Cancelled',
      Date: "22 Mar'24",
      From_City: 'Mumbai',
      From_Airport: 'Chhatrapati Shivaji Maharaj International Airport',
      To_City: 'New Delhi',
      To_Airport: 'Indira Gandhi International Airport',
      time: "02:30 PM - 04:00 PM",
      Airline_name: "AirIndia",
      stop: "1",
      price: "₹7854"
    },
    {
      name: 'Ralph Edwards',
      status: 'Cancelled',
      Date: "22 Mar'24",
      From_City: 'Mumbai',
      From_Airport: 'Chhatrapati Shivaji Maharaj International Airport',
      To_City: 'New Delhi',
      To_Airport: 'Indira Gandhi International Airport',
      time: "02:30 PM - 04:00 PM",
      Airline_name: "AirIndia",
      stop: "1",
      price: "₹7854"
    },

    
  ];

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
        <Table.HeadCell className="min-w-[215px]">Time</Table.HeadCell>
        <Table.HeadCell className="min-w-[160px]">Airline Name</Table.HeadCell>
        <Table.HeadCell className="min-w-[100px]">Stops</Table.HeadCell>
        <Table.HeadCell className="min-w-[120px]">Price</Table.HeadCell>
      </Table.Head>
      <Table.Body className="divide-gray-25 divide-y">
        {tableData.map((row, index) => (
          <Table.Row key={index} className="bg-white">
            <Table.Cell>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="-mb-0.5 text-body-4 font-medium text-metal-600">{row.name}</p>
                  </div>
                </div>
              </div>
            </Table.Cell>
            <Table.Cell>
              <Badge color="error" showIcon={true}>
                {row.status}
              </Badge>
            </Table.Cell>
            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">
                {row.Date}
            </Table.Cell>
            <Table.Cell>
              <p className="text-body-4 font-medium text-metal-400">{row.From_City}</p>
            </Table.Cell>
            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400 truncate">{row.From_Airport}</Table.Cell>
            <Table.Cell>
              <p className="text-body-4 font-medium text-metal-400">{row.To_City}</p>
            </Table.Cell>
            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400 truncate">{row.To_Airport}</Table.Cell>
            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{row.time}</Table.Cell>
            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{row.Airline_name}</Table.Cell>
            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{row.stop}</Table.Cell>
            <Table.Cell className="-mb-0.5 text-body-4 font-medium text-metal-400">{row.price}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
}

export default TableComponent;
