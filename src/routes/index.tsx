import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { LoginPage } from "@/pages/auth/signin";
import Bill from "@/pages/bill";
import BillChina from "@/pages/bill-china";
import BillDetail from "@/pages/bill/bill-detail";
import ListClaim from "@/pages/claim";
import { ClaimDetail } from "@/pages/claim/ClaimDetail";
import LandingPage from "@/pages/landing-page";
import NotFound from "@/pages/not-found";
import NotificationPage from "@/pages/notification";
import Order from "@/pages/order";
import ChinaPackage from "@/pages/packages/package_china";
import PackageDetailChina from "@/pages/packages/package_china/PackageDetail";
import { PackageDetailRegular } from "@/pages/packages/package_regular/PackageDetail";
import { PackageReturn } from "@/pages/packages/package_regular/packages-return";
import ListCoupon from "@/pages/settings/coupons/ListCoupon";
import CustomizeLabel from "@/pages/settings/customize-label/CustomizeLabel";
import PriceTable from "@/pages/settings/prices/Prices";
import ListProductPage from "@/pages/settings/products/ListProduct";
import ListTemplate from "@/pages/settings/templates/ListTemplate";
import { Shipments } from "@/pages/shipments";
import ShipmentDetail from "@/pages/shipments/ShipmentDetail";
// import Tracking from "@/pages/tracking";
import { Suspense, lazy } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

const DashboardLayout = lazy(
  () => import("@/components/layout/dashboard-layout")
);
const SignUp = lazy(() => import("@/pages/auth/signup"));
const Account = lazy(() => import("@/pages/settings/account/Account"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const OrderPage = lazy(() => import("@/pages/packages/package_regular"));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const dashboardRoutes = [
    {
      path: "/home",
      element: <LandingPage />,
      index: true,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <DashboardLayout>
            <Suspense>
              <Outlet />
            </Suspense>
          </DashboardLayout>
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/dashboard",
          element: <DashboardPage />,
          // index: true,
        },
        {
          path: "/packages",
          element: <OrderPage />,
        },
        {
          path: "/packages-china",
          element: <ChinaPackage />,
        },
        {
          path: "/package/details/:package_id",
          element: <PackageDetailRegular />,
        },
        {
          path: "/package-china/details/:package_id",
          element: <PackageDetailChina />,
        },
        {
          path: "/package/return",
          element: <PackageReturn />,
        },
        {
          path: "/setting/account",
          element: <Account />,
        },
        {
          path: "/bill/detail/:code",
          element: <BillDetail />,
        },
        {
          path: "/bill",
          element: <Bill />,
        },
        {
          path: "/bill-china",
          element: <BillChina />,
        },
        // {
        //   path: "/tracking",
        //   element: <Tracking ListPackages={[]} codes={[]} />,
        // },
        {
          path: "/setting/products",
          element: <ListProductPage />,
        },
        {
          path: "/setting/templates",
          element: <ListTemplate />,
        },
        {
          path: "/setting/label",
          element: <CustomizeLabel />,
        },
        {
          path: "/setting/prices",
          element: <PriceTable />,
        },
        {
          path: "/setting/coupons",
          element: <ListCoupon />,
        },
        {
          path: "/claim",
          element: <ListClaim />,
        },
        {
          path: "/claim/detail/:id",
          element: <ClaimDetail />,
        },
        {
          path: "/order",
          element: <Order />,
        },
        {
          path: "/shipments",
          element: <Shipments />,
        },
        {
          path: "/shipments/detail/:id",
          element: <ShipmentDetail />,
        },
        {
          path: "/notifications",
          element: <NotificationPage />,
        },
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/404",
      element: <NotFound />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
