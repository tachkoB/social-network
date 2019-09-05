import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(otherProfile) {
    const [button, setButton] = useState();

    useEffect(() => {
        axios
            .get(`/friends/${otherProfile.otherProfile}`)
            .then(results => {
                console.log(
                    "results from get otherprofile: ",
                    results.data.buttonText
                );
                setButton(results.data.buttonText);
            })
            .catch(err => {
                console.log("err in checking friendship: ", err.message);
            });
    }, []);

    function friendButton() {
        console.log("this is what I need now: ", otherProfile.otherProfile);
        axios
            .post("/friends/", {
                id: otherProfile.otherProfile,
                button: button
            })
            .then(results => {
                console.log("results in post:", results);
                setButton(results.data.buttonText);
            })
            .catch(err => {
                console.log("error in post friend req: ", err);
            });
    }

    return (
        <div className="friendButton">
            <button className="lo" onClick={friendButton}>
                {button}
            </button>
        </div>
    );
}
