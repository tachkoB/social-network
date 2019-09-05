//credit to Maja for helping me with redux

export default function(state = {}, action) {
    if (action.type == "ALL_PEOPLE") {
        state = {
            ...state,
            users: action.users
        };
    }
    if (action.type == "ALL_PEOPLE" || action.type == "ALL_PEOPLE") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    muffin: action.type == "ALL_PEOPLE"
                };
            })
        };
    }
    if (action.type == "MAKE_FRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id != action.id) {
                    return user;
                }
                return {
                    ...user,
                    accepted: true
                };
            })
        };
    }

    if (action.type == "UNFRIEND_PERSON") {
        state = {
            ...state,
            users: state.users.filter(user => {
                return user.id != action.id;
            })
        };
    }

    if (action.type == "PREV_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages.reverse()
        };
    }

    if (action.type == "NEW_MESSAGE") {
        var arr = state.chatMessages.slice();
        arr.push(action.chatMessage);

        return {
            ...state,
            chatMessages: arr
        };
    }
    return state;
}
