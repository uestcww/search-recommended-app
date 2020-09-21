import React from 'react';
import "../css/footer.css"

class Footer extends React.Component{
    render(){
        return(
            <div className='footer'>
                <p>
                    <span className='footerSpan'>
                        版权所有：电子科技大学 | 信息与软件工程学院 | 嵌入式实时计算实验室
                    </span>
                </p>
            </div>
        )
    }
}
export default Footer;