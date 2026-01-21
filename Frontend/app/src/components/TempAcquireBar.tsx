import React from 'react';

export default function TempAcquireBar(exist) {

    function navigateToAcquisitionScreen() {
        // Change it!
    }

    return (
        <>
            <div>You have a new Pokemon waiting!</div>
            <button onclick={navigateToAcquisitionScreen}>Go to the page</button >

        </>
    );
}