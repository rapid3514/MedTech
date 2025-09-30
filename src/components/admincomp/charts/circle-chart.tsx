import * as React from "react";
import { pieArcLabelClasses, PieChart } from "@mui/x-charts/PieChart";
import Stack from "@mui/material/Stack";
import { api } from "../../../Service/api";


export default function CircleChart() {
  const [userCounts, setUserCounts] = React.useState({
    doctor: 0,
    reception: 0,
    admin: 0,
  });

  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users"); 
        const users = res.data.items || res.data;

        const counts = { doctor: 0, reception: 0, admin: 0 };
        users.forEach((user: any) => {
          if (user.role === "doctor") counts.doctor++;
          if (user.role === "reception") counts.reception++;
          if (user.role === "admin") counts.admin++;
        });

        setUserCounts(counts);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };
    fetchUsers();
  }, []);

  const data = [
    { id: 0, value: userCounts.doctor, label: "Doctor" },
    { id: 1, value: userCounts.reception, label: "Reception" },
    { id: 2, value: userCounts.admin, label: "Admin" },
  ];

  return (
    <Stack>
      <PieChart
        series={[{ data, arcLabel: (item) => `${item.value}` }]}
        width={300}
        height={300}
        sx={{
          [`& .${pieArcLabelClasses.root}.${pieArcLabelClasses.animate}`]: {
            animationDuration: "2s",
          },
        }}
      />
    </Stack>
  );
}
