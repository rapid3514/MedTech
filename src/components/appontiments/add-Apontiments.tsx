import React, { useEffect, useState } from "react";
import { api } from "../../Service/api";
import type { Patient, User } from "../../store/auth.store";

export default function CreateAppointmentForm() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<User[]>([]);
  

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [status, setStatus] = useState("scheduled");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await api.get("/patients");
        const data = res.data.items ?? res.data;
        setPatients(data);
      } catch (err) {
        console.error("Error fetching patients", err);
      }
    };

    const fetchDoctors = async () => {
      try {
        const res = await api.get("/users");
        const data: User[] = res.data.items ?? res.data;
        const doctorsOnly = data.filter((u) => u.role?.toLowerCase() === "doctor");
        setDoctors(doctorsOnly);
      } catch (err) {
        console.error("Error fetching doctors", err);
      }
    };

    fetchPatients();
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientId || !doctorId || !startAt || !endAt) {
      setError("Iltimos barcha maydonlarni to‘ldiring");
      setSuccess("");
      return;
    }

    if (new Date(endAt) <= new Date(startAt)) {
      setError("End time must be after start time");
      setSuccess("");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/appointments", {
        patientId,
        doctorId,
        startAt: new Date(startAt).toISOString(),
        endAt: new Date(endAt).toISOString(),
        status,
        reason: reason || undefined,
      });

      setSuccess("Appointment created successfully!");
      setError("");

      // reset form
      setPatientId("");
      setDoctorId("");
      setStartAt("");
      setEndAt("");
      setStatus("scheduled");
      setReason("");

      console.log("Created appointment:", res.data);
    } catch (err: any) {
      console.error("Error creating appointment", err);
      setError(err.response?.data?.message || "Failed to create appointment");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow-md">
      <h2 className="text-xl font-semibold mb-4">Create Appointment</h2>

      {error && (
        <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}
      {success && (
        <div className="mb-4 text-green-600 bg-green-100 p-2 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium" htmlFor="patientId">
            Bemor
          </label>
          <select
            id="patientId"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">— Tanlang —</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="doctorId">
            Shifokor
          </label>
          <select
            id="doctorId"
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">— Tanlang —</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.firstname} {d.lastname}
              </option>
            ))}
          </select>
        </div>

        {/* Start & End */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="startAt">
            Boshlanish vaqti
          </label>
          <input
            id="startAt"
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="endAt">
            Tugash vaqti
          </label>
          <input
            id="endAt"
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        {/* Reason */}
        <div>
          <label className="block mb-1 font-medium" htmlFor="reason">
            Sabab
          </label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className={`w-full ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white py-2 rounded transition`}
          disabled={loading}
        >
          {loading ? "Yuklanmoqda..." : "Create Appointment"}
        </button>
      </form>
    </div>
  );
}