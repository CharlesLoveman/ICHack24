import { JSX } from "react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

export default function NavBar(): JSX.Element {
  const navigate = useNavigate();

  return (
    <>
      <Button onClick={() => navigate(-1)}>
        <IoIosArrowBack size="30px" />
      </Button>
    </>
  );
}
