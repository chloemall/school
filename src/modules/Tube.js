import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Card, Row, Col, Spin, Input, Button } from 'antd'; // Import Input for search functionality
import { db } from '../firebase';
import './Tube.css';
import logoImage from '../data/image1.jpeg'; // Import your local image

const subjects = ['All', 'Documentary', 'Animation', 'Mathematics', 'Biology', 'Science', 'English', 'Geography', 'Kiswahili', 'Physics', 'Chemistry', 'Home Science', 'Music', 'Computer', 'Art', 'Business', 'Religious Education', 'Agriculture', 'History', 'Engineering', 'Civics', 'Social Studies', 'Sign Language', 'German', 'French'];

const Video = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(subjects[0]);
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]); // State for filtered videos
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'tube'));
        const videosData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setVideos(videosData);
        setFilteredVideos(videosData); // Initially set filtered videos to all videos
      } catch (error) {
        console.error('Error fetching videos: ', error);
      }
    };

    fetchVideos();
  }, []);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleThumbnailChange = (e) => {
    setThumbnailFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      // Reset filtered videos if search term is empty
      setFilteredVideos(videos);
    } else {
      // Filter videos by title or subject
      const filtered = videos.filter((video) =>
        video.title.toLowerCase().includes(term) || video.category.toLowerCase().includes(term)
      );
      setFilteredVideos(filtered);
    }
  };

  const handleSave = async () => {
    if (!videoFile || !title || !thumbnailFile) {
      alert('Please select a video file, thumbnail, and provide a title');
      return;
    }

    setLoading(true);

    const storage = getStorage();
    const videoRef = ref(storage, `videos/${videoFile.name}`);
    const uploadTask = uploadBytesResumable(videoRef, videoFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Progress tracking
      },
      (error) => {
        console.error('Error uploading video: ', error);
        setLoading(false);
      },
      async () => {
        const videoDownloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        const reader = new FileReader();
        reader.readAsDataURL(thumbnailFile);
        reader.onloadend = async () => {
          const base64Thumbnail = reader.result;

          try {
            const docRef = await addDoc(collection(db, 'tube'), {
              title: title,
              video: videoDownloadURL,
              thumbnail: base64Thumbnail,
              category: subject,
            });
            console.log('Document written with ID: ', docRef.id);
            alert('Video saved successfully');
            setVideoFile(null);
            setThumbnailFile(null);
            setTitle('');
            setSubject(subjects[0]);

            const newVideo = { id: docRef.id, title: title, video: videoDownloadURL, thumbnail: base64Thumbnail, category: subject };
            setVideos([...videos, newVideo]);
            setFilteredVideos([...videos, newVideo]);
          } catch (e) {
            console.error('Error adding document: ', e);
            alert('Failed to save video');
          } finally {
            setLoading(false);
          }
        };
      }
    );
  };

  return (
    <div className="home-container">
     

      <div className="content-container">
        <div id="logo">
          <img
            src={logoImage} // Use the imported local image
            alt="Logo"
            className="logo-image"
          />
        </div></div>

      <Input
        placeholder="Search by title or subject"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px' }}
      />

      <Link to="/home">Go back</Link>

      <Row gutter={[16, 16]}>
        {filteredVideos.map((video) => (
          <Col key={video.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              cover={<video controls src={video.video} style={{ width: '100%' }} />}
            >
              <Card.Meta title={video.title} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Video;
