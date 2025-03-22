import { NavItem } from "@/types";

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Đơn hàng",
    icon: "shopping",
    href: "/packages",
    label: "Đơn hàng",
    children: [
      {
        title: "Đơn hàng",
        href: "/packages",
        icon: "shopping",
        label: "Đơn hàng",
      },
      {
        title: "Đơn hàng Trung Quốc",
        href: "/packages-china",
        icon: "shopping",
        label: "Đơn hàng Trung Quốc",
      },
    ],
  },
  {
    title: "Hóa đơn",
    icon: "billing",
    href: "/bill",
    label: "Hóa đơn"
  },
  {
    title: "Cài đặt",
    icon: "setting",
    href: "/404/1",
    label: "Cài đặt",
    children: [
      {
        title: "Tài khoản",
        href: "/setting/account",
        label: "Tài khoản",
      },
      {
        title: "Sản phẩm",
        href: "/setting/products",
        label: "Sản phẩm",
      },
      // {
      //   title: "Templates",
      //   href: "/setting/templates",
      //   label: "Templates",
      // },
      {
        title: "Giá dịch vụ",
        href: "/setting/prices",
        label: "Giá dịch vụ",
      },
      // {
      //   title: "Coupons",
      //   href: "/setting/coupons",
      //   label: "Coupons",
      // },
    ],
  },
];

export const users = [
  {
    id: 1,
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 4,
    name: "David Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
];

export const dashboardCard = [
  {
    date: "Today",
    total: 2000,
    role: "Students",
    color: "bg-[#EC4D61] bg-opacity-40",
  },
  {
    date: "Today",
    total: 2000,
    role: "Teachers",
    color: "bg-[#FFEB95] bg-opacity-100",
  },
  {
    date: "Today",
    total: 2000,
    role: "Parents",
    color: "bg-[#84BD47] bg-opacity-30",
  },
  {
    date: "Today",
    total: 2000,
    role: "Schools",
    color: "bg-[#D289FF] bg-opacity-30",
  },
];

export type TPackage = {
  id: number;
  order_number: string;
  code: string;
  tracking_number: string;
  service_name: string;
  created_at: string;
  accepted_at: string;
  status_string: string;
  shipping_fee: number;
  profile_picture?: string | null;
  label: string;
  validate_address: number;
  address_1: string;
  alert: number;
  is_package_exceed: boolean;
  custom_cn_barcode: string;
};

export type TProduct = {
  id: number;
  name: string;
  sku: string;
  stock: number;
  detail: string;
  country: string;
  status: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  material: string;
  weight: number;
  height: number;
  length: number;
  width: number;
};
