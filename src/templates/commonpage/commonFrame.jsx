import React from 'react';
import { hashHistory, Link } from "react-router";
import { Layout, Icon, Button } from 'antd';
import SRFooter from "../SRFooter";

import "../../css/commonpage/commonframe.css";

const { Header } = Layout;

const clientHeight = document.body.clientHeight;
const footerHeight = "160px";
const frameFooterStyle = {
    width: "100%",
    // 定位于父div最下方
    position: "absolute",
    bottom: 0,
    height: footerHeight,
}
const headerStyle = {
    backgroundColor: "#121d5a",
    height: "100px",
}
const headerHeightNum = headerStyle.height.substring(0, headerStyle.height.length-2);
const footerHeightNum = footerHeight.substring(0, footerHeight.length-2)
const childrenHeight = (clientHeight - headerHeightNum - footerHeightNum) + "px"

/*
* 框架类，为一些通用组件提供一个框架，组件就只需要完成自己的内容就好
* 不需要过度关注页面排版问题
* */
class CommonFrame extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div className="commonFrameDiv" style={{height: clientHeight}}>
                <Layout>
                    <Header style={headerStyle}>
                        {/*<Button type="primary">*/}
                        {/*    <Icon type="left" />*/}
                        {/*    Backward*/}
                        {/*</Button>*/}
                    </Header>
                    <div key={this.props.location.pathname}>
                        {
                            React.cloneElement(this.props.children, {
                                contentHeight: childrenHeight
                            })
                        }
                    </div>
                    <div style={frameFooterStyle}>
                        <SRFooter footerHeight={footerHeight} />
                    </div>
                </Layout>
            </div>
        )
    }
}
export default CommonFrame;
