import RegisterUserInfo from "@/types/RegisterUserInfo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const registerInitialState: RegisterUserInfo = {
  name: "",
  sex: "",
  residentId: "",
  phone: "",
  address: {
    zipcode: "",
    street: "",
    detail: "",
  },
  signature: "",
  bankAccount: {
    bank: "",
    account: "",
  },
  email: "",
  emailCode: 0,
  emailCert: false,
  password: "",
};

const registerUserInfo = createSlice({
  name: "registerUserInfo",
  initialState: registerInitialState,
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setUserSex: (state, action: PayloadAction<"male" | "female">) => {
      state.sex = action.payload;
    },
    setUserResidentId: (state, action: PayloadAction<string>) => {
      state.residentId = action.payload;
    },
    setUserPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setUserAddress: (
      state,
      action: PayloadAction<{ zipcode: string; street: string; detail: string }>
    ) => {
      state.address = action.payload;
    },
    setUserSignature: (state, action: PayloadAction<string>) => {
      state.signature = action.payload;
    },
    setUserBankAccount: (
      state,
      action: PayloadAction<{ bank: string; account: string }>
    ) => {
      state.bankAccount = action.payload;
    },
    setUserEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setUserEmailCode: (state, action: PayloadAction<number>) => {
      state.emailCode = action.payload;
    },
    setUserEmailCert: (state, action: PayloadAction<boolean>) => {
      state.emailCert = action.payload;
    },
    setUserPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    clearUserInfo: (state) => {
      Object.assign(state, registerInitialState);
    },
  },
});

export const {
  setUserName,
  setUserSex,
  setUserResidentId,
  setUserPhone,
  setUserAddress,
  setUserSignature,
  setUserBankAccount,
  setUserEmail,
  setUserEmailCode,
  setUserEmailCert,
  setUserPassword,
  clearUserInfo,
} = registerUserInfo.actions;

const registerUserInfoReducer = registerUserInfo.reducer;
export default registerUserInfoReducer;
