import { ArrowUpRight } from "lucide-react";
import React from "react";

interface PackageTrackingProps {
  current: {
    tracking_number?: string;
    service_name?: string;
    country_code?: string;
  };
}

const PackageTracking: React.FC<PackageTrackingProps> = ({ current }) => {
  const trackingNumber = current?.tracking_number || "";

  const getLink = () => {
    const { service_name, country_code } = current;

    if (service_name && service_name.toUpperCase().includes("FBA")) {
      return `https://www.ups.com/track?trackingNumber=${trackingNumber}`;
    }

    if (country_code === "AU") {
      return `https://auspost.com.au/mypost/track/#/details/${trackingNumber}`;
    }

    return `https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=${trackingNumber}`;
  };

  const link = getLink();

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="tracking"
    >
      <div>
        <div className="text-sm font-normal text-[#626363]">
          Last mile tracking:
        </div>
        <div className="flex hover:text-[#13c2c2]">
          <span className="font-medium text-sm tracking-[.2px] text-[#111212] hover:text-[#13c2c2]">
            {current?.tracking_number ? current.tracking_number : "N/A"}
          </span>
          {current?.tracking_number && <ArrowUpRight className="w-4 h-4" />}
        </div>
      </div>
    </a>
  );
};

export default PackageTracking;
