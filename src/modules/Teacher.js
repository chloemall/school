import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, message, Table, Upload, DatePicker, Radio, TimePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { addDoc, collection, serverTimestamp, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import moment from 'moment';
import { db } from '../firebase'; // Make sure to import db from your Firebase configuration
import './Students.css'; // Make sure to import your stylesheet

const Teacher = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false);
  const [isSignOutModalVisible, setIsSignOutModalVisible] = useState(false);
  const [studentData, setStudentData] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [filteredStudentData, setFilteredStudentData] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setImageUrl('');
    setSelectedStudent(null);
  };

  const fetchStudentData = async () => {
    try {
      const studentsCollection = collection(db, 'teachers');
      const studentsSnapshot = await getDocs(studentsCollection);
      const students = [];
      studentsSnapshot.forEach((doc) => {
        const data = doc.data();
        students.push({
          key: doc.id,
          id: data.id,
          profilePicture: data.profilePicture,
          fullName: data.fullName,
          year: data.year,
          department: data.department,
          school: data.school,
          class: data.class,
          stream: data.stream,
        });
      });
      setStudentData(students);
      setFilteredStudentData(students);
    } catch (error) {
      console.error('Error fetching student data:', error);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const onFinish = async (values) => {
    try {
      const studentData = {
        profilePicture: imageUrl,
        fullName: values.fullName,
        school: values.school,
        class: values.class,
        stream: values.stream,
        id: values.id,
        department: values.department,
        timestamp: serverTimestamp(),
        year: values.year,
      };

      const docRef = await addDoc(collection(db, 'teachers'), studentData);

      message.success('Teacher created successfully!');
      setIsModalVisible(false);
      setImageUrl('');

      fetchStudentData();

      setSelectedStudent({ key: docRef.id, ...studentData });
    } catch (error) {
      console.error('Error creating teacher:', error);

      if (error.message) {
        console.error('Error message:', error.message);
      }

      message.error('Failed to create teacher.');
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const columns = [
    {
      title: 'Profile Picture',
      dataIndex: 'profilePicture',
      key: 'profilePicture',
      render: (profilePicture) => (
        <img src={profilePicture} alt="Profile" style={{ width: '50px', height: '50px' }} />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Full Names',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'School',
      dataIndex: 'school',
      key: 'school',
    },
  ];

  const handleSearch = (value) => {
    const filteredStudents = studentData.filter(
      (student) => student.id.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredStudentData(filteredStudents);
  };

  const onSearchChange = (e) => {
    const { value } = e.target;
    handleSearch(value);
  };

  const onRowClick = async (record) => {
    setSelectedStudent(record);
    showModal();
    fetchAttendanceData(record.key); // Fetch attendance data for the selected teacher
  };

  const fetchAttendanceData = async (teacherId) => {
    try {
      const attendanceCollection = collection(db, 'teachers', teacherId, 'attendance');
      const attendanceSnapshot = await getDocs(attendanceCollection);
      const attendance = [];
      attendanceSnapshot.forEach((doc) => {
        const data = doc.data();
        attendance.push({
          key: doc.id,
          date: data.date.toDate(), // Convert Firestore timestamp to JS Date object
          status: data.status,
          signOutTime: data.signOutTime ? data.signOutTime.toDate() : null,
        });
      });
      // Sort attendance data to display newest first
      setAttendanceData(attendance.sort((a, b) => b.date - a.date));
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  const handleAttendance = () => {
    setIsAttendanceModalVisible(true);
  };

  const handleAttendanceCancel = () => {
    setIsAttendanceModalVisible(false);
  };

  const handleAttendanceSubmit = async (values) => {
    try {
      const attendanceDateTime = moment(values.date).set({
        hour: values.time.hour(),
        minute: values.time.minute(),
        second: values.time.second(),
      }).toDate();

      const attendanceData = {
        date: attendanceDateTime,
        status: values.status,
      };

      await addDoc(collection(db, 'teachers', selectedStudent.key, 'attendance'), attendanceData);

      message.success('Attendance marked successfully!');
      setIsAttendanceModalVisible(false);

      fetchAttendanceData(selectedStudent.key); // Refresh attendance data
    } catch (error) {
      console.error('Error marking attendance:', error);
      message.error('Failed to mark attendance.');
    }
  };

  const handleSignOut = async () => {
    try {
      if (selectedAttendance) {
        const attendanceDocRef = doc(db, 'teachers', selectedStudent.key, 'attendance', selectedAttendance.key);
        await updateDoc(attendanceDocRef, {
          signOutTime: serverTimestamp(),
        });

        message.success('Signed out successfully!');
        setIsSignOutModalVisible(false);
        fetchAttendanceData(selectedStudent.key); // Refresh attendance data
      } else {
        message.warning('Please select an attendance record to sign out.');
      }
    } catch (error) {
      console.error('Error signing out:', error);
      message.error('Failed to sign out.');
    }
  };

  const generateId = () => {
    const randomId = Math.floor(10000000 + Math.random() * 90000000); // Generate a random 8-digit number
    return randomId.toString();
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const uploadProps = {
    beforeUpload: async (file) => {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          setImageUrl(reader.result);
        };
      } catch (error) {
        console.error('Error uploading image:', error);
      }
      return false;
    },
  };

  const tailLayout = {
    wrapperCol: { offset: 6, span: 18 },
  };

  const getMonthData = (data) => {
    const filteredData = data.filter(item => {
      const day = item.date.getDay();
      return day !== 0 && day !== 6; // Filter out weekends
    });

    const currentMonth = moment().month();
    const monthlyData = filteredData.filter((record) => moment(record.date).month() === currentMonth);

    const summary = {
      present: monthlyData.filter((record) => record.status === 'Present').length,
      absent: monthlyData.filter((record) => record.status === 'Absent').length,
      absentWithPermission: monthlyData.filter((record) => record.status === 'Absent with Permission').length,
    };

    return summary;
  };

  return (
    <div>
      <div className="container">
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ marginBottom: '16px' }}
        >
          Back
        </Button>

        <Button type="primary" onClick={showModal} style={{ marginBottom: '16px' }}>
          Create Teacher
        </Button>

        <Input
          placeholder="Search by ID"
          onChange={onSearchChange}
          style={{ marginBottom: '16px', width: '100%' }}
        />

        {/* Teacher Creation Modal */}
        <Modal
          title="Create a Teacher"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            {...layout}
            name="createTeacher"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Upload Image"
              name="image"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />} style={{ width: '100%' }}>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>

            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Please enter the full name!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="School"
              name="school"
              rules={[{ required: true, message: 'Please enter the school!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Classes you teach"
              name="class"
              rules={[{ required: true, message: 'Please enter the class!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Streams you Teach"
              name="stream"
              rules={[{ required: true, message: 'Please enter the stream!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="ID"
              name="id"
              initialValue={generateId()} // Set initial value to generated ID
              rules={[{ required: true, message: 'Please enter the ID!' }]}
            >
              <Input readOnly />
            </Form.Item>

            <Form.Item
              label="Department"
              name="department"
              rules={[{ required: true, message: 'Please enter the department!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Years of Teaching"
              name="year"
              rules={[{ required: true, message: 'Please enter the year!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Teacher List */}
        <Table
          dataSource={filteredStudentData}
          columns={columns}
          onRow={(record) => ({
            onClick: () => onRowClick(record),
          })}
          style={{ backgroundColor: 'white' }}
        />

        {/* Display selected teacher details */}
        <Modal
          title={`Details for ID: ${selectedStudent?.id}`}
          visible={!!selectedStudent}
          onCancel={handleCancel}
          footer={null}
        >
          {/* Existing details */}
          <p><strong>Full Name:</strong> {selectedStudent?.fullName}</p>
          <p><strong>School:</strong> {selectedStudent?.school}</p>
          <p><strong>Class:</strong> {selectedStudent?.class}</p>
          <p><strong>Stream:</strong> {selectedStudent?.stream}</p>
          <p><strong>Department:</strong> {selectedStudent?.department}</p>
          <p><strong>Year:</strong> {selectedStudent?.year}</p>

          {/* Display profile picture */}
          {selectedStudent?.profilePicture && (
            <div>
              <img src={selectedStudent.profilePicture} alt="Profile" style={{ width: '100px', height: '100px' }} />
            </div>
          )}

          {/* Attendance Summary */}
          <div>
            <h3>Attendance Summary</h3>
            {attendanceData.length > 0 ? (
              <>
                <p><strong>Present Days:</strong> {getMonthData(attendanceData).present}</p>
                <p><strong>Absent Days:</strong> {getMonthData(attendanceData).absent}</p>
                <p><strong>Absent with Permission:</strong> {getMonthData(attendanceData).absentWithPermission}</p>
              </>
            ) : (
              <p>No attendance data available.</p>
            )}
            <Button type="primary" onClick={handleAttendance}>
              Mark Attendance
            </Button>
          </div>

          {/* Attendance Table */}
          <Table
            dataSource={attendanceData}
            columns={[
              {
                title: 'Date',
                dataIndex: 'date',
                key: 'date',
                render: (date) => moment(date).format('YYYY-MM-DD'),
              },
              {
                title: 'Time In',
                dataIndex: 'date',
                key: 'timeIn',
                render: (date) => moment(date).format('HH:mm:ss'),
              },
              {
                title: 'Time Out',
                dataIndex: 'signOutTime',
                key: 'timeOut',
                render: (timeOut) => (timeOut ? moment(timeOut).format('HH:mm:ss') : 'N/A'),
              },
              {
                title: 'Status',
                dataIndex: 'status',
                key: 'status',
              },
            ]}
            pagination={false}
            rowKey="key"
            style={{ marginTop: '20px' }}
            onRow={(record) => ({
              onClick: () => {
                setSelectedAttendance(record);
                setIsSignOutModalVisible(true);
              },
            })}
          />
        </Modal>

        {/* Attendance Modal */}
        <Modal
          title="Mark Attendance"
          visible={isAttendanceModalVisible}
          onCancel={handleAttendanceCancel}
          footer={null}
        >
          <Form
            {...layout}
            name="markAttendance"
            initialValues={{ remember: true }}
            onFinish={handleAttendanceSubmit}
          >
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select the date!' }]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Time"
              name="time"
              rules={[{ required: true, message: 'Please select the time!' }]}
            >
              <TimePicker />
            </Form.Item>

            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select the status!' }]}
            >
              <Radio.Group>
                <Radio value="Present">Present</Radio>
                <Radio value="Absent">Absent</Radio>
                <Radio value="Absent with Permission">Absent with Permission</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Sign Out Modal */}
        <Modal
          title="Sign Out"
          visible={isSignOutModalVisible}
          onCancel={() => setIsSignOutModalVisible(false)}
          footer={[
            <Button key="back" onClick={() => setIsSignOutModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={handleSignOut}>
              Sign Out
            </Button>,
          ]}
        >
          <p>Are you sure you want to sign out?</p>
        </Modal>
      </div>
    </div>
  );
};

export default Teacher;
