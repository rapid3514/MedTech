import { Button } from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-full h-full shadow-xl">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between mb-5 pt-4">
          <h1 className="text-xl font-bold">Navigation</h1>
          <ReorderIcon />
        </div>

        <Link to="/admin/charts" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" sx={{marginTop:1, width: '100%' }}>
            Dashboard
          </Button>
        </Link>

        <Link to="/admin/user" style={{ textDecoration: "none" }}>
          <Button variant="contained" color="primary" sx={{marginTop:1, width: '100%' }}>
            User
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
