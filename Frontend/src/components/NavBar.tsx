import { JSX } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FaHome } from "react-icons/fa";

export default function NavBar(): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <Button variant="contained" onClick={() => navigate(-1)}>
        <IoIosArrowBack size="30px" />
      </Button>
      <Button variant="contained" onClick={() => navigate("/")}>
        <FaHome size="30px" />
      </Button>
    </>
  );
}
