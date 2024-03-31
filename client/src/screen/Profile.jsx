import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../components/CssFolder/Profile.css";
//import { Button } from "keep-react";
//import { Pencil1Icon } from "@radix-ui/react-icons";
//import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogClose, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
import { MdArrowForwardIos, MdAdd } from "react-icons/md";
import { BsPencilSquare } from "react-icons/bs";
import { FiUser, FiLogOut } from "react-icons/fi";
import { GoDotFill } from "react-icons/go";
import { TbListDetails } from "react-icons/tb";
import { TailSpin } from "react-loader-spinner";
import { setSelectedImages, setLoading, setShowModel } from "../redux/slices/booking/bookingslices.jsx";
import Container from "@mui/material/Container";
import ImageUploading from "react-images-uploading";

const Navbar = React.lazy(() => import("../components/JsxFolder/Navbar.jsx"));

function MyTrips() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);

    useEffect(() => {
        dispatch(setLoading(true));

        const loadingTimeout = setTimeout(() => {
            dispatch(setLoading(false));
        }, 1000);

        return () => clearTimeout(loadingTimeout);
    }, [dispatch]);

    const handleImageUpload = (imageList) => {
        dispatch(setSelectedImages(imageList));
    };

    const handleEditModal = () => {
        dispatch(setShowModel(!state.booking.showModel));
    };

    console.log(state.booking.selectedImages);
    // const handleChange = (e, passengerIndex) => {
    //     const { name, value } = e.target;
    //     const updatedPassengerForms = [...state.booking.passengerAccInfo];
    //     updatedPassengerForms[passengerIndex] = {
    //         ...updatedPassengerForms[passengerIndex],
    //         [name]: value,
    //     };
    // };

    // const fieldPlaceholders = {
    //     Fullname: "Full Name",
    //     PhoneNumber: "Phone Number",
    //     MaritalStatus: "Marital Status",
    //     Gender: "Gender",
    //     Pincode: "Pincode",
    // };

    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                <Navbar />
            </Suspense>
            {state.booking.loading ? (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    <TailSpin visible={true} height="60" width="60" color="#605dec" ariaLabel="tail-spin-loading" radius="1" wrapperStyle={{}} wrapperClass="" />
                </div>
            ) : (
                <main className="MyProfile_section">
                    <Container maxWidth="lg">
                        <section className="Bread_crumb uppercase relative">
                            <span className="MyAccount_label">My Account </span>
                            <span>
                                <MdArrowForwardIos />
                            </span>
                            <span>My Profile</span>
                        </section>
                        <section className="MyAccount">
                            <div className="Personal_Profile">
                                <ImageUploading multiple value={state.booking.selectedImages} onChange={handleImageUpload} maxNumber={1} dataURLKey="data_url">
                                    {({ imageList, onImageUpload, onImageUpdate }) => (
                                        <div className="upload__image-wrapper">
                                            {imageList.length === 0 ? (
                                                <div className="user_icon">
                                                    <FiUser />
                                                </div>
                                            ) : (
                                                ""
                                            )}
                                            <div
                                                onClick={() => {
                                                    imageList.length === 0 ? onImageUpload() : onImageUpdate(0);
                                                }}
                                                className="Image_Update_Btn bg-amber-400"
                                            >
                                                {imageList.length === 0 ? <BsPencilSquare /> : <BsPencilSquare />}
                                            </div>
                                            {imageList.map((image, index) => (
                                                <div key={index}>
                                                    <img className="image-item" src={image["data_url"]} alt="" width="100" />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </ImageUploading>
                                <p className="text-metal-400 text-center text-lg font-semibold mt-2 mb-2">Gaurav Singh</p>
                                <p className="uppercase text-center text-xs text-amber-400 font-semibold">personal profile</p>
                                <div className="flex flex-col justify-center text-md cursor-pointer">
                                    {[
                                        { icon: <FiUser />, name: "Profile" },
                                        { icon: <TbListDetails />, name: "Login Details" },
                                        { icon: <FiLogOut />, name: "Logout" },
                                    ].map((level, index) => (
                                        <div key={index} className="flex items-center gap-3 p-2 hover:bg-amber-100 rounded-md transition-all">
                                            <span className="text-amber-500">{level.icon}</span>
                                            <p className="m-0 text-metal-700">{level.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="Personal_Profile_info_section">
                                <div className="Profile_info_section">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-amber-400 text-4xl Profile_label">Profile</h1>
                                        {/* <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="bg-amber-400 hover:bg-amber-300">
                                                    <Pencil1Icon className="mr-2 h-4 w-4" /> Edit Profile
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle className="text-left">Edit profile</DialogTitle>
                                                    <DialogDescription className="text-left">Make changes to your profile here. Click save when you are done.</DialogDescription>
                                                </DialogHeader>
                                                <div className="grid gap-2">
                                                    <div className="grid grid-cols-2 items-center gap-4">
                                                        {["Fullname", "PhoneNumber", "MaritalStatus", "Gender", "Address", "Pincode"].map((field) => (
                                                            <div className="input_area gap-3" key={field}>
                                                                <label htmlFor="name" className="text-left">
                                                                    {field}
                                                                </label>
                                                                <input
                                                                    type={field}
                                                                    name={field}
                                                                    autoComplete="off"
                                                                    value={state.booking.passengerAccInfo[field]}
                                                                    onChange={(e) => handleChange(e)}
                                                                    className="name p-2 col-span-3"
                                                                    placeholder={fieldPlaceholders[field] || `${field.charAt(0).toUpperCase()}${field.slice(1)}*`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button type="button" variant="default" className="bg-amber-400 hover:bg-amber-300">
                                                            Save Changes
                                                        </Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog> */}
                                    </div>
                                    <p className="text-metal-700 sub_heading">Basic info, for a faster booking experience</p>
                                    <div className="flex flex-col justify-center">
                                        {[
                                            { label: "Name", value: "Add" },
                                            { label: "Gender", value: "Add" },
                                            { label: "Marital Status", value: "Add" },
                                            { label: "Your Address", value: "Add" },
                                            { label: "Pincode", value: "Add" },
                                            { label: "State", value: "Add" },
                                        ].map((info, index) => (
                                            <div key={index} className="flex text-sm hover:bg-amber-100 rounded-md transition-all account_info">
                                                <div className="text-metal-700 w-3/12 account_label">{info.label}</div>
                                                <div className="flex items-center cursor-pointer text-amber-500 font-semibold w-3/12 account_value" onClick={handleEditModal}>
                                                    <MdAdd />
                                                    {info.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="Profile_info_section">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-amber-400 text-4xl Profile_label">Login Details</h1>
                                    </div>
                                    <p className="text-metal-700 sub_heading">Manage your email address mobile number and password</p>
                                    <div className="flex flex-col justify-center">
                                        {[
                                            { label: "Mobile Number", value: "+91-8291341433" },
                                            { label: "Email Address", value: "gauravsingh07004@gmail.com" },
                                            {
                                                label: "Password",
                                                value: (
                                                    <>
                                                        <GoDotFill />
                                                        <GoDotFill />
                                                        <GoDotFill />
                                                        <GoDotFill />
                                                        <GoDotFill />
                                                        <GoDotFill />
                                                    </>
                                                ),
                                            },
                                        ].map((info, index) => (
                                            <div key={index} className="flex text-sm hover:bg-amber-100 rounded-md transition-all account_info">
                                                <div className="text-metal-700 w-3/12 account_label">{info.label}</div>
                                                <div className="flex items-center cursor-pointer text-amber-500 font-semibold w-3/12 account_value">{info.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Container>
                </main>
            )}
        </>
    );
}

export default MyTrips;
