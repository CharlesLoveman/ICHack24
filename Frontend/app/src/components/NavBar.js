import React from 'react';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from "react-icons/io";

export default function NavBar() {

    const navigate = useNavigate();

    return (
        <>
            <Button onClick={() => navigate(-1)}><IoIosArrowBack size="30px" /></Button>
        </>
    );
}