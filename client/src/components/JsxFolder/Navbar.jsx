import { Link as ScrollLink } from "react-scroll";
import signUp from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/signUp_1.png";
import NewLogo from "D:/Development/Web-development/ReactJs/NextBoarding/client/src/assets/NewLogo.png";
import "../CssFolder/Navbar.css";
import { NavLink } from "react-router-dom";
import { Avatar } from "keep-react"
import { FiUser, FiLogOut } from "react-icons/fi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxDashboard } from "react-icons/rx";
import { RiCustomerService2Fill, RiDashboardLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import { LuSendToBack } from "react-icons/lu";
import { BsSuitcase2 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { setShowProfileModal, setShowSideNavbar } from "../../redux/slices/booking/bookingslices.jsx";

function Navbar() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    const handleOpenModal = () => {
        dispatch(setShowProfileModal(!state.booking.showProfileModal));
    };

    const handleSideNavbar = () => {
        dispatch(setShowSideNavbar(!state.booking.showSideNavbar));
    };

    return (
        <>
            <nav className={`navbar`}>
                <div>
                    <NavLink to="/" className="logo">
                        <img src={NewLogo} alt="logo" className="w-36 h-auto"/>
                    </NavLink>
                </div>
                <div className="menu">
                    <ul>
                        <li>
                            <ScrollLink to="home" spy={true} smooth={true} duration={250}>Home</ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="AboutUs" spy={true} smooth={true} duration={250}>About Us</ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="Service" spy={true} smooth={true} duration={250}>Service</ScrollLink>
                        </li>
                        <li>
                            <ScrollLink to="contact" spy={true} smooth={true} duration={250}>Contact</ScrollLink>
                        </li>
                    </ul>
                    <Avatar shape="circle" className="Profile_Image" size="lg" img={signUp} onClick={handleOpenModal} />
                </div>
                <div className="Hamburger">
                    <div className="Hamburger_icon" onClick={handleSideNavbar}>
                        <GiHamburgerMenu />
                    </div>
                    {state.booking.showSideNavbar && (
                        <div className="Hamburger_menu">
                            <div className="Profile_status">
                                <Avatar shape="circle" className="Profile_Image" size="lg" img={signUp} onClick={handleOpenModal} />
                                <div className="flex flex-col">
                                    <div className="User_name">Gaurav Singh</div>
                                    <div className="User_status">gauravsingh07004@gmail.com</div>
                                </div>
                                <div className={`text-2xl text-amber-400 close`} onClick={handleSideNavbar}><IoClose/></div>
                            </div>
                            <div className="mt-4">
                                <div className="hover:bg-amber-100 rounded-lg">
                                    <NavLink to="/" className="flex gap-4 items-center sidebar_menu">
                                        <RxDashboard className="text-2xl" />
                                        Dashboard
                                    </NavLink>
                                </div>
                                <div className="hover:bg-amber-100 rounded-lg">
                                    <NavLink to="/" className="flex gap-4 items-center sidebar_menu">
                                        <RiDashboardLine className="text-2xl" />
                                        About Us
                                    </NavLink>
                                </div>
                                <div className="hover:bg-amber-100 rounded-lg">
                                    <NavLink to="/" className="flex gap-4 items-center sidebar_menu">
                                        <LuSendToBack className="text-2xl" />
                                        Service
                                    </NavLink>
                                </div>
                                <div className="hover:bg-amber-100 rounded-lg">
                                    <NavLink to="/" className="flex gap-4 items-center sidebar_menu">
                                        <RiCustomerService2Fill className="text-2xl" />
                                        Contact
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            {state.booking.showProfileModal && (
                <div className="Profile_slider">
                    <p className="text-sm text-zinc-700 font-semibold mb-4">You are viewing your personal profile {state.booking.passengerAccInfo?.Fullname || ""}</p>
                    {[
                        { Icon: <FiUser />, title: "My Profile", description: "Manage your profile, traveller details, login details and password.", swtich: "Account" },
                        { Icon: <BsSuitcase2 />, title: "My Trips", description: "See booking details, Print e-ticket, Cancel Booking, Check Refund Status & more.", swtich: "MyTrips" },
                        { Icon: <FiLogOut />, title: "Log Out", description: "Click here to log out of your account.", swtich: "SignIn" },
                    ].map((level, index) => (
                        <NavLink className="profile_section" key={index} to={`/${level.swtich}`}>
                            <div className="text-2xl mt-1 text-zinc-500">{level.Icon}</div>
                            <div className="navLinkContent">
                                <p className="mb-1 text-zinc-700 font-semibold text-lg">{level.title}</p>
                                <p className="mb-1 text-zinc-500 text-xs">{level.description}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            )}
        </>
    );
}

export default Navbar;
