import { useState, Suspense } from "react";
import { Button, Modal, Typography, Notification } from "keep-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CiLock, CiMail, CiUnlock } from "react-icons/ci";
import { setShowPassword, setDeleteAccount, setDeleteModal } from "../../redux/slices/booking/bookingslices.jsx";
import { Trash, Check } from "phosphor-react";

function DeleteAccount() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const state = useSelector((state) => state);
    const [showNotification, setShowNotification] = useState(false); 

    const handleDeleteAccount = (e) => {
        const { name, value } = e.target;
        dispatch(
            setDeleteAccount({
                ...state.booking.deleteAccount,
                [name]: value,
            })
        );
        console.log("deleteAccount",state.booking.deleteAccount);
    };

    const handleShowPassword = () => {
        dispatch(setShowPassword("text"));
    };

    const handleHidePassword = () => {
        dispatch(setShowPassword("password"));
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = state.booking.token;
            if (!token) {
                throw new Error("No token found. Please log in.");
            }

            const response = await fetch("http://localhost:5000/api/auth/DeleteAccount", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ email: state.booking.deleteAccount.email, password: state.booking.deleteAccount.password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            setShowNotification(true);
            console.log("Account deleted successfully");
            setTimeout(() => {
                navigate("/SignUp");
            }, 3000);
        } catch (error) {
            console.error("Error:", error.message);
        }
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
                                <p className="text-body-4  text-metal-700 m-0 font-semibold">
                                    Account deleted successfully
                                </p>
                            </div>
                        </div>
                    </Notification.Content>
                </Notification.Body>
            </Notification>
        </div>
    );  

    //console.log("forgetEmail", state.booking.forgetEmail);

    const deleteModal = () => {
        dispatch(setDeleteModal(!state.booking.ShowDeleteModal));
    };

    return (
        <>
        <Modal isOpen={state.booking.ShowDeleteModal} onClose={deleteModal}>
            <form onSubmit={handleDeleteSubmit}>
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
                                <input
                                    className="forget_Password_field rounded-lg"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email address"
                                    required
                                    autoComplete="off"
                                    value={state.booking.deleteAccount.email}
                                    onChange={handleDeleteAccount}
                                />
                                {state.booking.showPassword === "password" ? <CiLock className="icon2" onClick={handleShowPassword} /> : <CiUnlock className="icon2" onClick={handleHidePassword} />}
                                <input
                                    className="forget_Password_field rounded-lg"
                                    type={state.booking.showPassword}
                                    placeholder="Password"
                                    required
                                    autoComplete="off"
                                    name="password"
                                    value={state.booking.deleteAccount.password}
                                    onChange={handleDeleteAccount}
                                />
                            </>
                        </div>
                    </Modal.Content>
                    <Modal.Footer>
                        <Button size="md" variant="outline" color="secondary" onClick={deleteModal} className="w-1/2 back">
                            Cancel
                        </Button>
                        <Button size="md" type="submit" color="primary" className="Reset_button ">
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal.Body>
            </form>
        </Modal>
        <Suspense>
            <NotificationComponent/>
        </Suspense>
        </>
    );
}

export default DeleteAccount;
