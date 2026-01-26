import { Outlet } from "react-router-dom";
import { DebugHeader } from "./components/debug/DebugHeader";
import { LayoutContainer } from "./components/layout/Layout";
import { CopyrightFooter } from "./components/root/CopyrightFooter";
import NavBar from "./components/root/NavBar";
import { useLocalStorage } from "./hooks/useLocalStorage";

export default function Root() {
  useLocalStorage();
  return (
    <LayoutContainer>
      <DebugHeader></DebugHeader>
      <NavBar />
      <Outlet />
      <CopyrightFooter />
    </LayoutContainer>
  );
}
