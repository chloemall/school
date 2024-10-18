import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Carousel, Table, Button, Modal, Row, Col } from 'antd';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import ReactPlayer from 'react-player';
import { MenuOutlined, BookOutlined, LaptopOutlined, TeamOutlined, TrophyOutlined, GlobalOutlined } from '@ant-design/icons';
import AboutCard from './AboutCard'; // Adjust the path based on your file structure
import SchoolCard from './SchoolCard'; // Adjust the path based on your file structure

const Home = () => {
  const [events, setEvents] = useState([]);
  const [tables, setTables] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      const eventsList = querySnapshot.docs.map(doc => doc.data());
      setEvents(eventsList);
    };

    const fetchTables = async () => {
      const querySnapshot = await getDocs(collection(db, 'tables'));
      const tablesList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTables(tablesList);
    };

    fetchEvents();
    fetchTables();

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsModalVisible(false);
  };

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = true;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tableColumns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text, record) => new Date(record.timestamp.seconds * 1000).toLocaleString(),
    },
    {
      title: 'Download',
      key: 'download',
      render: (text, record) => (
        <Button type="primary" onClick={() => handleDownload(record.link)}>
          Download
        </Button>
      ),
    },
  ];

  const imageUrls = [
    "https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-03%20at%205.32.16%20PM.jpeg?alt=media&token=e78913cd-1f58-4eb0-afb6-1f4dad2752c5",
    "https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-03%20at%205.32.18%20PM%20(3).jpeg?alt=media&token=2f8143d1-cac8-4a24-b2fe-f4bae7d5133e",
    "https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-03%20at%205.32.15%20PM.jpeg?alt=media&token=849c5c52-0628-43b7-b226-8108054d19ca",
    "https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-03%20at%205.32.12%20PM.jpeg?alt=media&token=ecfda0c3-43cb-4e4e-b03d-4030e9f5986d"
  ,
  'https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-03%20at%205.32.11%20PM.jpeg?alt=media&token=ea080820-1dff-451b-8a0f-47ed48824d4c',
  'https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-03%20at%205.32.10%20PM.jpeg?alt=media&token=b9230eb7-2b34-4805-8397-46d209d4bceb'
 ,
 'https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-03%20at%205.32.10%20PM.jpeg?alt=media&token=b9230eb7-2b34-4805-8397-46d209d4bceb'
];

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
        
      <div style={styles.container}>
        <div style={styles.overlay}>
         
          <h4 style={styles.title}>A.I.C Tharaka Bible College</h4>
        </div>
      </div>
  
      {events.length > 0 && (
        <Carousel autoplay autoplaySpeed={7000} style={styles.carousel} dotPosition="bottom">
          {events.map((event, index) => (
            <div key={index}>
              <Card style={styles.card}>
                <img
                  alt="event icon"
                  src="https://media.istockphoto.com/id/460357293/vector/graduation-cap.jpg?s=612x612&w=0&k=20&c=L7K9xiWX9rMWF26PzQJdSCl2f3QhWsIUOt07dPBq-QI="
                  style={styles.icon}
                />
                <h3 style={styles.cardTitle}>{event.title}</h3>
                <p style={styles.cardContent}>{event.subject}</p>
                <p style={styles.cardContent}>
                  {new Date(event.timestamp.seconds * 1000).toLocaleString()}
                </p>
              </Card>
            </div>
          ))}
        </Carousel>
      )}
      <Card style={styles.aboutCard}>
        <img
          alt="school logo"
          src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.12%20PM.jpeg?alt=media&token=f7d14585-7ff9-48fe-98c3-3c4e76b453fe" // Replace with the actual URL of the school logo
          style={styles.logo}
        />
       
      </Card>
<AboutCard />

      <h2>Our Graduations</h2>

      <Carousel autoplay autoplaySpeed={5000} dotPosition="bottom">
        {imageUrls.map((url, index) => (
          <div key={index}>
            <Card style={styles.card}>

              <img
                src={url}
                alt={`slide-${index}`}
                style={styles.image}
              />
            </Card>
          </div>
        ))}
      </Carousel>

    

      <Card style={styles.tablesCard}>
        <h2>Fee Structures</h2>
        <Table
          columns={tableColumns}
          dataSource={tables}
          rowKey="id"
          pagination={false}
        />
      </Card>
      <h2 style={styles.sectionTitle}>Why Choose Us</h2>
      <Carousel autoplay autoplaySpeed={5000} style={styles.carousel} dotPosition="bottom">
        <div>
          <Card style={styles.whyCard}>
            <BookOutlined style={styles.whyIcon} />
            <h3 style={styles.whySubtitle}><strong>Academic System</strong></h3>
          </Card>
        </div>
        <div>
          <Card style={styles.whyCard}>
            <LaptopOutlined style={styles.whyIcon} />
            <h3 style={styles.whySubtitle}><strong>Modern Teaching Method</strong></h3>
          </Card>
        </div>
        <div>
          <Card style={styles.whyCard}>
            <TeamOutlined style={styles.whyIcon} />
            <h3 style={styles.whySubtitle}><strong>Empowering Student Life</strong></h3>
          </Card>
        </div>
        <div>
          <Card style={styles.whyCard}>
            <TrophyOutlined style={styles.whyIcon} />
            <h3 style={styles.whySubtitle}><strong>Track Record of Excellence</strong></h3>
          </Card>
        </div>
        <div>
          <Card style={styles.whyCard}>
            <GlobalOutlined style={styles.whyIcon} />
            <h3 style={styles.whySubtitle}><strong>Ease of Transfer Reach</strong></h3>
          </Card>
        </div>
      </Carousel>
    </div>
  );
};

const styles = {
  
  container: {
    position: 'relative',
    backgroundImage: 'url(https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.11%20PM.jpeg?alt=media&token=08803a46-8fe1-4e8d-82e8-2cec6bd83e13)', // Replace with your image URL
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '68vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px' // Adjust as needed
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark gradient
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px'
  },
  sidebarContainer: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    display: 'flex',
    alignItems: 'center'
  },
  menuIcon: {
    display: 'block', // Always show the menu icon on small screens
    cursor: 'pointer'
  },
  sidebar: {
    position: 'absolute',
    top: '40px',
    right: '10px',
    backgroundColor: '#333', // Dark background
    color: 'white',
    padding: '10px',
    borderRadius: '5px'
  },
  menu: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'row',
    gap: '20px'
  },
  menuColumn: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  menuItem: {
    fontSize: '18px',
    color: 'white',
    cursor: 'pointer'
  },
  title: {
    color: 'white',
    fontSize: '48px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 'auto'
  },
  carousel: {
    width: '100%',
    maxWidth: '100%',
    marginTop: '20px'
  },
  card: {
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  },
  icon: {
    width: '100px',
    height: 'auto',
    margin: '0 auto'
  },
  cardTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  cardContent: {
    fontSize: '18px',
    marginBottom: '5px'
  },
  aboutCard: {
    width: '100%',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  logo: {
    width: '300px',
    height: 'auto',
    display: 'block',
    margin: '0 auto'
  },
  motto: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginTop: '10px'
  },
  aboutText: {
    fontSize: '18px',
    marginTop: '10px'
  },
  videoCard: {
    width: '100%',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  videoTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px'
  },
  playerWrapper: {
    position: 'relative',
    paddingTop: '56.25%', // 16:9 aspect ratio (for responsive player)
  },
  reactPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  tablesCard: {
    width: '100%',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    marginTop: '20px'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '36px',
    fontWeight: 'bold',
    margin: '50px 0',
  },
  whyCard: {
    width: '80%',
    margin: '50px auto',
    padding: '30px',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
  },
  whyIcon: {
    fontSize: '50px',
    color: '#1890ff',
    marginBottom: '20px',
  },
  whySubtitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  menuColumn: {
    listStyleType: 'none',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },  imageRowContainer: {
    padding: '0 10%',
    overflowX: 'auto', // Allow horizontal scrolling on small screens
  },
  imageRowContainer: {
    padding: '0 10%',
    overflowX: 'auto', // Allow horizontal scrolling on small screens
    whiteSpace: 'nowrap', // Keep images in a single row
  },
  imageRow: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px 0',
    flexWrap: 'nowrap', // Prevent wrapping in a new row
  },
  col: {
    flex: '0 0 auto', // Ensure each column maintains its size and doesn't shrink
  },
  card: {
    width: '100%',
    height: '60vh',  // Adjust height based on your needs
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',  // Background for better visibility
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'cover',  // Ensures images scale without distortion
    borderRadius: '10px',  // Optional for smooth edges
  }
};

export default Home;
