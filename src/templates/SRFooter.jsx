import React from 'react';
import "../css/srfooter.css"

// 页脚，目前主要是一些版权所有，可能还会有地址等信息
class SRFooter extends React.Component{
    render(){
        const footerStyle = {
            height: this.props.footerHeight,
            lineHeight: this.props.footerHeight,
            textAlign: "center",
            backgroundColor: "black",
        }
        const footerSpanStyle = {
            color: "white"
        }
        return(
            <div style={footerStyle}>
                <span style={footerSpanStyle}>
                        版权所有：电子科技大学 | 信息与软件工程学院 | 嵌入式实时计算实验室
                </span>
            </div>
        )
    }
}
export default SRFooter;