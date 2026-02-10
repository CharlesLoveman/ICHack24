import { Outlet } from "react-router-dom";
import { DebugHeader } from "./components/debug/DebugHeader";
import { LayoutContainer } from "./components/layout/Layout";
import { CopyrightFooter } from "./components/root/CopyrightFooter";
import NavBar from "./components/root/NavBar";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Notifications } from "./components/Notifications";
import { HiddenClicks } from "./components/BrowserRouter";
import { useSetupSocket } from "./hooks/useSetupSocket";
import { isDebug } from "./env";

export interface SocketProps {
  isConnected: boolean;
}

export default function Root(props: HiddenClicks) {
  useLocalStorage();
  const { isConnected } = useSetupSocket();
  return (
    <LayoutContainer>
      {isDebug ? <DebugHeader isConnected={isConnected}></DebugHeader> : <></>}
      <NavBar isConnected={isConnected} />
      <Outlet />
      <Notifications></Notifications>
      <CopyrightFooter {...props} />
    </LayoutContainer>
  );
}
