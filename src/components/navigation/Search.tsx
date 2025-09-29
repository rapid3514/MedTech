import { useState, useEffect } from "react";
import { OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface SearchProps {
  onSearch: (query: string) => void;
}

const Search = ({ onSearch }: SearchProps) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delay = setTimeout(() => {
      onSearch(query);
    }, 200);

    return () => clearTimeout(delay);
  }, [query, onSearch]);

  return (
<OutlinedInput
  placeholder="Search..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
  sx={{ width: 250, borderRadius: 3 }}
  endAdornment={
    <InputAdornment position="end">
      <IconButton edge="end">
        <SearchIcon />
      </IconButton>
    </InputAdornment>
  }
/>

  );
};

export default Search;
