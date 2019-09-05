var spicedPg = require("spiced-pg");

let db = spicedPg("postgres:postgres:postgres@localhost:5432/socialusers");

exports.addUser = function addUser(first, last, email, password) {
    return db.query(
        `INSERT INTO users (first, last, email, password) VALUES($1, $2, $3, $4) RETURNING id`,
        [first, last, email, password]
    );
};

exports.getEmail = function getEmail(email) {
    return db.query(`SELECT * FROM users WHERE email = ($1)`, [email]);
};

exports.getUser = function getUser(id) {
    return db.query(
        `SELECT id, first, last, image, bio FROM users WHERE id=($1)`,
        [id]
    );
};

exports.updateImage = function updateImage(url, id) {
    return db.query(
        `UPDATE users SET image = $1 WHERE id = $2 RETURNING image`,
        [url, id]
    );
};

exports.addBio = function addBio(bio, id) {
    return db.query(`UPDATE users SET bio = $1 WHERE id =$2 RETURNING bio`, [
        bio,
        id
    ]);
};

exports.getLastUsers = function getLastUsers() {
    return db.query(`SELECT * FROM users ORDER BY created_at DESC LIMIT 3`);
};

exports.getUsersByName = function getUsersByName(str) {
    return db.query(
        `SELECT first, last, image, id FROM users WHERE first ILIKE $1;`,
        [str + "%"]
    );
};

//----------------------------
exports.checkFriends = function checkFriends(sender_id, reciever_id) {
    return db.query(
        "SELECT * FROM friends WHERE (sender_id = $1 AND reciever_id = $2) OR (sender_id = $2 AND reciever_id = $1);",
        [sender_id, reciever_id]
    );
};

exports.makeFriendRequest = function makeFriendRequest(sender_id, reciever_id) {
    return db.query(
        "INSERT INTO friends (sender_id, reciever_id) VALUES ($1, $2) RETURNING *",
        [sender_id, reciever_id]
    );
};

exports.acceptFrReq = function acceptFrReq(reciever_id) {
    return db.query(
        "UPDATE friends SET accepted = true WHERE reciever_id = $1 RETURNING *",
        [reciever_id]
    );
};

exports.cxlFrReq = function cxlFrReq(sender_id, reciever_id) {
    return db.query(
        "DELETE FROM friends WHERE (sender_id =$1 AND reciever_id = $2) OR (reciever_id = $1 AND sender_id = $2)",
        [sender_id, reciever_id]
    );
};

exports.friendSelection = function friendSelection(id) {
    return db.query(
        `SELECT users.id, first, last, image, accepted
        FROM friends
        JOIN users
        ON (accepted = false AND reciever_id = $1 AND sender_id = users.id)
        OR (accepted = true AND reciever_id = $1 AND sender_id  = users.id)
        OR (accepted = true AND sender_id  = $1 AND reciever_id = users.id)`,
        [id]
    );
};

exports.addMessage = function addMessage(sender_id, message) {
    return db.query(
        "INSERT INTO chats (sender_id, message) VALUES ($1, $2) RETURNING *",
        [sender_id, message]
    );
};

exports.getMessages = function getMessages() {
    return db.query(
        "SELECT * FROM chats INNER JOIN users ON chats.sender_id = users.id ORDER BY chats.created_at DESC LIMIT 10"
    );
};
exports.deleteUser = function deleteUser(id) {
    return db.query(`DELETE FROM users WHERE id=$1`, [id]);
};

exports.deleteChat = function deleteChat(id) {
    return db.query(`DELETE FROM chats WHERE sender_id=$1`, [id]);
};
