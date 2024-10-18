import React, { useState, useEffect } from 'react';
import { Menu, Typography, message, Upload, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import {
   PoweroffOutlined, UploadOutlined, DashboardOutlined, YoutubeOutlined, BookOutlined, UserOutlined, FileTextOutlined, TeamOutlined, SolutionOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const SideMenu = () => {
  const navigate = useNavigate();
  const [analyticsExpanded, setAnalyticsExpanded] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'students'), where('uid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          setUserData(querySnapshot.docs[0].data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Display a confirmation dialog before logging out
    if (window.confirm('Are you sure you want to log out?')) {
      signOut(auth)
        .then(() => {
          // Add any additional cleanup or redirection logic here
          navigate('/'); // Redirect to the login page after logout
        })
        .catch((error) => {
          console.error('Logout error:', error.message);
        });
    }
  };

  const handleUpload = async (file) => {
    setLoading(true);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64url = reader.result;

      try {
        const user = auth.currentUser;
        if (user) {
          const q = query(collection(db, 'students'), where('uid', '==', user.uid));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const studentDoc = querySnapshot.docs[0];
            const studentDocRef = doc(db, 'students', studentDoc.id);

            await updateDoc(studentDocRef, { profilePicture: base64url });

            setUserData((prevData) => ({
              ...prevData,
              profilePicture: base64url,
            }));

            message.success('Profile picture updated successfully!');
          }
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
        message.error('Failed to update profile picture.');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      console.error('Error reading file');
      message.error('Failed to read file.');
      setLoading(false);
    };
  };

  const menuItems = [
    {
      key: '/dash',
      label: 'DashBoard',
      icon: <DashboardOutlined style={{ color: 'white' }} />,
    },
    {
      key: '/library',
      label: 'Fees',
      icon: <BookOutlined style={{ color: 'white' }} />,
    },
    {
      key: '/Subject',
      label: 'School Attendance',
      icon: <UserOutlined style={{ color: 'white' }} />,
    },
    {
      key: '/students',
      label: 'Library Books',
      icon: <TeamOutlined style={{ color: 'white' }} />,
    },
    {
      key: '/marks',
      label: 'Grades',
      icon: <SolutionOutlined style={{ color: 'white' }} />,
    },
    {
      key: '/exam',
      label: 'Assignments',
      icon: <FileTextOutlined style={{ color: 'white' }} />,
    },
    { key: '/tube', label: 'School Tube', icon: <YoutubeOutlined style={{ color: 'white' }} /> }

  ];

  const textStyles = {
    fontWeight: 'bold',
    fontSize: '16px',
    color: 'white', // Set text color to white
  };

  const menuStyle = {
    backgroundColor: 'black',
    color: 'white',
    border: 'none',
  };

  return (
    <>
      {/* User Profile */}
      {userData && (
        <div style={{ textAlign: 'center', margin: '20px 0', color: 'white' }}>
          <img
            src={userData.profilePicture}
            alt="Profile"
            style={{
              borderRadius: '50%',
              width: '100px',
              height: '100px',
              objectFit: 'cover',
            }}
          />
          <div style={{ marginTop: '10px' }}>
            <Text style={{ ...textStyles, fontSize: '18px' }}>{userData.fullName}</Text>
          </div>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleUpload(file);
              return false; // Prevent automatic upload
            }}
          >
            <Button icon={<UploadOutlined />} loading={loading}>
              Change Profile Picture
            </Button>
          </Upload>
        </div>
      )}
      <Menu selectedKeys={[window.location.pathname]} mode="vertical" style={menuStyle}>
        {menuItems.map((menuItem) => (
          <Menu.Item key={menuItem.key} onClick={() => navigate(menuItem.key)} icon={menuItem.icon}>
            <Link to={menuItem.key}>
              <Text style={textStyles}>{menuItem.label}</Text>
            </Link>
          </Menu.Item>
        ))}
        {/* Logout item */}
        <Menu.Item key="logout" onClick={handleLogout} icon={<PoweroffOutlined style={{ color: 'white' }} />}>
          <Text style={textStyles}>Log Out</Text>
        </Menu.Item>
      </Menu>
    </>
  );
};

export default SideMenu;
