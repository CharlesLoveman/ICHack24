import styled from "styled-components";
import { useSetupSocket } from "../../hooks/useSetupSocket";
import { ConnectionManager } from "./ConnectionManager";
import { ConnectionState } from "./ConnectionState";

const DebugContainer = styled.div`
  background-color: #dcdcbd;
`;

export function DebugHeader() {
  const { isConnected } = useSetupSocket();
  return (
    <DebugContainer>
      <ConnectionManager />
      <ConnectionState isConnected={isConnected} />
    </DebugContainer>
  );
}
