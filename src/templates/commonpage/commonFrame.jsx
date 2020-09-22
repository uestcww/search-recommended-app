import React from 'react';
import { Layout } from 'antd';
import SRFooter from "../SRFooter";

import "../../css/commonpage/commonframe.css";

const { Header, Footer, Sider, Content } = Layout;

/*
* 框架类，为一些通用组件提供一个框架，组件就只需要完成自己的内容就好
* 不需要过度关注页面排版问题
* */
class CommonFrame extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const clientHeight = document.body.clientHeight;
        const footerHeight = "160px";
        const frameFooterStyle = {
            width: "100%",
            // 定位于父div最下方
            position: "absolute",
            bottom: 0,
            height: footerHeight,
        }
        return(
            <div className="commonFrameDiv" style={{height: clientHeight}}>
                <Layout>
                    <Header className="frameHeader"/>
                    <div key={this.props.location.pathname} style={{border: "1px red solid"}}>
                        {this.props.children}
                    </div>
                    <div style={frameFooterStyle}>
                        <SRFooter footerHeight={footerHeight}/>
                    </div>
                </Layout>
            </div>
        )
    }
}
export default CommonFrame;
