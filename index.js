const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const bc = require("./utils/bc");
const csurf = require("csurf");
const s3 = require("./s3");
const config = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const cookieSession = require("cookie-session");

const cookieSessionMiddleware = cookieSession({
    secret: "I am always angry",
    maxAge: 1000 * 60 * 60 * 24 * 14
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
app.use(require("body-parser").json());

app.use(express.static("./public"));

app.use(compression());
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");

var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("/delete/:id", (req, res) => {
    console.log("logging the req params to see If I ahave: ", req.params.id);
    db.deleteUser(req.params.id)
        .then(() => {
            return db.deleteChat(req.params.id);
        })
        .catch(err => {
            console.log("error for deleting: ", err.message);
        });
    req.session = null;
    res.redirect("/welcome");
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});
app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//DO NOT DELTE THIS sendFile
app.get("/users", (req, res) => {
    db.getUser(req.session.userId)
        .then(results => {
            if (results.rows[0].image == null) {
                results.rows[0].image = "./default.png";
            }
            res.json({
                data: results.rows[0],
                success: true
            });
        })
        .catch(err => {
            console.log("getting user info error: ", err.message);
        });
});

app.get("/user/:id.json", (req, res) => {
    db.getUser(req.params.id)
        .then(results => {
            var otherUser = results.rows[0];
            if (!otherUser.image) {
                otherUser.image = "/public/default.png";
            }
            res.json(otherUser);
        })
        .catch(err => {
            console.log(
                "error getting other profile data in node: ",
                err.message
            );
        });
});

app.get("/lastUsers", (req, res) => {
    db.getLastUsers()
        .then(results => {
            console.log("getting last users in route: ", results.rows);
            var result = results.rows;
            res.json({ result });
        })
        .catch(err => {
            console.log("error in getting last users route: ", err.message);
        });
});
app.get("/searchUsers/:str.json", (req, res) => {
    console.log("the req params string: ", req.params.str);
    db.getUsersByName(req.params.str)
        .then(results => {
            console.log(
                "results from searching a user in route: ",
                results.rows
            );
            let result = results.rows;
            res.json({ result });
        })
        .catch(err => {
            console.log("error in searching for users by name: ", err.message);
        });
});

app.get("/friends/:otherProfile", function(req, res) {
    console.log(
        "otherprofile in get friends route",
        req.session.userId,
        req.params.otherProfile
    );
    db.checkFriends(req.session.userId, req.params.otherProfile)
        .then(results => {
            console.log("results in the get route for friends: ", results);

            if (results.rows.length == 0) {
                res.json({ buttonText: "Add friend" });
            } else if (
                req.session.userId == results.rows[0].reciever_id &&
                results.rows[0].accepted == false
            ) {
                res.json({
                    buttonText: "Accept friend request"
                });
            } else if (
                req.session.userId == results.rows[0].sender_id &&
                results.rows[0].accepted == false
            ) {
                res.json({
                    buttonText: "Cancel friend request"
                });
            } else if (
                req.session.userId == results.rows[0].reciever_id &&
                results.rows[0].accepted == true
            ) {
                res.json({
                    buttonText: "Unfriend"
                });
            } else if (
                req.session.userId == results.rows[0].sender_id &&
                results.rows[0].accepted == true
            ) {
                res.json({
                    buttonText: "Unfriend"
                });
            }
        })
        .catch(err => {
            console.log("error in get route friendbutton: ", err.message);
        });
});
//credit to Maja for helping with part 8

app.get("/friendsworld", async function(req, res) {
    try {
        let { rows } = await db.friendSelection(req.session.userId);
        res.json(rows);
    } catch (err) {
        console.log("Error in friends route: ", err);
    }
});

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/friends/", (req, res) => {
    if (req.body.button == "Add friend") {
        db.makeFriendRequest(req.session.userId, req.body.id)
            .then(results => {
                console.log("RESULTS MAKE FR REQ: ", results);
                res.json({ buttonText: "Cancel friend request" });
            })
            .catch(err => {
                console.log("error in making fr req: ", err.message);
            });
    }
    if (req.body.button == "Cancel friend request") {
        db.cxlFrReq(req.session.userId, req.body.id)
            .then(results => {
                res.json({ buttonText: "Add friend" });
                console.log("results cancel fr req: ", results);
            })
            .catch(err => {
                console.log("error in cancelling fr req: ", err.message);
            });
    }

    if (req.body.button == "Accept friend request") {
        db.acceptFrReq(req.session.userId)
            .then(results => {
                res.json({ buttonText: "Unfriend" });
                console.log("results accept fr req: ", results);
            })
            .catch(err => {
                console.log("error in accepting fr req: ", err.message);
            });
    }

    if (req.body.button == "Unfriend") {
        db.cxlFrReq(req.session.userId, req.body.id)
            .then(results => {
                res.json({ buttonText: "Add friend" });
                console.log("results unfriend post: ", results);
            })
            .catch(err => {
                console.log("error in unfriend req: ", err.message);
            });
    }
});

app.post("/register", (req, res) => {
    bc.hashPassword(req.body.password)
        .then(hash => {
            db.addUser(req.body.first, req.body.last, req.body.email, hash)
                .then(resp => {
                    req.session.userId = resp.rows[0].id;
                    console.log(req.session.userId);
                    console.log(resp.rows[0]);
                    res.json({
                        data: resp.rows[0],
                        success: true
                    });
                })
                .catch(err => {
                    console.log("error in add user", err);
                    res.json({
                        success: false
                    });
                });
        })
        .catch(err => {
            console.log("error in hash password", err.message);
            res.json({
                success: false
            });
        });
});

app.post("/login", (req, res) => {
    db.getEmail(req.body.email)
        .then(results => {
            bc.checkPassword(req.body.password, results.rows[0].password).then(
                matched => {
                    if (matched) {
                        req.session.userId = results.rows[0].id;
                        res.json({
                            data: results.rows[0],
                            success: true
                        });
                    } else {
                        res.json({
                            success: false
                        });
                    }
                }
            );
        })
        .catch(err => {
            console.log("error in the pw", err.message);
            res.json({
                success: false
            });
        });
});

app.post("/updateImage", uploader.single("file"), s3.upload, (req, res) => {
    console.log("this is the req.file: ", req.file);
    if (req.file) {
        const url = config.s3Url + req.file.filename;
        console.log("this is the const url: ", url);
        db.updateImage(url, req.session.userId)
            .then(data => {
                console.log(data);
                res.json(data.rows[0].image);
            })
            .catch(err => {
                console.log("error in adding image: ", err.message);
            });
    } else {
        res.json({
            success: false
        });
    }
});

app.post("/bio", (req, res) => {
    console.log("is this the post req:", req.body.bio, req.session.userId);
    db.addBio(req.body.bio, req.session.userId)
        .then(results => {
            console.log("the results of adding bio: ", results.rows[0].bio);
            res.json(results.rows[0].bio);
        })
        .catch(err => {
            console.log("error in returning bio: ", err.message);
        });
});

//credit to Jane for helping me with part 9
io.on("connection", async function(socket) {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    console.log("the socket session userId: ", socket.request.session.userId);

    const userId = socket.request.session.userId;

    let data = await db.getUser(userId);
    console.log("the data from getting user: ", data);

    socket.request.first = data.rows[0].first;
    socket.request.last = data.rows[0].last;
    socket.request.image = data.rows[0].image;

    let { rows } = await db.getMessages();
    console.log("the rows to appear in chat: ", rows);

    io.sockets.emit("chatMessages", rows);

    socket.on("Yolo", async msg => {
        let { rows } = await db.addMessage(userId, msg);
        console.log("logging the rows in socket: ", rows);

        io.sockets.emit("chatMessage", {
            id: rows[0].id,
            sender_id: rows[0].sender_id,
            message: rows[0].message,
            created_at: rows[0].created_at,
            first: socket.request.first,
            last: socket.request.last,
            image: socket.request.image
        });
    });
});

server.listen(8080, function() {
    console.log("I'm listening.");
});

//node bundle-server.js
