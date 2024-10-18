import React from 'react';
import { Card, Col, Row } from 'antd';

const SchoolCard = () => {
  return (
    <div style={{ overflowX: 'hidden', width: '100%', whiteSpace: 'nowrap' }}>
      <Row gutter={16} style={{ animation: 'scroll 15s linear infinite' }}>
        <Col xs={24} md={12} style={{ flex: '0 0 auto' }}>
          <Card title="Current Classroom">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-12%20at%207.27.17%20AM.jpeg?alt=media&token=c57123d2-fafc-4699-ac47-2081dd4dfa70"
              alt="Current Classroom"
              style={{ width: '80%', height: 'auto', borderRadius: '8px' }} // Adjusted width
            />
          </Card>
        </Col>
        <Col xs={24} md={12} style={{ flex: '0 0 auto' }}>
          <Card title="Current Ladies Dormitory">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-12%20at%207.27.18%20AM.jpeg?alt=media&token=ea33ff52-8df0-421e-99e4-75acace235a3"
              alt="Current Ladies Dormitory"
              style={{ width: '80%', height: 'auto', borderRadius: '8px' }} // Adjusted width
            />
          </Card>
        </Col>
        <Col xs={24} md={12} style={{ flex: '0 0 auto' }}>
          <Card title="Classroom Under Construction">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-12%20at%207.27.19%20AM.jpeg?alt=media&token=2d8bdc86-f699-4515-909f-d6e46e47588c"
              alt="Classroom Under Construction"
              style={{ width: '80%', height: 'auto', borderRadius: '8px' }} // Adjusted width
            />
          </Card>
        </Col>
        <Col xs={24} md={12} style={{ flex: '0 0 auto' }}>
          <Card title="Current Men Dormitory">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-12%20at%207.27.20%20AM.jpeg?alt=media&token=bcac06f5-83b1-43f5-99cb-f7df82bcf563"
              alt="Current Men Dormitory"
              style={{ width: '80%', height: 'auto', borderRadius: '8px' }} // Adjusted width
            />
          </Card>
        </Col>
      </Row>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          div {
            display: flex;
            flex-direction: row;
          }
          img:hover {
            transform: scale(1.05);
            transition: transform 0.3s ease;
          }
        `}
      </style>
    </div>
  );
};

export default SchoolCard;
