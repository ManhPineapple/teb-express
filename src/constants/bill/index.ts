export const TransactionLogTypeTopup = 1;
export const TransactionLogTypePay = 2;
export const TransactionLogTypeRefund = 4;
export const TransactionLogTypePayoneer = 5;
export const TransactionLogTypePingPong = 6;
export const TransactionLogAffiliate = 7;

export const TransactionStatusProcess = 1;
export const TransactionStatusSuccess = 2;
export const TransactionStatusFailure = 3;

export const TRANSACTION_STATUS = [
  {
    key: "1",
    name: "Nạp tiền",
  },
  {
    key: "2",
    name: "Thanh toán",
  },
  {
    key: "4",
    name: "Hoàn tiền",
  },
];
