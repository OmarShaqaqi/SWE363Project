import React from "react";
import Footer from "./Footer"
import Login from "./Login";
import Register from "./Register";
import Main from "./Main";
import {
  BrowserRouter,
  Routes,Route
} from "react-router-dom";

import Profile from "./Profile";
import FriendManager from "./Friends";
import ChartPage from "./ChartPage"



function App() {
  return (
    <div className="body">


      <BrowserRouter>
      <Routes>
      <Route path="/profile" element={<Profile />}/>
        <Route path="/main" element={<Main />}/>
        <Route path="/chart" element={<ChartPage />}/>
        <Route path="/" element={<Login />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/friend" element={<FriendManager />}/>
      </Routes>
      </BrowserRouter>
      <div className="toDOandHabitDiv">
      </div>
      <Footer />
     </div>
  );
}

export default App;
