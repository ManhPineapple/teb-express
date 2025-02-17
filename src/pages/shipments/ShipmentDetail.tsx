import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MAP_SHIPMENT_STATUS } from "@/constants/shipments";
import { getListShipmentItems, getShipmentsDetail } from "@/services/shipments";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShipmentsDetailTable } from "./components/ShipmentDetailTable";

type ShipmentDetail = {
  id: number;
  created_at: string;
  updated_at?: string;
  user_id?: number;
  weight: number;
  actual_weight?: number;
  price: number;
  status?: number;
  extra_fees?: number;
};

export type ShipmentItem = {
  id: number;
  code: string;
  tracking_number: string;
  order_number: string;
  label: string;
  recipient: string;
  company: string;
  phone_number: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  detail: string;
  weight: number;
  length: number;
  height: number;
  width: number;
  actual_weight: number;
  actual_width: number;
  actual_length: number;
  actual_height: number;
  status: number;
  status_string: string;
  service_id: number;
  service_code: string;
  service_name: string;
  shipping_fee: number;
  extraFee: number;
  updated_at: string;
  created_at: string;
};

type Fee = {
  amount: number;
};
export default function ShipmentDetail() {
  const { id } = useParams<{ id: string }>();
  const [shipmentsDetail, setShipmentsDetail] = useState<ShipmentDetail | null>(
    null
  );
  const [listShipmentItems, setListShipmentItems] =
    useState<ShipmentItem | null>(null);
  const [items, setItems] = useState<ShipmentItem[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  useEffect(() => {
    const fetchPackageDetail = async () => {
      try {
        if (id) {
          const data = await getShipmentsDetail(id);
          setShipmentsDetail(data.shipment);
          setTotalAmount(data.total_amount);
        }
      } catch (error) {}
    };

    const fetchListShipmentItems = async () => {
      try {
        if (id) {
          const data = await getListShipmentItems(id);
          setListShipmentItems(data.items[0]);
          setItems(data.items);
        }
      } catch (error) {}
    };

    fetchPackageDetail();
    fetchListShipmentItems();
  }, [id]);

  const extraFee = (): number => {
    if (shipmentsDetail?.extra_fees) {
      //@ts-ignore
      return shipmentsDetail.extra_fees.reduce((total: number, fee: Fee) => {
        return total + fee.amount;
      }, 0);
    } else {
      return 0;
    }
  };

  return (
    <div className="bg-[#f4f4f4] h-full relative ">
      <div className="mb-5 bg-[#fff] p-6 flex gap-10 justify-between">
        <div className="flex gap-10">
          <div>
            <div className="text-sm font-normal text-[#626363]">
              Code shipments:
            </div>
            <span className="text-base font-bold">
              #{shipmentsDetail?.id ? shipmentsDetail.id : "N/A"}
            </span>
          </div>
          <div>
            <div className="text-sm font-normal text-[#626363]">
              Create date:
            </div>
            <span className="text-base font-bold">
              {shipmentsDetail?.created_at
                ? format(
                    new Date(shipmentsDetail?.created_at),
                    "dd/MM/yyyy - HH:mm"
                  )
                : "N/A"}
            </span>
          </div>
          <div>
            <div className="text-sm font-normal text-[#626363]">Weight:</div>
            <span className="text-base font-bold">
              {shipmentsDetail?.weight
                ? (shipmentsDetail.weight / 1000).toFixed(2)
                : "N/A"}
              kg
            </span>
          </div>
          <div>
            <div className="text-sm font-normal text-[#626363]">Price:</div>
            <span className="text-base font-bold">
              ${totalAmount ? (totalAmount + extraFee()).toFixed(2) : "N/A"}
            </span>
          </div>
          <div>
            <div className="text-sm font-normal text-[#626363]">Status:</div>
            <span
              className={`text-base font-medium px-2 p-1 rounded-2xl capitalize ${
                shipmentsDetail?.status
                  ? MAP_SHIPMENT_STATUS[shipmentsDetail.status].className
                  : "N/A"
              }`}
            >
              {shipmentsDetail?.status
                ? MAP_SHIPMENT_STATUS[shipmentsDetail.status].text
                : "N/A"}
            </span>
          </div>
          <div>
            <div className="text-sm font-normal text-[#626363]">Service:</div>
            <span className="text-base font-bold">
              {listShipmentItems?.service_name
                ? listShipmentItems.service_name
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-12 mx-5 gap-3">
        <div className="col-span-9">
          <Card>
            <CardHeader>
              <CardTitle className="border-b pb-3">Shipment detail:</CardTitle>
            </CardHeader>
            <CardContent>
              <ShipmentsDetailTable item={items} />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="border-b pb-3">Recipient:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-5 font-normal text-[#626363]">
                  Full Name:
                </div>
                <div className="col-span-7">{listShipmentItems?.recipient}</div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-5 font-normal text-[#626363]">
                  Phone:
                </div>
                <div className="col-span-7">
                  {listShipmentItems?.phone_number}
                </div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-5 font-normal text-[#626363]">
                  Address:
                </div>
                <div className="col-span-7">{listShipmentItems?.address_1}</div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-5 font-normal text-[#626363]">
                  Address 2:
                </div>
                <div className="col-span-7">{listShipmentItems?.address_2}</div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-5 font-normal text-[#626363]">
                  City:
                </div>
                <div className="col-span-7"> {listShipmentItems?.city}</div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-5 font-normal text-[#626363]">
                  State Code:
                </div>
                <div className="col-span-7"> {listShipmentItems?.state}</div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-5 font-normal text-[#626363]">
                  Zip Code:
                </div>
                <div className="col-span-7"> {listShipmentItems?.zipcode}</div>
              </div>
              <div className="grid grid-cols-12 mb-3">
                <div className="col-span-5 font-normal text-[#626363]">
                  Country Code:
                </div>
                <div className="col-span-7"> {listShipmentItems?.country}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
