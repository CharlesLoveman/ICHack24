import React, { useCallback, useState } from 'react';
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
import { GlobalData } from '../../App.js';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';


export default function PokemonCaptureScreen() {
    const data = useContext(GlobalData);
    const backend_address = data.backend_address
    const [state, setState] = useState(null);
    const [url, setURL] = useState(null);
    const [hidden, setHidden] = useState("")

    const params = useParams()

    const navigate = useNavigate();

    // On file select (from the pop up)
    const onFileChange = (event) => {
        setState({
            selectedFile: event.target.files[0],
        });

        setURL(getImage(event.target.files[0]))

        setHidden("none")
    };

    // On file upload (click the upload button)
    const uploadFile = async function () {
        // Create an object of formData
        data.setPokemonReturned("waiting")
        const formData = new FormData();
        navigate(-1)

        // Update the formData object
        if (state) {
            if (state.selectedFile) {
                formData.append(
                    "img",
                    state.selectedFile,
                );
                console.log(state.selectedFile)
                //formData.append("image", imagefile.files[0]);
                // navigate(-1)
                return axios.post(`${backend_address}/CreatePokemon/${params.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => { return res.data.message }).catch(err => { console.log(err) });
            }


        }



        // Details of the uploaded file
        //console.log(state.selectedFile);

        // Request made to the backend api
        // Send formData object

        // Need to make it so that the backend can handle these requests on different threads

    };

    const onFileUpload = async function () {
        await uploadFile().then(function (response) {
            data.setPokemonReturned(""); // Fix this so that you only stop "waiting" if this pokemon was the one that caused the most current wait (for when multiple waits happen)
            data.setNoNewPokemon(data.noNewPokemon + 1);

        })
    }



    function getImage(image) {
        return URL.createObjectURL(image)
    }


    return (
        <>{NavBar()}
            <div style={{ textAlign: 'center' }}><GiForest />Capture a new Pokemon!<GiForest /></div >
            <Button fullWidth='true'><label htmlFor='imageUpload'><FaCameraRetro display={hidden} size='9rem'></FaCameraRetro></label ></Button >
            <div style={{ textAlign: 'center' }}><img src={url} width="200rem"></img></div >
            <div style={{ textAlign: 'center' }}>Take a picture an animal <FaDog />, object <FaBottleWater /> or anything else <GiSpikyExplosion /> you would like to Pokefy and upload it here. If you're happy with the result, click the tick to adopt the Pokemon. Happy capturing!</div>

            <Input
                id="imageUpload"
                type="file"
                onChange={onFileChange}
                style={{ display: "none" }}
                accept="image/*;capture=camera"
            />

            <Button fullWidth='true' >  <IoIosCheckmarkCircle size='2rem' onClick={onFileUpload} /></Button>


        </>
    );

}