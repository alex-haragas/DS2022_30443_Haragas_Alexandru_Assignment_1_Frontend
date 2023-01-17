import React, { Component } from "react";
import { Button, ButtonGroup, Card, Form, Table } from 'react-bootstrap';
import axios from 'axios';

class DeviceListAdminPAge extends Component {
    constructor(props) {
        super(props);
        this.state = { devices: [], users: [] , deviceSel: '', addressSel: '',userSel: '', description: '', address: '', hourlyConsumption: '', username: '' };
        this.username = this.props.match.params.username;
        this.user = JSON.parse(localStorage.getItem('user'));
        this.deviceDelete = this.deviceDelete.bind(this);
        this.deviceChange = this.deviceChange.bind(this);
        this.deviceCreate = this.deviceCreate.bind(this);
        this.deviceEdit = this.deviceEdit.bind(this);
    }

    async componentDidMount() {
        if (this.user.username === this.username && this.user.role === 'ADMIN') {
            axios.get("http://localhost:8081/device/all", {
                headers: { Authorization: "Bearer " + this.user.jwt }
            }).then(response => response.data).then(
                (data) => {
                    this.setState({ devices: data });
                });
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

    deviceCreate = event => {
        if (this.user.username === this.username && this.user.role === 'ADMIN') {
            const addVal = {
                description: this.state.description,
                address: this.state.address,
                hourlyConsumption: this.state.hourlyConsumption,
                username: this.state.username
            }
            axios.post("http://localhost:8081/device/add", addVal, {
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

    deviceDelete(device) {
        axios.delete(`http://localhost:8081/device/delete/${device.id}`, {
            headers: { Authorization: "Bearer " + this.user.jwt }
        }).then(response => {
            if (response.data != null) {
                alert("Deleted")
                window.location.reload()
            }
        })
    }

    deviceEdit(device) {
        const modVal = {
            id: device.id,
            description: device.description,
            address: device.address,
            hourlyConsumption: device.hourlyConsumption
        }
        axios.put(`http://localhost:8081/device/update`,modVal, {
            headers: { Authorization: "Bearer " + this.user.jwt }
        }).then(response => {
            if (response.data != null) {
                alert("Changed")
                window.location.reload()
            }
        })
    }



    deviceChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }



    render() {
        return (
            <>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>Add Device</Card.Header>
                    <Card.Body>
                        <Form id="userForm" onSubmit={this.deviceCreate}>
                            <Form.Group controlId="DescriptionGroup">
                                <Form.Label>Description</Form.Label>
                                <Form.Control required type="text" name="description" value={this.state.description}
                                    onChange={this.deviceChange} placeholder="Description" />
                            </Form.Group>
                            <Form.Group controlId="AddressGroup">
                                <Form.Label>Address</Form.Label>
                                <Form.Control required type="text" name="address" value={this.state.address}
                                    onChange={this.deviceChange} placeholder="Address" />
                            </Form.Group>
                            <Form.Group controlId="HCGroup">
                                <Form.Label>Hourly Consumption</Form.Label>
                                <Form.Control required type="text" name="hourlyConsumption" value={this.state.hourlyConsumption}
                                    onChange={this.deviceChange} placeholder="Hourly Consumption" />
                            </Form.Group>
                            <Form.Group controlId="UserGroup">
                                <Form.Control required as='select' name="username" value={this.state.username} onChange={this.deviceChange}>
                                    <option>User</option>
                                    {this.state.users.map((user)=>
                                        user.role !== "admin" ?
                                        <option value={user.username}>
                                            {user.username}
                                        </option>:
                                        <></>)
                                    }
                                </Form.Control>
                            </Form.Group>
                            <Button variant="success" type="submit">
                                Create Device
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
                <div></div>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>Devices</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="SearchUser">
                            <Form.Label>Search Device</Form.Label>
                                <Form.Control required type="text" name="deviceSel" value={this.state.deviceSel}
                                    onChange={this.deviceChange} placeholder="Description" />
                                <Form.Label>Search User</Form.Label>
                                <Form.Control required type="text" name="userSel" value={this.state.userSel}
                                    onChange={this.deviceChange} placeholder="Name" />
                            </Form.Group>
                        </Form>
                        <Table bordered hover striped variant="dark">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Description</th>
                                    <th>Address</th>
                                    <th>Hourly Consumption</th>
                                    <th>User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.devices.length === 0 ?
                                        <tr></tr> :
                                        this.state.devices.map((device) => (
                                                ( !device.user.username.startsWith(this.state.userSel) && this.state.userSel !== "")  &&  ( !device.description.startsWith(this.state.userSel) && this.state.deviceSel !== "")  ?
                                                <tr></tr>:
                                                 <tr>
                                                    <td>
                                                    <ButtonGroup>
                                                        <Button  onClick={() => this.deviceEdit(device)}>
                                                            Edit
                                                        </Button>
                                                        <Button variant="danger" onClick={() => this.deviceDelete(device)}>
                                                            Delete
                                                        </Button> 
                                                    </ButtonGroup>
                                                </td>
                                                <td>
                                                <Form.Control required type="text" name="description" placeholder={device.description} 
                                                    onChange={(event => {device.description = event.target.value})}/>                                                        
                                                </td>
                                                <td>
                                                <Form.Control required type="text" name="address" placeholder={device.address} 
                                                    onChange={(event => {device.address = event.target.value})}/>                                                        
                                                </td>
                                                <td>
                                                <Form.Control required type="text" name="hourlyConsumption" placeholder={device.hourlyConsumption} 
                                                    onChange={(event => {device.hourlyConsumption = event.target.value})}/>                                                        
                                                </td>
                                                <td>
                                                    {device.user.username}
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

export default DeviceListAdminPAge;