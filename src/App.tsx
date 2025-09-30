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
import Addpatients from "./components/receptioncomp/addpatients";
import Appontimentslist from "./components/receptioncomp/appontiments-list";
import PatientsManagement from "./components/receptioncomp/patents-menegmant";

function App() {
  return (
    <>
      <AuthRefresh>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <RoleRoute roles={["admin"]}>
                <Admin />
              </RoleRoute>
            }
          >
            <Route index element={<Chartspage />} />
            <Route path="charts" element={<Chartspage />} />
            <Route path="admin-patients" element={<PatientsManagement/>} />
            <Route path="user" element={<Userslist />} />
          </Route>

          <Route
            path="/doctor"
            element={
              <RoleRoute roles={["doctor"]}>
                <Doctor />
              </RoleRoute>
            }
          />

          <Route
            path="/reception"
            element={
              <RoleRoute roles={["reception"]}>
                <Reception />
              </RoleRoute>
            }
          >
            <Route path="appontments" element={<Appontimentslist/>} />
            <Route path="patients" element={<Addpatients />} />
          </Route>

          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/create-patents" element={<Addpatients />} />
          <Route path="/create-user" element={<CreateUserForm />} />
        </Routes>
      </AuthRefresh>
    </>
  );
}

export default App;
