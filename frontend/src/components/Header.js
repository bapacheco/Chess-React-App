import Navbar  from "react-bootstrap/Navbar";
import { Nav, NavDropdown } from "react-bootstrap";
import { NavLink, useLocation } from 'react-router-dom';
import Spinner from "react-bootstrap/Spinner";
import Container from 'react-bootstrap/Container';
import { useUser } from "../contexts/UserProvider";

export default function Header() {
    const { user } = useUser();
    const location = useLocation();
    const { pathname } = location;
    let disableSignIn = false;
    switch (pathname) {
        case '/login':
        case '/sign-up':
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
                    {(user === null || user === undefined) && !disableSignIn ? 
                        <Nav.Item>
                            <Nav.Link as={NavLink} to={"/login"}> Sign In </Nav.Link>
                        </Nav.Item>
                    :
                        <>
                            {user !== null && 
                                <div>
                                <NavDropdown>
                                    <NavDropdown.Item>
                                        Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                                </div>
                            }
                        </>
                    }
                </Nav>
            </Container>
        </Navbar>
    )
}