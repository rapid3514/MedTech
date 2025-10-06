import { useState, useEffect } from "react";
import { TextField, CircularProgress } from "@mui/material";
import { api } from "../../Service/api";

interface SearchProps {
  endpoint: "/users" | "/patients"; 
  onResults: (data: any[]) => void; 
  placeholder?: string;
}

const Search = ({ endpoint, onResults, placeholder }: SearchProps) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get(endpoint, { params: { q: query } });
        const result = data.items ?? data;
        onResults(result);
      } catch (err) {
        console.error("Search error:", err);
        onResults([]); // xatolik bo‘lsa, bo‘sh array qaytarsin
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [query, endpoint, onResults]);

  return (
    <div className="relative w-full max-w-md">
      <TextField
        fullWidth
        label={placeholder || "Qidirish..."}
        variant="outlined"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: "absolute",
            right: 10,
            top: "50%",
            marginTop: "-12px",
          }}
        />
      )}
    </div>
  );
};

export default Search;
