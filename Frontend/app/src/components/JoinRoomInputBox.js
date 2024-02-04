import React, { useState } from 'react';

export function JoinRoomInputBox() {

    function changePage(new_page) {

    }

    function onSubmit(event) {
    }

    return (
        <form onSubmit={onSubmit}>
            <input onChange={e => changePage(e.target.value)} />

            {/*<button type="submit" disabled={isLoading}>Join Room!</button>*/}
        </form>
    );
}