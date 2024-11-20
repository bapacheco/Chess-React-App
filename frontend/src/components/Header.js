import Navbar  from "react-bootstrap/Navbar";
import Container from 'react-bootstrap/Container';

export default function Header() {

    return (
        <Navbar className="Header">
            <Container>
                <Navbar.Brand>Basic Chess</Navbar.Brand>
            </Container>
        </Navbar>
    )
}