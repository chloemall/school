import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Col, Form, Input, Row } from 'antd';
import { addDoc, collection, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const generateRandomId = async () => {
  let isUnique = false;
  let randomId = '';

  while (!isUnique) {
    randomId = '';
    for (let i = 0; i < 10; i++) {
      const digit = Math.floor(Math.random() * 10);
      randomId += digit;
    }

    // Check if the generated ID already exists in the database
    const q = query(collection(db, 'books'), where('id', '==', randomId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      isUnique = true;
    }
  }

  return randomId;
};

const Book = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [generatedId, setGeneratedId] = useState('');

  const handleBackClick = () => {
    navigate('/library');
  };

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const id = await generateRandomId();
      setGeneratedId(id); // Set the generated ID to display before saving

      const bookData = {
        id,
        timestamp: serverTimestamp(),
        bookName: values.bookName,
        bookClass: values.bookClass,
        category: values.category,
        bookType: values.bookType,
        // Optional fields
        floor: values.floor || null,
        cabinetNo: values.cabinetNo || null,
        shelveNo: values.shelveNo || null,
        cartonNo: values.cartonNo || null,
      };

      await addDoc(collection(db, 'books'), bookData);

      alert('Book saved successfully in the database!');

      form.resetFields();
      setGeneratedId(''); // Reset the displayed ID after saving
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error saving the book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Row justify="center" style={{ marginBottom: '20px' }}>
        <Col>
          <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>School Library</h1>
        </Col>
        <Col>
          <Button type="primary" onClick={handleBackClick}>Back</Button>
        </Col>
      </Row>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item label="Book Name" name="bookName" rules={[{ required: true, message: 'Please input the book name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Book Class" name="bookClass" rules={[{ required: true, message: 'Please input the book class!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please input the category!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Book Type" name="bookType" rules={[{ required: true, message: 'Please input the book type!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Floor" name="floor">
              <Input />
            </Form.Item>
            <Form.Item label="Cabinet No" name="cabinetNo">
              <Input />
            </Form.Item>
            <Form.Item label="Shelve No" name="shelveNo">
              <Input />
            </Form.Item>
            <Form.Item label="Carton No" name="cartonNo">
              <Input />
            </Form.Item>
            {generatedId && (
              <Form.Item label="Generated ID">
                <Input value={generatedId} disabled />
              </Form.Item>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Book;
