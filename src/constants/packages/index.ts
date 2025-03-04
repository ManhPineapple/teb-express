type Status = {
  [key: number]: string;
};

type MapStatusClassName = {
  [key: string]: { text: string; className: string };
};

//audit log
export const PACKAGE_UPDATE_TYPE_RECIPIENT = 1;
export const PACKAGE_UPDATE_TYPE_PHONENUMBER = 2;
export const PACKAGE_UPDATE_TYPE_ADDRESS = 3;
export const PACKAGE_UPDATE_TYPE_ADDRESS2 = 13;
export const PACKAGE_UPDATE_TYPE_CITY = 4;
export const PACKAGE_UPDATE_TYPE_STATECODE = 5;
export const PACKAGE_UPDATE_TYPE_ZIPCODE = 6;
export const PACKAGE_UPDATE_TYPE_COUNTRYCODE = 7;
export const PACKAGE_UPDATE_TYPE_WEIGHT = 8;
export const PACKAGE_UPDATE_TYPE_VOLUME = 9;
export const PACKAGE_UPDATE_TYPE_NOTE = 10;
export const PACKAGE_UPDATE_TYPE_SERVICE = 11;
export const PACKAGE_UPDATE_TYPE_DETAIL = 12;
export const PACKAGE_UPDATE_TYPE_LABEL = 13;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_COVID = 14;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_OUTSIZE = 15;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_FIXVOLUME = 16;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_FIXWEIGHT = 17;
export const PACKAGE_UPDATE_EXTRAFEE_EDIT_ORDER = 19;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_REFUND = 20;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_OTHER = 21;
export const PACKAGE_CHECK_ADDRESS_TYPE = 22;
export const PACKAGE_IGNORE_ADDRESS_TYPE = 23;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_RESHIP = 24;
export const PACKAGE_UPDATE_TYPE_ORDER_NUMBER = 25;
export const PACKAGE_UPDATE_TYPE_PRODUCT = 26;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_PEAK = 27;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_CANCEL_LABEL = 28;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_OVERSIZE = 29;
export const PACKAGE_UPDATE_ADRESS_EXCEED_PACKAGE = 31;
export const PACKAGE_UPDATE_RETURN_PACKAGE = 32;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_BATTERY = 33;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_INSURED = 34;
export const PACKAGE_UPDATE_EXTRAFEE_TYPE_SERVICE = 35;

export const CHANGE_PACKAGE_TYPE: Status = {
  [PACKAGE_UPDATE_TYPE_RECIPIENT]: "Người nhận",
  [PACKAGE_UPDATE_TYPE_PHONENUMBER]: "Số điện thoại người nhận",
  [PACKAGE_UPDATE_TYPE_ADDRESS]: "Địa chỉ người nhận",
  [PACKAGE_UPDATE_TYPE_ADDRESS2]: "Địa chỉ phụ người nhận",
  [PACKAGE_UPDATE_TYPE_CITY]: "Thành phố",
  [PACKAGE_UPDATE_TYPE_STATECODE]: "Mã vùng",
  [PACKAGE_UPDATE_TYPE_ZIPCODE]: "Mã bưu điện",
  [PACKAGE_UPDATE_TYPE_COUNTRYCODE]: "Mã quốc gia",
  [PACKAGE_UPDATE_TYPE_WEIGHT]: "Trọng lượng",
  [PACKAGE_UPDATE_TYPE_VOLUME]: "Kích thước (DxRxC)",
  [PACKAGE_UPDATE_TYPE_NOTE]: "Yêu cầu khi giao",
  [PACKAGE_UPDATE_TYPE_SERVICE]: "Dịch vụ",
  [PACKAGE_UPDATE_TYPE_DETAIL]: "Chi tiết hàng hóa",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_COVID]: "Covid",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_OUTSIZE]: "Quá cỡ",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_FIXVOLUME]: "Sửa kích thước",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_FIXWEIGHT]: "Sửa trọng lượng",
  [PACKAGE_UPDATE_EXTRAFEE_EDIT_ORDER]: "Sửa đơn",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_REFUND]: "Hoàn tiền",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_OTHER]: "Phí phát sinh khác",
  [PACKAGE_CHECK_ADDRESS_TYPE]: "Xác nhận xóa cảnh báo địa chỉ không hợp lệ",
  [PACKAGE_IGNORE_ADDRESS_TYPE]: "Bỏ qua kiểm tra địa chỉ bằng API",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_RESHIP]: "Reship",
  [PACKAGE_UPDATE_TYPE_ORDER_NUMBER]: "Mã đơn hàng",
  [PACKAGE_UPDATE_TYPE_PRODUCT]: "",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_PEAK]: "",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_CANCEL_LABEL]: "Hủy Label",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_OVERSIZE]: "Phí quá thể tích",
  [PACKAGE_UPDATE_ADRESS_EXCEED_PACKAGE]: "Phí sửa địa chỉ",
  [PACKAGE_UPDATE_RETURN_PACKAGE]: "Return",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_BATTERY]: "Phụ phí pin",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_INSURED]: "Phí bảo hiểm",
  [PACKAGE_UPDATE_EXTRAFEE_TYPE_SERVICE]: "Phụ phí kích thước",
};

export const PACKAGE_STATUS_DEACTIVATE = 0;
export const PACKAGE_STATUS_CREATED = 1;
export const PACKAGE_STATUS_PENDING_PICKUP = 2;
export const PACKAGE_STATUS_RE_PENDING_PICKUP = 3;
export const PACKAGE_STATUS_PICKED = 10;
export const PACKAGE_STATUS_WAREHOUSE_LABELED = 11;
export const PACKAGE_STATUS_WAREHOUSE_IN_CONTAINER = 12;
export const PACKAGE_STATUS_WAREHOUSE_IN_SHIPMENT = 13;
export const PACKAGE_STATUS_WAREHOUSE_EXPORT = 14;
export const PACKAGE_STATUS_IN_TRANSIT = 30;
export const PACKAGE_STATUS_DELIVERED = 60;
export const PACKAGE_STATUS_RETURNED = 40;
export const PACKAGE_STATUS_CANCELLED = 50;
export const PACKAGE_STATUS_EXPIRED = 70;
export const PACKAGE_STATUS_RESHIP = 80;
export const PACKAGE_STATUS_UNDELIVERED = 90;
export const PACKAGE_STATUS_ARCHIVED = 55;
export const PACKAGE_DELIVERY_LOG_TYPE_RESHIP = 80;

export const DELIVER_LOG_PACKAGE: Status = {
  [PACKAGE_STATUS_IN_TRANSIT]: "Arriving at international airport to go abroad",
  [PACKAGE_STATUS_PENDING_PICKUP]:
    "Shipping label created, AnanBay awaiting item",
  [PACKAGE_STATUS_RE_PENDING_PICKUP]:
    "Shipping label created, AnanBay awaiting item",
  [PACKAGE_STATUS_PICKED]: "Accepted at AnanBay Processing	Center",
  [PACKAGE_STATUS_CANCELLED]: "Label canceled",
  [PACKAGE_STATUS_DELIVERED]: "Delivered",
  [PACKAGE_STATUS_WAREHOUSE_EXPORT]: "Departed from AnanBay Processing Center",
  [PACKAGE_DELIVERY_LOG_TYPE_RESHIP]: "Reship package",
};

export const EXTRA_FEE_CANCEL_LABEL = 13;
export const PACKAGE_REFUND_COMPLETE = 2;
export const EXTRA_FEE_TYPE_DISCOUNT = 15;

export const PACKAGE_STATUS_CREATED_TEXT = "pending";
export const PACKAGE_STATUS_PURCHASED_TEXT = "purchased";
export const PACKAGE_STATUS_PENDING_PICKUP_TEXT = "pre-transit";
export const PACKAGE_STATUS_PROCESSING_TEXT = "processing";
export const PACKAGE_STATUS_IN_TRANSIT_TEXT = "in-transit";
export const PACKAGE_STATUS_DELIVERED_TEXT = "delivered";
export const PACKAGE_STATUS_ALERT_TEXT = "alert";
export const PACKAGE_BOOKMARKED_TEXT = "bookmarks";
export const PACKAGE_STATUS_CANCELLED_TEXT = "canceled";
export const PACKAGE_STATUS_EXPIRED_TEXT = "expired";
export const PACKAGE_STATUS_UNDELIVERED_TEXT = "undelivered";
export const PACKAGE_STATUS_RETURN_TEXT = "return";
export const PACKAGE_STATUS_ARCHIVED_TEXT = "archived";

export const MAP_STATUS_CLASS_NAME: MapStatusClassName = {
  [PACKAGE_STATUS_CREATED_TEXT]: {
    text: PACKAGE_STATUS_CREATED_TEXT,
    className: "text-[#722ed1] bg-[#f9f0ff]",
  },
  [PACKAGE_STATUS_PURCHASED_TEXT]: {
    text: PACKAGE_STATUS_PURCHASED_TEXT,
    className: "text-[#722ed1] bg-[#f9f0ff]",
  },
  [PACKAGE_STATUS_PENDING_PICKUP_TEXT]: {
    text: PACKAGE_STATUS_PENDING_PICKUP_TEXT,
    className: "text-[#3f51b5] bg-[#e6ebf5]",
  },
  [PACKAGE_STATUS_PROCESSING_TEXT]: {
    text: PACKAGE_STATUS_PROCESSING_TEXT,
    className: "primary",
  },
  [PACKAGE_STATUS_IN_TRANSIT_TEXT]: {
    text: PACKAGE_STATUS_IN_TRANSIT_TEXT,
    className: "text-[#13c2c2] bg-[#e6fffb]",
  },
  [PACKAGE_STATUS_DELIVERED_TEXT]: {
    text: PACKAGE_STATUS_DELIVERED_TEXT,
    className: "text[#48be78] bg-[#f0fff3]",
  },
  [PACKAGE_STATUS_ALERT_TEXT]: {
    text: PACKAGE_STATUS_ALERT_TEXT,
    className: "alert",
  },
  [PACKAGE_STATUS_CANCELLED_TEXT]: {
    text: PACKAGE_STATUS_CANCELLED_TEXT,
    className: "text-[#f5222d] bg-[#fff1f0]",
  },
  [PACKAGE_STATUS_EXPIRED_TEXT]: {
    text: PACKAGE_STATUS_EXPIRED_TEXT,
    className: "expired",
  },
  [PACKAGE_STATUS_UNDELIVERED_TEXT]: {
    text: PACKAGE_STATUS_UNDELIVERED_TEXT,
    className: "danger",
  },
  [PACKAGE_STATUS_ARCHIVED_TEXT]: {
    text: PACKAGE_STATUS_ARCHIVED_TEXT,
    className: "text-[#f5222d] bg-[#fff1f0]",
  },
};

export type TUSState = {
  label: string;
  value: string;
};
export const US_STATES = [
  {
    label: "Alabama",
    value: "AL",
  },
  {
    label: "Alaska",
    value: "AK",
  },
  {
    label: "American Samoa",
    value: "AS",
  },
  {
    label: "Arizona",
    value: "AZ",
  },
  {
    label: "Arkansas",
    value: "AR",
  },
  {
    label: "California",
    value: "CA",
  },
  {
    label: "Colorado",
    value: "CO",
  },
  {
    label: "Connecticut",
    value: "CT",
  },
  {
    label: "Delaware",
    value: "DE",
  },
  {
    label: "District Of Columbia",
    value: "DC",
  },
  {
    label: "Federated States Of Micronesia",
    value: "FM",
  },
  {
    label: "Florida",
    value: "FL",
  },
  {
    label: "Georgia",
    value: "GA",
  },
  {
    label: "Guam",
    value: "GU",
  },
  {
    label: "Hawaii",
    value: "HI",
  },
  {
    label: "Idaho",
    value: "ID",
  },
  {
    label: "Illinois",
    value: "IL",
  },
  {
    label: "Indiana",
    value: "IN",
  },
  {
    label: "Iowa",
    value: "IA",
  },
  {
    label: "Kansas",
    value: "KS",
  },
  {
    label: "Kentucky",
    value: "KY",
  },
  {
    label: "Louisiana",
    value: "LA",
  },
  {
    label: "Maine",
    value: "ME",
  },
  {
    label: "Marshall Islands",
    value: "MH",
  },
  {
    label: "Maryland",
    value: "MD",
  },
  {
    label: "Massachusetts",
    value: "MA",
  },
  {
    label: "Michigan",
    value: "MI",
  },
  {
    label: "Minnesota",
    value: "MN",
  },
  {
    label: "Mississippi",
    value: "MS",
  },
  {
    label: "Missouri",
    value: "MO",
  },
  {
    label: "Montana",
    value: "MT",
  },
  {
    label: "Nebraska",
    value: "NE",
  },
  {
    label: "Nevada",
    value: "NV",
  },
  {
    label: "New Hampshire",
    value: "NH",
  },
  {
    label: "New Jersey",
    value: "NJ",
  },
  {
    label: "New Mexico",
    value: "NM",
  },
  {
    label: "New York",
    value: "NY",
  },
  {
    label: "North Carolina",
    value: "NC",
  },
  {
    label: "North Dakota",
    value: "ND",
  },
  {
    label: "Northern Mariana Islands",
    value: "MP",
  },
  {
    label: "Ohio",
    value: "OH",
  },
  {
    label: "Oklahoma",
    value: "OK",
  },
  {
    label: "Oregon",
    value: "OR",
  },
  {
    label: "Palau",
    value: "PW",
  },
  {
    label: "Pennsylvania",
    value: "PA",
  },
  {
    label: "Puerto Rico",
    value: "PR",
  },
  {
    label: "Rhode Island",
    value: "RI",
  },
  {
    label: "South Carolina",
    value: "SC",
  },
  {
    label: "South Dakota",
    value: "SD",
  },
  {
    label: "Tennessee",
    value: "TN",
  },
  {
    label: "Texas",
    value: "TX",
  },
  {
    label: "Utah",
    value: "UT",
  },
  {
    label: "Vermont",
    value: "VT",
  },
  {
    label: "Virgin Islands",
    value: "VI",
  },
  {
    label: "Virginia",
    value: "VA",
  },
  {
    label: "Washington",
    value: "WA",
  },
  {
    label: "West Virginia",
    value: "WV",
  },
  {
    label: "Wisconsin",
    value: "WI",
  },
  {
    label: "Wyoming",
    value: "WY",
  },
];
