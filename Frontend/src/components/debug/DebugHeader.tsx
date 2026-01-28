import styled from "styled-components";
import { ConnectionManager } from "./ConnectionManager";
import { ConnectionState } from "./ConnectionState";
import { SocketProps } from "../../Root";

const DebugContainer = styled.div`
  background-color: #dcdcbd;
`;

export function DebugHeader({ isConnected }: SocketProps) {
  return (
    <DebugContainer>
      <ConnectionManager />
      <ConnectionState isConnected={isConnected} />
    </DebugContainer>
  );
}
