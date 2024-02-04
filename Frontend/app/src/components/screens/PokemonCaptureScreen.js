import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { MdUpload } from "react-icons/md";
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { FaCameraRetro, FaUnderline } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useParams } from 'react-router-dom';
import { GiForest } from "react-icons/gi";
import { FaDog } from "react-icons/fa";
import { FaBottleWater } from "react-icons/fa6";
import { GiSpikyExplosion } from "react-icons/gi";


export default function PokemonCaptureScreen() {

    const [state, setState] = useState(null);
    const [url, setURL] = useState(null);

    const params = useParams()

    // On file select (from the pop up)
    const onFileChange = (event) => {
        setState({
            selectedFile: event.target.files[0],
        });

        setURL(getImage(event.target.files[0]))
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
                    }
                });
            }


        }



        // Details of the uploaded file
        //console.log(state.selectedFile);

        // Request made to the backend api
        // Send formData object

    };

    function getImage(image) {
        return URL.createObjectURL(image)
    }


    return (
        <>{NavBar()}
            <div style={{ textAlign: 'center' }}><GiForest />Capture a new Pokemon!<GiForest /></div >
            <Button fullWidth='true'><label htmlFor='imageUpload'><FaCameraRetro size='9rem'></FaCameraRetro></label ></Button >
            <div style={{ textAlign: 'center' }}>Take a picture an animal <FaDog />, object <FaBottleWater /> or anything else <GiSpikyExplosion /> you would like to Pokefy and upload it here. If you're happy with the result, click the tick to adopt the Pokemon. Happy capturing!</div>

            <Input
                id="imageUpload"
                type="file"
                onChange={onFileChange}
                style={{ display: "none" }}
            />

            <Button fullWidth='true'>  <IoIosCheckmarkCircle size='2rem' onClick={onFileUpload} /></Button>

            {<img src={url}></img>}
        </>
    );

}