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
                <Navbar.Brand>Basic Chess</Navbar.Brand>
                <Nav>
                    {user === undefined ? 
                        <Spinner animation="border" />
                    :
                        <>
                            {user === null ? 
                                    <>
                                        {!disableSignIn &&
                                        <Nav.Item>
                                            <Nav.Link as={NavLink} to={"/login"}> Sign In </Nav.Link>
                                        </Nav.Item>
                                        }
                                    </>

                                :
                                    <Stack direction="horizontal" gap={4}>
                                        <div>Rank: {user.rank}</div>
                                        <div>Games Played: {user.gamesPlayed}</div>
                                        <div>Wins: {user.wins}</div>
                                        <div>Losses: {user.losses}</div>
                                        <div>
                                            <NavDropdown>
                                                <NavDropdown.Item>
                                                    Profile
                                                </NavDropdown.Item>
                                                <NavDropdown.Item onClick={logout}>
                                                    Logout
                                                </NavDropdown.Item>
                                            </NavDropdown>
                                        </div>
                                    </Stack>
                            }
                        </>
                    }
                </Nav>
            </Container>
        </Navbar>
    )
}