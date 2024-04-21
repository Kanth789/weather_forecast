import { TextField } from "@mui/material";
import React from "react";

interface AutoSuggestionProps {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

function AutoSuggestion({ searchQuery, setSearchQuery }: AutoSuggestionProps) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  return (
    <TextField
      type="text"
      value={searchQuery}
      onChange={handleSearchChange}
      placeholder="Search city..."
      variant="outlined"
      size="small"
      fullWidth 
    />
  );
}

export default AutoSuggestion;
