import { useState } from "react";
import { api } from "../../Service/api";
import { Link } from "react-router-dom";
import type { Role } from "../../store/auth.store";



export default function CreateUserForm() {
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [role, setRole] = useState<Role>("doctor");
  const [temporaryPassword, setTempPass] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setLoading(true);

    try {
      const { data } = await api.post("/users", {
        email,
        firstName,
        lastName,
        role,
        temporaryPassword,
      });
      setMsg(`Foydalanuvchi yaratildi: ${data.email}`);
      setEmail("");
      setFirst("");
      setLast("");
      setRole("doctor");
      setTempPass("");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-1/2 flex  justify-center mt-[200px]">
      <div className="w-full max-w-sm">
        <div>
          <h1>New Password</h1>
          <Link to={'/admin'}>Admin page</Link>
        </div>
        <div>
          <form onSubmit={onSubmit} className="space-y-3 max-w-md">
            <h2 className="text-lg font-semibold">Yangi foydalanuvchi</h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="text"
              placeholder="Ism"
              value={firstName}
              onChange={(e) => setFirst(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />

            <input
              type="text"
              placeholder="Familiya"
              value={lastName}
              onChange={(e) => setLast(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="doctor">Doctor</option>
              <option value="reception">Reception</option>
              <option value="admin">Admin</option>
            </select>

            <input
              type="password"
              placeholder="Vaqtinchalik parol"
              value={temporaryPassword}
              onChange={(e) => setTempPass(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Yaratilmoqda..." : "Yaratish"}
            </button>

            {msg && <p className="text-green-600">{msg}</p>}
            {err && <p className="text-red-600">{err}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}