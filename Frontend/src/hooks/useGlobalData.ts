import { useContext } from "react";
import { GlobalData } from "./useSetupGlobalData";
import { GlobalContextType } from "../types";

export function useGlobalData() {
  return useContext(GlobalData) as GlobalContextType;
}
