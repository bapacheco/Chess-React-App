//library components
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
//self made components
import Header from "./components/Header";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
//pages
import PlayPage from "./pages/PlayPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
//contexts
import UserProvider from "./contexts/UserProvider";
import GameProvider from "./contexts/GameProvider";
import ApiProvider from "./contexts/ApiProvider";
import WebSocketProvider from "./contexts/WebSocketProvider";

export default function App() {
  
  return (
    <Container fluid className="App">
      <BrowserRouter>
        <ApiProvider>
          <UserProvider>
            <GameProvider>
              <Header />
                <Routes>
                  <Route path="/login" element={
                    <PublicRoute><LoginPage/></PublicRoute>  
                    } />
                  <Route path="/sign-up" element={
                    <PublicRoute><SignupPage/></PublicRoute>
                    } />
                  <Route path="/" element={<HomePage/>} />
                    <Route path="*" element={
                      <PrivateRoute>
                        <Routes>
                          <Route path="/play" element={<WebSocketProvider> <PlayPage /> </WebSocketProvider>} />
                          <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                      </PrivateRoute>
                    } />
                </Routes>
              </GameProvider>
          </UserProvider>
        </ApiProvider>
      </BrowserRouter>
    </Container>
  );

}