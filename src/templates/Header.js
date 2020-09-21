import React from 'react';
import { hashHistory, Link } from "react-router";
import { Menu, Icon, Dropdown, Modal, message, Row, Col, Input } from 'antd';
import {useFetchGet, useFetchPost, useXMLHttpRequest} from '../utils/HttpRequestUtil';
import Footer from "./Footer";
import "../css/header.css";

const { Search } = Input;

class Header extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            currentMenu: "",
            //用户登录状态和用户信息
            isLogin: false,
            username: "",
            email: "",
            //注册相关
            registerModalVisible: false,
            //登录相关
            loginModalVisible: false,
            loginMail: "",
            loginPassword: "",
            loginEmailAlert: <br/>,
            loginPasswordAlert: <br/>,
            //修改密码相关
            passwordModifyModalVisible: false,
            oldPassword: "",
            newPassword: "",
            newPasswordAgain: "",
            oldPasswordAlert: <br/>,
            newPasswordAlert: <br/>,
            newPasswordAgainAlert: <br/>,
            //搜索相关
            searchContent: "",
            searchIsLoading: false
        }
    }

    componentWillMount(){
        let isLogin = localStorage.getItem("isLogin");
        if(isLogin){
            this.setState({
                isLogin: true,
                username: localStorage.getItem("username"),
                currentMenu: localStorage.getItem("currentMenu"),
            })
        }else{
            this.setState({
                isLogin: false,
                username: "未登录",
                currentMenu: localStorage.getItem("currentMenu"),
            })
        }
    }

    //点击菜单栏
    handleClick(e){
        this.setState({
            currentMenu: e.key,
        });
        localStorage.setItem("currentMenu",e.key);
    }

    //处理右上角用户下拉菜单
    handleUserMenu(e){
        switch (e.key){
            case "login": this.setLoginModalVisible(true);break;
            case "register": this.setRegisterModalVisible(true);break;
            case "modifyPassword": this.setPasswordModifyModalVisible(true);break;
            case "logout": this.handleLogout();break;
            default: break;
        }
    }

    //处理注册事件
    handleRegister(){

    }

    //处理登录事件
    handleLogin(){
        let flag = false;
        if(this.state.loginMail === ""){
            flag = true;
            this.setState({
                loginEmailAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>邮箱不能为空</span></Col>
                </Row>
            })
        }
        if(this.state.loginPassword === ""){
            flag = true;
            this.setState({
                loginPasswordAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>密码不能为空</span></Col>
                </Row>
            })
        }
        if(flag){
            return;
        }
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(reg.test(this.state.loginMail)){
            this.setState({
                loginEmailAlert: <br/>
            })
        }else{
            this.setState({
                loginEmailAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>邮箱格式不正确</span></Col>
                </Row>
            })
            return;
        }
        let jsonObj = {
            email: this.state.loginMail,
            password: this.state.loginPassword,
        };

        useFetchPost("/login", jsonObj).then(res => res.json()).then(resObj => {
            if(resObj.code === "100"){
                message.success("登录成功！");
                localStorage.setItem("isLogin", true);
                localStorage.setItem("username", resObj.username);
                this.setState({
                    loginModalVisible: false,
                    isLogin: true,
                    username: resObj.username
                })
            }else if(resObj.code === "102"){
                message.warning("该用户已经登录！");
            }else{
                message.warning("没有该用户或未知错误");
            }
        }).catch(err => {
            console.error("登录时出错，", err.message);
        })

        // const header = {
        //     method: "POST",
        //     url: "/login"
        // }
        // useXMLHttpRequest(header, jsonObj, (responseObj) => {
        //     if(responseObj.code === "100"){
        //         message.success("登录成功！");
        //         localStorage.setItem("isLogin", true);
        //         localStorage.setItem("username", responseObj.username);
        //         this.setState({
        //             loginModalVisible: false,
        //             isLogin: true,
        //             username: responseObj.username
        //         })
        //     }else if(responseObj.code === "102"){
        //         message.warning("该用户已经登录！");
        //     }else{
        //         message.warning("没有该用户或未知错误");
        //     }
        // }).bind(this);

        // let jsonString = JSON.stringify(jsonObj);
        // let xmlhttp;
        // xmlhttp = new XMLHttpRequest();
        // xmlhttp.onreadystatechange = function () {
        //     if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        //         let responseObj = JSON.parse(xmlhttp.responseText);
        //         if(responseObj.code === "100"){
        //             message.success("登录成功！");
        //             localStorage.setItem("isLogin", true);
        //             localStorage.setItem("username", responseObj.username);
        //             this.setState({
        //                 loginModalVisible: false,
        //                 isLogin: true,
        //                 username: responseObj.username
        //             })
        //         }else if(responseObj.code === "102"){
        //             message.warning("该用户已经登录！");
        //         }else{
        //             message.warning("没有该用户或未知错误");
        //         }
        //     }
        // }.bind(this);
        // xmlhttp.open("POST","/login",true);
        // xmlhttp.setRequestHeader("Content-Type","application/json");
        // xmlhttp.send(jsonString);
    }

    //处理登出事件
    handleLogout(){
        useFetchGet("/logout").then(res => res.json()).then(resObj => {
            if(resObj.code === "103"){
                message.success("退出成功！");
                localStorage.clear();
                this.setState({
                    isLogin: false,
                    username: "未登录"
                })
                hashHistory.push({
                    pathname: "/homePage"
                })
            }else{
                message.warning("操作失败！");
                message.warning(resObj.message);
            }
        }).catch(err => {
            console.error("登出时出错，", err.message);
        })

        // let xmlhttp;
        // xmlhttp = new XMLHttpRequest();
        // xmlhttp.onreadystatechange = function(){
        //     if(xmlhttp.readyState === 4&&xmlhttp.status === 200){
        //         let responseObj = JSON.parse(xmlhttp.responseText);
        //         if(responseObj.code === "103"){
        //             message.success("退出成功！");
        //             localStorage.clear();
        //             this.setState({
        //                 isLogin: false,
        //                 username: "未登录"
        //             })
        //             hashHistory.push({
        //                 pathname: "/homePage"
        //             })
        //         }else{
        //             message.warning("操作失败！");
        //             message.warning(responseObj.message);
        //         }
        //     }
        // }.bind(this);
        // xmlhttp.open("GET","/logout",true);
        // xmlhttp.setRequestHeader("Content-Type","application/json");
        // xmlhttp.send();
    }

    //修改密码事件
    handlePasswordModify(){
        const State = this.state;
        if(State.oldPassword!==""&&State.newPassword!==""&&State.newPasswordAgain!==""&&State.newPassword===State.newPasswordAgain){
            let jsonObj = {
                email: State.email,
                password: State.newPassword
            };
            useFetchPost("/updatePassword", jsonObj).then(res => res.json()).then(resObj => {
                if(resObj.code === "209"){
                    message.success("修改成功！请重新登录！");
                    localStorage.clear();
                    hashHistory.push({
                        pathname: "/homePage"
                    })
                }else{
                    message.warning(resObj.message);
                }
            }).catch(err => {
                console.error("修改密码失败，", err.message)
            })

            // const header = {
            //     method: "POST",
            //     url: "/updatePassword"
            // }
            // useXMLHttpRequest(header, jsonObj, (responseObj) => {
            //     if(responseObj.errcode === "000"){
            //         message.success("修改成功！请重新登录！");
            //         localStorage.clear();
            //         hashHistory.push({
            //             pathname: "/"
            //         })
            //     }else{
            //         message.warning(responseObj.errcontent);
            //     }
            // }).bind(this);

            // let jsonString = JSON.stringify(jsonObj);
            // let xmlhttp;
            // xmlhttp = new XMLHttpRequest();
            // xmlhttp.onreadystatechange = function () {
            //     if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            //         let responseObj = JSON.parse(xmlhttp.responseText);
            //         if(responseObj.errcode === "000"){
            //             message.success("修改成功！请重新登录！");
            //             localStorage.clear();
            //             hashHistory.push({
            //                 pathname: "/"
            //             })
            //         }else{
            //             message.warning(responseObj.errcontent);
            //         }
            //     }
            // }.bind(this);
            // xmlhttp.open("POST","/user/changepassword",true);
            // xmlhttp.setRequestHeader("Content-Type","application/json");
            // xmlhttp.send(jsonString);
        }
    }

    //搜索
    handleSearch(){
        this.setState({
            searchIsLoading: true,
        })
        window.open("/#/searchPage")
        this.setState({
            searchIsLoading: false,
        })
    }

    //三个模态框的显示函数，value为true时显示，false则隐藏
    setRegisterModalVisible(value){
        this.setState({
            registerModalVisible: value
        });
    }
    setLoginModalVisible(value){
        this.setState({
            loginModalVisible: value,
            loginUsername: "",
            loginPassword: ""
        });
    }
    setPasswordModifyModalVisible(value){
        this.setState({
            passwordModifyModalVisible: value,
            oldPassword: "",
            newPassword: "",
            newPasswordAgain: "",
            oldPasswordAlert: <br/>,
            newPasswordAlert: <br/>,
            newPasswordAgainAlert: <br/>,
        });
    }

    //处理登录模态框中的各种change blur事件等等
    handleLoginEmailChange(e){
        this.setState({
            loginMail: e.target.value,
        });
    }
    handleLoginPasswordChange(e){
        this.setState({
            loginPassword: e.target.value,
        })
    }
    handleLoginEmailBlur(e){
        let email = e.target.value;
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(reg.test(email)){
            this.setState({
                loginEmailAlert: <br/>
            })
        }else{
            this.setState({
                loginEmailAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>邮箱格式不正确</span></Col>
                </Row>
            })
        }
    }
    handleLoginPasswordBlur(e){
        if(e.target.value === ""){
            this.setState({
                loginPasswordAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>密码不能为空</span></Col>
                </Row>
            })
        }else{
            this.setState({
                loginPasswordAlert: <br/>
            })
        }
    }

    //处理修改密码模态框中的各种事件
    handlePasswordModifyOldChange(e){
        this.setState({
            oldPassword: e.target.value,
        });
    }
    handlePasswordModifyNewChange(e){
        this.setState({
            newPassword: e.target.value,
        });
    }
    handlePasswordModifyNewAgainChange(e){
        this.setState({
            newPasswordAgain: e.target.value,
        });
    }
    handlePasswordModifyOldBlur(e){
        if(e.target.value === ""){
            this.setState({
                oldPasswordAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>请填写旧密码</span></Col>
                </Row>
            })
        }else{
            this.setState({
                oldPasswordAlert: <br/>
            })
        }
    }
    handlePasswordModifyNewBlur(e){
        if(e.target.value === ""){
            this.setState({
                newPasswordAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>请填写新密码</span></Col>
                </Row>
            })
        }else if(this.state.newPassword !== this.state.newPasswordAgain){
            this.setState({
                newPasswordAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>新旧密码不一致</span></Col>
                </Row>
            })
        }else{
            this.setState({
                newPasswordAlert: <br/>
            })
        }
    }
    handlePasswordModifyNewAgainBlur(e){
        if(e.target.value === ""){
            this.setState({
                newPasswordAgainAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>请重新填写新密码</span></Col>
                </Row>
            })
        }else if(this.state.newPassword !== this.state.newPasswordAgain){
            this.setState({
                newPasswordAgainAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>新旧密码不一致</span></Col>
                </Row>
            })
        }else{
            this.setState({
                newPasswordAgainAlert: <br/>
            })
        }
    }

    //处理搜索相关的事件，例如change blur等
    handleSearchChange(e){
        this.setState({
            searchContent: e.target.value,
        });
    }

    render(){
        const pointer = this;
        let userMenu;
        const clientHeight = document.body.clientHeight;
        const MenuStyle = {
            backgroundColor: "rgb(250,244,244)",
        };
        const SearchStyle = {
            display: "block",
            width: "30%",
            position: "absolute",
            top: "9px",
            left: "690px"
        }
        if(this.state.isLogin){
            userMenu = (
                <Menu onClick={this.handleUserMenu.bind(this)}>
                    <Menu.Item key="modifyPassword"><Icon type="edit" />&nbsp;修改登录密码</Menu.Item>
                    <Menu.Item key="logout"><Icon type="logout" />&nbsp;登出</Menu.Item>
                </Menu>
            );
        }else{
            userMenu = (
                <Menu onClick={this.handleUserMenu.bind(this)}>
                    <Menu.Item key="login"><Icon type="login" />&nbsp;登录</Menu.Item>
                    <Menu.Item key="register"><Icon type="form" />&nbsp;注册</Menu.Item>
                </Menu>
            );
        }
        document.onkeydown = function (e){
            console.log("start")
            event = window.event||e;
            let key=event.keyCode;
            console.log("middle")
            if(key === 13&& pointer.state.registerModalVisible === true){
                pointer.handleRegister();
                console.log("registerModalVisible")
            }
            if(key === 13&& pointer.state.loginModalVisible === true){
                pointer.handleLogin();
                console.log("loginModalVisible")
            }
            if(key === 13&& pointer.state.passwordModifyModalVisible === true){
                pointer.handlePasswordModify();
                console.log("passwordModifyModalVisible")
            }
            console.log("end")
        }
        return(
            <div className="homepageDiv" style={{height: clientHeight}}>
                <Modal
                    title="注册"
                    style={{ top: 50 }}
                    visible={this.state.registerModalVisible}
                    onOk={this.handleRegister()}
                    onCancel={() => this.setRegisterModalVisible(false)}
                    okText="注册"
                    cancelText="取消"
                >
                    <Row>
                        <Col span={5}>邮箱：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入邮箱账号"
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={5}>2333：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入用户名"
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={5}>2333：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入您的用户名"
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={5}>2333：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入您的用户名"
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={5}>2333：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入您的用户名"
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={5}>2333：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入您的用户名"
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={5}>2333：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入您的用户名"
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={5}>2333：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入您的用户名"
                            />
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col span={5}>2333：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginUsername}
                                placeholder="请输入您的用户名"
                            />
                        </Col>
                    </Row>
                    <br/>
                </Modal>
                <Modal
                    title="登录"
                    style={{ top: 50 }}
                    visible={this.state.loginModalVisible}
                    onOk={this.handleLogin.bind(this)}
                    onCancel={() => this.setLoginModalVisible(false)}
                    okText="登录"
                    cancelText="取消"
                >
                    <Row>
                        <Col span={5}>邮箱：</Col>
                        <Col span={19}>
                            <Input
                                value={this.state.loginMail}
                                onChange={this.handleLoginEmailChange.bind(this)}
                                onBlur={this.handleLoginEmailBlur.bind(this)}
                                placeholder="请输入邮箱"
                            />
                        </Col>
                    </Row>
                    {this.state.loginEmailAlert}
                    <Row>
                        <Col span={5}>密码：</Col>
                        <Col span={19}>
                            <Input.Password value={this.state.loginPassword}
                                            onChange={this.handleLoginPasswordChange.bind(this)}
                                            onBlur={this.handleLoginPasswordBlur.bind(this)}
                                            placeholder="请输入密码"
                            />
                        </Col>
                    </Row>
                    {this.state.loginPasswordAlert}
                </Modal>
                <Modal
                    title="修改密码"
                    style={{ top: 50 }}
                    visible={this.state.passwordModifyModalVisible}
                    onOk={this.handlePasswordModify.bind(this)}
                    onCancel={() => this.setPasswordModifyModalVisible(false)}
                    okText="确认修改"
                    cancelText="取消"
                >
                    <Row>
                        <Col span={5}>旧密码：</Col>
                        <Col span={19}>
                            <Input type="password"
                                   value={this.state.oldPassword}
                                   onChange={this.handlePasswordModifyOldChange.bind(this)}
                                   onBlur={this.handlePasswordModifyOldBlur.bind(this)}
                            />
                        </Col>
                    </Row>
                    {this.state.oldPasswordAlert}
                    <Row>
                        <Col span={5}>新密码：</Col>
                        <Col span={19}>
                            <Input type="password"
                                   value={this.state.newPassword}
                                   onChange={this.handlePasswordModifyNewChange.bind(this)}
                                   onBlur={this.handlePasswordModifyNewBlur.bind(this)}
                            />
                        </Col>
                    </Row>
                    {this.state.newPasswordAlert}
                    <Row>
                        <Col span={5}>确认新密码：</Col>
                        <Col span={19}>
                            <Input type="password"
                                   value={this.state.newPasswordAgain}
                                   onChange={this.handlePasswordModifyNewAgainChange.bind(this)}
                                   onBlur={this.handlePasswordModifyNewAgainBlur.bind(this)}
                            />
                        </Col>
                    </Row>
                    {this.state.newPasswordAgainAlert}
                </Modal>
                <div>
                    <Menu onClick={this.handleClick.bind(this)}
                          selectedKeys={[this.state.currentMenu]}
                          defaultSelectedKeys = "homePage"
                          mode="horizontal"
                          style={MenuStyle}
                    >
                        <Menu.Item key="homePage">
                            <Link to="/homePage" ><Icon type="home" />首页</Link>
                        </Menu.Item>
                        <Menu.Item key="news">
                            <Link to="/homePage"><Icon type="global" />动态</Link>
                        </Menu.Item>
                        <Menu.Item key="members">
                            <Link to="/homePage"><Icon type="team" />人员</Link>
                        </Menu.Item>
                        <Menu.Item key="resources">
                            <Link to="/homePage"><Icon type="tool" />资源</Link>
                        </Menu.Item>
                    </Menu>
                    <Search
                        placeholder="请输入搜索内容"
                        enterButton="搜索"
                        size="default"
                        onSearch={this.handleSearch.bind(this)}
                        loading = {this.state.searchIsLoading}
                        value={this.state.searchContent}
                        onChange={this.handleSearchChange.bind(this)}
                        style={SearchStyle}
                    />
                    <div className="username">
                        <Dropdown overlay={userMenu}>
                            <Link to="" className="ant-dropdown-link"><Icon type="user" />&nbsp;<span className="userfont">{this.state.username}</span>&nbsp;<Icon type="down" /></Link>
                        </Dropdown>
                    </div>
                </div>
                <div key={this.props.location.pathname} >
                    {this.props.children}
                </div>
                <div>
                    <Footer/>
                </div>
            </div>
        )
    }
}
export default Header;
