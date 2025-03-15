import React, { useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../ui/input";

export default function TableSearchInput({
  placeholder,
}: {
  placeholder?: string;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const country = searchParams.get("code") || "";
  const [searchTerm, setSearchTerm] = React.useState(country);
  // debounce the search input
  const handleSettingSearchParams = useCallback((newCodeValue: string) => {
    // Update the URL with the new search value
    if (
      newCodeValue === "" ||
      newCodeValue === undefined ||
      !newCodeValue
    ) {
      searchParams.delete("code");
      setSearchParams(searchParams);
      return;
    }
    setSearchParams({
      ...Object.fromEntries(searchParams),
      page: "1",
      code: newCodeValue,
    });
    window.location.reload();
  });
  return (
    <Input
      placeholder={placeholder || `Tìm mã đơn hàng...`}
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      onKeyDown={(event) => event.key == "Enter" && handleSettingSearchParams(searchTerm)}
      className="w-full md:max-w-sm"
    />
  );
}
