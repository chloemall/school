import React, { useState, useEffect, useRef } from 'react';
import { Typography, Card, Row, Col, Button, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import logoImage from '../data/image1.jpeg'; // Import your local image
import './Library.css'; // Import the CSS file

const { Title } = Typography;

const Pdf = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [feeData, setFeeData] = useState([]);
  const pdfRef = useRef(); // Ref for the component to print

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'students'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserData(userDoc.data());
          fetchFeeData(userDoc.id); // Pass the document ID to fetch fees
        }
      }
    };

    const fetchFeeData = async (userDocId) => {
      const feeCollection = collection(db, 'students', userDocId, 'library');
      const feeSnapshot = await getDocs(feeCollection);
      const feeList = feeSnapshot.docs.map(doc => doc.data());
      
      // Sort feeList by timestamp in descending order (newest books first)
      const sortedFeeList = feeList.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
      
      setFeeData(sortedFeeList);
    };

    fetchUserData();
  }, []);

  const handleNavigateHome = () => {
    navigate('/'); // Replace with the route to your Home component
  };

  const handlePrint = useReactToPrint({
    content: () => pdfRef.current, // Refers to the content to be printed
    documentTitle: 'Library Report', // Document title when printing
  });

  const columns = [
    {
      title: 'Borrowed Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp.seconds * 1000).toLocaleString(),
    },
    {
      title: 'Book Name',
      dataIndex: 'bookName',
      key: 'bookName',
    },
    {
      title: 'Book Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Book Class',
      dataIndex: 'bookClass',
      key: 'bookClass',
    },
  ];

  return (
    <div className="pdf-container">
      <Row justify="space-between" align="middle">
        <Col>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleNavigateHome}>
            Home
          </Button>
        </Col>
        <Col>
          <Button type="primary" onClick={handlePrint}>
            Print
          </Button>
        </Col>
      </Row>

      <div className="content-container" ref={pdfRef}> {/* Ref for printing */} 
        <div id="logo" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={logoImage} // Use the imported local image
            alt="Logo"
            className="logo-image"
            style={{ width: '150px' }} // Adjust the logo size as needed
          />
        </div>

        <Title level={4} className="title" style={{ textAlign: 'center' }}>
        A.I.C Tharaka Bible College
        </Title>

        {userData && (
          <Row gutter={[16, 16]} className="info-row">
            <Col xs={24} sm={12}>
              <Card>
                <p><strong>Admission No:</strong> {userData.admissionNo}</p>
              </Card>
            </Col>
            <Col xs={24} sm={12}>
              <Card>
                <p><strong>Full Name:</strong> {userData.fullName}</p>
              </Card>
            </Col>
          </Row>
        )}

        {feeData.length > 0 && (
          <Table
            dataSource={feeData}
            columns={columns}
            className="fee-table"
            pagination={{ pageSize: 25 }}
            rowKey={(record, index) => index}
          />
        )}
      </div>
    </div>
  );
};

export default Pdf;
