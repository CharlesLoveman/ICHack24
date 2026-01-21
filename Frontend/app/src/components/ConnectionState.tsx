interface ConnectionStateProps {
  isConnected: boolean;
}

export function ConnectionState({ isConnected }: ConnectionStateProps) {
  return <p>State: {"" + isConnected}</p>;
}
