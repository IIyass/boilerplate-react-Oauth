import React from "react";
import axios from "axios";

class Courses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courses: [],
    };
  }

  componentDidMount() {
    axios
      .get("/course", {
        headers: {
          Authorization: `Bearer ${this.props.auth.getAccesToken()}`,
        },
      })
      // we used proxy in package.json
      .then((res) => {
        this.setState({ courses: res.data.courses });
      })
      .catch((err) => {
        this.setState({ courses: err.message });
      });
    // To test What role have this who check this Courses Admin Or User
  }
  render() {
    return (
      <ul>
        {this.state.courses.map((e) => {
          return <li key={e.id}>{e.title}</li>;
        })}
      </ul>
    );
  }
}
export default Courses;
