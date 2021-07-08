import React from "react";
import axios from "axios";

class Courses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  componentDidMount() {
    axios
      .get("/admin", {
        headers: {
          Authorization: `Bearer ${this.props.auth.getAccesToken()}`,
        },
      })
      // we used proxy in package.json
      .then((res) => {
        this.setState({ message: res.data.message });
      })
      .catch((err) => {
        this.setState({ message: err });
      });
  }
  render() {
    return <>{this.state.message}</>;
  }
}
export default Courses;
