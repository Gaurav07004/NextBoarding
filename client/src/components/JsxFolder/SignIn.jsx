import { useEffect, useState } from "react";
import signIn from "../../assets/book.png";
import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { TailSpin } from "react-loader-spinner";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { CiLock, CiMail, CiUnlock } from "react-icons/ci";
import { Button, Modal, Typography } from "keep-react";
import { EnvelopeSimple, Check } from "phosphor-react";
import "../CssFolder/SignIn.css";
import { setConditionCheck, setShowPasswordModal, setShowPassword, setLoading, setPassengerLogin, setForgetEmail, setOTP, setToken  } from "../../redux/slices/booking/bookingslices.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import Countdown from "react-countdown";

function SignUp() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

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

    const handleEmailChange = (e) => {
        const { name, value } = e.target;
        dispatch(
            setForgetEmail({
                ...state.booking.forgetEmail,
                [name]: value,
            })
        );
        console.log(state.booking.forgetEmail)
    };
    const handleOTP = (e, index) => {
        const { value } = e.target;
        dispatch(
            setOTP({
                ...state.booking.OTP,
                [`OTP_${index + 1}`]: value,
            })
        );
    };

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => {
            const nextSlide = prevSlide + 1;
            if (nextSlide === 3) {
                navigate("/SignIn");
            }
            return nextSlide;
        });
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => prevSlide - 1);
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

    const handleEmail = async (e) => {
        e.preventDefault();
        try {
            await handleRequest("http://localhost:5000/api/auth/forget-password", "POST", { email: state.booking.forgetEmail.email });
            alert("Email sent successfully");
            console.log("Email sent successfully");
        } catch (error) {
            alert("Error: " + error.message);
            console.error(error);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        try {
            await handleRequest("http://localhost:5000/api/auth/verify-otp", "POST", { OTP: state.booking.OTP.Totalcount });
            console.log("OTP Verified Successfully!");
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        // Send login request
        const response = await handleRequest("http://localhost:5000/api/auth/login", "POST", {
            email: state.booking.passengerLogin.email,
            password: state.booking.passengerLogin.password
        });
        
        // Check if login was successful
        if (response.token) {
            // If successful, dispatch action to set token in Redux state
            dispatch(setToken(response.token));
            // Alert user about successful login
            alert("Login Successfully!");
            // Navigate user to another page (e.g., home page)
            navigate("/");
            // Log success message to console
            console.log("Login Successfully!");
        } else {
            // If login failed (no token in response), handle error
            throw new Error("Login failed. Please check your credentials.");
        }
    } catch (error) {
            console.error(error.message);
        }
    };
    const handlechangePassword = async (e) => {
        e.preventDefault();
        try {
            await handleRequest("http://localhost:5000/api/auth/changePassword", "POST", { email: state.booking.forgetEmail.email, newPassword: state.booking.forgetEmail.password });
            console.log("Password update successfully");
        } catch (error) {
            console.error(error.message);
        }
    };

    const slides = [
        { forget_label: "Forget Password", heading: "Don't worry! Resetting your password is easy. Just type in the email address you used to register for FlyEase." },
        { forget_label: "Check your email", heading: "We have sent you an email at gauravsingh07004@gmail.com. Check your inbox and verify your email address." },
        {
            forget_label: "Set new password",
            heading: "Your new password must be different to previously used password.",
            condition_1: "Having at least 8 characters",
            condition_2: "Includes at least one digit (0-9)",
            condition_3: "Includes at least one lowercase letter (a-z)",
            condition_4: "Includes at least one uppercase letter (A-Z)",
            condition_5: "Includes at least one special character (e.g. !, $,#,%,*)",
        },
        { forget_label: "Password reset", heading: "Your password has been successfully reset." },
    ];

    const OTP = () => {
        const inputs = Array.from({ length: 6 }, (_, index) => (
            <input
                key={index}
                className="OTP_field text-center text-2xl rounded-lg m-0"
                type="text"
                maxLength={1}
                name={`OTP_${index + 1}`}
                autoComplete="off"
                value={state.booking.OTP[`OTP_${index + 1}`]}
                onChange={(e) => handleOTP(e, index)}
            />
        ));

        return (
            <>
                <div className="flex justify-between mt-11 OTP_container">{inputs}</div>
                <Countdown className="float-right mt-6 text-metal-500 text-center text-base timer" date={Date.now() + 2 * 60 * 1000} />
            </>
        );
    };

    const forgetPassword = () => (
        <>
            <Modal isOpen={state.booking.showPasswordModal} onClose={cancelModal}>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (slides[currentSlide].forget_label === "Forget Password") {
                            await handleEmail(e);
                            handleNextSlide();
                        } else if (slides[currentSlide].forget_label === "Check your email") {
                            await handleVerifyOTP(e);
                            handleNextSlide();
                        } else if (slides[currentSlide].forget_label === "Set new password") {
                            await handlechangePassword(e);
                            handleNextSlide();
                        } else {
                            handleNextSlide();
                        }
                    }}
                >
                    <Modal.Body className="flex flex-col">
                        <Modal.Content className="my-4">
                            {slides[currentSlide].forget_label === "Check your email" ? (
                                <div className="flex items-center gap-2">
                                    <Modal.Icon className="rounded-md bg-green-100">
                                        <EnvelopeSimple size={28} color="#4bdc4b" />
                                    </Modal.Icon>
                                    <Typography variant="h3" className="text-body-1 font-bold text-metal-700">
                                        {slides[currentSlide].forget_label}
                                    </Typography>
                                </div>
                            ) : (
                                <Typography variant="h3" className={`text-body-1 font-bold text-metal-700 ${slides[currentSlide].forget_label === "Password reset" ? "flex justify-center" : ""}`}>
                                    {slides[currentSlide].forget_label}
                                </Typography>
                            )}
                            <Typography variant="p" className={`mt-3 text-body-4 font-normal text-metal-600  ${slides[currentSlide].forget_label === "Password reset" ? "flex justify-center" : ""}`}>
                                {slides[currentSlide].heading}
                            </Typography>
                            <div className="input-with-icon">
                                {slides[currentSlide].forget_label === "Forget Password" && (
                                    <>
                                        <CiMail className="icon mt-0" />
                                        <input
                                            className="forget_Password_field rounded-lg"
                                            type="email"
                                            name="email"
                                            placeholder="Enter your email address"
                                            required
                                            autoComplete="off"
                                            value={state.booking.forgetEmail.email}
                                            onChange={handleEmailChange}
                                        />
                                    </>
                                )}
                                {slides[currentSlide].forget_label === "Check your email" && <OTP />}
                                {slides[currentSlide].forget_label === "Set new password" && (
                                    <>
                                        {state.booking.showPassword === "password" ? <CiLock className="icon" onClick={handleShowPassword} /> : <CiUnlock className="icon" onClick={handleHidePassword} />}
                                        <input className="forget_Password_field rounded-lg" type={state.booking.showPassword} placeholder="New Password" autoComplete="new-password" name="password" value={state.booking.forgetEmail.password} onChange={handleEmailChange}/>
                                    </>
                                )}
                                {slides[currentSlide].forget_label === "Password reset" && (
                                    <Modal.Icon className="h-20 w-20 bg-success-50 text-success-500 checkMark">
                                        <Check size={60} />
                                    </Modal.Icon>
                                )}
                            </div>
                        </Modal.Content>
                        <Modal.Footer>
                            {slides[currentSlide].forget_label !== "Forget Password" && (
                                <Button size="md" variant="outline" color="secondary" onClick={handlePrevSlide} className="w-1/2 back">
                                    Back
                                </Button>
                            )}
                            <Button size="md" color="primary" type="submit" className="Reset_button">
                                {slides[currentSlide].forget_label === "Forget Password" ? "Send Email" : "Submit"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>
                </form>
            </Modal>
        </>
    );

    useEffect(() => {
        dispatch(setLoading(true));

        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);

    return (
        <main className="SignIn_container">
            <Container maxWidth="lg">
                {state.booking.loading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", marginTop: "-5%" }}>
                        <TailSpin visible={true} height="60" width="60" color="#605dec" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" />
                    </div>
                ) : (
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
                            <section>{forgetPassword()}</section>
                        </section>
                    </main>
                )}
            </Container>
        </main>
    );
}

export default SignUp;
