import React from "react";
import { Outlet } from "react-router-dom";
import ScrollToHash from "../utils/ScrollToHash";

const HomeLayout = () => {
  return (
    <div className="w-full overflow-x-hidden">
      <ScrollToHash />
      <Outlet />
    </div>
  );
};

export default HomeLayout;
