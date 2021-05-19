import React from "react";
import { CircularProgress } from "@material-ui/core";

export class CoverLoader extends React.Component {
  render() {
    return (
      <div className="cover-loader">
        <div className="loader">
          <CircularProgress />
        </div>
      </div>
    );
  }
}
