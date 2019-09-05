import React from "react";

export default function({ image, first, last, onClick }) {
    return (
        <div className="profilePicContainer">
            <img
                className="profilePic"
                src={image}
                alt={`${first} ${last}`}
                onClick={onClick}
            />
        </div>
    );
}
