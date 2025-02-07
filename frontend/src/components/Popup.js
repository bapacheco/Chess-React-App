import { Button, Modal, Container, Row, Col } from "react-bootstrap";

export default function Popup({ isOpen, onClose, title, onAccept, acceptText, acceptColor, children }) {

    //if isOpen = true, show, otherwise dont show
    //onhide allows user to click anywhere (not in box) to close
    //acceptColor if blank will be blue, otherwise color passed (danger = red)
    return (
        
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                
                    {children}

                
            </Modal.Body>
            <Modal.Footer>
            <Container>
                <Row>

                    <Col md={4}>
                        <Button className="float-end" variant="secondary" size="lg"
                        onClick={onClose}>Close</Button>
                    </Col>
                    <Col></Col>
                    <Col md={4}>
                        <Button className="float-start" variant={acceptColor} size="lg"
                            onClick={onAccept}>{acceptText}</Button>
                    </Col>

                </Row>
            </Container>
            </Modal.Footer>
        </Modal>
    );
}