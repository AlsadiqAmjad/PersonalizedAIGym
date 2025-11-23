import React from "react";
import GuestHeader from "../Components/common/GuestHeader";
import { Outlet } from "react-router-dom";
import ScrollToHash from "../utils/ScrollToHash";
const HomeLayout = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <GuestHeader />
      <ScrollToHash />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
