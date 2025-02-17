import { useState, useEffect } from "react";
import {
  countNotification,
  fetchNotification,
  readNotification,
} from "@/services/notification";
import { format } from "date-fns";
import PageHead from "@/components/shared/page-head";
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

type Status = {
  type: number;
  count: number;
};
const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [countNotifications, setCountNotifications] = useState([]);
  const [statusNotifications, setStatusNotifications] = useState<Status[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<number | undefined>(-1);
  const [limit, setLimit] = useState(25);
  const [page, setPage] = useState(1);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await fetchNotification(limit, page, activeTab, "");
      setNotifications(response.notifications);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  const fetchCountNotification = async () => {
    setLoading(true);
    try {
      const response = await countNotification(limit, page, activeTab, "");
      setCountNotifications(response.count);
      setStatusNotifications(response.status);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // if (!notifications || notifications.length === 0) return;

    fetchNotifications();
    fetchCountNotification();
  }, [limit, page, activeTab]);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setPage(1); // Reset to page 1 when changing tabs
  };

  const navigate = useNavigate();

  const handleReadNoti = (item: any) => {
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
    callRead(item);
  };

  const callRead = async (item: any) => {
    if (item.readed === 1) return;

    const arr = [item.id];
    try {
      const read = await readNotification(arr);
      if (!read.data.success) {
        toast.error("Có lỗi xảy ra");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    }
  };

  const orderUpdateCount =
    statusNotifications.find((s: any) => s.type === 1)?.count || 0;
  const financeUpdateCount =
    statusNotifications.find((s: any) => s.type === 2)?.count || 0;
  const announcementsCount =
    statusNotifications.find((s: any) => s.type === 3)?.count || 0;
  const serviceUpdateCount =
    statusNotifications.find((s: any) => s.type === 4)?.count || 0;
  const promotionsCount =
    statusNotifications.find((s: any) => s.type === 5)?.count || 0;

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <PageHead title="Notifications | Ananbay" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 bg-gray-50 min-h-screen">
        <div className="p-4 bg-gray-50 min-h-screen">
          {/* Tabs */}
          <div className="flex space-x-4 mb-6 max-w-full overflow-auto whitespace-nowrap">
            <button
              className={`px-4 py-2 rounded-3xl text-sm ${activeTab === -1 ? "bg-[#8D181B] text-white" : "bg-white text-gray-700 border"}`}
              onClick={() => handleTabClick(-1)}
            >
              All ({statusNotifications.length})
            </button>
            <button
              className={`px-4 py-2 rounded-3xl text-sm ${activeTab === 1 ? "bg-[#8D181B] text-white" : "bg-white text-gray-700 border"}`}
              onClick={() => handleTabClick(1)}
            >
              Order updates ({orderUpdateCount})
            </button>
            <button
              className={`px-4 py-2 rounded-3xl text-sm ${activeTab === 2 ? "bg-[#8D181B] text-white" : "bg-white text-gray-700 border"}`}
              onClick={() => handleTabClick(2)}
            >
              Finance updates ({financeUpdateCount})
            </button>
            <button
              className={`px-4 py-2 rounded-3xl text-sm ${activeTab === 3 ? "bg-[#8D181B] text-white" : "bg-white text-gray-700 border"}`}
              onClick={() => handleTabClick(3)}
            >
              Announcements ({announcementsCount})
            </button>
            <button
              className={`px-4 py-2 rounded-3xl text-sm ${activeTab === 4 ? "bg-[#8D181B] text-white" : "bg-white text-gray-700 border"}`}
              onClick={() => handleTabClick(4)}
            >
              Service Updates ({serviceUpdateCount})
            </button>
            <button
              className={`px-4 py-2 rounded-3xl text-sm ${activeTab === 5 ? "bg-[#8D181B] text-white" : "bg-white text-gray-700 border"}`}
              onClick={() => handleTabClick(5)}
            >
              Promotions ({promotionsCount})
            </button>
          </div>

          {/* Notifications List */}
          <div className="bg-white shadow rounded-lg cursor-pointer">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${
                    notification.readed === 0
                      ? "border-l-2 border-l-[#8D181B]"
                      : ""
                  } border-b p-4`}
                  onClick={() => handleReadNoti(notification)}
                >
                  <h4 className="text-lg font-semibold">
                    {notification.title}
                  </h4>
                  <span className="text-gray-500 text-sm">
                    {notification?.created_at
                      ? format(
                          new Date(notification.created_at),
                          "dd/MM/yyyy - HH:mm"
                        )
                      : "N/A"}
                  </span>
                  <p className="text-gray-700 mt-2">{notification.body}</p>
                </div>
              ))
            ) : (
              <p>No notifications found.</p>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-gray-700">
              Bản ghi mỗi trang:
              <select
                className="ml-2 p-2 border rounded"
                value={limit}
                onChange={(e: any) => setLimit(e.target.value)}
              >
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 border rounded bg-gray-200"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                &lt;
              </button>
              <span>{page}</span>
              <button
                className="p-2 border rounded bg-gray-200"
                onClick={() => setPage(page + 1)}
                disabled={page === 1}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
        {/* Notification detail */}
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h4 className="text-lg font-semibold mb-4">Notification Detail</h4>
          <p>Select a notification to open it</p>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
