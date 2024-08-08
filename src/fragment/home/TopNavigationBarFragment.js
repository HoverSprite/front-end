import './TopNavigationBarFragment.css';
import Nav from 'react-bootstrap/Nav';

function TopNavigationBarFragment() {
    return (
        <div className="content-container">
            <div className="nav-container">
                <Nav className="left-nav" activeKey="/">
                    <Nav.Item>
                        <Nav.Link href="/">Name</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Nav className="center-nav">
                    <Nav.Item>
                        <Nav.Link eventKey="link-1">Services</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1">API</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1">Pricing</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="link-1">About</Nav.Link>
                    </Nav.Item>
                </Nav>

                <Nav className="right-nav">
                    <Nav.Item>
                        <Nav.Link href="/login">Sign In</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link href="/signup">Sign Up</Nav.Link>
                    </Nav.Item>
                </Nav>
            </div>
        </div>
    );
}

export default TopNavigationBarFragment;