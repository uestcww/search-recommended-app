import React from 'react';
import { hashHistory, Link } from "react-router";
import { Menu, Icon, Dropdown, Modal, message, Row, Col, Input, Form, Button, Checkbox } from 'antd';
import {useFetchGet, useFetchPost} from '../utils/HttpRequestUtil';
import SRFooter from "./SRFooter";
import "../css/srheader.css";

const { Search } = Input;

const footerHeight = "1rem";
const MenuStyle = {
    backgroundColor: "rgb(250,244,244)",
};
const SearchStyle = {
    display: "block",
    width: "30%",
    position: "absolute",
    top: "0.06rem",
    left: "5.7rem"
}
const homeFooterStyle = {
    width: "100%",
    height: footerHeight,
}

class SRHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            //当前菜单
            currentMenu: "",
            //用户登录状态和用户信息
            isLogin: false,
            username: "",
            //登录相关
            loginModalVisible: false,
            loginEmail: "",
            loginPassword: "",
            //登录中邮箱输入框提示信息
            loginEmailValidateStatus: "",
            loginEmailHelp: "",
            loginEmailHasFeedback: false,
            //登录中密码输入框提示信息
            loginPasswordValidateStatus: "",
            loginPasswordHelp: "",
            loginPasswordHasFeedback: false,
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
            case "modifyPassword": this.setPasswordModifyModalVisible(true);break;
            case "logout": this.handleLogout();break;
            default: break;
        }
    }

    //处理登录事件
    handleLogin(){
        const State = this.state
        let flag = false;
        if(State.loginEmail === ""){
            flag = true;
            this.setState({
                loginEmailValidateStatus: "error",
                loginEmailHelp: "邮箱不能为空",
                loginEmailHasFeedback: true,
            })
        }
        if(State.loginPassword === ""){
            flag = true;
            this.setState({
                loginPasswordValidateStatus: "error",
                loginPasswordHelp: "密码不能为空",
                loginPasswordHasFeedback: true,
            })
        }
        if(flag){
            return;
        }
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(reg.test(State.loginEmail)){
            this.setState({
                loginEmailValidateStatus: "",
                loginEmailHelp: "",
                loginEmailHasFeedback: false,
                loginPasswordValidateStatus: "",
                loginPasswordHelp: "",
                loginPasswordHasFeedback: false,
            })
        }else{
            this.setState({
                loginEmailValidateStatus: "error",
                loginEmailHelp: "邮箱格式不正确",
                loginEmailHasFeedback: true,
                loginPasswordValidateStatus: "",
                loginPasswordHelp: "",
                loginPasswordHasFeedback: false,
            })
            return;
        }
        let jsonObj = {
            email: this.state.loginEmail,
            password: this.state.loginPassword,
        };
        useFetchPost("/login", jsonObj).then(res => res.json()).then(resObj => {
            if(resObj.code === "100"){
                message.success("登录成功！");
                localStorage.setItem("isLogin", true);
                localStorage.setItem("username", resObj.username);
                localStorage.setItem("email", resObj.email);
                this.setState({
                    loginModalVisible: false,
                    isLogin: true,
                    username: resObj.username
                })
            }else if(resObj.code === "102"){
                message.warning("警告：该用户已经登录！");
            }else{
                message.warning("警告：" + resObj.message);
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
                message.warning("警告：" + resObj.message);
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
        let flag = false;
        if(State.oldPassword === ""){
            flag = true;
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
        if(State.newPassword === ""){
            flag = true;
            this.setState({
                newPasswordAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>请填写新密码</span></Col>
                </Row>
            })
        }else if(State.newPassword !== this.state.newPasswordAgain){
            flag = true;
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
        if(State.newPasswordAgain === ""){
            flag = true;
            this.setState({
                newPasswordAgainAlert: <Row>
                    <Col span={5}></Col>
                    <Col span={19}><span style={{color: "red",fontSize: 10}}>请重新填写新密码</span></Col>
                </Row>
            })
        }else if(State.newPassword !== State.newPasswordAgain){
            flag = true;
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
        if(flag){
            return;
        }
        let jsonObj = {
            email: localStorage.getItem("email"),
            password: State.newPassword
        };
        useFetchPost("/updatePassword", jsonObj).then(res => res.json()).then(resObj => {
            if(resObj.code === "209"){
                message.success("修改成功！请重新登录！");
                localStorage.clear();
                window.location.reload();
            }else{
                message.warning("警告：" + resObj.message);
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

    //两个模态框的显示函数，value为true时显示，false则隐藏
    setLoginModalVisible(value){
        this.setState({
            loginModalVisible: value,
            loginEmail: "",
            loginPassword: "",
            loginEmailValidateStatus: "",
            loginEmailHelp: "",
            loginEmailHasFeedback: false,
            loginPasswordValidateStatus: "",
            loginPasswordHelp: "",
            loginPasswordHasFeedback: false,
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
            loginEmail: e.target.value,
            loginEmailValidateStatus: "",
            loginEmailHelp: "",
            loginEmailHasFeedback: false,
        });
    }
    handleLoginPasswordChange(e){
        this.setState({
            loginPassword: e.target.value,
            loginPasswordValidateStatus: "",
            loginPasswordHelp: "",
            loginPasswordHasFeedback: false,
        })
    }
    handleLoginEmailBlur(e){
        let value = e.target.value;
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(value === ""){
            this.setState({
                loginEmailValidateStatus: "error",
                loginEmailHelp: "邮箱不能为空",
                loginEmailHasFeedback: true,
            })
        }else if(reg.test(value)){
            this.setState({
                loginEmailValidateStatus: "",
                loginEmailHelp: "",
                loginEmailHasFeedback: false,
            })
        }else{
            this.setState({
                loginEmailValidateStatus: "error",
                loginEmailHelp: "邮箱格式不正确",
                loginEmailHasFeedback: true,
            })
        }
    }
    handleLoginPasswordBlur(e){
        let value = e.target.value;
        if(value === ""){
            this.setState({
                loginPasswordValidateStatus: "error",
                loginPasswordHelp: "密码不能为空",
                loginPasswordHasFeedback: true,
            })
        }else{
            this.setState({
                loginPasswordValidateStatus: "",
                loginPasswordHelp: "",
                loginPasswordHasFeedback: false,
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
        const pointer = this;  //固定this指针，方便后面可以在回调函数里面使用this.state中的内容，不固定的话this指针会改变
        const clientHeight = document.body.clientHeight;
        const userMenu = (
            <Menu onClick={this.handleUserMenu.bind(this)}>
                <Menu.Item key="modifyPassword"><Icon type="edit" />&nbsp;修改登录密码</Menu.Item>
                <Menu.Item key="logout"><Icon type="logout" />&nbsp;登出</Menu.Item>
            </Menu>
        );
        //绑定点击回车事件，以便于在登录、修改密码等事件的时候只需要敲击回车就可以，不需要必须点击按钮
        document.onkeydown = function (e){
            event = window.event||e;
            const loginVisible = pointer.state.loginModalVisible;
            const passwordVisible = pointer.state.passwordModifyModalVisible;
            let key=event.keyCode;
            // 这里不能写三个等号的等同符，应该写两个等号的等值符，因为会出问题，具体为啥不知道
            if(key === 13 && loginVisible == true){
                pointer.handleLogin();
            }
            if(key === 13 && passwordVisible == true){
                pointer.handlePasswordModify();
            }
        }
        return(
            <div className="headerDiv" style={{height: clientHeight}}>
                <Modal
                    title="登录"
                    style={{ top: "1rem" }}
                    visible={this.state.loginModalVisible}
                    onCancel={() => this.setLoginModalVisible(false)}
                    okText="登录"
                    cancelText="取消"
                    footer={null}
                >
                    <Form onSubmit={this.handleLogin.bind(this)} className="login-form">
                        <Form.Item  validateStatus={this.state.loginEmailValidateStatus}
                                    help={this.state.loginEmailHelp}
                                    hasFeedback={this.state.loginEmailHasFeedback}>
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                   value={this.state.loginEmail}
                                   onChange={this.handleLoginEmailChange.bind(this)}
                                   onBlur={this.handleLoginEmailBlur.bind(this)}
                                   placeholder="请输入邮箱"
                            />
                        </Form.Item>
                        <Form.Item validateStatus={this.state.loginPasswordValidateStatus}
                                   help={this.state.loginPasswordHelp}
                                   hasFeedback={this.state.loginPasswordHasFeedback}>
                            <Input.Password prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }}/>}
                                   value={this.state.loginPassword}
                                   onChange={this.handleLoginPasswordChange.bind(this)}
                                   onBlur={this.handleLoginPasswordBlur.bind(this)}
                                   placeholder="请输入密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Checkbox>记住密码</Checkbox>
                            <Link className="login-form-forgot"
                                  onlyActiveOnIndex
                                  to={
                                      {
                                          pathname: "/commonFrame/forgetPassword",
                                      }
                                  }
                             >忘记密码？</Link>
                            <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
                            或者 <a href="">立即注册!</a>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal
                    title="修改密码"
                    style={{ top: "1rem" }}
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
                        {//根据用户的登录情况改变右上角的显示，未登录和已登录的菜单是不一样的
                            this.state.isLogin ?
                                (
                                    <Dropdown overlay={userMenu}>
                                        <Link to="" className="ant-dropdown-link" onlyActiveOnIndex><Icon type="user" />&nbsp;<span className="userFont">{this.state.username}</span>&nbsp;<Icon type="down" /></Link>
                                    </Dropdown>
                                ):(
                                    <span className="userFont">
                                        <Link to="" className="ant-dropdown-link" onClick={() => this.setLoginModalVisible(true)} onlyActiveOnIndex>登录</Link>
                                        <Link to="" className="ant-dropdown-link" onlyActiveOnIndex> | </Link>
                                        <Link to="" className="ant-dropdown-link" onlyActiveOnIndex>注册</Link>
                                    </span>
                                )
                        }
                    </div>
                </div>
                <div key={this.props.location.pathname} >
                    {this.props.children}
                </div>
                <div style={homeFooterStyle}>
                    <SRFooter footerHeight={footerHeight}/>
                </div>
            </div>
        )
    }
}
export default SRHeader;
