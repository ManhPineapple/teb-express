import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import PageHead from "@/components/shared/page-head";
import { getCountListPackages } from "@/services/packages";
import { usePackageStore } from "@/store/tableStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PackageTable from "../components/packages-table";
import { useGetListPackages } from "../queries/queries";

export const packageListTypeRegular = 0;
export default function PackagePage() {
  const setPackages = usePackageStore((state) => state.setPackages);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageLimit = Number(searchParams.get("limit") || 50);
  const order_number = searchParams.get("code") || null;
  const searchStatus = searchParams.get("status") || undefined;
  const startDate = searchParams.get("start_date") || undefined;
  const endDate = searchParams.get("end_date") || undefined;
  const byDate = searchParams.get("by_date") || undefined;
  const { data: packageData, isLoading } = useGetListPackages(
    page,
    pageLimit,
    order_number,
    searchStatus,
    startDate,
    endDate,
    byDate
  );
  const [count, setCount] = useState<any>({ count: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const status = searchStatus?.toLowerCase();
        const safeOrderNumber = order_number ?? "";
        const safeStatus = status == "all" || !status ? "" : status;
        const countResponse = await getCountListPackages(
          page,
          pageLimit,
          safeOrderNumber,
          safeStatus,
          startDate,
          endDate,
          byDate,
        );
        setCount(countResponse);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (packageData?.packages) {
      setPackages(packageData.packages);
    }
  }, [packageData, setPackages]);

  const packages = usePackageStore((state) => state.packages);
  const pageCount = Math.ceil(count.count / pageLimit);

  if (isLoading) {
    return (
      <div className="p-5">
        <DataTableSkeleton
          columnCount={10}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    );
  }

  return (
    <div className="p-5">
      <PageHead title="Orders | Ananbay" />
      <PackageTable
        packages={packages}
        page={page}
        count={count}
        pageCount={pageCount}
        packageListType={packageListTypeRegular}
      />
    </div>
  );
}
