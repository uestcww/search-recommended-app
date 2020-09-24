import React from 'react';
import { Col, Input, Button, Form, Steps, message, Modal, Result } from 'antd';
import { hashHistory, Link } from "react-router";

import "../../css/commonpage/forgetpassword.css";
import {useFetchPost} from "../../utils/HttpRequestUtil";

const { Step } = Steps;
const { confirm } = Modal;

class ForgetPassword extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            //控制步骤条的显示
            currentStep: 0,
            //本次找回密码的会话ID
            sessionID: "",
            //第一阶段验证邮箱相关变量
            forgetEmail: "",
            forgetVerifyCode: "",
            codeButtonValue: "获取验证码",
            codeButtonDisabled: false,
            //邮箱输入框提示信息
            forgetEmailValidateStatus: "",
            forgetEmailHelp: "",
            forgetEmailHasFeedback: false,
            //验证码输入框提示信息
            forgetCodeValidateStatus: "",
            forgetCodeHelp: "",
            forgetCodeHasFeedback: false,
            //第二阶段重置密码相关变量
            forgetNewPassword: "",
            forgetNewPasswordAgain: "",
            //第一次密码输入框的提示信息
            forgetPasswordValidateStatus: "",
            forgetPasswordHelp: "",
            forgetPasswordHasFeedback: false,
            //确认密码输入框的提示信息
            forgetPasswordAgainValidateStatus: "",
            forgetPasswordAgainHelp: "",
            forgetPasswordAgainHasFeedback: false,
            //第三阶段
            forgetResultStatus: "",
            forgetResultTitle: "",
            jumpCount: 5,
        }
    }

    // 点击获取验证码按钮
    handleCodeButtonClick(){
        const State = this.state;
        this.setState({
            forgetCodeValidateStatus: "",
            forgetCodeHelp: "",
            forgetCodeHasFeedback: false,
        })
        if(State.forgetEmail === ""){
            this.setState({
                forgetEmailValidateStatus: "error",
                forgetEmailHelp: "邮箱不能为空",
                forgetEmailHasFeedback: true,
            })
            return;
        }
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(!reg.test(State.forgetEmail)){
            this.setState({
                forgetEmailValidateStatus: "error",
                forgetEmailHelp: "邮箱格式不正确",
                forgetEmailHasFeedback: true,
            })
            return;
        }
        this.setState({
            forgetEmailValidateStatus: "",
            forgetEmailHelp: "",
            forgetEmailHasFeedback: false,
            codeButtonDisabled: true,
        },this.codeTimer)
        useFetchPost("/forgetPassword/sendCode", {email: this.state.forgetEmail})
            .then(res => res.json()).then(resObj => {
                if(resObj.code === "100"){
                    this.setState({
                        sessionID: resObj.sessionId
                    })
                }
        }).catch(err => {
            console.error("发送验证码失败，", err.message);
        })
    }
    //验证邮箱阶段，点击下一步按钮
    handleFirstNextStepClick(){
        const State = this.state;
        const current = this.state.currentStep;
        let flag = false;
        if(State.forgetEmail === ""){
            flag = true;
            this.setState({
                forgetEmailValidateStatus: "error",
                forgetEmailHelp: "请输入邮箱地址",
                forgetEmailHasFeedback: true,
            })
        }
        if(State.forgetVerifyCode === ""){
            flag = true;
            this.setState({
                forgetCodeValidateStatus: "error",
                forgetCodeHelp: "请输入验证码",
                forgetCodeHasFeedback: true,
            })
        }
        if(flag){
            return;
        }
        this.setState({
            forgetEmailValidateStatus: "",
            forgetEmailHelp: "",
            forgetEmailHasFeedback: false,
            forgetCodeValidateStatus: "",
            forgetCodeHelp: "",
            forgetCodeHasFeedback: false,
        })
        let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if(!reg.test(State.forgetEmail)){
            this.setState({
                forgetEmailValidateStatus: "error",
                forgetEmailHelp: "邮箱格式不正确",
                forgetEmailHasFeedback: true,
            })
            return;
        }
        const jsonObj = {
            sessionId: this.state.sessionID,
            email: this.state.forgetEmail,
            verifycode: this.state.forgetVerifyCode,
        }
        useFetchPost("/forgetPassword/verifyCode", jsonObj)
            .then(res => res.json()).then(resObj => {
            if(resObj.code === "100"){
                this.setState({
                    currentStep: current+1,
                })
            }else if(resObj.code === "902" || resObj.code === "906"){
                this.setState({
                    forgetCodeValidateStatus: "error",
                    forgetCodeHelp: "验证码有误或邮箱不存在",
                    forgetCodeHasFeedback: true,
                })
            }else{
                message.warning("警告：" + resObj.message)
            }
        }).catch(err => {
            console.error("验证邮箱失败，", err.message)
        })
    }
    //确认修改密码，显示最终结果
    handlePasswordChangeConfirm(){
        const pointer = this;
        const State = this.state;
        let flag = false;
        if(State.forgetNewPassword === ""){
            flag = true;
            this.setState({
                forgetPasswordValidateStatus: "error",
                forgetPasswordHelp: "请输入新密码",
                forgetPasswordHasFeedback: true,
            })
        }
        if(State.forgetNewPasswordAgain === ""){
            flag = true
            this.setState({
                forgetPasswordAgainValidateStatus: "error",
                forgetPasswordAgainHelp: "请再次输入新密码",
                forgetPasswordAgainHasFeedback: true,
            })
        }
        if(flag){
            return;
        }
        this.setState({
            forgetPasswordValidateStatus: "",
            forgetPasswordHelp: "",
            forgetPasswordHasFeedback: false,
            forgetPasswordAgainValidateStatus: "",
            forgetPasswordAgainHelp: "",
            forgetPasswordAgainHasFeedback: false,
        })
        if(State.forgetNewPassword !== State.forgetNewPasswordAgain){
            this.setState({
                forgetPasswordAgainValidateStatus: "error",
                forgetPasswordAgainHelp: "两次输入的密码不一致！",
                forgetPasswordAgainHasFeedback: true,
            })
        }
        confirm({
            title: "确认修改？",
            content: "点击确定前请您确认已经记住了您的新密码",
            okText: "确定",
            cancelText: "取消",
            onOk(){
                const jsonObj = {
                    sessionId: State.sessionID,
                    email: State.forgetEmail,
                    newPassword: State.forgetNewPassword,
                }
                useFetchPost("/forgetPassword/resetPassword", jsonObj)
                    .then(res => res.json()).then(resObj => {
                    if(resObj.code === "100"){
                        pointer.setState({
                            forgetResultStatus: "success",
                            forgetResultTitle: "修改密码成功",
                        })
                    }else if(resObj.code === "906"){
                        //会话不一致，等于超时了
                        pointer.setState({
                            forgetResultStatus: "warning",
                            forgetResultTitle: "您的操作超时了",
                        })
                    }else{
                        //其他未知原因
                        pointer.setState({
                            forgetResultStatus: "error",
                            forgetResultTitle: "操作失败，原因未知",
                        })
                    }
                    const current = State.currentStep;
                    pointer.setState({
                        currentStep: current+1,
                    }, pointer.resultTimer)
                }).catch(err => {
                    console.error(err.message);
                })
            },
        });
    }

    //定时器函数，专门做发送验证码按钮的一分钟倒计时任务的
    codeTimer(seconds = 60){
        let time = seconds;
        const timeCount = () => {
            if(time === 0){
                this.setState({
                    codeButtonValue: "重新发送验证码",
                    codeButtonDisabled: false,
                })
                return;
            }
            time--;
            this.setState({
                codeButtonValue: time + "秒后重新发送",
            })
            setTimeout(timeCount, 1000)
        };
        setTimeout(timeCount, 0)
    }
    //定时器函数，用于结果页面的跳转倒计时
    resultTimer(seconds = 5){
        let time = seconds;
        const timeCount = () => {
            if(time === 0){
                hashHistory.push({
                    pathname: "/homePage"
                })
                return;
            }
            time--;
            this.setState({
                jumpCount: time,
            })
            setTimeout(timeCount, 1000)
        };
        setTimeout(timeCount, 0)
    }

    //输入邮箱的输入框的change事件
    handleForgetEmailChange(e){
        this.setState({
            forgetEmail: e.target.value
        })
    }
    //输入验证码的输入框的change事件
    handleForgetVerifyCodeChange(e){
        this.setState({
            forgetVerifyCode: e.target.value,
            forgetCodeValidateStatus: "",
            forgetCodeHelp: "",
            forgetCodeHasFeedback: false,
        })
    }
    //输入新密码的输入框的change事件
    handleForgetPasswordChange(e){
        this.setState({
            forgetNewPassword: e.target.value,
            forgetPasswordValidateStatus: "",
            forgetPasswordHelp: "",
            forgetPasswordHasFeedback: false,
        })
    }
    //再次输入新密码的输入框的change事件
    handleForgetPasswordAgainChange(e){
        this.setState({
            forgetNewPasswordAgain: e.target.value,
            forgetPasswordValidateStatus: "",
            forgetPasswordHelp: "",
            forgetPasswordHasFeedback: false,
        })
    }

    render() {
        const outDivStyle = {
            height: this.props.contentHeight,
        }
        const steps = [
            {
                title: '验证邮箱',
                content: (
                    <Form className="first-form">
                        <Form.Item validateStatus={this.state.forgetEmailValidateStatus}
                                   help={this.state.forgetEmailHelp}
                                   hasFeedback={this.state.forgetEmailHasFeedback}>
                            <Input placeholder="请输入邮箱"
                                   value={this.state.forgetEmail}
                                   onChange={this.handleForgetEmailChange.bind(this)}
                            />
                        </Form.Item>
                        <Form.Item validateStatus={this.state.forgetCodeValidateStatus}
                                   help={this.state.forgetCodeHelp}
                                   hasFeedback={this.state.forgetCodeHasFeedback}>
                            <Col span={13}>
                                <Input placeholder="请输入验证码"
                                       value={this.state.forgetVerifyCode}
                                       onChange={this.handleForgetVerifyCodeChange.bind(this)}
                                />
                            </Col>
                            <Col span={1}></Col>
                            <Col span={10}>
                                <Button type="primary"
                                        disabled={this.state.codeButtonDisabled}
                                        className="first-form-code-button"
                                        onClick={this.handleCodeButtonClick.bind(this)}
                                >{this.state.codeButtonValue}</Button>
                            </Col>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary"
                                    className="first-form-next-button"
                                    onClick={this.handleFirstNextStepClick.bind(this)}
                            >下一步</Button>
                        </Form.Item>
                    </Form>
                )
            },
            {
                title: '重置密码',
                content: (
                    <Form className="second-form">
                        <Form.Item validateStatus={this.state.forgetPasswordValidateStatus}
                                   help={this.state.forgetPasswordHelp}
                                   hasFeedback={this.state.forgetPasswordHasFeedback}>
                            <Input.Password placeholder="请输入新密码"
                                   value={this.state.forgetNewPassword}
                                   onChange={this.handleForgetPasswordChange.bind(this)}
                            />
                        </Form.Item>
                        <Form.Item validateStatus={this.state.forgetPasswordAgainValidateStatus}
                                   help={this.state.forgetPasswordAgainHelp}
                                   hasFeedback={this.state.forgetPasswordAgainHasFeedback}>
                            <Input.Password placeholder="请再次输入新密码"
                                   value={this.state.forgetNewPasswordAgain}
                                   onChange={this.handleForgetPasswordAgainChange.bind(this)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary"
                                    className="second-form-button"
                                    onClick={this.handlePasswordChangeConfirm.bind(this)}
                            >完成</Button>
                        </Form.Item>
                    </Form>
                )
            },
            {
                title: '修改结果',
                content: (
                    <Result
                        status={this.state.forgetResultStatus}
                        title={this.state.forgetResultTitle}
                        subTitle={"本页面将会在"+this.state.jumpCount+"秒后自动跳转，如果没有跳转成功，请点击下方按钮"}
                        extra={[
                            <Button type="primary"
                                    onClick={ () => { hashHistory.push({pathname: "/homePage"}) } }
                            >返回首页</Button>
                        ]}
                    />
                )
            },
        ];
        return(
            <div style={outDivStyle}>
                <div className="steps-div">
                    <Steps current={this.state.currentStep}>
                        {steps.map(item => (
                            <Step key={item.title} title={item.title} />
                        ))}
                    </Steps>
                </div>
                <div>
                    {steps[this.state.currentStep].content}
                </div>
            </div>
        )
    }
}
export default ForgetPassword;
