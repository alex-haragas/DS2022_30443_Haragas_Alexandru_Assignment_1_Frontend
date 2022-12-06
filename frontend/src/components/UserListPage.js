import React, { Component } from "react";
import { Button, ButtonGroup, Card, Form, Table } from 'react-bootstrap';
import axios from 'axios';

class UserListPage extends Component {
    constructor(props) {
        super(props);
        this.state = { users: [], userSel: '', userRoleSel: '', username: '', password: '', role: '' };
        this.username = this.props.match.params.username;
        this.user = JSON.parse(localStorage.getItem('user'));
        this.userDelete = this.userDelete.bind(this);
        this.userChange = this.userChange.bind(this);
        this.userCreate = this.userCreate.bind(this);
        this.userEdit = this.userEdit.bind(this);
    }

    async componentDidMount() {
        if (this.user.username === this.username && this.user.role === 'ADMIN') {
            axios.get("http://localhost:8081/user/all", {
                headers: { Authorization: "Bearer " + this.user.jwt }
            }).then(response => response.data).then(
                (data) => {
                    this.setState({ users: data });
                });
        }
        else {
            this.setState({ users: [] });
        }
    }

    userCreate = event => {
        if (this.user.username === this.username && this.user.role === 'ADMIN') {
            const addVal = {
                username: this.state.username,
                password: this.state.password,
                role: this.state.role
            }
            axios.post("http://localhost:8081/user/add", addVal, {
                headers: { Authorization: "Bearer " + this.user.jwt }
            }).then(response => {
                console.log(response.status);
                alert(response.data);
            }
            )
                .catch(error => {
                    alert(error);
                });

            event.preventDefault();
        }
    }

    userDelete(user) {
        axios.delete(`http://localhost:8081/user/delete/${user.id}`, {
            headers: { Authorization: "Bearer " + this.user.jwt }
        }).then(response => {
            if (response.data != null) {
                alert("Changed")
                window.location.reload()
            }
        })
    }

    userEdit(user) {
        const modVal = {
            id: user.id,
            username: user.username,
            password: user.password,
        }
        axios.put(`http://localhost:8081/user/update`,modVal, {
            headers: { Authorization: "Bearer " + this.user.jwt }
        }).then(response => {
            if (response.data != null) {
                alert("Changed")
                window.location.reload()
            }
        })
    }



    userChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }



    render() {
        return (
            <>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>Add User</Card.Header>
                    <Card.Body>
                        <Form id="userForm" onSubmit={this.userCreate}>
                            <Form.Group controlId="UserGroup">
                                <Form.Label>Username</Form.Label>
                                <Form.Control required type="text" name="username" value={this.state.username}
                                    onChange={this.userChange} placeholder="Name" />
                            </Form.Group>
                            <Form.Group controlId="PasswordGroup">
                                <Form.Label>Password</Form.Label>
                                <Form.Control required type="text" name="password" value={this.state.password}
                                    onChange={this.userChange} placeholder="Password" />
                            </Form.Group>
                            <Form.Group controlId="RoleGroup">
                                <Form.Select name="role" value={this.state.role} onChange={this.userChange}>
                                    <option>Role</option>
                                    <option value="client">Client</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                            <Button variant="success" type="submit">
                                Create User
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div></div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>Users</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="SearchUser">
                                <Form.Label>Search User</Form.Label>
                                <Form.Control required type="text" name="userSel" value={this.state.userSel}
                                    onChange={this.userChange} placeholder="Name" />
                                <Form.Select name="userRoleSel" value={this.state.userRoleSel} onChange={this.userChange}>
                                    <option value="default">Role</option>
                                    <option value="client">Client</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                        </Form>
                        <Table bordered hover striped variant="dark">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Username</th>
                                    <th>Encrypted Password</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.users.length === 0 ?
                                        <tr></tr> :
                                        this.state.users.map((user) => (
                                                ( !user.username.startsWith(this.state.userSel) && this.state.userSel !== "")  &&  (user.role !== this.state.userRoleSel && this.state.userRoleSel !== "default" ) ?
                                                <tr></tr>:
                                                 <tr>
                                                    <td>
                                                    <ButtonGroup>
                                                        <Button  onClick={() => this.userEdit(user)}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="danger" onClick={() => this.userDelete(user)}>
                                                            Delete
                                                        </Button> 
                                                    </ButtonGroup>
                                                </td>
                                                <td>
                                                <Form.Control required type="text" name="username" placeholder={user.username} 
                                                    onChange={(event => {user.username = event.target.value})}/>                                                        
                                                </td>
                                                <td>
                                                <Form.Control required type="text" name="password" placeholder={user.password} 
                                                    onChange={(event => {user.password = event.target.value})}/>  
                                                </td>
                                                <td>
                                                    {user.role}
                                                </td>
                                                </tr>
                                        ))
                                }
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

            </>
        );

    }

}

export default UserListPage;