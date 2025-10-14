import { create } from "zustand";
import { api } from "../Service/api";
export type Role = "admin" | "doctor" | "reception";
export type User = {
  id: string;
  email: string;
  role: Role;
  mustChangePassword?: boolean;
  firstname: string;
  lastname: string;
  isActive: boolean;
};
export interface Doctor {
  id: string;
  firstname: string;
  lastname: string;
}
export interface DeleteProps {
  id: string;
  endpoint?: string;
  onDeleted: () => void;
}
export type Patient = {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  phone: string;
  email: string;
  notes: string;
  createdAt: boolean;
  updatedAt: boolean;
};
export interface Appointment {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  reason: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
  };
  doctor: {
    id: string;
    firstname: string;
    lastname: string;
    role: string;
  };
}

type AuthState = {
  token: string | null;
  user: User | null;
  booted: boolean;
  login: (t: string, u: User) => void;
  logout: () => void;
  setBooted: (v: boolean) => void;
  changing: boolean;
  changeError: string | null;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
};

export const useAuth = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  booted: false,
  login: (token, user) => set({ token, user }),
  logout: () => set({ token: null, user: null }),
  setBooted: (v) => set({ booted: v }),
  changing: false,
  changeError: null,
  async changePassword(currentPassword, newPassword) {
    set({ changing: true, changeError: null });
    try {
      const { data } = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      const u = get().user;
      if (u) set({ user: { ...u, mustChangePassword: false } });
      console.log(data.message);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data)
          ? err.response.data.join(", ")
          : "") ||
        "Parolni almashtirishda xatolik";
      set({ changeError: msg });
      throw err;
    } finally {
      set({ changing: false });
    }
  },
}));
