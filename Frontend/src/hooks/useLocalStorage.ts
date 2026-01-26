import { useEffect } from "react";
import { useGlobalData } from "./useGlobalData";
import { GlobalStates } from "../types";

export function useLocalStorage() {
  const data = useGlobalData();

  useEffect(() => {
    // console.log(data?.username);
    const stringifiedData = JSON.stringify(data);
    // console.log(stringifiedData);
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
