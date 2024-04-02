import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, Typography, Divider } from "keep-react";
import { Trash } from "phosphor-react";
import { CiLock, CiMail, CiUnlock } from "react-icons/ci";
import "../CssFolder/AccountDetail.css";
import { setShowPasswordModal, setShowPassword, setPassengerAccInfo, setAccountData } from "../../redux/slices/booking/bookingslices.jsx";

const ForgetPassword = React.lazy(() => import("../JsxFolder/ForgetPassword.jsx"));

function Account() {
    const dispatch = useDispatch();
    const [ShowDeleteModal, setDeleteModal] = useState(false);
    const [Data, setData] = useState(true);
    const state = useSelector((state) => state);

    const handleChange = (e) => {
        const { name, value } = e.target;

        dispatch(
            setPassengerAccInfo({
                ...state.booking.passengerAccInfo,
                [name]: value,
            })
        );
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

    const handleShowPassword = () => {
        dispatch(setShowPassword("text"));
    };

    const handleHidePassword = () => {
        dispatch(setShowPassword("password"));
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
                            <Typography variant="p" className={`mt-3 text-body-4 font-normal text-metal-600`}>
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

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = state.booking.token;
                if (!token) {
                    throw new Error("No token found. Please log in.");
                }

                const response = await fetch("http://localhost:5000/api/auth/user", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                dispatch(setAccountData(data.userData));
                console.log("accountData", data.userData);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, []);

    if (Data && state.booking.accountData) {
        dispatch(
            setPassengerAccInfo({
                Fullname: state.booking.accountData.fullName,
                PhoneNumber: state.booking.accountData.PhoneNumber,
                MaritalStatus: state.booking.accountData.MaritalStatus,
                EmailAddress: state.booking.accountData.email,
                Gender: state.booking.accountData.Gender,
                Address: state.booking.accountData.Address,
            })
        );
        setData(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = state.booking.token;
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await fetch("http://localhost:5000/api/auth/AccountData", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullName: state.booking.passengerAccInfo.Fullname,
                    email: state.booking.passengerAccInfo.EmailAddress,
                    PhoneNumber: state.booking.passengerAccInfo.PhoneNumber,
                    MaritalStatus: state.booking.passengerAccInfo.MaritalStatus,
                    Gender: state.booking.passengerAccInfo.Gender,
                    Address: state.booking.passengerAccInfo.Address,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Something went wrong");
            }
            alert("Data stored successfully");
            console.log("Data stored successfully");
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    console.log("passengerAccInfo", state.booking.passengerAccInfo);

    return (
        <main>
            <section>
                <form onSubmit={handleSubmit}>
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
                    <section>
                        <ForgetPassword />
                    </section>
                    <Divider size="lg" className="mt-5" />
                    <div className="mt-1 flex justify-between items-center">
                        <div className="font-semibold text-gray-500 cursor-pointer" onClick={cancelModal}>
                            Change Password
                        </div>
                        <Button type="submit" color="warning" className="mt-6">
                            Update
                        </Button>
                    </div>
                    <Divider size="lg" className="mt-6" />
                    <div>{Delete_Account()}</div>
                    <div className="font-semibold mt-6 text-red-500 cursor-pointer" onClick={deleteModal}>
                        Delete Account
                    </div>
                </form>
            </section>
        </main>
    );
}

export default Account;
