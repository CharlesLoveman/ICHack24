import { ConnectionManager } from "./components/ConnectionManager";
import { Outlet } from "react-router-dom";
import { useSetupSocket } from "./hooks/useSetupSocket";
import { ConnectionState } from "./components/ConnectionState";

export default function Root() {
  const { isConnected } = useSetupSocket();

  return (
    <>
      <ConnectionManager />
      <ConnectionState isConnected={isConnected} />
      <div>
        <Outlet />
      </div>
    </>
  );
}
