import React, { Suspense, useEffect, startTransition  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "keep-react";
import { IoMenu } from "react-icons/io5";
import "../components/CssFolder/Account.css";
import { TailSpin } from "react-loader-spinner";
import { setLoading, setShowSidebar } from "../redux/slices/booking/bookingslices.jsx";

const Navbar = React.lazy(() => import("../components/JsxFolder/Navbar.jsx"));
const Sidebar = React.lazy(() => import("../components/JsxFolder/sidebar.jsx"));
const AccountDetail = React.lazy(() => import("../components/JsxFolder/AccountDetail.jsx"));
const Upcoming = React.lazy(() => import("../components/JsxFolder/Upcoming.jsx"));
const Cancelled = React.lazy(() => import("../components/JsxFolder/Cancelled.jsx"));
const Completed = React.lazy(() => import("../components/JsxFolder/Completed.jsx"));

function Account() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    useEffect(() => {
        const setLoadingWithTransition = (loading) => {
            startTransition(() => {
                dispatch(setLoading(loading));
            });
        };

        setLoadingWithTransition(true);

        const loadingTimeout = setTimeout(() => {
            setLoadingWithTransition(false);
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);


    const handleSidebar = () => {
        dispatch(setShowSidebar(!state.showSidebar));
    };
    
    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            {state.loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <TailSpin visible={true} height={60} width={60} color="#605dec" ariaLabel="tail-spin-loading" />
                </div>
            ) : (
                <section className="px-12 py-20 Account_page bg-gray-100 flex flex-col gap-4">
                    <section className="HamBurger">
                        <div className="Hamburger2_icon" onClick={handleSidebar}>
                            <IoMenu />
                        </div>
                        {state.showSidebar && (
                            <Suspense fallback={<div>Loading...</div>}>
                                <div className="for_Moblie">
                                    <Sidebar />
                                </div>
                            </Suspense>
                        )}
                    </section>
                    <section className="flex justify-between">
                        <section className="Sidebar">
                            <Suspense fallback={<div>Loading...</div>}>
                                <Sidebar />
                            </Suspense>
                        </section>
                        {["Upcoming", "Cancelled", "Completed", "Account Details"].map((status, index) => (
                            <section key={index} className={`Account_info_section ${state.booking.selectedTripStatus === status ? "" : "hidden"} transition-all`}>
                                <div className="font-semibold text-red-400 text-2xl mb-1 label">{status === "Account Details" ? "Account Detail" : status + " Trip"}</div>
                                <div className="font-semibold text-gray-400 text-sm label_2">{status === "Account Details" ? "Manage Your FlyEase Profile" : ""}</div>
                                <div className="flex gap-4 mt-12 user_id">
                                    {Array.isArray(state.booking.selectedImages) && state.booking.selectedImages.map((dataUrl, index) => (
                                        <div key={index}>
                                            <Avatar shape="circle" className="Profile_Image" size="lg" img={dataUrl} />
                                        </div>
                                    ))}
                                    <div className="flex flex-col justify-center">
                                        <div className="font-semibold text-red-400 text-md mb-1">User ID</div>
                                        <div className="font-semibold text-gray-400 text-sm">{state.booking.passengerAccInfo?.Fullname || ""}</div>
                                    </div>
                                </div>
                                {status === "Upcoming" ? (
                                        <Suspense fallback={<div>Loading...</div>}>
                                            <Upcoming/>
                                        </Suspense>
                                    ) : (
                                        status === "Cancelled" ? (
                                            <Suspense fallback={<div>Loading...</div>}>
                                                <Cancelled/>
                                            </Suspense>
                                        ) : (
                                            status === "Account Details" ? (
                                                <Suspense fallback={<div>Loading...</div>}>
                                                    <AccountDetail/>
                                                </Suspense>
                                            ) : (
                                                <Suspense fallback={<div>Loading...</div>}>
                                                    <Completed/>
                                                </Suspense>
                                            )
                                        )
                                    )}
                            </section>
                        ))}
                    </section>
                </section>
            )}
        </main>
    );
}

export default Account;
