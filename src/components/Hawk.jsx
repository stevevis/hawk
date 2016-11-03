import "./Hawk.scss";
import React from "react";

class Hawk extends React.Component {
  render() {
    let myarray = ["a", "b"];
    let myother = { aaa: "a", bbb: "b" };

    myarray = myother;
    myother = myarray;

    return (
      <div className="hawk-wrapper">
        <h1>Hello Hawk!</h1>
        <div className="hawk-image"></div>
        <div className="alert alert-info" role="alert">
          <strong>Well done!</strong> Looks like everything is working.
        </div>
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
            Dropdown
          </button>
          <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
          </div>
        </div>
      </div>
    );
  }
}

export default Hawk;
