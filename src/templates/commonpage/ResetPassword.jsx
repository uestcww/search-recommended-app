import React from 'react';
import { Layout } from 'antd';

const { Header, Footer, Sider, Content } = Layout;

class ResetPassword extends React.Component{

    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return(
            <div>
                <Layout>
                    <Header>Header</Header>
                    <Content>Content</Content>
                    <Footer>Footer</Footer>
                </Layout>
            </div>
        )
    }
}
export default ResetPassword;