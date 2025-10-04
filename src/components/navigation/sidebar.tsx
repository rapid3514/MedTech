import { Button } from "@mui/material";
import ReorderIcon from "@mui/icons-material/Reorder";
import { Link } from "react-router-dom";
import { useAuth } from "../../store/auth.store";


const Sidebar = () => {
  const { user } = useAuth();

  return (
    <div className="w-full h-full shadow-xl">
      <div className="w-[90%] mx-auto">
        <div className="flex items-center justify-between mb-5 pt-4">
          <h1 className="text-xl font-bold">Navigation</h1>
          <ReorderIcon />
        </div>

        {user?.role === "admin" && (
          <>
            <Link to="/admin/charts" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 1, width: "100%" }}
              >
                Dashboard
              </Button>
            </Link>

            <Link to="/admin/user" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 1, width: "100%" }}
              >
                User
              </Button>
            </Link>
               <Link to="/admin/admin-patients" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 1, width: "100%" }}
              >
                Patients menegmant
              </Button>
            </Link>
          </>
        )}

        {user?.role === "reception" && (
          <>
            <Link to="" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 1, width: "100%" }}
              >
                Bemor qo‘shish
              </Button>
            </Link>

            <Link to="patients" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: 1, width: "100%" }}
              >
                Uchrashuvlar
              </Button>
            </Link>
            
          </>
        )}

        {/* Doctor uchun */}
        {user?.role === "doctor" && (
          <Button
            variant="contained"
            color="primary"
            sx={{ marginTop: 1, width: "100%" }}
            disabled // 👈 navigatsiya yo‘q, faqat button
          >
            Dashboard
          </Button>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
