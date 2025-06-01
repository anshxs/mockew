import React from "react";

type UpdateStorageContextType = {
  updateStorage: any;
  setUpdateStorage: React.Dispatch<React.SetStateAction<any>>;
};

export const UpdateStorageContext = React.createContext<UpdateStorageContextType>({
  updateStorage: {},
  setUpdateStorage: () => {},
});