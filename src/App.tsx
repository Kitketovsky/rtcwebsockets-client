import { Route, Routes } from "react-router";
import { LoginPage } from "./views/LoginPage/LoginPage";
import { ConversationPage } from "./views/ConversationPage/ConversationPage";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<LoginPage />} />
      <Route path={"/:roomId"} element={<ConversationPage />} />
    </Routes>
  );
}

export default App;
