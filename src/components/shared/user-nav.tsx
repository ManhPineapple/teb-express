import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userService } from "@/services/auth";
import { useEffect, useState } from "react";
import { BsPersonCircle } from "react-icons/bs";

export default function UserNav() {
  const [userInfo, setUserInfo] = useState({ email: "", full_name: "" });
  const handleLogout = () => {
    localStorage.removeItem("auth-storage");

    window.location.href = "/login";
  };
  const getUserInfo = async () => {
    const response = await userService.getUserInfo();
    setUserInfo(response.user);
  };
  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-14 rounded-full">
          <Avatar className="h-10 w-10">
            <BsPersonCircle size={40} />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userInfo?.full_name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => (window.location.href = "/setting/account")}
          >
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => (window.location.href = "/claim")}>
            Claims
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
