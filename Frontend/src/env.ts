import { clientURL } from "./url";

declare global {}
// export const backendAddress = import.meta.env.VITE_BACKEND_URL;
// export const publicFolder = import.meta.env.VITE_PUBLIC_FOLDER_URL;

/* We assume it is at the same ip, but at port VITE_BACKEND_PORT */
function getBackendAddress() {
  return clientURL.ip + ":" + import.meta.env.VITE_BACKEND_PORT;
}

export const backendAddress = getBackendAddress();
export const assetsFolder = clientURL.fullString() + "/public";
export const isDebug = import.meta.env.VITE_IS_DEBUG === "true";

export const CAPTURE_SCREEN_JUST_REFRESHED = "capture_screen_just_refreshed"