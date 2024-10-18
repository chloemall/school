import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc, Timestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { Table, Select, Modal, Button, Input, Form, Upload, Checkbox, message } from 'antd';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;

const Assign = () => {
  const [classTeachers, setClassTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isAssignmentsModalVisible, setIsAssignmentsModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [title, setTitle] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [completedAssignments, setCompletedAssignments] = useState([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleFileChange = ({ fileList }) => {
    setFileList(fileList);
  };

  const handleSave = async () => {
    if (fileList.length === 0 || !title || selectedStudents.length === 0) {
      alert('Please select at least one file, provide a title, and select students');
      return;
    }

    const storage = getStorage();
    const uploadPromises = fileList.map(file => {
      const fileRef = ref(storage, `assignments/${file.name}`);
      const uploadTask = uploadBytesResumable(fileRef, file.originFileObj);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {},
          (error) => {
            console.error('Error uploading file: ', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ name: file.name, url: downloadURL });
          }
        );
      });
    });

    try {
      const uploadedFiles = await Promise.all(uploadPromises);
      const assignmentData = {
        title,
        files: uploadedFiles,
        timestamp: Timestamp.now()
      };

      const uploadPromisesForStudents = selectedStudents.map(studentId =>
        addDoc(collection(db, 'students', studentId, 'assignments'), assignmentData)
      );

      await Promise.all(uploadPromisesForStudents);

      alert('Files saved successfully');
      setFileList([]);
      setTitle('');
      setSelectedStudents([]);
      setIsUploadModalVisible(false);
    } catch (e) {
      console.error('Error adding document: ', e);
      alert('Failed to save files');
    }
  };

  const handleDelete = async (studentId, assignmentId, files) => {
    const storage = getStorage();

    try {
      await deleteDoc(doc(db, 'students', studentId, 'assignments', assignmentId));
      for (const file of files) {
        const fileRef = ref(storage, `assignments/${file.name}`);
        await deleteObject(fileRef);
      }
      message.success('Assignment deleted successfully');
      fetchAssignments(studentId);
    } catch (error) {
      console.error('Error deleting assignment: ', error);
      message.error('Failed to delete assignment');
    }
  };

  useEffect(() => {
    const fetchClassTeachers = async () => {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const teachersSet = new Set();

      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.classTeacher) {
          teachersSet.add(data.classTeacher);
        }
      });

      setClassTeachers([...teachersSet]);
    };

    fetchClassTeachers();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (selectedTeacher) {
        const q = query(collection(db, 'students'), where('classTeacher', '==', selectedTeacher));
        const querySnapshot = await getDocs(q);
        const studentsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setStudents(studentsList);
      } else {
        setStudents([]);
      }
    };

    fetchStudents();
  }, [selectedTeacher]);

  const fetchAssignments = async (studentId) => {
    const assignmentsQuery = query(collection(db, 'students', studentId, 'assignments'), orderBy('timestamp', 'desc'));
    const assignmentsSnapshot = await getDocs(assignmentsQuery);
    const assignmentsList = assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAssignments(assignmentsList);

    const completedAssignmentsQuery = query(collection(db, 'students', studentId, 'done'), orderBy('timestamp', 'desc'));
    const completedAssignmentsSnapshot = await getDocs(completedAssignmentsQuery);
    const completedAssignmentsList = completedAssignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCompletedAssignments(completedAssignmentsList);

    setIsAssignmentsModalVisible(true);
  };

  const columns = [
    {
      title: 'Select',
      key: 'select',
      render: (text, record) => (
        <Checkbox
          checked={selectedStudents.includes(record.id)}
          onChange={() => handleSelectStudent(record.id)}
        />
      ),
    },
    {
      title: 'Profile Picture',
      dataIndex: 'profilePicture',
      key: 'profilePicture',
      render: (text) => <img src={text} alt="Profile" style={{ width: '50px', borderRadius: '50%' }} />,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Admission No',
      dataIndex: 'admissionNo',
      key: 'admissionNo',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'School',
      dataIndex: 'school',
      key: 'school',
    },
    {
      title: 'Stream',
      dataIndex: 'stream',
      key: 'stream',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary" onClick={() => fetchAssignments(record.id)}>
          View Assignments
        </Button>
      ),
    },
  ];

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prevSelected => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter(id => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  const showUploadModal = () => {
    setIsUploadModalVisible(true);
  };

  const handleCancel = () => {
    setIsUploadModalVisible(false);
    setIsAssignmentsModalVisible(false);
    setFileList([]);
    setTitle('');
    setSelectedStudents([]);
  };

  const handleTableChange = (pagination) => {
    setPagination(pagination);
  };

  const assignmentsColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
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
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="danger"
          icon={<DeleteOutlined />}
          onClick={() => handleDelete(selectedStudents[0], record.id, record.files)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '28px', color: '#333' }}>My Class</h1>
      </header>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h2>Select a Class Teacher</h2>
        <Select
          style={{ width: 200 }}
          placeholder="Select a teacher"
          onChange={setSelectedTeacher}
          value={selectedTeacher}
        >
          {classTeachers.map((teacher, index) => (
            <Option key={index} value={teacher}>
              {teacher}
            </Option>
          ))}
        </Select>
      </div>

      {selectedTeacher && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <h3>Selected Teacher: {selectedTeacher}</h3>
          <Table
            dataSource={students}
            columns={columns}
            rowKey={(record) => record.id}
            style={{ marginTop: '20px' }}
            pagination={{
              ...pagination,
              total: students.length,
              showSizeChanger: true,
              onChange: handleTableChange,
            }}
          />
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button type="primary" onClick={showUploadModal} disabled={selectedStudents.length === 0}>
          Upload Assignment
        </Button>
      </div>

      <Modal
        title="Upload Assignment"
        visible={isUploadModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Form.Item label="Title">
            <Input value={title} onChange={handleTitleChange} />
          </Form.Item>
          <Form.Item label="Upload Files">
            <Upload
              multiple
              beforeUpload={() => false}
              fileList={fileList}
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,image/*,video/*"
            >
              <Button icon={<UploadOutlined />}>Select Files</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Assignments"
        visible={isAssignmentsModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        <div>
          <h2>Current Assignments</h2>
          <Table
            dataSource={assignments}
            columns={assignmentsColumns}
            rowKey={(record) => record.id}
            pagination={false}
            scroll={{ y: 400 }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <h2>Completed Assignments</h2>
          <Table
            dataSource={completedAssignments}
            columns={assignmentsColumns}
            rowKey={(record) => record.id}
            pagination={false}
            scroll={{ y: 400 }}
          />
        </div>
      </Modal>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/home" style={{ color: '#1890ff', fontWeight: 'bold' }}>Go back</Link>
      </div>
    </div>
  );
};

export default Assign;
