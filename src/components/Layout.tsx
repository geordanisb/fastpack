import React from "react";
import { Container, Navbar, Nav } from "react-bootstrap";

interface Props {
    children: JSX.Element;
}
const Layout: React.FC<Props> = ({children})=>{
    return <Container>
        <Navbar bg="primary" variant="dark">
            <Container>
                <Navbar.Brand href="/">Fastpack Inc.</Navbar.Brand>
                <Nav className="me-auto">
                {/* <Nav.Link href="#aboutUs">About us</Nav.Link> */}
                </Nav>
            </Container>
        </Navbar>
        <section className="p-3">
            {children}
        </section>
    </Container>
};
export default Layout;