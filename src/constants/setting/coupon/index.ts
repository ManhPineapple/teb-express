type Status = {
  [key: number]: string;
};

export const COUPON_TYPE_MONEY = 1;
export const COUPON_TYPE_DISCOUNT_PERCENT = 3;
export const COUPON_TYPE_DISCOUNT_MONEY = 2;

export const MAP_COUPON_TEXT: Status = {
  [COUPON_TYPE_MONEY]: "Tặng ngay",
  [COUPON_TYPE_DISCOUNT_MONEY]: `Giảm ngay`,
  [COUPON_TYPE_DISCOUNT_PERCENT]: "Giảm ngay",
};
