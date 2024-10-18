import React, { useState, useEffect, useRef } from 'react';
import { Typography, Card, Row, Col, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useReactToPrint } from 'react-to-print';
import logoImage from '../data/image1.jpeg'; // School logo image

const { Title } = Typography;

const Marks = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [marksData, setMarksData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null); // For selected exam card
  const printRef = useRef(); // Ref for the component to be printed

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'students'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          setUserData(userDoc.data());
          fetchMarksData(userDoc.id);
        }
      }
    };

    const fetchMarksData = async (userDocId) => {
      const marksCollection = collection(db, 'students', userDocId, 'marks');
      const marksQuery = query(marksCollection, orderBy('timestamp', 'desc')); // Latest exams on top
      const marksSnapshot = await getDocs(marksQuery);
      const marksList = marksSnapshot.docs.map(doc => doc.data());
      setMarksData(marksList);
    };

    fetchUserData();
  }, []);

  const handleNavigateHome = () => {
    navigate('/');
  };

  // Print function using react-to-print
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  // Function to select an exam card for printing
  const selectCardForPrint = (record) => {
    setSelectedRecord(record); // Store selected record in state
  };

  return (
    <div className="pdf-container">
      <Row justify="space-between" align="middle" style={{ marginBottom: '20px' }}>
        <Col>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleNavigateHome}>
            Home
          </Button>
        </Col>
      </Row>

      <div className="content-container">
        <div id="logo" style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img
            src={logoImage}
            alt="School Logo"
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        </div>
        <Title level={3} style={{ textAlign: 'center' }}>A.I.C Tharaka Bible College</Title>

        {userData && (
          <Row gutter={[16, 16]} justify="center">
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

        {marksData.length > 0 ? (
          marksData.map((marks, index) => (
            <Card key={index} style={{ marginBottom: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                 <Row justify="center">
                <Col>
                  <img
                    src={logoImage}
                    alt="Logo"
                    style={{ width: '80px', height: '80px', marginBottom: '10px' }}
                  />
                </Col>
              </Row>

              <Row justify="space-between" align="middle">
                <Col>
                  <Title level={4} style={{ display: 'inline-block' }}>
                    Exam Results - {marks.timestamp ? marks.timestamp.toDate().toLocaleString() : ''}
                  </Title>
                </Col>
                <Col>
                  <Button type="primary" onClick={() => selectCardForPrint(marks)}>
                    Select for Print
                  </Button>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Card bordered={false}>
                    <p><strong>Total Marks:</strong> {marks.totalMarks}</p>
                    <p><strong>Mean Marks:</strong> {marks.meanMarks}</p>
                    <p><strong>Mean Grade:</strong> {marks.meanGrade}</p>
                    <p><strong>Admission No:</strong> {marks.admissionNo}</p>
                    <p><strong>Full Name:</strong> {marks.fullName}</p>
                    <p><strong>Exam Id:</strong> {marks.tableId}</p>
                    <p><strong>Exam Title:</strong> {marks.tableTitle}</p>
                  </Card>
                </Col>
                <Col xs={24} sm={12}>
                  <Card bordered={false}>
                    <p><strong>Comments:</strong> {marks.comment}</p>
                  </Card>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                {Object.keys(marks)
                  .filter(
                    key => !['admissionNo', 'fullName', 'phoneNumber', 'id', 'timestamp', 'totalMarks', 'meanMarks', 'comment',
                      , 'studentId', 'tableId', 'tableTitle', 'meanGrade'].includes(key)
                  )
                  .map(subject => (
                    <Col xs={24} sm={12} key={subject}>
                      <Card bordered={false}>
                        <p><strong>{subject}:</strong> {marks[subject]}</p>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </Card>
          ))
        ) : (
          <p>No exam results available</p>
        )}

        {/* Render the selected card to be printed */}
        {selectedRecord && (
          <div style={{ display: 'none' }}>
            <div ref={printRef}>
              <Card style={{ marginBottom: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <Row justify="center">
                  <Col>
                    <img
                      src={logoImage}
                      alt="Logo"
                      style={{ width: '120px', height: '120px', marginBottom: '10px' }}
                    />
                  </Col>
                </Row>

               

                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={4}>Exam Results - {selectedRecord.timestamp ? selectedRecord.timestamp.toDate().toLocaleString() : ''}</Title>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <Card bordered={false}>
                      <p><strong>Total Marks:</strong> {selectedRecord.totalMarks}</p>
                      <p><strong>Mean Marks:</strong> {selectedRecord.meanMarks}</p>
                      <p><strong>Mean Grade:</strong> {selectedRecord.meanGrade}</p>
                      <p><strong>Admission No:</strong> {selectedRecord.admissionNo}</p>
                      <p><strong>Full Name:</strong> {selectedRecord.fullName}</p>
                      <p><strong>Exam Id:</strong> {selectedRecord.tableId}</p>
                      <p><strong>Exam Title:</strong> {selectedRecord.tableTitle}</p>
                    </Card>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Card bordered={false}>
                      <p><strong>Comments:</strong> {selectedRecord.comment}</p>
                    </Card>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  {Object.keys(selectedRecord)
                    .filter(
                      key => !['admissionNo', 'fullName', 'phoneNumber', 'studentId', 'tableId', 'tableTitle','id', 'timestamp', 'totalMarks', 'meanMarks', 'comment', 'meanGrade'].includes(key)
                    )
                    .map(subject => (
                      <Col xs={24} sm={12} key={subject}>
                        <Card bordered={false}>
                          <p><strong>{subject}:</strong> {selectedRecord[subject]}</p>
                        </Card>
                      </Col>
                    ))}
                </Row>
              </Card>
            </div>
          </div>
        )}

        {selectedRecord && (
          <Row justify="center">
            <Button type="primary" onClick={handlePrint}>
              Print Selected Exam Card
            </Button>
          </Row>
        )}
      </div>
    </div>
  );
};

export default Marks;
