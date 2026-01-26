import { useEffect } from "react";
import { useGlobalData } from "./useGlobalData";
import { GlobalStates } from "../types";

export function useLocalStorage() {
  const data = useGlobalData();

  useEffect(() => {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem("data", stringifiedData);
  }, [data]);
}

export function loadLocalStorage() {
  const stringifiedData = localStorage.getItem("data");

  const localStorageData =
    JSON.parse(stringifiedData ?? "{}") ?? ({} as GlobalStates);
  console.log(localStorageData);
  return localStorageData;
}
