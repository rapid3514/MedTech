// src/components/navigation/Delete.tsx
import { Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { api } from "../../Service/api";
import { useAuth } from "../../store/auth.store";

interface DeleteProps {
  id: string;
  endpoint?: string; // default /patients
  onDeleted: () => void;
}

const Delete = ({ id, endpoint = "/patients", onDeleted }: DeleteProps) => {
  const { user } = useAuth();

  const handleDelete = async () => {
    if (!user || (user.role !== "admin" && user.role !== "reception")) {
      alert("Sizda o‘chirish uchun ruxsat yo‘q!");
      return;
    }

    const confirmDelete = window.confirm("Bemorni o‘chirmoqchimisiz?");
    if (!confirmDelete) return;

    try {
      await api.delete(`${endpoint}/${id}`);
      onDeleted();
    } catch (err) {
      console.error("O‘chirishda xatolik:", err);
      alert("O‘chirishda xatolik yuz berdi.");
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      size="small"
      startIcon={<DeleteIcon />}
      onClick={handleDelete}
    >
      Delete
    </Button>
  );
};

export default Delete;
