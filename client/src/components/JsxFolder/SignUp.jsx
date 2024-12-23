import { useEffect, useState } from "react";
import signUp from "../../assets/signUp_1.png";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
// import { FcGoogle } from "react-icons/fc";
// import { FaFacebook } from "react-icons/fa";
import NewLogo from "../../assets/Logo2.png";
import { CiLock, CiMail, CiUnlock, CiUser } from "react-icons/ci";
import { Button, Notification } from "keep-react";
import { Check } from "phosphor-react";
import "../CssFolder/SignUp.css";
import { TailSpin } from "react-loader-spinner";
import { setConditionCheck, setLoading, setPassengerRegistration, setShowPassword, setToken } from "../../redux/slices/booking/bookingslices.jsx";
import { NavLink, useNavigate } from "react-router-dom";

function SignUp() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [showNotification, setShowNotification] = useState(false);

    const handleCondition = () => {
        dispatch(setConditionCheck(!state.booking.conditionCheck));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(
            setPassengerRegistration({
                ...state.booking.passengerRegistration,
                [name]: value,
            })
        );
    };

    const handleShowPassword = () => {
        dispatch(setShowPassword("text"));
    };

    const handleHidePassword = () => {
        dispatch(setShowPassword("password"));
    };

    const NotificationComponent = () => (
        <div className="px-5 py-3">
            <Notification isOpen={showNotification} onClose={() => setShowNotification(false)} position="top-right">
                <Notification.Body className="max-w-sm p-4 border-slate-300 border-2 rounded-lg bg-slate-100">
                    <Notification.Content>
                        <div className="flex items-center gap-2 justify-center">
                            <div className="h-14 w-14 p-1.5 bg-success-50 text-success-500 rounded-full border-2 border-success-300">
                                <Check size={40} />
                            </div>
                            <div className="max-w-[220px]">
                                <p className="text-body-4  text-metal-700 m-0 font-semibold">Account is Register Successfully!</p>
                            </div>
                        </div>
                    </Notification.Content>
                </Notification.Body>
            </Notification>
        </div>
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(state.booking.passengerRegistration),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || "Something went wrong");
            }

            const data = await response.json();
            console.log("Response data:", data);
            dispatch(setToken(data.token));
            setShowNotification(true);
            setTimeout(() => {
                navigate("/Home");
            }, 3000);
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    console.log(state.booking.passengerRegistration);

    useEffect(() => {
        dispatch(setLoading(true));

        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);

    return (
        <main className="SignUp_container ">
            <Container maxWidth="lg">
                {state.booking.loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: "-5%" }}>
                        <TailSpin visible={true} height="60" width="60" color="#605dec" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" />
                    </div>
                ) : (
                    <>
                        <main className="SignUp_modal">
                            <section className="signUp_image_container">
                                <img src={signUp} alt="signUp" className="Image" />
                            </section>
                            <section className="signUp_form_container">
                                <div className="logo">
                                    <img src={NewLogo} alt="logo" className="w-28 h-auto" />
                                </div>
                                {/* <div className="plugin_desktop">
                                    <Button color="secondary" variant="outline" className="Button py-2">
                                        <FcGoogle className="text-2xl plugin_icon" /> <span className="ml-1 plugin_type">Google</span>
                                    </Button>
                                    <Button color="secondary" variant="outline" className="Button py-2">
                                        <FaFacebook className="text-2xl plugin_icon text-blue-500" /> <span className="ml-1 plugin_type">Facebook</span>
                                    </Button>
                                </div>
                                <div className="plugin_Mobile">
                                    <Button color="secondary" variant="outline" className="Button py-3">
                                        <FcGoogle className="text-2xl plugin_icon" />
                                        <span className="ml-1 plugin_type">Google</span>
                                    </Button>
                                    <Button color="secondary" variant="outline" className="Button py-3">
                                        <FaFacebook className="text-2xl text-blue-500" /> <span className="ml-1 plugin_type">Facebook</span>
                                    </Button>
                                </div>
                                <p className="font-semibold text-zinc-500 text-sm text-center Separate">OR</p> */}
                                <h1 className="font-semibold text-6xl text-center text-amber-400 mt-6">Hi There!</h1>
                                <div className="font-semibold text-xs text-center text-amber-400 mt-1">Welcome to NextBoarding! Get started by creating your account.</div>
                                <form className="signup-form" onSubmit={handleSubmit}>
                                    <div className="input-with-icon">
                                        <CiUser className="icon" />
                                        <input className="user_field" type="text" name="fullName" placeholder="Full Name" required autoComplete="off" value={state.booking.passengerRegistration.fullName} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-with-icon">
                                        <CiMail className="icon" />
                                        <input className="user_field" type="text" name="email" placeholder="Email or Phone Number" required autoComplete="off" value={state.booking.passengerRegistration.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-with-icon">
                                        {state.booking.showPassword === "password" ? <CiLock className="icon" onClick={handleShowPassword} /> : <CiUnlock className="icon" onClick={handleHidePassword} />}
                                        <input
                                            className="password_field"
                                            type={state.booking.showPassword}
                                            name="password"
                                            placeholder="Password"
                                            required
                                            autoComplete="off"
                                            value={state.booking.passengerRegistration.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="mt-4">
                                        <label htmlFor="check1" className={`text-zinc-400 text-sm condition ${state.booking.conditionCheck ? "activeItem" : ""}`} onClick={handleCondition}>
                                            I agree to the <span className="terms-and-conditions">terms and conditions</span>
                                        </label>
                                        {state.booking.conditionCheck === true ? (
                                            <Button className="create_Account bg-amber-400 hover:bg-amber-300 active:bg-amber-200 text-white">Create Account</Button>
                                        ) : (
                                            <Button className="create_Account bg-amber-400 hover:bg-amber-300 active:bg-amber-200 text-white" disabled>
                                                Create Account
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-zinc-400 text-sm font-semibold mt-2 text-center">
                                        Already a member?{" "}
                                        <NavLink className="text-orange-500 cursor-pointer no-underline" to="/">
                                            Sign in
                                        </NavLink>
                                    </p>
                                </form>
                            </section>
                        </main>
                        <NotificationComponent />
                    </>
                )}
            </Container>
        </main>
    );
}

export default SignUp;
