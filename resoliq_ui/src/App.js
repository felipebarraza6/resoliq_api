import React, { createContext, useReducer, useEffect } from "react";
import "./assets/App.css";
import { Layout } from "antd";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Login from "./containers/Login";
import Home from "./containers/Home";
import { appReducer } from "./reducers/appReducer";
export const AppContext = createContext();

function App() {
  const initialState = {
    isAuth: false,
    token: null,
    user: null,
  };

  const [state, dispatch] = useReducer(appReducer, initialState);

  const updateApp = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      dispatch({
        type: "LOGIN",
        payload: { token, user },
      });
    }
  };

  useEffect(() => {
    updateApp();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="App">
        <Layout style={{ minHeight: "100vh" }}>
          <Router>
            <Routes>
              {state.isAuth ? (
                <Route index path="/" element={<Home />} />
              ) : (
                <Route exact path="/" element={<Login />} />
              )}
            </Routes>
          </Router>
        </Layout>
      </div>
    </AppContext.Provider>
  );
}

export default App;
