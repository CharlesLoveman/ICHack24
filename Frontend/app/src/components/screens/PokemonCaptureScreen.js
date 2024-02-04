import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { MdUpload } from "react-icons/md";
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';


export default function PokemonCaptureScreen() {

    const [state, setState] = useState(null);

    const params = useParams()

    // On file select (from the pop up)
    const onFileChange = (event) => {
        setState({
            selectedFile: event.target.files[0],
        });
    };

    // On file upload (click the upload button)
    const onFileUpload = () => {
        // Create an object of formData
        const formData = new FormData();

        // Update the formData object
        if (state) {
            if (state.selectedFile) {
                formData.append(
                    "img",
                    state.selectedFile,
                );
                console.log(state.selectedFile)
                //formData.append("image", imagefile.files[0]);
                axios.post(`http://127.0.0.1:5000/CreatePokemon/${params.id}`, formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data'
                    }});

                //axios.post(`http://127.0.0.1:5000/CreatePokemon/${params.id}`, formData);
            }
        }
    };


    return (
        <>{NavBar()}
            <div>Put a Camera here</div>
            <div>Put an upload button here</div>

            <Button><label htmlFor='imageUpload'><MdUpload size="32px"></MdUpload></label></Button>

            <Input
                id="imageUpload"
                type="file"
                onChange={onFileChange}
                style={{ display: "none" }}
            />

            <MdUpload onClick={onFileUpload}></MdUpload>
        </>
    );

}