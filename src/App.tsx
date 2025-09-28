import { Route, Routes } from "react-router-dom";
import { AuthRefresh } from "./components/authComp/Auth-Refresh";
import Login from "./page/Login";
import { RoleRoute } from "./Routes/role-route";
import Admin from "./page/Admin";
import Doctor from "./page/Doctor";
import Reception from "./page/Reception";
import ChangePassword from "./components/navigation/change-password";
import CreateUserForm from "./components/users/create-user";
import Userslist from "./components/users/users-list";
import Chartspage from "./page/charts-page";

function App() {
  return (
    <>
      <AuthRefresh>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["admin"]}>
                <Admin />
              </RoleRoute>
            }
          >
            {/* default page => charts */}
            <Route index element={<Chartspage />} />
            <Route path="charts" element={<Chartspage />} />
            <Route path="user" element={<Userslist />} />
          </Route>

          {/* Doctor */}
          <Route
            path="/doctor"
            element={
              <RoleRoute roles={["doctor"]}>
                <Doctor />
              </RoleRoute>
            }
          />

          {/* Reception */}
          <Route
            path="/reception"
            element={
              <RoleRoute roles={["reception"]}>
                <Reception />
              </RoleRoute>
            }
          />

          {/* Other */}
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/create-user" element={<CreateUserForm />} />
        </Routes>
      </AuthRefresh>
    </>
  );
}

export default App;
