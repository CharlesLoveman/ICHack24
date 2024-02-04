import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../NavBar';
import { MdUpload } from "react-icons/md";
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import { FaCameraRetro } from "react-icons/fa";


export default function PokemonCaptureScreen() {

    const [state, setState] = useState(null);

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
                    "myFile",
                    state.selectedFile,
                    state.selectedFile.name
                );

                axios.post("api/uploadfile", formData);
            }


        }



        // Details of the uploaded file
        //console.log(state.selectedFile);

        // Request made to the backend api
        // Send formData object

    };

    // File content to be displayed after
    // file upload is complete
    function fileData() {
        if (state) {
            if (state.selectedFile) {
                return (
                    <div>
                        <h2>File Details:</h2>
                        <p>
                            File Name:{" "}
                            {state.selectedFile.name}
                        </p>

                        <p>
                            File Type:{" "}
                            {state.selectedFile.type}
                        </p>

                        <p>
                            Last Modified:{" "}
                            {state.selectedFile.lastModifiedDate.toDateString()}
                        </p>
                    </div>
                );


            } else {
                return (
                    <div>
                        <br />
                        <h4>
                            Choose before Pressing the Upload
                            button
                        </h4>
                    </div>
                );
            }
        }
    };


    return (
        <>{NavBar()}
            <div>Capture a new Pokemon!</div>
            <div>Take a picture an animal, object or anything else you would like to Pokefy and upload it here. Happy capturing!</div>

            <Button><label htmlFor='imageUpload'><FaCameraRetro size="32px"></FaCameraRetro></label></Button>

            <Input
                id="imageUpload"
                type="file"
                onChange={onFileChange}
                style={{ display: "none" }}
            />

            {fileData()}
        </>
    );

}