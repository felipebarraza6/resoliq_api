import React, { createContext, useReducer, useEffect } from "react";
import "./assets/App.css";
import { Layout, ConfigProvider } from "antd";
import esES from "antd/locale/es_ES";
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
    <ConfigProvider
      locale={esES}
      theme={{
        token: {
          colorPrimary: '#030852', // Dark blue from the logo
          colorInfo: '#030852',
          borderRadius: 6,
          fontFamily: "'Inter', 'San Francisco', sans-serif",
        },
        components: {
          Layout: {
            headerBg: '#ffffff',
            siderBg: '#030852', // Sidebar background
          },
          Menu: {
            darkItemBg: '#030852',
            darkItemSelectedBg: '#1890ff',
          },
          Card: {
            boxShadowTertiary: '0 4px 12px rgba(0,0,0,0.08)',
          },
          Button: {
            colorPrimary: '#030852',
            colorPrimaryHover: '#13217d',
            colorPrimaryActive: '#010433',
          }
        },
      }}
    >
      <AppContext.Provider value={{ state, dispatch }}>
        <div className="App fade-in">
          <Layout style={{ minHeight: "100vh" }}>
            <Router>
              <Routes>
                {state.isAuth ? (
                  <>
                    <Route index path="/" element={<Home />} />
                    <Route path="*" element={<Home />} />
                  </>
                ) : (
                  <>
                    <Route exact path="/" element={<Login />} />
                    <Route path="*" element={<Login />} />
                  </>
                )}
              </Routes>
            </Router>
          </Layout>
        </div>
      </AppContext.Provider>
    </ConfigProvider>
  );
}

export default App;
