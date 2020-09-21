import React from 'react';
import { Router, Route, hashHistory} from 'react-router';
import Header from "../templates/Header";
import HomePage from "../templates/homepage/HomePage";
import SearchPage from "../templates/searchpage/SearchPage";

class Routes extends React.Component{
    render() {
        return  (
            <Router history={hashHistory}>
                <Route path="/" component={Header}>
                    <Route path="/homePage" component={HomePage}/>
                    <Route path="/searchPage" component={SearchPage}/>
                </Route>
            </Router>
        );
    }
}
export default Routes;
