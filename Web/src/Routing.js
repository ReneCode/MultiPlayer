import React from "react";
import { Route, Switch } from "react-router-dom";
import App from "./App";

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={App}></Route>
      <Route exact path="/:id" component={App}></Route>
    </Switch>
  );
};

export default Routing;
