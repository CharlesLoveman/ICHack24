import React from 'react';
import Button from '@mui/material/Button';
import useNavigate from 'react-router-dom';

export default function NavBar() {

    const navigate = useNavigate();

    return (
        <>
            <Button onclick={() => navigate(-1)}>Go back</Button>
            <div>a</div>
            <div>NavBar</div>
        </>
    );
}