import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDocs, collection, query, where, addDoc, doc, updateDoc, deleteDoc, Timestamp, getDoc } from 'firebase/firestore';
import { Modal, Input, Button, Form, Select, message, Table } from 'antd';
import { db } from '../firebase'; // Assuming your firebase configuration is in a file named firebase.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const { Option } = Select;

const List = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isGradeModalVisible, setIsGradeModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [gradeForm] = Form.useForm();
  const [tableTitles, setTableTitles] = useState([]);
  const [selectedTableTitle, setSelectedTableTitle] = useState('');
  const [marksData, setMarksData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [grades, setGrades] = useState({});
  const [gradeDocId, setGradeDocId] = useState(null);

  const gradeOptions = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'E'];

  useEffect(() => {
    const fetchClasses = async () => {
      const querySnapshot = await getDocs(collection(db, 'students'));
      const classesSet = new Set();

      querySnapshot.forEach(doc => {
        const data = doc.data();
        if (data.class) {
          classesSet.add(data.class);
        }
      });

      setClasses([...classesSet]);
    };

    fetchClasses();

    const fetchTableTitles = async () => {
      const tableTitlesArray = [];

      const studentsSnapshot = await getDocs(collection(db, 'students'));

      for (const docSnapshot of studentsSnapshot.docs) {
        const studentId = docSnapshot.id;

        const marksSnapshot = await getDocs(collection(db, 'students', studentId, 'marks'));

        marksSnapshot.forEach(markDoc => {
          const markData = markDoc.data();
          if (markData.tableTitle && !tableTitlesArray.includes(markData.tableTitle)) {
            tableTitlesArray.push(markData.tableTitle);
          }
        });
      }

      setTableTitles(tableTitlesArray);
    };

    fetchTableTitles();
  }, []);

  const generateTable = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  const calculateTotalMarks = (marksData) => {
    return Object.keys(marksData)
      .filter(key => !['admissionNo', 'fullName', 'phoneNumber', 'id', 'tableTitle', 'tableId', 'studentId', 'timestamp', 'totalMarks', 'meanMarks'].includes(key))
      .reduce((sum, key) => sum + parseInt(marksData[key], 10), 0);
  };

  const calculateMeanMarks = (marksData) => {
    const subjects = Object.keys(marksData)
      .filter(key => !['admissionNo', 'fullName', 'phoneNumber', 'id', 'tableTitle', 'tableId', 'studentId', 'timestamp', 'totalMarks', 'meanMarks'].includes(key));

    if (subjects.length === 0) return 0;

    const totalMarks = calculateTotalMarks(marksData);
    return totalMarks / subjects.length;
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { tableTitle, subjects } = values;

      if (!selectedClass) {
        message.error('Please select a class');
        return;
      }

      const tableId = generateTable();

      const q = query(collection(db, 'students'), where('class', '==', selectedClass));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(async docSnapshot => {
        const studentData = docSnapshot.data();
        const marksData = {
          tableTitle,
          tableId,
          admissionNo: studentData.admissionNo,
          fullName: studentData.fullName,
          phoneNumber: studentData.phoneNumber,
          timestamp: Timestamp.now(),
        };

        subjects.forEach(subject => {
          marksData[subject] = 0; // Initialize the subject with 0 marks
        });

        marksData.totalMarks = calculateTotalMarks(marksData);
        marksData.meanMarks = calculateMeanMarks(marksData);

        await addDoc(collection(db, 'students', docSnapshot.id, 'marks'), marksData);
      });

      message.success('Marks saved successfully');
      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Failed to save marks');
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleTableTitleSelect = async (value) => {
    setSelectedTableTitle(value);

    const marksDataArray = [];

    const studentsSnapshot = await getDocs(collection(db, 'students'));

    for (const docSnapshot of studentsSnapshot.docs) {
      const studentId = docSnapshot.id;

      const marksSnapshot = await getDocs(collection(db, 'students', studentId, 'marks'));

      marksSnapshot.forEach(markDoc => {
        const markData = markDoc.data();
        if (markData.tableTitle === value) {
          marksDataArray.push({
            id: markDoc.id,
            studentId,
            ...markData,
            timestamp: markData.timestamp ? markData.timestamp.toDate().toString() : 'N/A'
          });
        }
      });
    }

    setMarksData(marksDataArray);

    const gradesQuery = query(collection(db, 'grades'), where('tableTitle', '==', value));
    const gradesSnapshot = await getDocs(gradesQuery);

    if (!gradesSnapshot.empty) {
      const gradeDoc = gradesSnapshot.docs[0];
      setGradeDocId(gradeDoc.id);
      setGrades(gradeDoc.data().grades);
    } else {
      setGradeDocId(null);
      setGrades({});
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    editForm.setFieldsValue(record);
    setIsEditModalVisible(true);
  };

  const handleEditSave = async () => {
    try {
      const values = await editForm.validateFields();
      const updatedData = { ...editingRecord, ...values };

      updatedData.totalMarks = calculateTotalMarks(updatedData);
      updatedData.meanMarks = calculateMeanMarks(updatedData);

      await updateDoc(doc(db, 'students', editingRecord.studentId, 'marks', editingRecord.id), updatedData);

      setMarksData(prevData => prevData.map(item => (item.id === editingRecord.id ? updatedData : item)));
      setIsEditModalVisible(false);
      message.success('Marks updated successfully');
    } catch (error) {
      message.error('Failed to update marks');
      console.error(error);
    }
  };

  const handleEditCancel = () => {
    setIsEditModalVisible(false);
    editForm.resetFields();
  };

  const handleDeleteTable = async () => {
    try {
      const studentsSnapshot = await getDocs(collection(db, 'students'));

      for (const docSnapshot of studentsSnapshot.docs) {
        const studentId = docSnapshot.id;

        const marksSnapshot = await getDocs(collection(db, 'students', studentId, 'marks'));

        marksSnapshot.forEach(async markDoc => {
          const markData = markDoc.data();
          if (markData.tableTitle === selectedTableTitle) {
            await deleteDoc(doc(db, 'students', studentId, 'marks', markDoc.id));
          }
        });
      }

      message.success('Table and associated marks deleted successfully');
      setSelectedTableTitle('');
      setMarksData([]);
      setTableTitles(prevTitles => prevTitles.filter(title => title !== selectedTableTitle));
    } catch (error) {
      message.error('Failed to delete table');
      console.error(error);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text(`Marks Table for ${selectedTableTitle}`, 10, 10);
    const tableColumns = [
      { header: 'Admission No', dataKey: 'admissionNo' },
      { header: 'Full Name', dataKey: 'fullName' },
      { header: 'Phone Number', dataKey: 'phoneNumber' },
      { header: 'Total Marks', dataKey: 'totalMarks' },
      { header: 'Mean Marks', dataKey: 'meanMarks' },
      { header: 'Table ID', dataKey: 'tableId' },
      { header: 'Timestamp', dataKey: 'timestamp' },
      ...Object.keys(marksData.length > 0 ? marksData[0] : {}).filter(key => key !== 'admissionNo' && key !== 'fullName' && key !== 'phoneNumber' && key !== 'id' && key !== 'tableTitle' && key !== 'tableId' && key !== 'studentId' && key !== 'timestamp' && key !== 'totalMarks' && key !== 'meanMarks').map(subject => ({ header: subject, dataKey: subject })),
    ];

    const tableRows = marksData.map(item => ({
      admissionNo: item.admissionNo,
      fullName: item.fullName,
      phoneNumber: item.phoneNumber,
      totalMarks: item.totalMarks,
      meanMarks: item.meanMarks.toFixed(2),
      tableId: item.tableId,
      timestamp: item.timestamp,
      ...Object.keys(marksData.length > 0 ? marksData[0] : {}).filter(key => key !== 'admissionNo' && key !== 'fullName' && key !== 'phoneNumber' && key !== 'id' && key !== 'tableTitle' && key !== 'tableId' && key !== 'studentId' && key !== 'timestamp' && key !== 'totalMarks' && key !== 'meanMarks').reduce((acc, key) => {
        acc[key] = item[key];
        return acc;
      }, {}),
    }));

    doc.autoTable({
      columns: tableColumns,
      body: tableRows,
    });

    doc.save(`${selectedTableTitle}.pdf`);
  };

  const handleSetGrades = () => {
    gradeForm.setFieldsValue(
      gradeOptions.reduce((acc, option) => {
        acc[`${option}Min`] = grades[option] ? grades[option][0] : undefined;
        acc[`${option}Max`] = grades[option] ? grades[option][1] : undefined;
        return acc;
      }, {})
    );
    setIsGradeModalVisible(true);
  };

  const handleGradeSave = async () => {
    try {
      const values = await gradeForm.validateFields();
      const gradesData = {};

      gradeOptions.forEach(option => {
        gradesData[option] = [values[`${option}Min`], values[`${option}Max`]];
      });

      if (gradeDocId) {
        await updateDoc(doc(db, 'grades', gradeDocId), {
          grades: gradesData,
          timestamp: Timestamp.now(),
        });
      } else {
        await addDoc(collection(db, 'grades'), {
          tableTitle: selectedTableTitle,
          grades: gradesData,
          timestamp: Timestamp.now(),
        });
      }

      setGrades(gradesData);
      setIsGradeModalVisible(false);
      message.success('Grades saved successfully');
      gradeForm.resetFields();
    } catch (error) {
      message.error('Failed to save grades');
      console.error(error);
    }
  };

  const handleGradeCancel = () => {
    setIsGradeModalVisible(false);
    gradeForm.resetFields();
  };

  const columns = [
    { title: 'Admission No', dataIndex: 'admissionNo', key: 'admissionNo' },
    { title: 'Full Name', dataIndex: 'fullName', key: 'fullName' },
    { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber' },
    {
      title: 'Total Marks',
      dataIndex: 'totalMarks',
      key: 'totalMarks',
    },
    {
      title: 'Mean Marks',
      key: 'meanMarks',
      render: (_, record) => {
        return record.meanMarks.toFixed(2);
      },
    },
    { title: 'Timestamp', dataIndex: 'timestamp', key: 'timestamp' },
    ...Object.keys(marksData.length > 0 ? marksData[0] : {}).filter(key => key !== 'admissionNo' && key !== 'fullName' && key !== 'phoneNumber' && key !== 'id' && key !== 'tableTitle' && key !== 'tableId' && key !== 'studentId' && key !== 'timestamp' && key !== 'totalMarks' && key !== 'meanMarks').map(subject => ({
      title: subject,
      dataIndex: subject,
      key: subject,
    })),
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <span>
          <Link onClick={() => handleEdit(record)}>Edit</Link>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2>Class List</h2>
      <Select
        style={{ width: 200 }}
        placeholder="Select Class"
        onChange={setSelectedClass}
      >
        {classes.map(cls => (
          <Option key={cls} value={cls}>
            {cls}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={() => setIsModalVisible(true)} disabled={!selectedClass}>
        Add Marks
      </Button>
      <Button type="primary" onClick={handleDownloadPDF} disabled={!selectedTableTitle}>
        Download PDF
      </Button>
      <Button type="danger" onClick={handleDeleteTable} disabled={!selectedTableTitle}>
        Delete Table
      </Button>
      <Button type="default" onClick={handleSetGrades} disabled={marksData.length === 0}>
        Set Subjects Grades
      </Button>
      <Select
        style={{ width: 200, marginLeft: 10 }}
        placeholder="Select Table Title"
        onChange={handleTableTitleSelect}
      >
        {tableTitles.map(title => (
          <Option key={title} value={title}>
            {title}
          </Option>
        ))}
      </Select>
      <Table
        dataSource={marksData}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 20 }}
      />

      <Modal title="Add Marks" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form}>
          <Form.Item
            label="Table Title"
            name="tableTitle"
            rules={[{ required: true, message: 'Please enter table title' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Subjects"
            name="subjects"
            rules={[{ required: true, message: 'Please enter subjects' }]}
          >
            <Select mode="tags" style={{ width: '100%' }} placeholder="Enter subjects" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Edit Marks" visible={isEditModalVisible} onOk={handleEditSave} onCancel={handleEditCancel}>
        <Form form={editForm}>
          {Object.keys(editingRecord || {}).map(key => {
            if (
              key !== 'admissionNo' &&
              key !== 'fullName' &&
              key !== 'phoneNumber' &&
              key !== 'id' &&
              key !== 'tableTitle' &&
              key !== 'tableId' &&
              key !== 'studentId' &&
              key !== 'timestamp' &&
              key !== 'totalMarks' &&
              key !== 'meanMarks'
            ) {
              return (
                <Form.Item key={key} label={key} name={key}>
                  <Input type="number" />
                </Form.Item>
              );
            }
            return null;
          })}
        </Form>
      </Modal>

      <Modal title="Set Subject Grades" visible={isGradeModalVisible} onOk={handleGradeSave} onCancel={handleGradeCancel}>
        <Form form={gradeForm}>
          {gradeOptions.map(option => (
            <div key={option} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Form.Item
                label={`${option} Min`}
                name={`${option}Min`}
                rules={[{ required: true, message: `Please enter minimum marks for ${option}` }]}
              >
                <Input type="number" />
              </Form.Item>
              <Form.Item
                label={`${option} Max`}
                name={`${option}Max`}
                rules={[{ required: true, message: `Please enter maximum marks for ${option}` }]}
              >
                <Input type="number" />
              </Form.Item>
            </div>
          ))}
        </Form>
      </Modal>
    </div>
  );
};

export default List;
