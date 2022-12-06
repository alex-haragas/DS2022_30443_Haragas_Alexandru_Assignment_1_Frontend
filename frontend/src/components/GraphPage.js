import React, { Component } from "react";
import axios from 'axios';
import { Bar } from 'react-chartjs-2'
import Chart from 'chart.js/auto';


class GraphPage extends Component {
    constructor(props) {
        super(props);
        this.state = { consumptions: [], time: [], chartData: '', id: [], overload: [],device: ''};
        this.username = this.props.match.params.username;
        this.user = JSON.parse(localStorage.getItem('user'));
        this.id = this.props.match.params.id;
        this.date = this.props.match.params.date
    }


    async componentDidMount() {
        if (this.user.username === this.username) {
            axios.get(`http://localhost:8081/device/dev/${this.id}`,{
                headers: { Authorization: "Bearer " + this.user.jwt }
            }).then(response=>response.data).then(
                (data)=>{
                    this.setState({device: data})
                }
            )

            axios.get(`http://localhost:8081/consumption/${this.id}/${this.date}`, {
                headers: { Authorization: "Bearer " + this.user.jwt }
            }).then(response => response.data).then(
                (data) => {
                    this.setState({ consumptions: data.map((d)=> parseFloat(d.value)
                        ), time: data.map((d)=> (d.time)), 
                               overload: data.map((d) => (parseFloat(d.value)>parseFloat(this.state.device.hourlyConsumption))?
                                    d.time
                                    : null)}
                              );
                });
                console.log(this.state.consumptions)
                console.log(this.state.time)
            this.setState({chartData: {
                labels: this.state.time,
                datasets: [{
                    label: 'Consumption',
                    data: this.state.consumptions,
                    backgroundColor: 'blue',
                    borderColor: 'blue',
                    borderWidth: 0.5
                }]
            }})
            // alert(this.state.consumptions.length);
            // this.tableData.hour=this.state.consumptions.map((consumption) => consumption.time);
            // this.tableData.dataset.date=this.state.consumptions.map((consumption) => consumption.value);
        }
        else {
            this.setState({ consumptions: [] });
        }
    }

    getChartData(){
        axios.get(`http://localhost:8081/consumption/${this.id}/${this.date}`, {
            headers: { Authorization: "Bearer " + this.user.jwt }
        }).then(response => response.data).then(
            (data) => {
                this.setState({ consumptions: data.map((d)=> parseFloat(d.value)
                     ), time: data.map((d)=> (d.time)), 
                            overload: data.map((d) => (parseFloat(d.value)>parseFloat(this.state.device.hourlyConsumption))?
                                 d.time
                                 :null)}
                           );
            });
        this.setState({chartData: {
            labels: this.state.time,
            datasets: [{
                label: 'Consumption',
                data: this.state.consumptions,
                backgroundColor: 'blue',
                borderColor: 'blue',
                borderWidth: 0.5
            }]
        }})
        return this.state.id;
        
    }

    render() {
        return (
            <>
                {
                    this.state.consumptions.length === 0 ?
                        <div> Nothing to show</div> :
                        <div>
                        <Bar 
                            key={this.getChartData()}
                            data={this.state.chartData}
                            // Height of graph
                            
                            height={400}
                            options={{
                                responsive:true,
                                maintainAspectRatio: false,
                                
                                legend: {
                                    labels: {
                                        fontSize: 15,
                                    },
                                },
                            }}
                        />
                        </div>
                }
                {
                        this.state.overload.length === 0 ?
                        <div></div>:
                        <div>
                           {this.state.overload.map((overload) => (
                                overload !== null ?
                                <div>Consumption higher that normat at {overload}</div>:<></>))}
                        </div>
                }
            </>
        )

    }
}

export default GraphPage;