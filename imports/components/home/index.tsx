import * as React from "react";
import Feed from "../posts";

class HomeComponent extends React.PureComponent<{}, {}> {
  public render() {
    return (
      <div>
        <Feed />
      </div>
    );
  }
}

export default HomeComponent;
