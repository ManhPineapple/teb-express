import PageHead from "@/components/shared/page-head";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { userService } from "@/services/auth";
import { getTransactionsChina } from "@/services/bill";
import { ArrowRightLeft, FileClock, FileCog, Landmark } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import HistoryTab from "./bill-tab/history";
import ManagementTab from "./bill-tab/management";
import PendingTab from "./bill-tab/pending";
import Topup from "./bill-tab/top-up";
import Withdraw from "./bill-tab/withdraw";
import WalletBalance from "./components/wallet-balance";

const BillChina: React.FC = () => {
  const [balance, setBalance] = useState(0.0);
  const points = 0;
  const [pendingAmount, setPendingAmount] = useState(0.0);
  const [searchParams] = useSearchParams();
  const [user_info, setUserInfo] = useState<any>("");

  // Retrieve the selected tab from localStorage or set default to "management"
  const [selectedTab, setSelectedTab] = useState<string>(() => {
    const storedTab = localStorage.getItem("selectedTab");
    return storedTab || "management";
  });

  const handleGetTransaction = async () => {
    try {
      const result = await getTransactionsChina(1, 50, searchParams);
      setBalance(result.balance);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleGetHolding = async () => {
    try {
      const result = await userService.getUserInfo();
      setPendingAmount(result.user.holding_money);
      setUserInfo(result.user.user_info);
    } catch (error) {
      console.error("Error fetching holdings:", error);
    }
  };

  useEffect(() => {
    handleGetTransaction();
    handleGetHolding();
  }, []);

  // Store the selected tab in localStorage when it changes
  useEffect(() => {
    localStorage.setItem("selectedTab", selectedTab);
  }, [selectedTab]);

  return (
    <>
      <PageHead title="Bill | Ananbay" />
      <div className="2xl:mx-52 my-10">
        <WalletBalance
          balance={balance}
          points={points}
          pendingAmount={pendingAmount}
          user_info={user_info}
        />
        <Tabs
          value={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
          className="max-w-full m-10"
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="topUp">
              <Landmark />
              <div className="max-sm:hidden">Top up</div>
            </TabsTrigger>
            <TabsTrigger value="management">
              <FileCog />
              <div className="max-sm:hidden">Management</div>
            </TabsTrigger>
            <TabsTrigger value="history">
              <ArrowRightLeft />
              <div className="max-sm:hidden"> Transaction history</div>
            </TabsTrigger>
            <TabsTrigger value="pending">
              <FileClock />
              <div className="max-sm:hidden"> Pending bill</div>
            </TabsTrigger>
            {/* <TabsTrigger value="exchange">
            <CandlestickChart />
            Exchange
          </TabsTrigger>
          <TabsTrigger value="withdraw">
            <CircleDollarSign />
            Rút tiền
          </TabsTrigger> */}
          </TabsList>
          <TabsContent value="topUp">
            <Topup />
          </TabsContent>
          <TabsContent value="management">
            <ManagementTab />
          </TabsContent>
          <TabsContent value="history">
            <HistoryTab />
          </TabsContent>
          <TabsContent value="pending">
            <PendingTab />
          </TabsContent>
          <TabsContent value="withdraw">
            <Withdraw />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default BillChina;
