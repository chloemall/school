import React from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Pdf = () => {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/'); // Replace with the route to your Home component
  };

  return (
    <div className="guest-container" style={{ padding: '20px' }}>
     <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
        <img
          alt="School"
          src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.11%20PM.jpeg?alt=media&token=08803a46-8fe1-4e8d-82e8-2cec6bd83e13"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card title="Call Us" bordered={false}>
            <p>
              <PhoneOutlined /> <a href="tel:+254797980011">+254792358587</a>
            </p>
            <p>
              <PhoneOutlined /> <a href="tel:+254115973519">+254722235387 </a>
            </p>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Email Us" bordered={false}>
            <p>
              <MailOutlined /> <a href="mailto:aictharakabiblecollege@gmail.com"></a>aictharakabiblecollege@gmail.com
            </p>
            <p>
            </p>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="Address" bordered={false}>
            <p>
              <EnvironmentOutlined /> P.O BOX  576 NKUBU
            </p>
          </Card>
          <Col span={24}>
          <Card title="Location" bordered={false}>
            <p>
              <EnvironmentOutlined /> Physical location of the college. 
              A.I.C Tharaka Bible College is located at A.I.C Rugiika 17 kilometers from Mitunguu along Mitunguu- Marimanti road which is in Marimanti ward, Tharaka sub county in Tharaka Nithi county in Kenya. Our Nairobi campus is located at A.I.C Kayole North which is Kayole near Mihang'o stage.
            </p>
          </Card>
        </Col>
        </Col>
      </Row>
    </div>
  );
};

export default Pdf;
