import React from "react";
import axios from "axios";

class Private extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
    };
  }

  componentDidMount() {
    axios
      .get("/private", {
        headers: {
          Authorization: `Bearer ${this.props.auth.getAccesToken()}`,
        },
      })
      // we used proxy in package.json
      .then((res) => {
        this.setState({ message: res.data.message });
      })
      .catch((err) => {
        this.setState({ message: err.message });
      });
  }
  render() {
    return <>{this.state.message}</>;
  }
}
export default Private;
