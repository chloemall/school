import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Button, Calendar, Avatar, List } from 'antd';
import { ArrowRightOutlined, BookOutlined, BulbOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import moment from 'moment';

const { Title, Text } = Typography;

const Dash = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(moment().format('HH:mm:ss'));

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'students'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserData(querySnapshot.docs[0].data());
          fetchAssignments(querySnapshot.docs[0].id);
          fetchEvents();
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format('HH:mm:ss'));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEventIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [events]);

  const fetchAssignments = async (userDocId) => {
    const assignmentsCollection = collection(db, 'students', userDocId, 'assignments');
    const q = query(assignmentsCollection, where('timestamp', '>=', moment().subtract(48, 'hours').toDate()));
    const assignmentSnapshot = await getDocs(q);
    const assignmentList = assignmentSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setAssignments(assignmentList);
  };

  const fetchEvents = async () => {
    const eventsCollection = collection(db, 'events');
    const eventsSnapshot = await getDocs(eventsCollection);
    const eventList = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setEvents(eventList);
  };

  const handleCardClick = (assignmentId) => {
    navigate('/exam', { state: { assignmentId } });
  };

  if (!userData) {
    return <div>Loading...</div>; // You can replace this with a spinner or skeleton loader
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={16}>
          <Card style={styles.profileCard}>
            <Row align="middle">
              <Col span={16}>
                <Title level={4} style={{ color: '#fff' }}>Your Profile</Title>
                <Text style={{ color: '#fff' }}>Hi {userData.fullName}, Welcome to {userData.school}  Student portal. Feel free to manage 
                  your student account.</Text>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Avatar size={80} src={userData.profilePicture} alt="Profile Picture" />
              </Col>
            </Row>
          </Card>

          <Card title="Upcoming Events" style={{ marginTop: '20px' }}>
            <div style={styles.eventRow}>
              {events.length > 0 && (
                <Card
                  key={events[currentEventIndex].id}
                  hoverable
                  style={styles.eventCard}
                >
                  <div style={styles.overlay}>
                    <img src="https://www.edgeip.com/images/FCK/Image/202209/Northeastern-OnlineClassTips.jpg" alt="Event Image" style={styles.image} />
                    <div style={styles.textOverlay}>
                      <Text style={{ color: '#fff' }}>{events[currentEventIndex].title}</Text>
                      <Text style={{ color: '#fff' }}>{events[currentEventIndex].subject}</Text>
                      <Text style={{ color: '#fff' }}>{moment(events[currentEventIndex].timestamp.toDate()).format('MMMM Do YYYY, h:mm:ss a')}</Text>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </Card>

          <Card title="Your Assignments" style={{ marginTop: '20px' }}>
            <div style={styles.assignmentRow}>
              {assignments.map(assignment => (
                <Card
                  key={assignment.id}
                  hoverable
                  style={styles.assignmentCard}
                  onClick={() => handleCardClick(assignment.id)}
                >
                  <BookOutlined style={styles.assignmentIcon} />
                  <Title level={5}>{assignment.subject}</Title>
                  <Text>Status: {assignment.status}</Text>
                  <ArrowRightOutlined style={styles.icon} />
                </Card>
              ))}
            </div>
          </Card>

         

          <Card title="Lessons for you" style={{ marginTop: '20px' }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card hoverable style={styles.lessonCard}>
                  <div style={styles.overlay}>
                    <img src="https://www.faulkner.edu/wp-content/uploads/Student-taking-online-class.jpg" alt="Lesson Image" style={styles.image} />
                    <div style={styles.textOverlay}>
                      <Text style={{ color: '#fff' }}>Join millions of students in Nobe for tutorials, tuitions, tests.</Text>
                      <Text style={{ color: '#fff' }}>Download Nobe app at Playstore</Text>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card style={styles.calendarCard}>
            <Row justify="space-between" align="middle">
              <Col>
                <Avatar size={64} src={userData.profilePicture} alt="Profile Picture" />
              </Col>
              <Col>
                <Button type="primary" onClick={() => navigate('/')}>Home</Button>
              </Col>
            </Row>
            <Title level={4} style={{ marginTop: '20px' }}>Current Time</Title>
            <Text>{currentTime}</Text>
            <Calendar fullscreen={false} style={{ marginTop: '20px' }} />
          </Card>

          <Card title="" style={{ marginTop: '20px' }}>
            <List
              itemLayout="horizontal"
              dataSource={[
                { title: 'Upload Assignment', icon: <BookOutlined /> },
                { title: 'Study for Quiz', icon: <BulbOutlined /> },
                { title: 'Parent Consultation', icon: <TeamOutlined /> },
                { title: 'Spell Check English', icon: <BookOutlined /> },
              ]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta avatar={item.icon} title={item.title} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  profileCard: {
    backgroundColor: 'orangered',
    padding: '20px',
    borderRadius: '10px',
    color: '#fff',
  },
  assignmentRow: {
    display: 'flex',
    overflowX: 'scroll',
  },
  assignmentCard: {
    textAlign: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: '10px',
    padding: '20px',
    minWidth: '200px',
    marginRight: '10px',
  },
  assignmentIcon: {
    fontSize: '40px',
    color: '#1890ff',
    marginBottom: '10px',
  },
  eventRow: {
    display: 'flex',
    justifyContent: 'center',
    overflowX: 'hidden',
  },
  eventCard: {
    textAlign: 'center',
    borderRadius: '10px',
    padding: '0',
    overflow: 'hidden',
    minWidth: '100%',
    maxWidth: '100%',
  },
  overlay: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  textOverlay: {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    maxHeight: '100%', // Ensure the overlay text does not overflow
  },
  lessonCard: {
    textAlign: 'center',
    borderRadius: '10px',
    padding: '0', // Remove padding to fit
  },
  lessonCard: {
    textAlign: 'center',
    borderRadius: '10px',
    padding: '0', // Remove padding to fit image
    overflow: 'hidden',
    minWidth: '100%',
    maxWidth: '100%',
  },
  calendarCard: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
  },
  icon: {
    fontSize: '24px',
    color: '#1890ff',
  },
};

export default Dash;
