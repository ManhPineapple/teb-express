import { navItems } from "@/constants/data";
import { usePathname } from "@/routes/hooks";
import Heading from "./heading";
import { ModeToggle } from "./theme-toggle";
import UserNav from "./user-nav";
import NotificationsNav from "./notifications-nav";
import { useEffect, useState } from "react";
import { userService } from "@/services/auth";
import { Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Custom hook to find the matched path
const useMatchedPath = (pathname: string) => {
  const matchedChildPath = navItems
    .flatMap((parentItem) => parentItem.children || [])
    .find((childItem) => childItem.href === pathname);

  if (matchedChildPath) {
    return matchedChildPath.title;
  }

  const matchedParentPath = navItems.find((item) => item.href === pathname);

  if (matchedParentPath) {
    return matchedParentPath.title;
  }

  return "";
};

export default function Header() {
  const pathname = usePathname();
  const headingText = useMatchedPath(pathname);
  const [userInfo, setUserInfo] = useState<any>(null);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    const response = await userService.getUserInfo();
    setUserInfo(response.user);
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="flex flex-1 items-center justify-between bg-secondary px-4">
      <Heading title={headingText} />
      <div className="ml-4 flex items-center md:ml-6">
        <div className="mr-3">
          <strong className="mr-2">
            Balance: $
            {(Math.trunc(userInfo?.balance * 100) / 100)
              .toFixed(2)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </strong>
          {userInfo?.user_info?.debt_max_amount != null && (
            <div className="text-sm text-red-500">
              Debit max amount: ${userInfo?.user_info?.debt_max_amount}
            </div>
          )}
        </div>
        <div
          className="p-2 bg-[#E6FFFB] rounded-full cursor-pointer"
          onClick={() => navigate("/bill")}
        >
          <Wallet className="text-[#13C2C2]" />
        </div>
        <strong className="ml-3 max-sm:hidden">{userInfo?.full_name}</strong>
        <NotificationsNav />
        <UserNav />
        <ModeToggle />
      </div>
    </div>
  );
}
