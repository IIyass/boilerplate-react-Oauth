import React from "react";

export default class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profil: null,
      error: "",
    };
  }

  componentDidMount() {
    this.loadUserProfil();
  }

  loadUserProfil = () => {
    this.props.auth.getProfile((profil, error) =>
      this.setState({ profil, error })
    );
  };
  render() {
    const { profil } = this.state;
    if (!profil) return null;
    return (
      <>
        <h1>Profil</h1>
        <p>{profil.mickname}</p>
        <img
          style={{ maxWidth: 50, maxHeight: 50 }}
          src={profil.picture}
          alt="Profil pic"
        />
        <pre>{JSON.stringify(profil, null, 2)}</pre>
      </>
    );
  }
}
