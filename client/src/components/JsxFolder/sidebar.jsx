import { useDispatch, useSelector } from "react-redux";
import signUp_1 from "../../assets/signUp_1.png"
import { LuUserCircle2 } from "react-icons/lu";
import { BsPencilSquare } from "react-icons/bs";
import { FiUser } from "react-icons/fi";
import { PiPersonSimpleBikeBold, PiSuitcaseRollingFill  } from "react-icons/pi";
import { IoLogOut, IoCheckmarkCircleOutline  } from "react-icons/io5";
import { setSelectedProfileLabel, setSelectedImages, setSelectedTripStatus, setShowSidebar } from "../../redux/slices/booking/bookingslices.jsx";
import { MdCancelPresentation } from "react-icons/md";
import { RxCrossCircled  } from "react-icons/rx";
import { Sidebar, Avatar, Typography, Divider } from "keep-react";
import ImageUploading from "react-images-uploading";
import { NavLink } from "react-router-dom";

function SidebarComponent() {
    const dispatch = useDispatch();
    const state = useSelector((state) => state);
    const handleImageUpload = (imageList) => {
        dispatch(setSelectedImages(imageList));
    };
    const handleSidebar = () => {
        dispatch(setShowSidebar(!state.booking.showSidebar));
    };

    const handleTypeOfClass = (count) => {
        dispatch(setSelectedProfileLabel(count));
    };

    const handleTripStatus = (status_name) => {
        dispatch(setSelectedTripStatus(status_name));
    };

    const sidebarItems = [
        { icon: <LuUserCircle2 size={24} />, label: "Account Details" },
        { icon: <PiPersonSimpleBikeBold size={24} />, label: "My Trips", sub_label_1: "Upcoming", sub_label_2: "Cancelled", sub_label_3: "Completed" },
        // { icon: <IoLogIn  size={24} />, label: "LogIn Details" },
        { icon: <IoLogOut size={24} />, label: "Log Out"}
    ];

    return (
        <Sidebar>
            <div className="flex">
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
                <RxCrossCircled  className="text-xl cross" onClick={handleSidebar}/>
            </div>
            <Sidebar.Header className='mb-0'>
                <div className='px-3 font-semibold text-gray-400 text-lg mt-4'>General</div>
            </Sidebar.Header>
            <Sidebar.Body className="flex flex-col justify-between gap-4 p-2 cursor-pointer">
                {sidebarItems.map((item, index) => (
                    <div key={index} className='flex flex-col'>
                        <Sidebar.Item
                            className={`flex items-center justify-between p-2 ${state.booking.selectedProfileLabel === item.label || (!state.booking.selectedProfileLabel && item.label === "") ? "bg-amber-100 rounded-lg transition-all" : ""} hover:bg-amber-100 rounded-lg transition-all`}
                            onClick={() => {
                                handleTypeOfClass(item.label);
                                {item.label === "Account Details" ? handleTripStatus(item.label):"";}
                            }}
                        >
                            <div className="flex gap-2">
                                {item.icon}
                                {item.label === "Log Out" ? (
                                    <NavLink to={`/SignIn`}>
                                        {item.label}
                                    </NavLink>
                                ) : (
                                    item.label
                                )}
                            </div>
                        </Sidebar.Item>
                        {(state.booking.selectedProfileLabel === "My Trips" && item.label === "My Trips") && (
                            <div className='p-2 pl-6'>
                                <div className='p-2 flex gap-4 items-center' onClick={() => handleTripStatus(item.sub_label_1)}><PiSuitcaseRollingFill size={18}/><span>{item.sub_label_1}</span></div>
                                <div className='p-2 flex gap-4 items-center' onClick={() => handleTripStatus(item.sub_label_2)}><MdCancelPresentation size={18}/><span>{item.sub_label_2}</span></div>
                                <div className='p-2 flex gap-4 items-center' onClick={() => handleTripStatus(item.sub_label_3)}><IoCheckmarkCircleOutline  size={18}/><span>{item.sub_label_3}</span></div>
                            </div>
                        )}
                    </div>
                ))}
            </Sidebar.Body>
            <Divider className="my-3" size="xl"/>
            <Sidebar.Footer className="flex items-center gap-2">
                <div>
                    <Avatar shape="circle" img={signUp_1} />
                </div>
                <div>
                    <Typography variant="p" className="mb-0 text-body-3 font-medium text-metal-600">
                        User Id
                    </Typography>
                    <Typography variant="p" className="text-body-4 font-normal text-metal-400">
                        Gaurav Singh
                    </Typography>
                </div>
            </Sidebar.Footer>
        </Sidebar>
    );
}

export default SidebarComponent;
