import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import './index.css';

const { Search } = Input;
const { Text } = Typography;
const {Meta} = Card;

const client = new W3CWebSocket('ws://127.0.0.1:8000');

export default class App extends Component {

    state = {
        userName: '',
        isAuthenticated: false,
        messages: []
    }

    componentDidMount() {
        client.onopen = () => {
            console.log('Websocket Client Connected')
        }

        client.onmessage = message => {
            // console.log();
            const dataFromServer = JSON.parse(message.data);
            // console.log(dataFromServer);
            if(dataFromServer.type === 'message') {
                this.setState(state => ({
                    messages: [...state.messages, {
                        msg: dataFromServer.msg,
                        user: dataFromServer.user
                    }]
                }));
            }
        }
    }

    onButtonClicked = (message) => {
        client.send(JSON.stringify({
            type: 'message',
            msg: message,
            user: this.state.userName
        }));
        this.setState({searchVal: ''});
    }

    render() {
        return (
            <div className="main">
                {
                    this.state.isAuthenticated ? 
                        <div>
                            <div className="title">
                                <Text type="secondary" style={{ fontSize: '36px' }}>WebSocket Chat: {this.state.userName}</Text>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages">
                                {this.state.messages.map(message => 
                                <Card key={message.msg} style={{ width: 300, margin: '16px 4px 0 4px', alignSelf: this.state.userName === message.user ? 'flex-end' : 'flex-start' }} loading={false}>
                                    <Meta
                                    avatar={
                                        <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>{message.user[0].toUpperCase()}</Avatar>
                                    }
                                    title={message.user+":"}
                                    description={message.msg}
                                    />
                                </Card> 
                                )}
                            </div>
                            <div className="bottom">
                                <Search
                                placeholder="Type your message"
                                enterButton="Send"
                                value={this.state.searchVal}
                                size="large"
                                onChange={(e) => this.setState({ searchVal: e.target.value })}
                                onSearch={value => this.onButtonClicked(value)}
                                />
                            </div>
                        </div>
                        :
                        <div style={{ padding: '200px 40px' }}>
                            <Search
                            placeholder="Enter Username"
                            enterButton="Login"
                            size="large"
                            onSearch={value => this.setState({ isAuthenticated: true, userName: value })}
                            />
                        </div>
                }
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));