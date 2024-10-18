import React, { useState, useEffect } from 'react';
import { Typography, Row, Col, Button, Table, Modal, Form, Input, Upload, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { db } from '../firebase'; // Assuming your firebase configuration is in a file named firebase.js
import { getDocs, collection, addDoc, Timestamp, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const { Title } = Typography;

const Roll = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [form] = Form.useForm();
  const storage = getStorage();

  const fetchCareers = async () => {
    try {
      const careersCollection = collection(db, 'careers');
      const careersSnapshot = await getDocs(careersCollection);
      const careersList = careersSnapshot.docs.map(doc => ({
        key: doc.id,
        ...doc.data(),
      }));
      setCareers(careersList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching careers:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareers();
  }, []);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Requirements',
      dataIndex: 'requirements',
      key: 'requirements',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => timestamp.toDate().toLocaleString(),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleRowClick(record)}>Apply Now</Button>
      ),
    },
  ];

  const handleNavigateHome = () => {
    navigate('/'); // Replace with the route to your Home component
  };

  const handleRowClick = (record) => {
    setSelectedCareer(record);
    setIsModalVisible(true);
  };

  const handleUploadCV = async (file) => {
    const storageRef = ref(storage, `cvs/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Progress handling can be added here if needed
        },
        (error) => {
          console.error('Upload error:', error);
          message.error('Failed to upload CV');
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const file = values.cv[0].originFileObj;
      const cvURL = await handleUploadCV(file);

      const applicationData = {
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        salaryExpectations: values.salaryExpectations,
        city: values.city,
        jobPosition: values.jobPosition,
        cvURL,
        timestamp: Timestamp.now(),
      };

      const careerDocRef = doc(db, 'careers', selectedCareer.key);
      const applicationsCollectionRef = collection(careerDocRef, 'applications');
      await addDoc(applicationsCollectionRef, applicationData);

      message.success('Application submitted successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Error submitting application:', error);
      message.error('Failed to submit application');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
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
      <Table
        columns={columns}
        dataSource={careers}
        loading={loading}
        pagination={{ pageSize: 25 }}
        style={{ marginTop: '20px' }}
        scroll={{ x: 'max-content' }}
      />
      <Modal
        title="Apply for Job"
        visible={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
      >
        <Form
          form={form}
          layout="vertical"
          name="jobApplicationForm"
        >
          <Form.Item
            name="fullName"
            label="Full Name"
            rules={[{ required: true, message: 'Please enter your full name' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: 'Please enter your email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter your phone number' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="salaryExpectations"
            label="Salary Expectations"
            rules={[{ required: true, message: 'Please enter your salary expectations' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please enter your city' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="jobPosition"
            label="Job Position"
            initialValue={selectedCareer?.title}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="cv"
            label="Attach CV"
            valuePropName="fileList"
            getValueFromEvent={(e) => Array.isArray(e) ? e : e && e.fileList}
            rules={[{ required: true, message: 'Please attach your CV' }]}
          >
            <Upload name="cv" beforeUpload={() => false} accept=".pdf,.doc,.docx">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Roll;
