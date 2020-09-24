import React from 'react';
import { Router, Route, hashHistory} from 'react-router';
import SRHeader from "../templates/SRHeader";
import HomePage from "../templates/homepage/HomePage";
import SearchPage from "../templates/searchpage/SearchPage";
import ForgetPassword from "../templates/commonpage/ForgetPassword";
import CommonFrame from "../templates/commonpage/commonFrame";

// 路由表，包括react所有的路由内容，所有页面的跳转都需要在这里注册一下
class Routes extends React.Component{
    render() {
        return  (
            <Router history={hashHistory}>
                <Route path="/" component={SRHeader}>
                    <Route path="/homePage" component={HomePage}/>
                    <Route path="/searchPage" component={SearchPage}/>
                </Route>
                <Route path="/commonFrame" component={CommonFrame}>
                    <Route path="/commonFrame/forgetPassword" component={ForgetPassword}/>
                </Route>

            </Router>
        );
    }
}
export default Routes;
