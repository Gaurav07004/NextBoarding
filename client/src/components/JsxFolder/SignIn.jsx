import React, { Suspense, useEffect, useState } from "react";
import signIn from "../../assets/book.png";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { CiLock, CiMail, CiUnlock } from "react-icons/ci";
import { Check } from 'phosphor-react'
import { Button, Notification } from "keep-react";
import "../CssFolder/SignIn.css";
import { setConditionCheck, setShowPasswordModal, setShowPassword, setLoading, setPassengerLogin, setToken } from "../../redux/slices/booking/bookingslices.jsx";
import { NavLink, useNavigate } from "react-router-dom";

const ForgetPassword = React.lazy(() => import("../JsxFolder/ForgetPassword.jsx"));

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
            setPassengerLogin({
                ...state.booking.passengerLogin,
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

    const cancelModal = () => {
        dispatch(setShowPasswordModal(!state.booking.showPasswordModal));
    };

    const handleRequest = async (url, method, body) => {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "An error occurred while processing your request.");
        }

        return await response.json();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await handleRequest("http://localhost:5000/api/auth/login", "POST", {
                email: state.booking.passengerLogin.email,
                password: state.booking.passengerLogin.password
            });

            if (response.token) {
                dispatch(setToken(response.token));
                setShowNotification(true);
                setTimeout(() => {
                    navigate("/"); 
                }, 3000);
                console.log("Login Successfully!");
            } else {
                throw new Error("Login failed. Please check your credentials.");
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        dispatch(setLoading(true));

        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);

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
                                <p className="text-body-4  text-metal-700 m-0 font-semibold">
                                    Account is Login Successfully!
                                </p>
                            </div>
                        </div>
                    </Notification.Content>
                </Notification.Body>
            </Notification>
        </div>
    );

    return (
        <main className="SignIn_container">
            <Container maxWidth="lg">
                {state.booking.loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: "-5%" }}>
                        <TailSpin visible={true} height="60" width="60" color="#605dec" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" />
                    </div>
                ) : (
                    <>
                        <main className="SignIn_modal">
                            <section className="signIn_image_container">
                                <img src={signIn} alt="signIn" className="Image_signIn" />
                            </section>
                            <section className="signIn_form_container">
                                <h1 className="font-bold text-3xl mb-2" style={{ color: "#f8467a" }}>
                                    Sign In
                                </h1>
                                <p className="text-zinc-400 text-sm font-semibold m-0 ">
                                    Not a member?{" "}
                                    <NavLink className="text-orange-500 cursor-pointer no-underline" to="/SignUp">
                                        Sign up
                                    </NavLink>
                                </p>
                                <div className="plugin_desktop">
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
                                <p className="font-semibold text-zinc-500 text-sm text-center Separate1">OR</p>
                                <form className="signin-form" onSubmit={handleSubmit}>
                                    <div className="input-with-icon">
                                        <CiMail className="icon" />
                                        <input className="user_field" type="text" name="email" placeholder="Email or Phone Number" required autoComplete="off" value={state.booking.passengerLogin.email} onChange={handleInputChange} />
                                    </div>
                                    <div className="input-with-icon flex items-center">
                                        {state.booking.showPassword === "password" ? <CiLock className="icon" onClick={handleShowPassword} /> : <CiUnlock className="icon" onClick={handleHidePassword} />}
                                        <input
                                            className="user_field"
                                            type={state.booking.showPassword}
                                            name="password"
                                            placeholder="Password"
                                            required
                                            autoComplete="off"
                                            value={state.booking.passengerLogin.password}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="flex text-center justify-between ">
                                        <p className={`text-zinc-400 text-sm condition1 ${state.booking.conditionCheck ? "activeItem" : ""}`} onClick={handleCondition}>
                                            Remember me
                                        </p>
                                        <p className="text-zinc-400 text-sm forget_Password cursor-pointer " onClick={cancelModal}>
                                            Forget password ?
                                        </p>
                                    </div>
                                    <Button type="submit" className="Sign_In_Button">Sign In</Button>
                                </form>
                                <section><ForgetPassword/></section>
                            </section>
                        </main>
                        <Suspense fallback={<div>Loading...</div>}>
                            <NotificationComponent/>
                        </Suspense>
                    </>
                )}
            </Container>
        </main>
    );
}

export default SignUp;
