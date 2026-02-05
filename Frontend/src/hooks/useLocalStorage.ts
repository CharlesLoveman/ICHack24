import { useEffect } from "react";
import { useGlobalData } from "./useGlobalData";
import { GlobalStates } from "../types";
import { CAPTURE_SCREEN_JUST_REFRESHED } from "../env";

export function useLocalStorage() {
  const data = useGlobalData();

  useEffect(() => {
    const stringifiedData = JSON.stringify(data);
    localStorage.setItem("data", stringifiedData);
  }, [data]);

  useEffect(() => {
    const val = localStorage.getItem(CAPTURE_SCREEN_JUST_REFRESHED);
    localStorage.removeItem(CAPTURE_SCREEN_JUST_REFRESHED);
    console.log(val);
    if (val === "true") {
      data.addNotification({
        message: "Capture page was just reloaded and any Pokemon just snapped has not been processed. This may be due to launching the Camera and Android memory constraints.",
        severity: "warning",
      });
    }
  }, [])
}

export function loadLocalStorage() {
  const stringifiedData = localStorage.getItem("data");

  const localStorageData =
    JSON.parse(stringifiedData ?? "{}") ?? ({} as GlobalStates);
  // console.log(localStorageData);
  return localStorageData;
}
