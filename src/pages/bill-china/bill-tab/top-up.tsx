import { useState } from "react";
import { BsCreditCard2BackFill } from "react-icons/bs";
import PayoneerIcon from "../../../assets/payoneer.svg";
import PingpongIcon from "../../../assets/pingpong.svg";
import BankingTopup from "../components/top-up-type/banking";
import PayoneerTopup from "../components/top-up-type/payoneer";
import PingpongTopup from "../components/top-up-type/pingpong";

interface TopupTabButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive: boolean;
}

const TopupTabButton: React.FC<TopupTabButtonProps> = ({
  children,
  onClick,
  isActive,
}) => {
  return (
    <button
      className={`mb-5 h-12 border rounded-xl flex items-center justify-center ${
        isActive ? "shadow-lg shadow-cyan-500/50" : ""
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Topup: React.FC = () => {
  const [tab, setTab] = useState<string>("banking");

  const handleTabChange = (newTab: string) => {
    setTab(newTab);
  };

  return (
    <div className="sm:flex">
      <div className="m-5 sm:w-1/6 flex flex-col max-sm:grid max-sm:grid-cols-2 gap-2">
        <TopupTabButton
          onClick={() => handleTabChange("banking")}
          isActive={tab === "banking"}
        >
          <BsCreditCard2BackFill />
          <span className="font-bold ml-2">Banking</span>
        </TopupTabButton>
        <TopupTabButton
          onClick={() => handleTabChange("payoneer")}
          isActive={tab === "payoneer"}
        >
          <img src={PayoneerIcon} alt="PayoneerIcon" height={30} width={30} />
          <span className="font-bold text-xl">Payoneer</span>
        </TopupTabButton>
        <TopupTabButton
          onClick={() => handleTabChange("pingpong")}
          isActive={tab === "pingpong"}
        >
          <img src={PingpongIcon} alt="PingpongIcon" />
        </TopupTabButton>
        {/* <TopupTabButton
          onClick={() => handleTabChange("lianlian")}
          isActive={tab === "lianlian"}
        >
          <img src={LianlianIcon} alt="LianlianIcon" />
        </TopupTabButton> */}
      </div>
      <div className="w-full">
        {tab === "banking" && <BankingTopup />}
        {tab === "payoneer" && <PayoneerTopup />}
        {tab === "pingpong" && <PingpongTopup />}
        {/* {tab === "lianlian" && <LianlianTopup />} */}
      </div>
    </div>
  );
};

export default Topup;
