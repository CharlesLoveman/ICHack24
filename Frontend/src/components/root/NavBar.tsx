import { JSX } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import { HeaderContainer } from "../layout/HeaderContainer";
import styled from "styled-components";
import { darkGrey } from "../../utils/colors";

const NavBarContainer = styled(HeaderContainer)`
  background-color: ${darkGrey};
`;

export default function NavBar(): JSX.Element {
  const navigate = useNavigate();

  return (
    <NavBarContainer>
      <Button variant="text" color="navigation" onClick={() => navigate(-1)}>
        <IoIosArrowBack size="30px" />
      </Button>
      <Button variant="text" color="navigation" onClick={() => navigate("/")}>
        <FaHome size="30px" />
      </Button>
    </NavBarContainer>
  );
}
