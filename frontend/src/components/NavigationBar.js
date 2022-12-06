import React from "react";

import {Navbar, Nav} from "react-bootstrap";
import {Link} from 'react-router-dom';


class NavigationBar extends React.Component{
    render() {
        return(
            <Navbar bg="dark" variant="dark">
                <Link to={"public/logo192.png"} className="brand">
                    {/* <img src="" width="25" height="25"/> */}
                </Link>
                <Nav className="mr-auto">
                    <Link to={"/LogIn"} className="nav-link">Log In   </Link>
                </Nav>
            </Navbar>
        );
    }
}
export default NavigationBar;

