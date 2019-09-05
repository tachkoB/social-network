import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);

    const elemRef = useRef();

    useEffect(
        () => {
            elemRef.current.scrollTop =
                elemRef.current.scrollHeight - elemRef.current.clientHeight;
        },
        [chatMessages]
    );

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("Yolo", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div>
            <div className="chatBox" ref={elemRef}>
                <h3>Chat with your friends!</h3>
                {chatMessages &&
                    chatMessages.map(message => (
                        <div className="chatContainer" key={message.id}>
                            <img className="chatImg" src={message.image} />
                            <div className="chatChat">
                                <p className="addPad">
                                    by: {message.first} {message.last}
                                    <p className="addPad tinyText">
                                        {" "}
                                        at: {message.created_at}
                                    </p>
                                </p>
                                <p className="addPad">{message.message}</p>
                            </div>
                        </div>
                    ))}
                <textarea
                    className="txtChat"
                    placeholder="Add a comment"
                    onKeyDown={keyCheck}
                />
            </div>
        </div>
    );
}
