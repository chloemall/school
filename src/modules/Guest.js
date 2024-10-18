import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../firebase'; // Assuming your firebase configuration is in a file named firebase.js
import { Typography, Card, Row, Col, Table } from 'antd';

const { Title, Paragraph } = Typography;

const Guest = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const querySnapshot = await getDocs(collection(db, 'teachers'));
      const teachersData = querySnapshot.docs.map((doc) => ({
        key: doc.id,
        ...doc.data(),
      }));
      setTeachers(teachersData);
    };

    fetchTeachers();
  }, []);

  const handleNavigateHome = () => {
    navigate('/'); // Replace with the route to your Home component
  };

  const mission = (
    <Card title="Our Mission">
      <Paragraph>
        At Nobe Academy, we empower students through innovative learning experiences that foster critical thinking, creativity, and lifelong curiosity. Our mission is to cultivate a supportive community where every student thrives academically and personally, preparing them to excel in a dynamic global society.
      </Paragraph>
    </Card>
  );

  const schoolHistory = (
    <Card title="School History" style={{ marginTop: '20px' }}>
      <Paragraph>
        Nobe Academy International School commenced its journey in 2010, nestled in the vibrant community of Imara Daima, Nairobi. Dedicated to academic excellence and holistic development, we proudly uphold the Cambridge education system, catering to both primary and high school students.
      </Paragraph>
      <Paragraph>
        Our school's foundation is built upon a commitment to nurturing well-rounded individuals who embody critical thinking, creativity, and global citizenship. By integrating rigorous academics with innovative teaching methodologies, we empower students to thrive in an ever-evolving world.
      </Paragraph>
      <Paragraph>
        At Nobe Academy, our ethos centers around fostering a supportive learning environment where each student's unique talents and aspirations are celebrated. Beyond academics, we emphasize character development, community engagement, and leadership skills, preparing our students to become compassionate and responsible global citizens.
      </Paragraph>
      <Paragraph>
        With a steadfast dedication to quality education and a forward-thinking approach, Nobe Academy continues to evolve, ensuring our students receive the best possible preparation for future challenges and opportunities in an increasingly interconnected world.
      </Paragraph>
    </Card>
  );

  const directorPInfo = (
    <Card title='' style={{ marginTop: '20px', width: '100%' }}>
       <h3>Benjamin Musyoki - P1 at Shanzu Teachers College</h3>
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={8} style={{ marginBottom: '10px' }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/78%2FWhatsApp%20Image%202024-10-13%20at%2011.32.39%20PM.jpeg?alt=media&token=6e2d0cc4-df2c-45ea-831e-925b1a9c490e"
            alt="Director"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={16}>
          <Paragraph>
            <ul>
          <h3>Education</h3>
              <li>
              Bachelor of Arts in Pastoral and Theology at Scott Christian University (First Class Honors) 
              

              </li>
          <h3> Teaching</h3>
          <li>
          Research Methods.

          </li>
          <li>
        Theological Kiswahili.

          </li>
          <li>
          Public speaking.

          </li>
          <li>
          Biblical Courses and Languages.
            

          </li>
          

            </ul>

          </Paragraph>
        </Col>
      </Row>
    </Card>
  );

  const directorPPInfo = (
    <Card title='' style={{ marginTop: '20px', width: '100%' }}>
      <h3>Rev Stephen Ngari - Assistant Bishop A.I.C Mt. Kenya Area church council</h3>
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={8} style={{ marginBottom: '10px' }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/78%2FWhatsApp%20Image%202024-10-13%20at%2011.32.37%20PM.jpeg?alt=media&token=62c9b707-1d9e-49d7-a003-9feb4c9706d5"
            alt="Director"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={16}>
          <Paragraph>
            <ul>
          <h3>Education</h3>
              <li>
Bachelor of theology- Africa International University

              </li>
              <li style={{ fontStyle: 'italic' }}>
              Diploma in Bible and Theology - Ukamba Bible College 
              </li>
          <h3>Teaching</h3>
          <li>
          Family and Marriage.
          

          </li>
          <li>
          Humanity and sin.
        

          </li>
          <li>
          Angelology.
          

          </li>
          <li>
          Eschatology among many other units.
          
            

          </li>
          

            </ul>

          </Paragraph>
        </Col>
      </Row>
    </Card>
  );

  const directorInfo = (
    <Card title='Rev. John Kimina' style={{ marginTop: '20px', width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={8} style={{ marginBottom: '10px' }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%204.18.17%20PM.jpeg?alt=media&token=a6934448-d38e-4842-b3e8-c3148feef224"
            alt="Director"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={16}>
          <Paragraph>
            <ul>
          <h3>Education</h3>
              <li>
                Bachelor of Theology- Scott Christian University.

              </li>
          <h3>Teaching</h3>
          <li>
           Christian life.

          </li>
          <li>
           Angelology.

          </li>
          <li>
          Pneumatology.

          </li>
          <li>
            Bible geography among other units.

          </li>
          <li>
           The dean of ministries

          </li>

            </ul>

          </Paragraph>
        </Col>
      </Row>
    </Card>
  );

  const principalInfo = (
    <Card title="" style={{ marginTop: '20px', width: '100%' }}>
        <h3>School Principal - Pastor Angela Katunge Maina</h3>

      <Row justify="space-between" align="middle">
        <Col xs={24} sm={8} style={{ marginBottom: '10px' }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%205.04.43%20PM.jpeg?alt=media&token=ac7c09fe-6731-4ad8-9fc2-15a8a156737d" // Replace with the actual HTTPS URL of the principal's image
            alt="Principal"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={16}>
        <Paragraph>
          <ul>
          <h3>Education</h3>
            <li>
             Studied at Africa International University- Bachelor of Theology- first class honors

            </li>
            <li style={{ fontStyle: 'italic' }} >
            East Africa University - Advanced Diploma in Bible and Theology - highest honors
            </li>
            <li style={{ fontStyle: 'italic' }} >
             Yatta College of the Bible. Diploma in Bible and Theology- highest distinction 
            </li>
         <h3>Teaching</h3>
           <li>
           Public Speaking.

           </li>
           <li>
            Humanity and sin.

           </li>
           <li>
             World regions.

           </li>
           <li>
            Africa traditional religion among others

           </li>
           <li>
          Research methods and Bible study Methods among other units

           </li>
          </ul>
        </Paragraph>
        
     
          
        </Col>
      </Row>
    </Card>
  );

  const deputyInfo = (
    <Card title=" Pastor Elizabeth Musyoki" style={{ marginTop: '20px', width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={8} style={{ marginBottom: '10px' }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%204.47.05%20PM.jpeg?alt=media&token=9c9dc436-8a39-4613-8389-309926a0271c" // Replace with the actual HTTPS URL of the principal's image
            alt="Principal"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={16}>
          <Paragraph>
            <ul>
            <h3>Education</h3>
              <li>
               Bachelor in Christian Counselling: PAC University

              </li>
              <li>
              Bachelor in Christian Counselling: PAC University

              </li>
            </ul>
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );

  const lect = (
    <Card title="Rev. Leonard Maingi. " style={{ marginTop: '20px', width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={8} style={{ marginBottom: '10px' }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-08%20at%2012.24.45%20AM.jpeg?alt=media&token=284ffa8c-ca67-4295-8f54-3bad46c1b1bd" // Replace with the actual HTTPS URL of the principal's image
            alt="Principal"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={16}>
          <Paragraph>
            <ul>
          <h3>Education</h3>
          <li>
          Bachelor of Theology of AIU .

          </li>
          <li style={{ fontStyle: 'italic' }} >
          Diploma in christian leadership of PAC university,

          </li>
          <li style={{ fontStyle: 'italic' }} >
          Diploma in African christian leadership,
          </li>
          <li style={{ fontStyle: 'italic' }} >
          Certificate of Bible Teaching College of Pastors.
          </li>
         <h3>Teaching</h3>
         <li>
          
         Lecturer of Pentateuch.
         </li>
         <li>
          
          Cults.
         </li>
         <li>
          
          Church planting and growth.
         </li>
         <li>
           Poetic & wisdom literature.

         </li>
         <li>
         Church leadership and administration.

         </li>
         <li>
         Apologetics.

         </li>
         <li>
         Hermeneutics.

         </li>
         <li>
         African independent churches.

         </li>
            </ul>
  

          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
 
  const seniorInfo = (
    <Card title="Pst. Milcah Kariuki " style={{ marginTop: '20px', width: '100%' }}>
      <Row justify="space-between" align="middle">
        <Col xs={24} sm={8} style={{ marginBottom: '10px' }}>
          <img
            src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/church%2FWhatsApp%20Image%202024-10-07%20at%2010.18.17%20PM.jpeg?alt=media&token=32133590-2cf7-4a61-9cae-86448da52bae" // Replace with the actual HTTPS URL of the principal's image
            alt="Principal"
            style={{ width: '100%', borderRadius: '8px' }}
          />
        </Col>
        <Col xs={24} sm={16}>
        <Paragraph>
        <ul>

          <h3>Education</h3>
            <li>
            Bachelor of Education - Nazarene University 

            </li>
            <li style={{ fontStyle: 'italic' }} >
          Diploma in Bible and Theology.. Moffat college of the Bible

            </li>
            <h3>Teaching</h3>
            <li>
             English.

          </li>
          <li>
          Principles.
          </li>
          
   <li>
   Church history among other units
   </li>
          </ul>

          </Paragraph>
        </Col>
      </Row>
    </Card>
  );

  

  const columns = [
    {
      title: 'Profile Picture',
      dataIndex: 'profilePicture',
      key: 'profilePicture',
      render: (text) => <img src={text} alt="Profile" style={{ width: '50px', borderRadius: '8px' }} />,
    },
    {
      title: 'Full Name',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
  ];

  const aboutUsSection = (
    <Card title="About Us">
      <Paragraph>
      A.I.C Tharaka Bible College was established in April 2018 by A.I.C Tharaka regional church council under the supervision of A.I.C Mt. Kenya area church council. It is a community of Christians united in the acknowledgement of Jesus Christ as lord and savior and striving to grow into maturity in the knowledge of the lord. His mission as a community is to send the blessed gospel light into the world which is build on the great commission in Mathew 28:19-20. In its training programs it prepares men and women to serve the church through the ministry of pastor, teacher, evangelist, missionary and other forms of christian ministry. It expects those enrolling in its programs to have experienced the call of God to the ministry to which they are training and that this call will be confirmed by the community of their fellow Christians.
      </Paragraph>
     
        
    </Card>
  );

  const statementOfFaithSection = (
    <Card title="Statement of Faith" style={{ marginTop: '20px' }}>
      <Paragraph>
      As a community of Christians who acknowledge Jesus Christ as Lord and Saviour, we affirm our belief in:
        <ul>
          <li>The unity and trinity of God, eternally existing in three co-equal persons, the Father, the Son, and the Holy Spirit.</li>
          <li>God the creator and preserver of all things, who created man, male and female, in his own image and gave them dominion over the earthly creation.</li>
          <li>The deity and humanity of God the son, the Lord Jesus Christ, who being very God also became man, being begotten by the Holy Spirit, born of the virgin Mary was crucified, dead and buried, was raised bodily from the dead and ascended to the right hand of the father, whose two natures continue eternally and inseparably joined together in one person.</li>
          <li>The deity and personality of God the Holy Spirit and the necessity of his work to make the death of Christ effective to the individual sinner, granting him repentance toward God and faith in the Lord Jesus Christ; and in his ministry dwelling permanently within and working through the believer for Godly life and service.</li>
          <li>The divine verbal inspiration and infallibility of the scriptures of Old and New Testament as originally given and their absolute and final authority in all matters of faith and conduct.</li>
          <li>The universal sinfulness and guilty of human nature since the fall, rendering man subject to God’s wrath and condemnation.</li>
          <li>The sacrificial death of our representative and substitute, the Lord Jesus Christ, the incarnate son of God, by the shedding of whose blood atonement was made for the sins of the world whereby alone men are redeemed from guilty, penalty and power of sin and death.</li>
          <li>The necessity of the new birth as the work of God and the Holy Spirit, that men are saved by grace through faith not by works.</li>
        <li>The Eternal security of the believer, based entirely on the atoning work of the Lord Jesus Christ, whereby, as a born again child of God, he has assurance of salvation and has the right to all privileges of the sons of God.</li>
        <li>The true church, whose head is the Lord Jesus Christ and whose members are all regenerate persons united to Christ and to one another by baptism of the Holy Spirit.</li>
       <li>The observance of the ordinances of Baptism and the Lord’s supper as appointed by Lord Jesus Christ.</li>
        </ul>
      </Paragraph>
      <h3 style={{ fontSize: '16px' }}>Vision:</h3>
<Paragraph style={{ fontSize: '16px' }}>
  Sending the light of the gospel to all nations. (Matthew 28:18-20)
</Paragraph>

<h3 style={{ fontSize: '16px' }}>Mission:</h3>
<Paragraph style={{ fontSize: '16px' }}>
  A.I.C Tharaka Bible College is committed to fulfilling the Great Commission through biblical studies that equip everyone with useful tools and skills for reaching out.
</Paragraph>

     
    </Card>
  );

  const goalsSection = (
    <Card title="GOALS OF THE COLLEGE" style={{ marginTop: '20px' }}>
      <p>The college aims to prepare its students for effective ministry through the appropriate development of knowledge, skills, and character. Its goals, accordingly, are grouped under these three headings.</p>
      <Title level={4}>Knowledge Goals</Title>
      <ul>
        <li>A working knowledge of scripture that includes both an overview of its teaching and an ability for in-depth exposition of specific passages.</li>
        <li>A systematic understanding of Christian theology consistent with the philosophy of the college. A critical understanding of the relations between the Christian faith and theology on the one hand and other religions and ideologies that are significant in the contemporary context on the other hand.</li>
        <li>A historical perspective based on the study of church history that provides historical insights for dealing with issues facing the church in Africa today.</li>
      <li>An identification of possibilities for expressing Christianity in ways that are appropriate and relevant to contemporary African culture. An understanding of the relations between Christian faith and theology on the one hand and the wider issues of daily life, including other areas of learning, on the other hand.</li>
      </ul>

      <Title level={4}>Skills Goals</Title>
      <ul>
     <li>Interpreting scripture through the use of sound exegetical principles.</li> 
     <li>
     Applying the teaching of scripture to practical problems in contemporary situations.

     </li>
     <li>
     Applying the teaching of scripture to practical problems in contemporary situations.

     </li>
     <li>
     Communicating the gospel through a variety of media with an emphasis on preaching and teaching.

     </li>
     <li>
     Sharing the gospel with people of diverse religious backgrounds and those claiming to follow no religion, in order to lead them to personal faith in Jesus Christ.

     </li>
     <li>
Nurturing in the word of God those who profess a personal faith in Jesus Christ.

     </li>
     <li>
      Communication and church development in cross-cultural contexts in response to the gospel imperative to make Christ known to all peoples.

     </li>
     <li>
Conducting effective church education programmes for all ages.

     </li>
<li>
 Counseling people in need, employing responsible, biblically informed counseling principles.

</li>
<li>
Performing the appropriate ordinances, ceremonies, and pastoral duties as expected and authorized by the students' church.

</li>
<li>
 Exercising leadership in a manner that is effective in implementing changes that ensure the continued effectiveness of the ministries of the church while being sensitive to the need for stability, continuity, and unity in the life of the church.

</li>
<li>
Managing the organizational affairs of a church, including the creative solution of problems that arise in church life.

</li>
       
      </ul>

      <Title level={4}>Character Goals</Title>
      <p> 
        <li>
        (i) A daily life of prayer and diligence in listening to and obeying the word of God with an attitude of dependence on the Holy Spirit.

        </li>
        <li>
        (ii) An understanding of the self as a unique person made in God’s image in community with others.

        </li>
        <li>
        (iii) An understanding of the qualities of a godly character as described in scripture.

        </li>                    
        <li>
       (iv) The practice of a well-balanced lifestyle that integrates spiritual, physical, emotional, intellectual, and social interests.

        </li>
        <li>
         (v) A patient daily living based on a complete confidence in the authority and trustworthiness of scriptures as the guide to good life.

        </li>
        
 </p>
 <h3>From Principal's Desk </h3>
          <Paragraph>
Greetings in the name of our lord Jesus Christ. 
A.I.C Tharaka Bible College is established on the Vision of sending the light of Christ to the world. 
We intentionally hammer our core values that define our ethos and serve as markers for our journey. J
esus Christ is the ultimate focus and purpose of Tharaka Bible College. He is the supreme model, demonstrating 
a life of genuine integrity and holiness and biblical servant leadership ( Phil 2:5-11). The holy bible is the 
basis for our faith and practice. It is the authoritative foundation of our institution. ATBC is a unique community, which is spiritually alive, strategically focused, academically excellent, and actively preparing true servant leaders for today's cultural challenges. If you are looking for a place to develop your God given gifts, I encourage you to consider A.I.C Tharaka Bible College.
Welcome all!!!
For more information contact: 0792358587 -principal 
Or 
0722235387- BOM Chairman
          </Paragraph>
    </Card>
  );

  const classImages = (
    <div style={{ marginTop: '40px' }}>
      <Title level={3}>Current Facilities</Title>
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Card title="Current Classroom">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-12%20at%207.27.17%20AM.jpeg?alt=media&token=c57123d2-fafc-4699-ac47-2081dd4dfa70" // Replace with actual URL
              alt="Current Classroom"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Current Ladies Dormitory">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-12%20at%207.27.18%20AM.jpeg?alt=media&token=ea33ff52-8df0-421e-99e4-75acace235a3" // Replace with actual URL
              alt="Current Ladies Dormitory"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col xs={24} md={12}>
          <Card title="Classroom Under Construction">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-12%20at%207.27.19%20AM.jpeg?alt=media&token=2d8bdc86-f699-4515-909f-d6e46e47588c" // Replace with actual URL
              alt="Classroom Under Construction"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Current Men Dormitory">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-12%20at%207.27.16%20AM.jpeg?alt=media&token=bbe932d8-7997-45f0-9929-104dc8ee88a7" // Replace with actual URL
              alt="Current Men Dormitory"
              style={{ width: '100%', borderRadius: '8px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );

  return (
    <div className="guest-container" style={{ padding: '20px' }}>
      
      <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
        <img
          alt="School"
          src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.11%20PM.jpeg?alt=media&token=08803a46-8fe1-4e8d-82e8-2cec6bd83e13"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {aboutUsSection}
      {statementOfFaithSection}
      {goalsSection}
      </div>
      <Row justify="space-between" style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12}>
          {principalInfo}
        </Col>
        <Col xs={24} sm={12}>
          {directorInfo}
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12}>
          {directorPPInfo}
        </Col>
        <Col xs={24} sm={12}>
          {directorPInfo}
        </Col>
      </Row>
      <Row justify="space-between" style={{ marginTop: '20px' }}>
        <Col xs={24} sm={12}>
          {deputyInfo}
        </Col>
        <Col xs={24} sm={12}>
          {seniorInfo}
        </Col>
        <Col xs={24} sm={12}>
          {lect}
        </Col>
      </Row>
      <div style={{ marginTop: '20px' }}>
      {/* Top sections */}
      {aboutUsSection}
      {statementOfFaithSection}
      {goalsSection}
        <Title level={2}>Our Teachers</Title>
        <Table columns={columns} dataSource={teachers} pagination={{ pageSize: 5 }} />
        {classImages}

      </div>
     
    </div>
  );
};

export default Guest;
