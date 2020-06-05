import React from "react";
import { Route, Switch } from "react-router-dom";
import App from "./components/App";
import Home from "./components/Home";

const Routing = () => {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/g/:id" component={App}></Route>
    </Switch>
  );
};

export default Routing;
