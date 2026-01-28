import { JSX } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { HeaderContainer } from "../layout/HeaderContainer";
import styled from "styled-components";
import { darkGrey } from "../../utils/colors";
import { SocketProps } from "../../Root";
import { TbCircuitCell } from "react-icons/tb";
import { RightAlignedContainer } from "../layout/RightAlignedContainer";
import { HomeIcon } from "../layout/HomeIcon";
import { BackIcon } from "../layout/BackIcon";

const NavBarContainer = styled(HeaderContainer)`
  background-color: ${darkGrey};
`;

export default function NavBar({ isConnected }: SocketProps): JSX.Element {
  const navigate = useNavigate();

  return (
    <NavBarContainer>
      <Button variant="text" color="navigation" onClick={() => navigate(-1)}>
        <BackIcon size="2rem"></BackIcon>
      </Button>
      <Button variant="text" color="navigation" onClick={() => navigate("/")}>
        <HomeIcon size="2rem"></HomeIcon>
      </Button>
      <RightAlignedContainer>
        <Button variant="text">
          <TbCircuitCell color={isConnected ? "green" : "red"} size="30px" />
        </Button>
      </RightAlignedContainer>
    </NavBarContainer>
  );
}
