import { useState } from "react";
import { Button, Modal, Typography } from "keep-react";
import { EnvelopeSimple, Check } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { CiLock, CiMail, CiUnlock } from "react-icons/ci";
import { setShowPasswordModal, setShowPassword, setForgetEmail, setOTP } from "../../redux/slices/booking/bookingslices.jsx";
import { useNavigate } from "react-router-dom";
import Countdown from "react-countdown";

function ForgetPassword() {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
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

    const handlechangePassword = async (e) => {
        e.preventDefault();
        try {
            await handleRequest("http://localhost:5000/api/auth/changePassword", "POST", { email: state.booking.forgetEmail.email, newPassword: state.booking.forgetEmail.password });
            console.log("Password update successfully");
        } catch (error) {
            console.error(error.message);
        }
    };

  return (
    <div>
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
    </div>
  )
}

export default ForgetPassword