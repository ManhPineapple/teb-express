import { getListPackages } from "@/services/packages";
import { useQuery } from "@tanstack/react-query";

export const useGetListPackages = (
  offset: number,
  pageLimit: number,
  order_number: string | null,
  status: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  byDate: string | undefined
) => {
  return useQuery({
    queryKey: ["packages", offset, pageLimit, order_number],
    queryFn: async () => {
      status = status?.toLowerCase();
      const safeOrderNumber = order_number ?? "";
      const safeStatus = status == "all" || !status ? "" : status;
      return getListPackages(
        offset,
        pageLimit,
        safeOrderNumber,
        safeStatus,
        startDate,
        endDate,
        byDate
      );
    },
  });
};
