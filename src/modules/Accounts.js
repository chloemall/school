import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Table, message, Input, Modal, Form, InputNumber, Row, Col } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { collection, getDocs, doc, addDoc, serverTimestamp, getFirestore, query, where, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Accounts = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFeeModalVisible, setIsFeeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [feeDetails, setFeeDetails] = useState([]);
  const [editingFee, setEditingFee] = useState(null);

  const handleGoBack = () => {
    navigate('/home');
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'students'));
        const studentsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(studentsData);
        updateTotalStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students: ', error);
        message.error('Error fetching students. Please try again later.');
      }
    };

    fetchStudents();
  }, []);

  const updateTotalStudents = (data) => {
    setTotalStudents(data.length);
  };

  const columns = [
    {
      title: 'Admission No',
      dataIndex: 'admissionNo',
      key: 'admissionNo',
      width: 150,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
    },
    {
      title: 'Class Teacher',
      dataIndex: 'classTeacher',
      key: 'classTeacher',
      width: 150,
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      width: 150,
    },
    {
      title: 'Stream',
      dataIndex: 'stream',
      key: 'stream',
      width: 150,
    },
    {
      title: 'Actions',
      dataIndex: '',
      key: 'actions',
      render: (text, record) => (
        <>
          <Button type="link" onClick={() => showModal(record)}>
            View Details
          </Button>
          <Button type="link" onClick={() => showFeeModal(record)}>
            Add Fee
          </Button>
        </>
      ),
      width: 200,
    },
  ];

  const feeColumns = [
    {
      title: 'Term',
      dataIndex: 'term',
      key: 'term',
    },
    {
      title: 'Total Fee',
      dataIndex: 'totalFee',
      key: 'totalFee',
    },
    {
      title: 'Deposit Fee',
      dataIndex: 'depositFee',
      key: 'depositFee',
      render: (text, record) => (
        <span onClick={() => handleEditDeposit(record)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => new Date(text?.seconds * 1000).toLocaleString(),
    },
  ];

  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    const results = students.filter(
      (student) =>
        (!trimmedSearchTerm ||
          (student.admissionNo && student.admissionNo.toLowerCase().includes(trimmedSearchTerm)) ||
          (student.fullName && student.fullName.toLowerCase().includes(trimmedSearchTerm)) ||
          (student.class && student.class.toString().includes(trimmedSearchTerm)) ||
          (student.stream && student.stream.toLowerCase().includes(trimmedSearchTerm)))
    );

    setSearchResults(results);

    if (trimmedSearchTerm && results.length === 0) {
      message.error('No student with this Admission No, Full Name, Class, or Stream exists.');
    }

    updateTotalStudents(results);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    updateTotalStudents(students);
  };

  const showModal = (record) => {
    setSelectedStudent(record);
    setIsModalVisible(true);

    const fetchFeeDetails = async () => {
      try {
        const studentRef = doc(db, 'students', record.id);
        const feesQuery = query(collection(studentRef, 'fees'));
        const feesSnapshot = await getDocs(feesQuery);
        const feesData = feesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setFeeDetails(feesData);
      } catch (error) {
        console.error('Error fetching fee details: ', error);
        message.error('Error fetching fee details. Please try again later.');
      }
    };

    fetchFeeDetails();
  };

  const showFeeModal = (record) => {
    setSelectedStudent(record);
    setIsFeeModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsFeeModalVisible(false);
    form.resetFields();
    setEditingFee(null);
  };

  const handleFeeSubmit = async (values) => {
    try {
      if (!selectedStudent) {
        message.error('No student selected.');
        return;
      }

      const studentRef = doc(db, 'students', selectedStudent.id);
      const feeCollectionRef = collection(studentRef, 'fees');

      if (editingFee) {
        const editingFeeDocRef = doc(feeCollectionRef, editingFee.id);
        await setDoc(editingFeeDocRef, {
          term: values.term,
          totalFee: values.totalFee,
          depositFee: values.depositFee,
          balance: calculateFeeBalance(values.totalFee, values.depositFee),
          timestamp: serverTimestamp(),
        });
        message.success('Fee deposit updated successfully');
      } else {
        const feeData = {
          term: values.term,
          totalFee: values.totalFee,
          depositFee: values.depositFee,
          balance: calculateFeeBalance(values.totalFee, values.depositFee),
          timestamp: serverTimestamp(),
        };

        await addDoc(feeCollectionRef, feeData);
        message.success('Fee added successfully');
      }

      setIsFeeModalVisible(false);
      form.resetFields();
      showModal(selectedStudent);
      setEditingFee(null);
    } catch (error) {
      console.error('Error handling fee: ', error);
      message.error('Error handling fee. Please try again later.');
    }
  };

  const handleEditDeposit = (record) => {
    setEditingFee(record);
    setIsFeeModalVisible(true);
    form.setFieldsValue({
      term: record.term,
      totalFee: record.totalFee,
      depositFee: record.depositFee,
    });
  };

  const calculateFeeBalance = (totalFee, depositFee) => {
    return totalFee - depositFee;
  };

  return (
    <div className="app">
      <header className="header">
        <Button type="link" onClick={handleGoBack} icon={<ArrowLeftOutlined />} />
        <h1 className="title">Students Information</h1>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={18}>
            <Input
              placeholder="Search by Admission No, Full Name, Class, or Stream"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Col>
          <Col span={3}>
            <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
              Search
            </Button>
          </Col>
          <Col span={3}>
            <Button type="default" onClick={handleClearSearch}>
              Clear
            </Button>
          </Col>
        </Row>
      </header>
      <div className="content">
        <div className="total-students">Total Students: {totalStudents}</div>
        <Table dataSource={searchResults.length > 0 ? searchResults : students} columns={columns} pagination={{ pageSize: 500 }} />
      </div>
      <Modal title="Student Details" visible={isModalVisible} onOk={handleCancel} onCancel={handleCancel}>
        <p>Full Name: {selectedStudent?.fullName}</p>
        <p>Admission No: {selectedStudent?.admissionNo}</p>
        <p>Class: {selectedStudent?.class}</p>
        <p>Class Teacher: {selectedStudent?.classTeacher}</p>
        <p>Stream: {selectedStudent?.stream}</p>
        <Table dataSource={feeDetails} columns={feeColumns} pagination={false} />
      </Modal>
      <Modal title="Add/Edit Fee" visible={isFeeModalVisible} onOk={() => form.submit()} onCancel={handleCancel}>
        <Form form={form} layout="vertical" onFinish={handleFeeSubmit}>
          <Form.Item label="Term" name="term" rules={[{ required: true, message: 'Please enter the term' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Total Fee" name="totalFee" rules={[{ required: true, message: 'Please enter the total fee' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Deposit Fee" name="depositFee" rules={[{ required: true, message: 'Please enter the deposit fee' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Accounts;
