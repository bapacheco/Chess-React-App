import Navbar  from "react-bootstrap/Navbar";
import { Nav, NavDropdown, Spinner } from "react-bootstrap";
import { NavLink, useLocation } from 'react-router-dom';
//import Spinner from "react-bootstrap/Spinner";
import Container from 'react-bootstrap/Container';
import Stack from 'react-bootstrap/Stack';
import { useUser } from "../contexts/UserProvider";

export default function Header() {
    const { user, logout } = useUser();
    const location = useLocation();
    const { pathname } = location;
    let disableSignIn = false;
    switch (pathname) {
        case '/login':
            disableSignIn = true;
            break;
        default:
            disableSignIn = false;
            break;
    }
    

    return (
        <Navbar className="Header">
            <Container>
                <Navbar.Brand as={NavLink} to={"/"}>Basic Chess</Navbar.Brand>
                <Navbar.Collapse className="justify-content-end">
                    {user === undefined ? 
                        <Spinner animation="border" />
                    :
                        <Nav >
                            {user === null ? 
                                    <>
                                        {!disableSignIn &&
                                            <Nav.Item>
                                                <Nav.Link as={NavLink} to={"/login"}> Sign In </Nav.Link>
                                            </Nav.Item>
                                        }
                                    </>

                                :
                                <NavDropdown title="menu" align="end">
                                    <NavDropdown.Item>
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        Rank: {user.rank}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        Games Played: {user.gamesPlayed}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        Wins: {user.wins}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        Losses: {user.losses}
                                    </NavDropdown.Item>
                                    <NavDropdown.Item onClick={logout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>   
                            }
                        </Nav>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}