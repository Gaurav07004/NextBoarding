import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "keep-react";
import Bund from "../../assets/Bund.png";
import Sydney from "../../assets/Sydney.png";
import Kyoto from "../../assets/kyoto.png";
import bp_1 from "../../assets/bp_1.webp";
import maldives from "../../assets/maldives.png";
import Tokyo from "../../assets/Tokyo.webp";
import Moroco from "../../assets/Moroco.png";
import Paris from "../../assets/Paris.webp"
import about_1 from "../../assets/about_1.webp";
import about_2 from "../../assets/about_2.webp";
import { BsCalendar2Check } from "react-icons/bs";
import { MdAirlineSeatReclineExtra } from "react-icons/md";
import { AiOutlineSafety } from "react-icons/ai";
import { GoCopilot } from "react-icons/go";
import "../CssFolder/CityStay.css";
import { setCitiesToShow } from "../../redux/slices/booking/bookingslices";

function CityStay() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state)
    const totalItems = 20;
    const cities = [
        'New York',
        'Paris',
        'Tokyo',
        'London',
        'Sydney',
        'Rome',
        'Dubai',
        'Berlin',
        'Cape Town',
        'Bangkok',
        'Los Angeles',
        'Beijing',
        'Mumbai',
        'Moscow',
        'Toronto',
        'Istanbul',
        'Mexico City',
        'Singapore',
        'Frankfurt',
        'Amsterdam',
        'Seoul',
        'Madrid',
        'San Francisco',
        'Shanghai',
        'Toronto',
        'Hong Kong',
        'Chicago',
        'Dublin',
        'Rio de Janeiro',
        'Stockholm'
    ];

    const loadMoreCities = () => {
        let showMore = state.booking.citiesToShow + 3;
        dispatch(setCitiesToShow(showMore));
    };

    const displayedItems = cities.slice(0, state.booking.citiesToShow);

    return (
        <Container maxWidth="lg">
            <main className="city_stay">
                <main className=" About_us" id="AboutUs" >
                    <section className="About_us_detail">
                        <div className="text-amber-400 uppercase text-lg font-semibold About_label">About Us</div>
                        <div className="text-zinc-600 font-semibold tracking-wider Sub_heading text-4xl "><div>Discover Your Travel With</div><div>NextBoarding</div></div>
                        <div className="text-zinc-600 text-justify pt-3 para_1">Welcome to NextBoarding, your gateway to a world of hassle-free and unforgettable travel experiences. At NextBoarding, we believe that travel should be easy, enjoyable, and accessible to everyone. Whether you are an avid explorer or a first-time traveler, we are here to make your journey seamless and stress-free.</div>
                        <div className="text-zinc-600 text-justify pt-3 para_2">Whether you are embarking on a solo adventure, planning a family vacation, or organizing a business trip, NextBoarding is here for you. Join us on the journey where travel is not just a destination but an experience in itself.</div>
                    </section>
                    <section className="About_us_Image">
                        <div className="about_1">
                            <img src={about_1} className="img-fluid rounded-md" alt="about_1" />
                        </div>
                        <div className="about_2 mt-5">
                            <img src={about_2} className="img-fluid rounded-md" alt="about_2" />
                        </div>
                    </section>
                </main>
                <main className="Flight-Deals" id="Service">
                    <section className="Flight-Deals_detail">
                        <div className="text-amber-400 uppercase text-lg font-semibold Serve_label">What we serve</div>
                        <div className="text-zinc-600 font-semibold tracking-wider Sub_heading text-4xl leading-tight"><div>Find Your Next Adventure With</div><div>Flight Deals</div></div>
                        <div className="serve_item_container">
                            <div className="serve_item">
                                <div className="font-semibold tracking-wider text-sm flex gap-4 items-center serve_item_label">
                                    <div className="icon_shape">
                                        <BsCalendar2Check className="w-16 h-16 p-3 serve_icon" />
                                    </div>
                                    <span className="text-lg sub_serve_label">Personal Schedule</span>
                                </div>
                                <div className="card-Place text-justify mt-4">Organize your flight booking schedule with flight details, accommodations, and key travel information for a well-prepared and efficient trip.</div>
                            </div>
                            <div className="serve_item">
                                <div className="font-semibold tracking-wider text-sm flex gap-4 items-center serve_item_label">
                                    <div className="icon_shape">
                                        <MdAirlineSeatReclineExtra className="w-16 h-16 p-3 serve_icon" />
                                    </div>
                                    <span className="text-lg sub_serve_label">Luxury Interiors</span>
                                </div>
                                <div className="card-Place text-justify mt-4">Indulge in luxury with our stylish interiors. Whether you are in Business Class with plush amenities or Economy Class with thoughtful design, we prioritize your comfort for an enjoyable travel experience.</div>
                            </div>
                            <div className="serve_item">
                                <div className="font-semibold tracking-wider text-sm flex gap-4 items-center serve_item_label">

                                    <div className="icon_shape">
                                        <AiOutlineSafety className="w-16 h-16 p-3 serve_icon" />
                                    </div>
                                    <span className="text-lg sub_serve_label">Safe & Confidential</span>
                                </div>
                                <div className="card-Place text-justify mt-4">We have simplified security measures to make your travel experience easy and confidential. Book with confidence, knowing that we prioritize your protection every step of the way.</div>
                            </div>
                            <div className="serve_item">
                                <div className="font-semibold tracking-wider text-sm flex gap-4 items-center serve_item_label">

                                    <div className="icon_shape">
                                        <GoCopilot className="w-16 h-16 p-3 serve_icon" />
                                    </div>
                                    <span className="text-lg sub_serve_label">Professional Crew</span>
                                </div>
                                <div className="card-Place text-justify mt-4">Our professional and dedicated crew ensures a refined and secure travel experience. With expertise and a commitment to service excellence, we strive to make your journey comfortable, enjoyable, and formal.</div>
                            </div>
                        </div>
                    </section>
                    <section className="Flight-Deals_Image_container">
                        <div>
                            <div className="Flight-Deals_Image mb-4">
                                <img src={bp_1} className="Flight-Deals_Image1 img-fluid rounded-md" alt="about_2" />
                            </div>
                            <div className="Flight-Deals_Image">
                                <img src={Bund} className="Flight-Deals_Image2 img-fluid rounded-md" alt="about_1" />
                            </div>
                        </div>
                        <div>
                            <div className="Flight-Deals_Image mb-4">
                                <img src={Sydney} className="Flight-Deals_Image3 img-fluid rounded-md" alt="about_1" />
                            </div>
                            <div className="Flight-Deals_Image">
                                <img src={Kyoto} className="Flight-Deals_Image4 img-fluid rounded-md" alt="about_2" />
                            </div>
                        </div>
                    </section>
                </main>
                <main className="Explore-City">
                    <section className="Explore-City_Image_container">
                        {[
                            { image: maldives, name: "Stay among the atolls in Maldives" },
                            { image: Moroco, name: "Ourika Valley in Morocco" },
                            { image: Tokyo, name: "Live traditionally in Mongolia" },
                            { image: Paris, name: "Live traditionally in Mongolia" },
                        ].map((deal, index) => (
                            <div key={index} className="Explore-City_Image">
                                <img src={deal.image} className="Explore-City_Image1 img-fluid rounded-md" alt={`City: ${deal.name}`} />
                            </div>

                        ))}
                    </section>
                    <section className="Explore-City_detail">
                        <div className="text-amber-400 uppercase text-lg font-semibold Explore-City_label">Popular Destinations</div>
                        <div className="text-zinc-600 font-semibold tracking-wider Sub_heading text-4xl leading-tight">Explore unique places to stay</div>
                        <div className="card-Place mt-3 text-justify">Embark on a adventure of limitless opportunities with our immersive tourism experiences. Explore numerous cultures, breathtaking landscapes, and historical wonders as we guide you via the arenas maximum enchanting locations. Our curated travel alternatives cater to every wanderlust, from tranquil retreats to exciting adventures, ensuring a seamless mixture of enjoyment and exploration.</div>

                        <p className="card-Name text-lg mt-3">BEST TOURS CITY</p>
                        <section className="make_grid mt-2">
                            {displayedItems.map((item, index) => (
                                <div key={index} className="cities_list p-2">{item}</div>
                            ))}
                        </section>

                        {state.booking.citiesToShow < totalItems && (
                            <Button className="Explore-more-stays p-3" onClick={loadMoreCities} >Explore more stays</Button>
                        )}
                    </section>
                </main>
            </main>
        </Container>
    );
}

export default CityStay;
