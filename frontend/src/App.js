import './App.css';
import React from "react";

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';
import {Container,Row,Col} from "react-bootstrap";
import NavigationBar from "./components/NavigationBar";
import LogIn from "./components/LogIn";
import AdminPage from "./components/AdminPage";
import UserListPage from './components/UserListPage';
import DeviceListAdminPAge from './components/DeviceListAdminPage';
import DeviceListClientPage from './components/DeviceListClientPage';
import GraphPage from './components/GraphPage';
import ChatApp from './components/ChapApp';

function App() {
  const marginTop={marginTop:"20px"};

  return (
      <Router>
        <NavigationBar/>
        <Container>
          <Row>
            <Col lg={12} style={marginTop}>
              <Switch>
                <Route path='/LogIn' exact component={LogIn}/>
                <Route path='/admin/:username' exact component={AdminPage }/>
                <Route path='/admin/:username/users' exact component={UserListPage}/>
                <Route path='/admin/:username/device' exact component={DeviceListAdminPAge}/>
                <Route path='/client/:username/' exact component={DeviceListClientPage}/>
                <Route path='/client/:username/:id/:date' exact component={GraphPage}/>
                <Route path='/client/:username/chat' exact component={ChatApp}/>
                <Route path='/admin/:username/chat' exact component={ChatApp}/>
                <Route path='*' exact component={LogIn}/>
              </Switch>
            </Col>
          </Row>
        </Container>
      </Router>
  );
}

export default App;
