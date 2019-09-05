//copy paste the form data for uploading
//multer, form data, s3, the difference is we do not insert a new row, we update the users row of the imgurl
//we are sending only the file as a form data hwere id is userId
//needs to send a function to the parent when click on X to close the modal
import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleUpload(e) {
        console.log(e.target.files[0]);
        const url = e.target.files[0];
        var formData = new FormData();
        formData.append("file", url);
        axios.post("/updateImage", formData).then(results => {
            console.log("the ressssuuuults:", results.data);
            this.props.done(results.data);
        });
    }

    render() {
        return (
            <div>
                <div className="modal">
                    <input
                        name="file"
                        type="file"
                        accept="image/*"
                        onChange={e => this.handleUpload(e)}
                    />
                </div>
            </div>
        );
    }
}
