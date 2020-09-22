import React from 'react';
import { Carousel } from 'antd';
import "../../css/homepage/homepage.css";

// 主页，目前主要包括一个走马灯
class HomePage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isLogin: false,
            currentMenu: "homePage",
        }
    }

    render(){
        return(
            <div>
                <Carousel autoplay>
                    <div>
                        <img src={require("../../img/GroupPhoto.jpg")} style={{display: "inline-block", verticalAlign: "top", height: "600px"}}/>
                        <div style={{display: "inline-block",verticalAlign: "top", marginLeft: "5px", width: "47%"}}>
                            <h3>实验室主任：雷航</h3>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;雷航，博士、教授、博士生导师。1982年毕业于成都科技大学计算机学院，1985年至1988年电子科技大学攻读硕士学位研究生。
                                1993～1997年电子科技大学攻读博士学位，1997年毕业留校任教。
                                先后主持或主研“九五”国防预研基金项目：“实时软件的超时故障分析及可靠性评价模型的研究”、
                                “九五”预研项目：“实时并发软件可靠性测试评价系统”、
                                “超微内核嵌入式实时操作系统”、“十五”预研项目“高可靠嵌入式实时操作系统”、
                                十一“863”重大软件专项：面向PDA的嵌入式Linux软件操作平台”、国家“十一五”核高基重大专项“数字电视嵌入式软件平台及产业化”、
                                自然基金“面向多核处理器的实时锁协议与实时调度算法研究”等科研项目。先后发表学术论文80多余篇，数十篇论文被SCI和被EI收录。
                                先后担任四川省计算机学会软件专委会主任、四川省计算机用户协会常务副理事长、中国计算机学会抗恶劣环境专委会委员。
                            </p>
                            <h3>实验室主要成员：</h3>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;桑楠：教授</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;廖勇：教授</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;江春华：副教授</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;唐雪飞：副教授</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;李晓瑜：副教授</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;钱伟中：副教授</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;吴佳：副教授</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;杨茂林：助理研究员</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;王旭鹏：博士后</p>
                            <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;李贞昊：工程师</p>
                        </div>
                    </div>
                    <div>
                        <h3>2</h3>
                    </div>
                    <div>
                        <h3>3</h3>
                    </div>
                </Carousel>
            </div>
        )
    }
}
export default HomePage;
