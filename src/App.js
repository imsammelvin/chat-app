import { useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import ChatScreen from "./screens/chat-screen/ChatScreen";
import LoginScreen from "./screens/login-screen/LoginScreen";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      <Router>
        <Navbar user={user} setUser={setUser} />

        <Switch>
          <Route path="/chat">
            <ChatScreen user={user} setUser={setUser} />
          </Route>

          <Route path="/">
            <LoginScreen user={user} setUser={setUser} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
