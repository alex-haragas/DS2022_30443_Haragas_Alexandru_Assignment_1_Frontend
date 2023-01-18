import React from "react";

import './ChatApp.css';

import { ChatMessage, ReceiveMsgRequest,User, Empty } from "./../chat_pb";
import {ChatServiceClient} from "../chat_grpc_web_pb"
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const client=new ChatServiceClient("http://localhost:8088",null,null);



class ChatApp extends React.Component{
    constructor(props) {
        super(props);
        this.username=this.props.match.params.username;
        this.user = JSON.parse(localStorage.getItem('user'));
        this.id= "1";
        this.client= new ChatServiceClient("http://localhost:8088",null,null);
        this.state = {
          users: [],
          msgList: [],
          submitted: false,
          message: '',
          selUser: '',
        };
        this.messgChange = this.messgChange.bind(this)
      }
    
      componentDidMount() {
        const user=new User();
        const username = this.username;
        user.setId(Date.now())
        user.setName(this.username)
        if(this.user.username === this.username && this.user.role==="CLIENT"){
          this.state.selUser="admin"
        }
        else{
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
        
        this.client.join(user,null,(err,response)=>{
            if(err) {
              console.log(err);
              console.log("HERE");
              return;
            }
            const error = response.getError();
            const msg = response.getMsg();

            if(error===1){
                this.setState({submitted: true})
                return
            }
            this.setState({submitted: true})
        })

        const strRq = new ReceiveMsgRequest();
        strRq.setUser(username);
    
        var chatStream = client.receiveMsg(strRq, {});
        chatStream.on("data", (response) => {
          const from = response.getFrom();
          const msg = response.getMsg();
          const time = response.getTime();
          const to = response.getTo();
          console.log(msg)
          if (from === this.username) {
            this.setState((prevState) => {
              return {
                msgList: [
                  ...prevState.msgList,
                  { from, msg, time, to, mine: true },
                ],
              };
            });
          } else {
            if(this.state.msgList.length!==0){
              if(this.state.msgList[this.state.msgList.length-1].msg==="..."){
                this.state.msgList.pop();
              }
            }
              this.setState((prevState) => {
                  return {
                    msgList: [...prevState.msgList, { from, msg, time, to }],
                }; 
               });
            
          }
        });
    
        chatStream.on("status", function (status) {
          console.log(status.code, status.details, status.metadata);
        });
    
        chatStream.on("end", () => {
          console.log("Stream ended.");
        });
    
        this.getAllUsers();
      }
    
      getAllUsers = () => {
        // client.getAllUsers(new Empty(), null, (err, response) => {
        //   let usersList = response.getUsersList(); 
        //   usersList = usersList
        //     .map((user) => {
        //       return {
        //         id: user.array[0],
        //         name: user.array[1],
        //       };
        //     })
        //     .filter((u) => u.name !== this.username);
        //  this.setUsers(usersList);
        // });
      };

      setUsers = (usersList) => {
        this.state.users=usersList
      }
    
      sendMessage = (message) => {
        const msg = new ChatMessage();
        console.log(message)
        msg.setMsg(message);
        msg.setFrom(this.username);
        msg.setTime(new Date().toLocaleString());
        msg.setTo(this.state.selUser)
    
        client.sendMsg(msg, null, (err,response) => {
          const msg = response.getMsg();

          console.log(msg);
          if(msg==="found"){
            alert("Message sent");
          }
        });

      };

      
    messgChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        if(this.state.message!=="")
          this.sendMessage("...")
    }

    
      render() {   
        if(this.user.username !== this.username) 
        return null
        else
        return (
            <div className="chatpage">
            {
              this.user.role==="ADMIN"?
              <div>
              <div>Select user</div>
              <Form.Group controlId="UserGroup">
              <Form.Control required as='select' name="selUser" value={this.state.selUser} onChange={this.messgChange}>
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
             </div>:
              <div></div>
            }
            <div className="userslist-section">
              <div
                style={{ paddingBottom: "4px", borderBottom: "1px solid darkgray" }}
               >
              {/* //   <div>
              //     <button onClick={()=> this.getAllUsers()}>REFRESH</button>
              //   </div> */}
                <div>
                  <span>
                    Logged in as <b>{this.username}</b>
                  </span>
                </div>
                <Form id="msgForm" >
                            <Form.Group controlId="MsgGroup">
                                <Form.Control required type="text" name="message" value={this.state.message}
                                    onChange={this.messgChange} placeholder="Message" />
                            </Form.Group>
                            <Button variant="success" type="button" onClick={() => this.sendMessage(this.state.message)}>
                                Send Message
                            </Button>
                </Form>
              </div>
            
            </div>
            <div className="chatpage-section">
              {
                this.state.msgList.length===0?
                <div></div>:
                this.state.msgList.map((message) => (
                  ((message.to === this.username && message.from === this.state.selUser )
                    || (message.to === this.state.selUser && message.from ===  this.username && message.msg!=="..."))?
                  message.mine?
                   <div style={{color: "green"}}> {message.msg} </div>:
                   <div style={{color: "red"}}> {message.msg} </div>:
                   <div></div>
                ))
              }
            </div>
        </div>
         );
    }
}

export default ChatApp;