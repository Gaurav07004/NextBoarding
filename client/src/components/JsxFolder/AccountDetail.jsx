import React, { useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Divider, Notification } from "keep-react";
import { Check } from 'phosphor-react'
import "../CssFolder/AccountDetail.css";
import { setPassengerAccInfo, setDeleteModal, setShowPasswordModal } from "../../redux/slices/booking/bookingslices.jsx";

const ForgetPassword = React.lazy(() => import("../JsxFolder/ForgetPassword.jsx"));
const DeleteAccount = React.lazy(() => import("../JsxFolder/DeleteAccount.jsx"));

function Account() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const [showNotification, setShowNotification] = useState(false); 

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
        dispatch(setDeleteModal(!state.booking.ShowDeleteModal));
    };

    console.log("passengerData", state.booking.flightBookingDetails)

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
                    <section><DeleteAccount/></section>
                    <div className="font-semibold text-red-500 cursor-pointer" onClick={deleteModal}>
                        Delete Account
                    </div>
                </form>
            </section>
            <Suspense>
                <NotificationComponent/>
            </Suspense>
        </main>
    );
}

export default Account;
