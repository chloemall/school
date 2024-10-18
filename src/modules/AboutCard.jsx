import React from 'react';
import { Card, Typography } from 'antd';

const { Paragraph, Title } = Typography;

const AboutUsCard = () => {
  return (
    <div
      style={{
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      <Card
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          flexDirection: 'row', // Default row for large screens
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden',
          flexWrap: 'wrap',
        }}
        bodyStyle={{
          padding: '0', // Remove default padding
        }}
      >
        {/* Image on the left */}
        <div
          style={{
            flex: '1',
            minWidth: '300px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#e0e0e0',
          }}
        >
          
        </div>

        {/* Text content on the right */}
        <div
          style={{
            flex: '2',
            padding: '20px',
            minWidth: '300px',
          }}
        >
          <Title level={2}>About Us</Title>
          <Paragraph>
            A.I.C Tharaka Bible College was established in April 2018 by A.I.C Tharaka regional church council under the supervision of A.I.C Mt. Kenya area church council. It is a community of Christians united in the acknowledgement of Jesus Christ as Lord and Savior, striving to grow into maturity in the knowledge of the Lord. His mission as a community is to send the blessed gospel light into the world, built on the Great Commission in Matthew 28:19-20.
          </Paragraph>

          <Title level={4}>Statement of Faith</Title>
          <Paragraph>
            As a community of Christians who acknowledge Jesus Christ as Lord and Savior, we affirm our belief in:
            <ul>
              <li>The unity and trinity of God, eternally existing in three co-equal persons: the Father, the Son, and the Holy Spirit.</li>
              <li>God the creator and preserver of all things, who created man in his image and gave them dominion over creation.</li>
              <li>The deity and humanity of God the Son, Jesus Christ, who, being very God, also became man, born of the Virgin Mary, was crucified, dead, buried, and raised bodily from the dead.</li>
              <li>The necessity of the Holy Spirit's work to make Christ’s death effective to the individual sinner and enable faith in Jesus Christ.</li>
              <li>The divine inspiration and infallibility of the scriptures as the final authority in all matters of faith and conduct.</li>
              <li>The sinfulness of human nature, rendering man subject to God's wrath and condemnation.</li>
              <li>The sacrificial death of Jesus Christ, whose blood atonement redeems men from guilt, penalty, and the power of sin.</li>
              <li>The necessity of new birth, salvation by grace through faith, and the eternal security of the believer.</li>
              <li>The true Church, whose head is Jesus Christ, whose members are united by the Holy Spirit.</li>
              <li>The observance of Baptism and the Lord’s Supper as appointed by Christ.</li>
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

          <Title level={4}>Goals of the College</Title>
          <Paragraph>
            <Title level={5}>Knowledge Goals</Title>
            <ul>
              <li>A working knowledge of scripture, including an overview of its teaching and ability for in-depth exposition of passages.</li>
              <li>A systematic understanding of Christian theology consistent with the philosophy of the college.</li>
              <li>A critical understanding of Christian faith in contemporary culture, with historical insights from church history.</li>
              <li>An understanding of Christianity's relevance to contemporary African culture.</li>
            </ul>

            <Title level={5}>Skills Goals</Title>
            <ul>
              <li>Interpreting scripture using sound exegetical principles.</li>
              <li>Applying scripture to practical problems and communicating the gospel effectively through preaching, teaching, and media.</li>
              <li>Leading church development and education programs across cultural contexts.</li>
              <li>Counseling people in need using biblically-informed principles.</li>
            </ul>

            <Title level={5}>Character Goals</Title>
            <ul>
              <li>A daily life of prayer, listening to and obeying God’s word, and depending on the Holy Spirit.</li>
              <li>An understanding of oneself as a unique person made in God’s image, in community with others.</li>
              <li>Practicing a well-balanced lifestyle that integrates spiritual, physical, emotional, and intellectual interests.</li>
              <li>Living in confidence based on the authority of scripture and participating in communal Christian life with love and care for one another.</li>
            </ul>
          </Paragraph>
          <h3>From Principal's Desk </h3>
          <Paragraph>
Greetings in the name of our lord Jesus Christ. 
A.I.C Tharaka Bible College is established on the Vision of sending
 the light of Christ to the world. We intentionally hammer our core 
 values that define our ethos and serve as markers for our journey. 
 Jesus Christ is the ultimate focus and purpose of Tharaka Bible College. 
 
 He is the supreme model, demonstrating a life of genuine integrity and holiness 
 and biblical servant leadership ( Phil 2:5-11). The holy bible is the basis for our f
 aith and practice. It is the authoritative foundation of our institution. ATBC is a unique community, which is spiritually alive, strategically focused, academically excellent, and actively preparing true servant leaders for today's cultural challenges. If you are looking for a place to develop your God given gifts, I encourage you to consider A.I.C Tharaka Bible College.
Welcome all!!!
For more information contact: 0792358587 -principal 
Or 
0722235387- BOM Chairman
          </Paragraph>
         
        </div>
        
      </Card>
     
    </div>
  );
};

export default AboutUsCard;
