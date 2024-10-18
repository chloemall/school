import React, { useState, useEffect, useRef } from 'react';
import { Typography, Card, Row, Col, Button, Table, Modal, Form, Input, Upload, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import logoImage from '../data/image1.jpeg'; // Import your local image
import './Library.css'; // Import the CSS file

const { Title } = Typography;

const Pdf = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [feeData, setFeeData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const pdfRef = useRef();

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

    fetchUserData();
  }, []);

  const fetchFeeData = async (userDocId) => {
    const feeCollection = collection(db, 'students', userDocId, 'assignments');
    const q = query(feeCollection, orderBy('timestamp', 'desc'));
    const feeSnapshot = await getDocs(q);
    const feeList = feeSnapshot.docs.map(doc => doc.data());
    setFeeData(feeList);
  };

  const handleNavigateHome = () => {
    navigate('/'); // Replace with the route to your Home component
  };

  const handleAddMoneyRecord = async () => {
    try {
      const user = auth.currentUser;
      if (user && userData) {
        const q = query(collection(db, 'students'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          const { title, subject } = form.getFieldsValue();

          const storage = getStorage();
          const fileUrls = [];

          for (const file of fileList) {
            const storageRef = ref(storage, `files/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file.originFileObj);
            await new Promise((resolve, reject) => {
              uploadTask.on('state_changed', null, reject, () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                  fileUrls.push({ name: file.name, url: downloadURL });
                  resolve();
                });
              });
            });
          }

          await addDoc(collection(db, 'students', userDoc.id, 'money'), {
            title,
            subject,
            files: fileUrls,
            timestamp: new Date()
          });

          setIsModalVisible(false);
          form.resetFields();
          setFileList([]);
          fetchFeeData(userDoc.id); // Refresh the fee data after adding a new record
        }
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Files',
      dataIndex: 'files',
      key: 'files',
      render: (files) => (
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">{file.name}</a>
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => new Date(timestamp.seconds * 1000).toLocaleString(),
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
          <Button type="primary" onClick={showModal}>
            Add Record
          </Button>
        </Col>
      </Row>
      <div className="content-container">
        <div id="logo">
          <img
            src={logoImage} // Use the imported local image
            alt="Logo"
            className="logo-image"
          />
        </div>
        <Title level={4} className="title">A.I.C Tharaka Bible College</Title>
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
      <Modal
        title="Add Record"
        visible={isModalVisible}
        onOk={handleAddMoneyRecord}
        onCancel={handleCancel}
        okText="Save"
      >
        <Form form={form} layout="vertical" name="add_record_form">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="subject"
            label="Subject"
            rules={[{ required: true, message: 'Please input the title!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Upload Files">
            <Upload
              multiple
              fileList={fileList}
              beforeUpload={() => false}
              onChange={handleFileChange}
              listType="picture"
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Pdf;
