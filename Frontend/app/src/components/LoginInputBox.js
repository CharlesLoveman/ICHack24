import React, { useState } from 'react';
import { socket } from '../socket';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { GiBattleAxe } from "react-icons/gi";



const orig_username = String(Math.floor(Math.random() * 1000000))

export default function LoginInputBox(updateAndInitialiseUser, sx) {

    const [username, setUsername] = useState(orig_username);

    function updateUsername() {
        updateAndInitialiseUser(username)
    }

    function handleKeyDown(e) {
        if (e.keyCode == 13) {
            updateUsername()
        }
    }

    return (<>
        <Button sx={sx} fullWidth='true' color='error' startIcon={<GiBattleAxe size="1rem" />} endIcon={<GiBattleAxe size="1rem" />} variant='contained' size='large' type="submit" onClick={() => updateUsername()}>Login</Button><br />
        <Input onKeyDown={e => handleKeyDown(e)} defaultValue={orig_username} onChange={e => setUsername(e.target.value)} />
    </>


    );
}