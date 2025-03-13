export default interface RegisterUserInfo {
  name: string;
  sex: string;
  residentId: string;
  phone: string;
  address: {
    zipcode: string;
    street: string;
    detail: string;
  };
  signature: string;
  bankAccount: {
    bank: string;
    account: string;
  };
  email: string;
  emailCode: number;
  emailCert: boolean;
  password: string;
}
