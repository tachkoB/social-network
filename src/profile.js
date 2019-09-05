import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    return (
        <div className="gridElement">
            <div className="bigPicture">
                <ProfilePic
                    image={props.image}
                    first={props.first}
                    last={props.last}
                    onClick={props.onClick}
                />
                <p className="what">
                    {props.first} {props.last}
                </p>
            </div>
            <BioEditor bio={props.bio} changeBio={props.changeBio} />
        </div>
    );
}
