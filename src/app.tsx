import { Home } from "pages/home";
import { NotFound } from "pages/NotFound";
import { Room } from "pages/room";
import Router, { Route } from "preact-router";

export function App() {
  return (
    <Router>
      <Route component={Home} path="/" />
      <Route component={Room} path="/:roomId" />
      <Route component={NotFound} default/>
    </Router>
  );
}
