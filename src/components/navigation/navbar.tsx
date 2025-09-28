import Logout from "./Logout";
import Profile from "./Profile";


const Navbar = () => {
  return (
    <div className="w-full shadow-lg border-l border-gray-200 h-[10vh] ">
      <div className=" p-6 h-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">MedTech</h1>
    
     <div className="flex items-center gap-4">
           <Profile />
        <Logout/>
     </div>
      </div>
    </div>
  );
};

export default Navbar;