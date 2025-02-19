import { DataTableSkeleton } from "@/components/shared/data-table-skeleton";
import PageHead from "@/components/shared/page-head";
import { getCountListPackages } from "@/services/packages";
import { usePackageStore } from "@/store/tableStore";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PackageTable from "../components/packages-table";
import { useGetListPackages } from "../queries/queries";

export default function PackagePage() {
  const [count, setCount] = useState<any>({ count: 0 });
  const setPackages = usePackageStore((state) => state.setPackages);
  // const [showBanner, setShowBanner] = useState<boolean>(false);
  // const bannerRef = useRef<HTMLDivElement>(null);

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
          byDate
        );
        setCount(countResponse);
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    };

    fetchData();
  }, []);

  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 1);
  const pageLimit = Number(searchParams.get("limit") || 50);
  const order_number = searchParams.get("code") || null;
  const searchStatus = searchParams.get("status") || undefined;
  const startDate = searchParams.get("start_date") || undefined;
  const endDate = searchParams.get("end_date") || undefined;
  const byDate = searchParams.get("by_date") || undefined;
  const { data, isLoading } = useGetListPackages(
    page,
    pageLimit,
    order_number,
    searchStatus,
    startDate,
    endDate,
    byDate
  );

  useEffect(() => {
    if (data?.packages) {
      setPackages(data.packages);
    }
  }, [data, setPackages]);

  // const packages = data?.packages;
  const packages = usePackageStore((state) => state.packages);
  const pageCount = Math.ceil(count.count / pageLimit);

  // useEffect(() => {
  //   const hasVisited = document.cookie.split('; ').find(row => row.startsWith('hasVisited='));
  //   if (!hasVisited) {
  //     setShowBanner(true);
  //     document.cookie = "hasVisited=true; max-age=" + 3 * 24 * 60 * 60; // Set cookie to expire in 3 days
  //   }
  // }, []);

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
    // {showBanner && (
    //   <div ref={bannerRef} className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-50">
    //     <div className="relative">
    //       <button
    //         onClick={() => setShowBanner(false)}
    //         className="absolute top-2 right-2 text-white text-[40px] cursor-pointer"
    //       >
    //         &times; {/* This represents the close "X" */}
    //       </button>
    //       <img src="https://i.ibb.co/7W3k6b7/Thu-ngo-ANan-Bay-ba-n-final-2.png" alt="Banner" className="h-[80vh] w-auto" />
    //     </div>
    //   </div>
    // )}
    <div className="p-5">
      <PageHead title="Orders | Ananbay" />
      <PackageTable
        packages={packages}
        page={page}
        count={count}
        pageCount={pageCount}
      />
    </div>
  );
}
