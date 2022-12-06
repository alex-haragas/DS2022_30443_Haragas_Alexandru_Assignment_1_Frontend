import React, { Component } from "react";
import { Button, ButtonGroup, Card, Form, Table } from 'react-bootstrap';
import axios from 'axios';


class DeviceListClientPage extends Component {
    constructor(props) {
        super(props);
        this.state = { devices: [], deviceSel: '', addressSel: '', selectedDevice: '' , dateSel:'', consumptions: [] };
        // this.tableData ={
        //     label: [],
        //     dataset: [
        //         {
        //             label: 'Values',
        //             data: [],
        //             backgroundColor: 'rgba(255,0,255,0.5)',
        //         }
        //     ],
        // }
        this.username = this.props.match.params.username;
        this.user = JSON.parse(localStorage.getItem('user'));
   
        this.deviceChange = this.deviceChange.bind(this);
        this.selectDevice = this.selectDevice.bind(this);
        this.getConsumtion = this.getConsumtion.bind(this);
    }


    async componentDidMount() {
        if (this.user.username === this.username && this.user.role=== 'CLIENT') {
            axios.get(`http://localhost:8081/device/${this.username}`, {
                headers: { Authorization: "Bearer " + this.user.jwt }
            }).then(response => response.data).then(
                (data) => {
                    this.setState({ devices: data });
                });
        }
        else {
            this.setState({ devices: [] });
        }
    }

    deviceChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }


    selectDevice(device) {
        this.setState({
            selectedDevice: device
        });
    }

    getConsumtion(){
        if (this.user.username === this.username) {
            axios.get(`http://localhost:8081/consumption/${this.state.selectedDevice.id}/${this.state.dateSel}`, {
                headers: { Authorization: "Bearer " + this.user.jwt }
            }).then(response => response.data).then(
                (data) => {
                    this.setState({ consumptions: data });
                });
                // alert(this.state.consumptions.length);
                // this.tableData.hour=this.state.consumptions.map((consumption) => consumption.time);
                // this.tableData.dataset.date=this.state.consumptions.map((consumption) => consumption.value);
                // alert(this.tableData.hour.length);
                
        }
        else {
            this.setState({ consumptions: [] });
        }
    }

    render() {
        return (
            <>
                <Card className={"border border-dark bg-dark text-white"}>
                    <Card.Header>Devices</Card.Header>
                    <Card.Body>
                        <Form>
                            <Form.Group controlId="SearchUser">
                            <Form.Label>Search Device</Form.Label>
                                <Form.Control required type="text" name="deviceSel" value={this.state.deviceSel}
                                    onChange={this.deviceChange} placeholder="Description" />
                            </Form.Group>
                        </Form>
                        <Table bordered hover striped variant="dark">
                            <thead>
                                <tr>
                                    <th>Select</th>
                                    <th>Description</th>
                                    <th>Address</th>
                                    <th>Hourly Consumption</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.devices.length === 0 ?
                                        <tr></tr> :
                                        this.state.devices.map((device) => (
                                                ( !device.description.startsWith(this.state.userSel) && this.state.deviceSel !== "")  ?
                                                <tr></tr>:
                                                 <tr>
                                                 <td>
                                                 <ButtonGroup>
                                                        <Button  onClick={() => this.selectDevice(device)}>
                                                            Select 
                                                        </Button>
                                                    </ButtonGroup>
                                                 </td>
                                                <td>
                                                    {device.description}                                                         
                                                </td>
                                                <td>
                                                    {device.address}                             
                                                </td>
                                                <td>
                                                {device.hourlyConsumption}                                                       
                                                </td>
                                                </tr>
                                        ))
                                }
                            </tbody>
                        </Table>

                       
                    </Card.Body>
                </Card>
                {
                        this.state.selectedDevice!=='' ?
                        <div>
                          {this.state.selectedDevice.description}   
                            <Form.Control type="date" name='dateSel' value={this.state.dateSel}   onChange={this.deviceChange} />
                            <Button onClick={() => this.props.history.push(this.username + '/' + this.state.selectedDevice.id + '/' + this.state.dateSel)}>
                                Show Graph
                            </Button>
        
                        </div>:
                        <div></div>
                         }
            </>
        );

    }

}

export default DeviceListClientPage;