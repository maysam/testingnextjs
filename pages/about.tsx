import React from 'react'
import { Button, Modal, Breadcrumb, Row, Col, Layout, Card, Carousel } from 'antd'
import {
  HomeOutlined,
  UserOutlined,
  FacebookOutlined,
  InstagramOutlined,
  GoogleOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  GithubOutlined,
  AndroidOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
const { Content } = Layout

class About extends React.Component {
  state = { visible: false }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = (e: object) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }

  handleCancel = (e: object) => {
    console.log(e)
    this.setState({
      visible: false,
    })
  }
  render() {
    return (
      <Layout>
        <div>
          <Button type="primary" onClick={this.showModal}>
            Open Modal
          </Button>
        </div>
        <br />
        <Modal title="Basic Modal" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>

        <div>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="primary" danger>
            Prime Danger
          </Button>
          <Button danger>Danger</Button>
          <Button type="link">Link</Button>
        </div>
        <Row justify="space-around">
          <Col
            span={20}
            style={{
              textAlign: 'right',
              height: 50,
              display: 'flex',
              justifyContent: 'flex-end',
              textTransform: 'uppercase',
            }}
          >
            <div style={{ width: 'fit-content', margin: 'auto 0px' }}>
              <Link href="/">
                <a>Home</a>
              </Link>
            </div>
            <div style={{ width: 'fit-content', margin: 'auto 0px' }}>
              <Link href="/">
                <a>Product</a>
              </Link>
            </div>
            <div style={{ width: 'fit-content', margin: 'auto 0px' }}>
              <Link href="/about">
                <a>About us</a>
              </Link>
            </div>
          </Col>
        </Row>
        <Row justify="space-around">
          <Col span={20}>
            <Breadcrumb>
              <Breadcrumb.Item href="">
                <HomeOutlined />
              </Breadcrumb.Item>
              <Breadcrumb.Item href="">
                <UserOutlined />
                <span>Home</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Row justify="space-around">
          <Col span={20} style={{ paddingTop: '30px', paddingBottom: '30px', minHeight: '500px' }}>
            <Content>
              <div>
                <Carousel autoplay>
                  <div>
                    <h3>
                      <img src="/static/images/big-images.jpg" />
                    </h3>
                  </div>
                  <div>
                    <h3>
                      <img src="/static/images/big-images-2.jpg" />
                    </h3>
                  </div>
                  <div>
                    <h3>
                      <img src="/static/images/big-images-3.jpg" />
                    </h3>
                  </div>
                </Carousel>
              </div>
              <Row gutter={16}>
                <Col span={6} md={6} sm={12} xs={24}>
                  <Card
                    hoverable
                    cover={<img alt="image1" style={{ width: '100%' }} src="/static/images/burger1.jpg" />}
                  >
                    <Card.Meta title="Menu 1" description="burger with patty and cheese" />
                  </Card>
                </Col>
                <Col span={6} md={6} sm={12} xs={24}>
                  <Card
                    hoverable
                    cover={<img alt="image2" style={{ width: '100%' }} src="/static/images/burger2.jpg" />}
                  >
                    <Card.Meta title="Menu 2" description="burger on white ceramic plate" />
                  </Card>
                </Col>
                <Col span={6} md={6} sm={12} xs={24}>
                  <Card
                    hoverable
                    cover={<img alt="image3" style={{ width: '100%' }} src="/static/images/burger3.jpg" />}
                  >
                    <Card.Meta title="Menu 3" description="burger with tomato and onion" />
                  </Card>
                </Col>
                <Col span={6} md={6} sm={12} xs={24}>
                  <Card
                    hoverable
                    cover={<img alt="image4" style={{ width: '100%' }} src="/static/images/burger4.jpg" />}
                  >
                    <Card.Meta title="Menu 4" description="burger with vegetables" />
                  </Card>
                </Col>
              </Row>
            </Content>
          </Col>
        </Row>
        <Row justify="space-around" style={{ background: '#f9f9f9' }}>
          <Col md={8} xs={20} style={{ height: '40px', display: 'flex' }}>
            <div style={{ margin: 'auto 0px' }}>&copy; 2019 nextjs antd now.sh</div>
          </Col>
          <Col md={8} xs={20}>
            <div style={{ margin: 'auto', height: '40px', display: 'flex', justifyContent: 'flex-end' }}>
              <FacebookOutlined />
              <InstagramOutlined />
              <GoogleOutlined />
              <TwitterOutlined />
              <LinkedinOutlined />
              <GithubOutlined />
              <AndroidOutlined />
            </div>
          </Col>
        </Row>
      </Layout>
    )
  }
}

export default About
