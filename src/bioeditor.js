import React from "react";
import axios from "./axios";

export default class Bio extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: null,
            draftBio: ""
        };
    }
    addBio(e) {
        this.draftBio = e.target.value;
        console.log("the value of e: ", e.target.value);
        console.log("this is the draftbio: ", this.draftBio);
    }
    submit() {
        console.log("this is itttt:", this.draftBio);
        axios
            .post("/bio", {
                bio: this.draftBio
            })
            .then(data => {
                console.log("this is data in return: ", data.data);
                this.setState({ editing: false });
                // this.setState({ bio: data.data });
                this.props.changeBio(data.data);
            })
            .catch(err => {
                console.log("the error: ", err.message);
            });
    }

    //two props and two states
    render() {
        return (
            <div>
                {this.props.bio && !this.state.editing && (
                    <div>
                        <p className="bioText">{this.props.bio}</p>
                        <button
                            className="profileButton"
                            onClick={() => this.setState({ editing: true })}
                        >
                            Edit
                        </button>
                    </div>
                )}
                {this.state.editing && (
                    <div>
                        <textarea
                            className="txtarea"
                            onChange={e => this.addBio(e)}
                            name="draftBio"
                        />
                        <button
                            className="profileButton"
                            onClick={() => this.submit()}
                        >
                            save
                        </button>
                    </div>
                )}

                {!this.props.bio && !this.state.editing && (
                    <button
                        className="profileButton"
                        onClick={() => this.setState({ editing: true })}
                    >
                        Add a bio
                    </button>
                )}
            </div>
        );
    }
}
