export default interface UserInfo {
  _id: string;
  name: string;
  사업자번호: string;
  sex: string;
  주민번호: string;
  phone: string;
  address: {
    zip: string;
    mainAddress: string;
    subAddress: string;
  };
  sign: object;
  bankAccount: {
    bank: string;
    account: string;
  };
  email: string;
  password: string;
}
