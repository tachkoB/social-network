import axios from "./axios";

export async function receiveUsers() {
    const { data } = await axios.get("/friendsworld");
    console.log("data in action", data);
    return {
        type: "ALL_PEOPLE",
        users: data
    };
}

export async function beFriends(id) {
    await axios.post("/friends/", {
        button: "Accept friend request",
        id: id
    });

    return {
        type: "MAKE_FRIEND",
        id
    };
}

export async function unFriend(id) {
    await axios.post("/friends/", {
        button: "Unfriend",
        id: id
    });
    return {
        type: "UNFRIEND_PERSON",
        id
    };
}
export async function chatMessage(msg) {
    return {
        type: "NEW_MESSAGE",
        chatMessage: msg
    };
}

export async function chatMessages(msgs) {
    return {
        type: "PREV_MESSAGES",
        chatMessages: msgs
    };
}
