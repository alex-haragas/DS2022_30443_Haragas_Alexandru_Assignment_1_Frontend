import React from "react";
import {Nav, Navbar} from "react-bootstrap";
import {Link} from "react-router-dom";



class AdminPage extends React.Component{
    constructor(props) {
        super(props);
        this.username=this.props.match.params.username;
    }


    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Nav className="mr-auto">
                    <Link to={this.username+"/users"} className="nav-link">See Users  </Link>
                    <Link to={this.username+"/device"} className="nav-link">See Devices </Link>

                </Nav>
            </Navbar>
        );
    }
}

export default AdminPage;