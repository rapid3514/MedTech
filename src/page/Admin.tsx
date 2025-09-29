import { Outlet } from "react-router-dom";
import Navbar from "../components/navigation/navbar";
import Sidebar from "../components/navigation/sidebar";

const Admin = () => {
  return (
    <div
      className="
        w-full h-full grid grid-cols-1 lg:grid-cols-[15%_85%] grid-rows-[auto_1fr] min-h-screen
      "
    >
      <div className="row-span-1 lg:row-span-2">
        <Sidebar />
      </div>

      <div className="col-span-1">
        <Navbar />
      </div>

     
      <div className="p-4 col-span-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Admin;
