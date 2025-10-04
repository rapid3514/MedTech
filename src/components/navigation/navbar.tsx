import { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Typography,
} from "@mui/material";
import Logout from "./Logout";
import Profile from "./Profile";
import { useAuth } from "../../store/auth.store";

const Navbar = () => {
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const firstLetter = user?.email?.[0]?.toUpperCase() || "?";

  return (
    <div className="w-full shadow-lg border-l border-gray-200 ">
      <div className="p-2 mx-[2%] h-full flex justify-between items-center">
        <h1 className="text-2xl font-bold">MedTech</h1>

        <div className="flex items-center gap-4">
          <IconButton onClick={handleOpen}>
            <Avatar sx={{ bgcolor: "#1976d2", color: "white" }}>
              {firstLetter}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <div className="px-4 py-2">
              <Typography variant="subtitle1">User Info</Typography>
            </div>
            <Divider />
            <MenuItem onClick={handleClose}>
              <Profile />
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Logout />
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
