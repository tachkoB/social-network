import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUser] = useState();
    const [val, setVal] = useState();
    const [lastUsers, setLastUsers] = useState();

    useEffect(() => {
        axios.get("/lastUsers").then(results => {
            console.log(
                "results from getting last users: ",
                results.data.result
            );
            setLastUsers(results.data.result);
        });
    }, []);

    useEffect(
        () => {
            if (val) {
                axios.get(`/searchUsers/${val}.json`).then(results => {
                    console.log(
                        "results for new users in findpeople: ",
                        results.data.result
                    );
                    setUser(results.data.result);
                });
            }
        },
        [val]
    );

    const onChange = e => {
        setVal(e.target.value);
    };

    return (
        <div className="yolo">
            <h3>Recently joined users:</h3>
            <div className="gridOther">
                {lastUsers &&
                    lastUsers.map((user, i) => {
                        if (!user.image) {
                            user.image = "/default.png";
                        }
                        return (
                            <div key={i + 1}>
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="friendImg"
                                        src={user.image}
                                    />
                                </Link>
                                <p className="textPic">
                                    {user.first} {user.last}
                                </p>
                            </div>
                        );
                    })}
            </div>
            <br />
            <div className="inputAndSearch">
                <h3 className="search">Search for users:</h3>
                <input className="input" type="text" onChange={onChange} />
            </div>
            <br />
            <div className="gridOther">
                {users &&
                    users.map((user, i) => {
                        if (!user.image) {
                            user.image = "/default.png";
                        }
                        return (
                            <div key={i + 1}>
                                <Link to={`/user/${user.id}`}>
                                    <img
                                        className="friendImg"
                                        src={user.image}
                                    />
                                </Link>
                                <p className="textPic">
                                    {user.first} {user.last}
                                </p>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
