import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { db } from '../firebase'; // Assuming your firebase configuration is in a file named firebase.js
import { getDocs, collection } from 'firebase/firestore';

const { Title, Text } = Typography;

const Roll = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTenders = async () => {
      setLoading(true);
      const tendersCollection = collection(db, 'tenders');
      const tendersSnapshot = await getDocs(tendersCollection);
      const tendersList = tendersSnapshot.docs.map(doc => ({
        tenderId: doc.id,
        ...doc.data()
      }));
      setTenders(tendersList);
      setLoading(false);
    };

    fetchTenders();
  }, []);

  const handleNavigateHome = () => {
    navigate('/'); // Replace with the route to your Home component
  };

  const columns = [
    {
      title: 'Tender ID',
      dataIndex: 'tenderId',
      key: 'tenderId',
      responsive: ['sm'],
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => timestamp.toDate().toLocaleString(),
      responsive: ['sm', 'md', 'lg', 'xl'],
    },
    {
      title: 'File',
      dataIndex: 'file',
      key: 'file',
      render: (file) => <a href={file} target="_blank" rel="noopener noreferrer">Download</a>,
      responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  ];

  return (
    <div className="guest-container" style={{ padding: '20px' }}>
     
      <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
        <img
          alt="School"
          src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.11%20PM.jpeg?alt=media&token=08803a46-8fe1-4e8d-82e8-2cec6bd83e13"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={tenders}
        rowKey="tenderId"
        pagination={{ pageSize: 10 }}
        loading={loading}
        scroll={{ x: '100%' }}
        style={{ marginTop: '20px', width: '100%' }}
      />
    </div>
  );
};

export default Roll;
