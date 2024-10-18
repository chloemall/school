import React, { useState, useEffect } from 'react';
import { Button, Input, Table, message } from 'antd';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';



const German = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [classTotal, setClassTotal] = useState({});

  const handleGoBack = () => {
    navigate('/library');
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const q = query(collection(db, 'books'), where('category', '==', 'German'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const booksData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setBooks(booksData);

          // Calculate totalBooks and classTotal
          let total = 0;
          let classTotalCount = {};

          booksData.forEach((book) => {
            total++;

            // Calculate classTotal
            if (classTotalCount[book.bookClass]) {
              classTotalCount[book.bookClass]++;
            } else {
              classTotalCount[book.bookClass] = 1;
            }
          });

          setTotalBooks(total);
          setClassTotal(classTotalCount);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };

    fetchBooks();
  }, []);

  const columns = [
    {
      title: 'Book Class',
      dataIndex: 'bookClass',
      key: 'bookClass',
      width: 100,
    },
    {
      title: 'Book Name',
      dataIndex: 'bookName',
      key: 'bookName',
      width: 130,
    },
    {
      title: 'Book Type',
      dataIndex: 'bookType',
      key: 'bookType',
      width: 100,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text, record) => (
        record.timestamp ? new Date(record.timestamp.seconds * 1000).toLocaleString() : '-'
      ),
      width: 100,
    },
    
    {
      title: 'Cabinet No',
      dataIndex: 'cabinetNo',
      key: 'cabinetNo',
      width: 150,
    },
    {
      title: 'Shelve No',
      dataIndex: 'shelveNo',
      key: 'shelveNo',
      width: 100,
    },
    
    {
      title: 'Book Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: 'Admission No',
      dataIndex: 'admissionNo',
      key: 'admissionNo',
      width: 100,
    },
    {
      title: 'Student Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 100,
    },
    {
      title: 'Total Books',
      key: 'totalBooks',
      render: (text, record, index) => {
        return index === 0 ? <span>{totalBooks}</span> : null;
      },
      width: 100,
    },
  ];

  
  const handleSearch = () => {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();

    const results = books.filter(
      (book) =>
        (!trimmedSearchTerm ||
          (book.id && book.id.toLowerCase().includes(trimmedSearchTerm)) ||
          (book.bookClass && book.bookClass.toLowerCase().includes(trimmedSearchTerm)) ||
          (book.bookType && book.bookType.toLowerCase().includes(trimmedSearchTerm)) ||
          (book.bookName && book.bookName.toLowerCase().includes(trimmedSearchTerm)))
    );

    setSearchResults(results);

    if (trimmedSearchTerm && results.length === 0) {
      message.error('No book with this ID, Book Class, Book Type, or Book Name exists in the database.');
    }

    let total = 0;
    let classTotalCount = {};

    results.forEach((book) => {
      total++;

      if (book.bookClass) {
        // Calculate classTotal
        if (classTotalCount[book.bookClass]) {
          classTotalCount[book.bookClass]++;
        } else {
          classTotalCount[book.bookClass] = 1;
        }
      }
    });

    setTotalBooks(total);
    setClassTotal(classTotalCount);
  };
  

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="app">
      <header className="header">
        <Button type="link" onClick={handleGoBack} icon={<ArrowLeftOutlined />} />
        <h1 className="title" style={{ color: 'black', marginLeft: '16px' }}>
           
        </h1>
        <Input
          placeholder="Search by ID, Book Class, Book Type, or Book Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '300px', marginRight: '16px' }}
        />
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
          Search
        </Button>
        <Button type="default" onClick={handleClearSearch}>
          Clear
        </Button>
      </header>
      <div className="container" style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '16px' }}>Total Books: {totalBooks}</div>
        <Table
          columns={columns}
          dataSource={searchResults.length > 0 ? searchResults : books}
          pagination={false}
          scroll={{ x: '100%' }} // Enable horizontal scrolling
        />
      </div>
    </div>
  );
};

export default German;
