import React, { Component } from "react";
import { Button, ButtonGroup, Card, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import SockJS from 'sockjs-client';
import {over} from 'stompjs'

var stompClient = null;
class DeviceListClientPage extends Component {
    constructor(props) {
        super(props);
        this.state = { devices: [], deviceSel: '', addressSel: '', selectedDevice: '' , dateSel:'', consumptions: [], mes:'', connected: false};
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
        // this.onMessageRec = this.registerUser.bind(this)
        // this.onMessageRec = this.onConnected.bind(this)
        // this.onMessageRec = this.onError.bind(this)
        // this.onMessageRec = this.getMessageRec.bind(this)

        this.registerUser();


    }


    async componentDidMount() {
        if (this.user.username === this.username && this.user.role=== 'CLIENT') {
            axios.get(`http://localhost:8081/device/${this.username}`, {
                headers: { Authorization: "Bearer " + this.user.jwt }
            }).then(response => response.data).then(
                (data) => {
                    this.setState({ devices: data });
                });
            console.log("did again")
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



    getMessageRec = (payload) => {
        console.log("Something 4")
        let payloadData= JSON.parse(payload.body)
       
        alert(payloadData.mess);
       // this.setState({ mes: payloadData });
    }

    registerUser = () =>{
        let Sock = new SockJS('http://localhost:8081/gs');
        stompClient=over(Sock);
        console.log("Something 1");
        stompClient.connect({},this.onConnected,this.onError)

    }

    onConnected = ()=>{
        if(this.state.connected===false){
            console.log("Something 2");
            stompClient.subscribe('/client/'+this.username+"/warning", this.getMessageRec)

        }
        this.setState({connected:true});
    }

    onError = (err)=>{
        console.log("Something 3");
        this.setState({connected:false});

    }


    render() {
        return (
            <>
                <div>{this.state.mes}</div>
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