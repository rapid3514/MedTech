import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rolePath } from "../../Routes/role-path";
import { useAuth } from "../../store/auth.store";

const ChangePassword = () => {
  const { changePassword, changing, changeError, user } = useAuth();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNext] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [ok, setOk] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOk("");

    if (newPassword !== confirmPassword) {
      setOk("Yangi parol va tasdiqlash paroli mos emas!");
      return;
    }

    try {
      await changePassword(currentPassword, newPassword);
      setOk("Parol muvaffaqiyatli o'zgartirildi");

      if (user?.role) {
        navigate(rolePath[user.role as keyof typeof rolePath], {
          replace: true,
        });
      } else {
        navigate("/login", { replace: true });
      }

      setCurrent("");
      setNext("");
      setConfirm("");
    } catch {}
  };

  return (
    <div className="w-full h-1/2 flex justify-center mt-[200px]">
      <div className="w-full max-w-sm">
        <h1 className="mb-4 font-semibold text-lg">Parolni yangilash</h1>
        <form onSubmit={onSubmit} className="max-w-sm space-y-3">
          <input
            type="password"
            placeholder="Joriy parol"
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Yangi parol"
            value={newPassword}
            onChange={(e) => setNext(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            type="password"
            placeholder="Yangi parolni tasdiqlash"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            disabled={changing}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            {changing ? "Yuborilmoqda..." : "Parolni almashtirish"}
          </button>

          {changeError && (
            <p className="text-red-600 text-sm">{changeError}</p>
          )}
          {ok && <p className="text-green-600 text-sm">{ok}</p>}
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
