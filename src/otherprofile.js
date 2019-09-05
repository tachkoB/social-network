import React from "react";
import axios from "./axios";
import ProfilePic from "./profilepic.js";
import FriendButton from "./friendbutton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        axios.get(`/user/${id}.json`).then(results => {
            console.log("the res json from other users: ", results);
            this.setState(results.data);
            console.log("setting the state: ", results.data);
        });
    }

    render() {
        return (
            <div className="gridElement">
                <div className="bigPicture">
                    <ProfilePic
                        image={this.state.image}
                        first={this.state.first}
                        last={this.state.last}
                        onClick={this.state.onClick}
                    />
                    <div className="yo">
                        <p className="what">
                            {this.state.first} {this.state.last}
                        </p>
                        <p className="bioText"> {this.state.bio}</p>
                        <br />
                        <FriendButton
                            otherProfile={this.props.match.params.id}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
