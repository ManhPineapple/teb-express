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
  const handleSettingSearchParams = useCallback(
    (newCodeValue: string) => {
      // Update the URL with the new search value
      if (newCodeValue === "" || newCodeValue === undefined || !newCodeValue) {
        const params = new URLSearchParams(searchParams);
        params.delete("code");
        setSearchParams(params);
        return;
      }
      setSearchParams({
        ...Object.fromEntries(searchParams),
        page: "1",
        code: newCodeValue,
      });
      window.location.reload();
    },
    [searchParams, setSearchParams]
  );
  return (
    <Input
      placeholder={placeholder || `Tìm theo mã đơn/mã AB/mã tracking/tên người nhận...`}
      value={searchTerm}
      onChange={(event) => setSearchTerm(event.target.value)}
      onKeyDown={(event) =>
        event.key == "Enter" && handleSettingSearchParams(searchTerm)
      }
      className="w-full md:max-w-sm"
    />
  );
}
