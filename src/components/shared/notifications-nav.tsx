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
import { Badge } from "@/components/ui/badge";
import {
  countNotification,
  fetchNotification,
  readNotification,
  readNotifications,
} from "@/services/notification";
import { format } from "date-fns";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Notification = {
  id: number;
  user_id: number;
  sender_id: number;
  creator_id: number;
  is_send_all: number;
  title: string;
  body: string;
  image: string;
  badge: string;
  link: string;
  status: number;
  readed: number;
  parent_id: number;
  type: number;
  sent_at: string;
  created_at: string;
  updated_at: string;
  sender: null;
  creator: null;
};

export default function NotificationsNav() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [countNotifications, setCountNotifications] = useState<number>(0);
  const navigate = useNavigate();
  const fetchNotifications = async () => {
    try {
      const response = await fetchNotification(25, 1, -1, "");
      setNotifications(response.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };
  const fetchCountNotification = async () => {
    try {
      const response = await countNotification(25, 1, -1, "");
      setCountNotifications(response.count);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchCountNotification();
  }, []);

  async function handleReadAll() {
    try {
      const result = await readNotifications();

      if (!result.success) {
        toast.error(result.message);
      } else {
        // Handle success or reload/init logic
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  }

  const handleReadNoti = async (item: Notification) => {
    const navigate = useNavigate();

    try {
      if (item.link) {
        if (!item.type) {
          const url = item.link.replace(
            /(http[s]?:\/\/)?([^\/\s]+(\/)|^[\/])/,
            ""
          );
          navigate(`/${url}`);
        } else {
          window.open(item.link, "_blank");
        }
      }

      // Check if already read
      if (item.readed === 1) return;

      const arr = [item.id];
      const read = await readNotification(arr);

      if (!read.success) {
        toast.error("An error occurred");
      }
    } catch (error) {
      toast.error("An error occurred while processing the notification");
    }
  };

  const countReadedNotifications = notifications?.length
    ? notifications.filter((notification) => notification.readed === 0).length
    : 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-14 w-14 rounded-full">
          <Bell />
          {countReadedNotifications > 0 && (
            <Badge className="absolute top-[-0.2px] right-[-2px] rounded-full bg-[#8D181B]">
              {countReadedNotifications}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex justify-between">
            <p className="text-base font-semibold leading-none">
              Notifications{" "}
            </p>
            {countNotifications > 0 && (
              <p
                className="text-sm font-medium leading-none text-[#8D181B] cursor-pointer"
                onClick={handleReadAll}
              >
                Mark as read
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="overflow-y-auto max-h-64 scrollbar-thin scrollbar-thumb-[#8D181B] scrollbar-track-gray-100">
          {notifications?.length > 0 ? (
            notifications.map((notification, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleReadNoti(notification)}
                className={`${
                  notification.readed === 0 ? "border-l-2 border-[#8D181B]" : ""
                } mb-2`}
              >
                <div>
                  <div className="font-medium">{notification.title}</div>
                  <span className="text-[#b0b3b9] font-medium">
                    {notification?.created_at
                      ? format(
                          new Date(notification.created_at),
                          "dd/MM/yyyy - HH:mm"
                        )
                      : "N/A"}
                  </span>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div>No notifications available</div>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => navigate("/notifications")}
          className="cursor-pointer text-[#8D181B] font-bold"
        >
          See all notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
