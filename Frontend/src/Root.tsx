import { Outlet } from "react-router-dom";
import { DebugHeader } from "./components/debug/DebugHeader";
import { LayoutContainer } from "./components/layout/Layout";
import { CopyrightFooter } from "./components/root/CopyrightFooter";
import NavBar from "./components/root/NavBar";

export default function Root() {
  return (
    <LayoutContainer>
      <DebugHeader></DebugHeader>
      <NavBar />
      <Outlet />
      <CopyrightFooter />
    </LayoutContainer>
  );
}
