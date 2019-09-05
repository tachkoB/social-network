import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { receiveUsers, beFriends, unFriend } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const users = useSelector(
        state =>
            state.users && state.users.filter(users => users.accepted == true)
    );

    const wannabes = useSelector(
        state =>
            state.users &&
            state.users.filter(wannabes => wannabes.accepted == false)
    );

    useEffect(() => {
        dispatch(receiveUsers());
    }, []);
    if (!users) {
        return null;
    }

    if (!wannabes) {
        return null;
    }

    return (
        <div>
            <h1>List of your friends</h1>
            <div className="friendsContainer">
                {users &&
                    users.map(user => (
                        <div className="friendsImgContainer" key={user.id}>
                            <Link to={`/user/${user.id}`}>
                                <img
                                    className="friendImg"
                                    src={user.image || "/default.png"}
                                    alt={`${user.first} ${user.last}`}
                                />
                                <p className="friends">
                                    {user.first} {user.last}{" "}
                                </p>
                            </Link>
                            <button
                                className="buttonFriends"
                                onClick={e => dispatch(unFriend(user.id))}
                            >
                                Unfriend
                            </button>
                        </div>
                    ))}
            </div>
            <h1>People who have sent you a friend request</h1>
            <div className="friendsContainer">
                {wannabes &&
                    wannabes.map(wannabes => (
                        <div className="friendsImgContainer" key={wannabes.id}>
                            <Link to={`/user/${wannabes.id}`}>
                                <img
                                    className="friendImg"
                                    src={wannabes.image || "/default.png"}
                                    alt={`${wannabes.first} ${wannabes.last}`}
                                />
                                <p className="friends">
                                    {wannabes.first} {wannabes.last}{" "}
                                </p>
                            </Link>
                            <button
                                className="buttonFriends"
                                onClick={e => dispatch(beFriends(wannabes.id))}
                            >
                                Accept
                            </button>
                        </div>
                    ))}
            </div>
        </div>
    );
}
