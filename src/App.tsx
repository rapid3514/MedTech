import { Route, Routes, Navigate } from "react-router-dom";
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
import Appontimentslist from "./components/receptioncomp/patients-list";
import Patentsmenegmant from "./components/receptioncomp/patents-menegmant";
import Appointments from "./components/receptioncomp/addpatients";
import Uchrashuvlar from "./page/uchrashuvlar";
import PatientDetails from "./components/receptioncomp/patient-detail";
import AddAppointment from "./components/appontiments/add-Apontiments";
import PatentsList from "./components/receptioncomp/patients-list";
import AppointmentsList from "./components/appontiments/appointmnts-list";

function App() {
  return (
    <>
      <AuthRefresh>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

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
            <Route path="admin-patients" element={<Appontimentslist />} />
            <Route path="user" element={<Userslist />} />
          <Route path="appointments" element={<AddAppointment />} />
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
            <Route index element={<PatentsList />} />
            <Route path="patients" element={<Uchrashuvlar />} />
          <Route path="appointments" element={<AddAppointment />} />
              <Route path="appointments-list" element={<AppointmentsList/>}/>


          </Route>

          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/create-patents" element={<Appointments />} />
          <Route path="/create-user" element={<CreateUserForm />} />
          <Route path="/patients/:id" element={<Patentsmenegmant />} />
           <Route path="/patients-detail/:id" element={<PatientDetails />} />
        </Routes>
      </AuthRefresh>
    </>
  );
}

export default App;
