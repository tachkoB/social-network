import React from "react";
import Uploader from "./uploader";
import ProfilePic from "./profilepic";
import axios from "./axios";
import Profile from "./profile";
import { Route, BrowserRouter, Link } from "react-router-dom";
import OtherProfile from "./otherprofile";
import FindPeople from "./findpeople";
import Friends from "./friends";
import Chat from "./chat";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false
        };
    }
    componentDidMount() {
        axios.get("/users").then(results => {
            console.log(results.data.data.bio);
            this.setState({
                id: results.data.data.id,
                first: results.data.data.first,
                last: results.data.data.last,
                image: results.data.data.image,
                bio: results.data.data.bio
            });
        });
    }

    render() {
        if (!this.state.id) {
            return <div>Loading..</div>;
        }
        return (
            <div>
                <BrowserRouter>
                    <div className="headerContainer">
                        <Link to="/">
                            <img
                                className="loggedInZucky"
                                src="/zucky.png"
                                alt="Zuck"
                            />
                        </Link>
                    </div>

                    <ProfilePic
                        image={this.state.image}
                        first={this.state.first}
                        last={this.state.last}
                        onClick={() =>
                            this.setState({
                                uploaderIsVisible: true
                            })
                        }
                    />
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            done={image =>
                                this.setState({
                                    image,
                                    uploaderIsVisible: false
                                })
                            }
                        />
                    )}

                    <div>
                        <div className="header">
                            <Link className="headerElements" to="/friends">
                                <p className="headerElements">Friends</p>
                            </Link>
                            <Link className="headerElements" to="/users">
                                <p className="headerElements">Find friends</p>
                            </Link>
                            <Link to="/chat" className="headerElements">
                                Chat
                            </Link>
                            <a href="/logout" className="headerElements">
                                Logout
                            </a>
                            <a
                                href={"/delete/" + this.state.id}
                                className="headerElements"
                            >
                                Delete your account
                            </a>
                        </div>
                        <Route
                            exact
                            path="/"
                            render={props => {
                                return (
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        image={this.state.image}
                                        onClick={this.showUploader}
                                        bio={this.state.bio}
                                        changeBio={bio =>
                                            this.setState({ bio: bio })
                                        }
                                    />
                                );
                            }}
                        />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/friends" component={Friends} />
                        <Route path="/chat" component={Chat} />

                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
