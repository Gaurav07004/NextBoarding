import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Typography, Divider } from "keep-react";
import { EnvelopeSimple,Trash, Check } from "phosphor-react";
import { CiLock, CiMail, CiUnlock } from "react-icons/ci";
import "../CssFolder/AccountDetail.css";
import { useNavigate } from "react-router-dom";
import { setShowPasswordModal, setShowPassword } from "../../redux/slices/booking/bookingslices.jsx";
import { startTransition } from "react";
import Countdown from "react-countdown";

function Account() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [ShowDeleteModal, setDeleteModal] = useState(false);
    const state = useSelector((state) => state);

    const handleChange = (e, passengerIndex) => {
        const { name, value } = e.target;

        startTransition(() => {
            const updatedPassengerForms = [...state.booking.passengerAccInfo];
            updatedPassengerForms[passengerIndex] = {
                ...updatedPassengerForms[passengerIndex],
                [name]: value,
            };
        });
    };

    const fieldPlaceholders = {
        Fullname: "Full Name",
        PhoneNumber: "Phone Number",
        MaritalStatus: "Marital Status",
        Gender: "Gender",
        EmailAddress: "Email Address",
        Address: "Residential Address",
    };
    const cancelModal = () => {
        dispatch(setShowPasswordModal(!state.booking.showPasswordModal));
    };
    const deleteModal = () => {
        dispatch(setDeleteModal(!ShowDeleteModal));
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
        const inputs = Array.from({ length: 6 }, (_, index) => <input key={index} className="OTP_field text-center text-2xl rounded-lg m-0" type="text" maxLength={1} />);

        return (
            <>
                <div className="flex justify-between mt-11 OTP_container">{inputs}</div>
                <Countdown className="float-right mt-6 text-metal-500 text-center text-base timer" date={Date.now() + 2 * 60 * 1000} />
            </>
        );
    };
    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => {
            const nextSlide = prevSlide + 1;
            if (nextSlide === 4) {
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
    const forgetPassword = () => {
        return (
            <>
                <Modal isOpen={state.booking.showPasswordModal} onClose={cancelModal}>
                    <Modal.Body className="flex flex-col">
                        <Modal.Content className="my-4">
                            {slides[currentSlide].forget_label == "Check your email" ? (
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
                                        <input className="forget_Password_field rounded-lg" type="email" placeholder="Enter your email address" />
                                    </>
                                )}
                                {slides[currentSlide].forget_label === "Check your email" && <OTP />}
                                {slides[currentSlide].forget_label === "Set new password" && (
                                    <>
                                        {state.booking.showPassword === "password" ? <CiLock className="icon" onClick={handleShowPassword} /> : <CiUnlock className="icon" onClick={handleHidePassword} />}
                                        <input className="forget_Password_field rounded-lg" type={state.booking.showPassword} placeholder="New Password" />
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
                            {slides[currentSlide].forget_label !== "Forget Password" ? (
                                <Button size="md" variant="outline" color="secondary" onClick={handlePrevSlide} className="w-1/2 back">
                                    Back
                                </Button>
                            ) : (
                                ""
                            )}
                            <Button size="md" color="primary" onClick={handleNextSlide} className="Reset_button ">
                                {slides[currentSlide].forget_label === "Forget Password" ? "Send Email" : "Submit"}
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>
            </>
        );
    };
    const Delete_Account = () => {
        return (
            <>
                <Modal isOpen={ShowDeleteModal} onClose={deleteModal}>
                    <Modal.Body className="flex flex-col">
                        <Modal.Content className="my-4">
                                <div className="flex items-center gap-2">
                                    <Modal.Icon className="rounded-md bg-red-100">
                                        <Trash size={28} color="red" />
                                    </Modal.Icon>
                                    <Typography variant="h3" className="text-body-1 font-bold text-metal-700">
                                        Delete Account
                                    </Typography>
                                </div>
                            <Typography variant="p" className={`mt-3 text-body-4 font-normal text-metal-600  ${slides[currentSlide].forget_label === "Password reset" ? "flex justify-center" : ""}`}>
                                Confirm your Email Address and Password to delete your account.
                            </Typography>
                            <div className="input-with-icon">
                                <>
                                    <CiMail className="icon1 mt-0" />
                                    <input className="forget_Password_field rounded-lg" type="email" placeholder="Enter your email address" />
                                    {state.booking.showPassword === "password" ? <CiLock className="icon2" onClick={handleShowPassword} /> : <CiUnlock className="icon" onClick={handleHidePassword} />}
                                    <input className="forget_Password_field rounded-lg" type={state.booking.showPassword} placeholder="New Password" />
                                </>
                            </div>
                        </Modal.Content>
                        <Modal.Footer>
                            <Button size="md" variant="outline" color="secondary" onClick={deleteModal} className="w-1/2 back">
                                Cancel
                            </Button>
                            <Button size="md" color="primary" onClick={deleteModal} className="Reset_button ">
                                Confirm
                            </Button>
                        </Modal.Footer>
                    </Modal.Body>
                </Modal>
            </>
        );
    };

    return (
        <main>
            <section>
                <div className="grid grid-cols-2 items-center gap-4 account_data mt-6">
                    {["Fullname", "EmailAddress", "PhoneNumber", "MaritalStatus", "Gender", "Address"].map((field) => (
                        <div key={field}>
                            <label htmlFor="name" className="text-left font-semibold text-gray-500">
                                {fieldPlaceholders[field]}
                            </label>
                            <input
                                type={field}
                                name={field}
                                autoComplete="off"
                                value={state.booking.passengerAccInfo[field]}
                                onChange={(e) => handleChange(e)}
                                className="name mt-4 p-2 col-span-3"
                                placeholder={fieldPlaceholders[field] || `${field.charAt(0).toUpperCase()}${field.slice(1)}*`}
                            />
                        </div>
                    ))}
                </div>
                <div>{forgetPassword()}</div>
                <Divider size="lg" className="mt-5"/>
                <div className="mt-1 flex justify-between items-center">
                    <div className="font-semibold text-gray-500 cursor-pointer" onClick={cancelModal}>
                        Change Password
                    </div>
                    <Button color="warning" className="mt-6">
                        Update
                    </Button>
                </div>
                <Divider size="lg" className="mt-6" />
                <div>{Delete_Account()}</div>
                <div className="font-semibold mt-6 text-red-500 cursor-pointer" onClick={deleteModal}>
                    Delete Account
                </div>
            </section>
        </main>
    );
}

export default Account;
