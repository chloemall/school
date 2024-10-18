import React from 'react';
import { Row, Col, Card, Typography, Divider, Table } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const gradingColumns = [
  {
    title: 'Grade',
    dataIndex: 'grade',
    key: 'grade',
  },
  {
    title: 'Percentage',
    dataIndex: 'percentage',
    key: 'percentage',
  },
  {
    title: 'Grade Points',
    dataIndex: 'points',
    key: 'points',
  },
  {
    title: 'Achievement Level',
    dataIndex: 'achievement',
    key: 'achievement',
  },
];

const gradingData = [
  { key: '1', grade: 'A', percentage: '92 - 100', points: '4.0', achievement: 'Greatest Distinction' },
  { key: '2', grade: 'A-', percentage: '88 - 91', points: '3.7', achievement: '' },
  { key: '3', grade: 'B+', percentage: '84 - 87', points: '3.3', achievement: 'Great Distinction' },
  { key: '4', grade: 'B', percentage: '80 - 83', points: '3.0', achievement: '' },
  { key: '5', grade: 'B-', percentage: '76 - 79', points: '2.7', achievement: '' },
  { key: '6', grade: 'C+', percentage: '72 - 75', points: '2.3', achievement: 'Distinction' },
  { key: '7', grade: 'C', percentage: '68 - 71', points: '2.0', achievement: '' },
  { key: '8', grade: 'C-', percentage: '64 - 67', points: '1.7', achievement: '' },
  { key: '9', grade: 'D+', percentage: '60 - 63', points: '1.3', achievement: 'Passing' },
  { key: '10', grade: 'D', percentage: '55 - 59', points: '1.0', achievement: '' },
  { key: '11', grade: 'D-', percentage: '50 - 54', points: '0.7', achievement: '' },
  { key: '12', grade: 'F', percentage: 'Below 50', points: '0.0', achievement: 'Failure' },
];

const Roll = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '0px' }}>
      {/* Image Section */}
      <div style={{ width: '100%', height: '400px', overflow: 'hidden' }}>
        <img
          alt="School"
          src="https://firebasestorage.googleapis.com/v0/b/college-1db7d.appspot.com/o/WhatsApp%20Image%202024-09-29%20at%2012.49.11%20PM.jpeg?alt=media&token=08803a46-8fe1-4e8d-82e8-2cec6bd83e13"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      {/* Content Section */}
      <Row justify="center" style={{ marginTop: '20px' }}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card hoverable style={{ marginBottom: '20px' }}>
            <Title level={3} style={{ textAlign: 'center' }}>Courses & Admission</Title>
            <Divider />
            <Paragraph>
              <strong>Course identification:</strong>
              <br />
              BIB.. Indicates biblical studies course units
              <br />
              THE.. Indicates theological studies course units
              <br />
              GEN.. Indicates General studies course units
              <br />
              MIN... Indicates Ministry studies course units
            </Paragraph>

            <Title level={4}>Distinctive of the College</Title>
            <Paragraph>
              1. The college is an institution devoted to professional training to prepare students for Christian ministry, based on biblical values.
              <br />
              2. It is Bible-based, where biblical values guide all aspects of its purpose, structure, and programs.
              <br />
              3. The college maintains an integral relationship with the church, preserving its mission and identity.
              <br />
              4. It affirms the absolute authority and reliability of scriptures and salvation by grace through faith in Jesus Christ.
            </Paragraph>

            <Title level={4}>Admission Requirements</Title>
            <Paragraph>
              Our intakes are in September, January, and May every year. Applicants should meet the following:
            </Paragraph>
            <Paragraph>
              <strong>Call to Christian Ministry</strong>
              <br />
              A personal testimony of faith in Jesus Christ, a life of obedience, and involvement in service within the church.
              <br />
              Recognition from the applicant’s church that they are fit for theological training.
            </Paragraph>

            <Paragraph>
              <strong>Academic Qualifications</strong>
              <br />
              A minimum of D+ in KCSE or a certificate in Christian ministries with a GPA of 3.3. Applicants should be at least 17 years old. The diploma course lasts 3 years with 54 units and includes a 10-week internship.
            </Paragraph>
          </Card>

          {/* Assessment and Grading Section */}
          <Card hoverable style={{ marginTop: '20px' }}>
            <Title level={3} style={{ textAlign: 'center' }}>Assessment and Grading</Title>
            <Divider />
            <Paragraph>
              The continuous assessment task counts for at least 40% but not more than 50% of the course grade in any course. Continuous assessment tests may include tests or short examinations, written papers, oral presentations, brief research assignments, or investigative reports. A major end-of-course examination or comparable major assessment task accounts for the remainder of the course grade.
            </Paragraph>
            <Title level={4}>Grading Scale</Title>
            <Table 
              dataSource={gradingData} 
              columns={gradingColumns} 
              pagination={false} 
              bordered
            />

            <Title level={4}>Field Education Learning Grading</Title>
            <Paragraph>
              A: Exceptional achievement in meeting the specified learning objectives. <br />
              B: Substantial progress in achieving the objectives. <br />
              C: Progress made, but more work is needed. <br />
              F: Failure to make significant progress.
            </Paragraph>

            <Title level={4}>Academic Regulations</Title>
            <Title level={5}>Class Attendance</Title>
            <Paragraph>
              A student is required to attend all scheduled classes unless authority for absence is obtained from the dean of students. The dean of students advises all lecturers concerned of all authorized absences. A student with more than two unauthorized absences in one course shall fail the course concerned.
            </Paragraph>

            <Title level={5}>Late Assignments</Title>
            <Paragraph>
              A student who is unable to complete an assignment on time should report the circumstances to the lecturer concerned with reasons for the inability to complete the assignment. If satisfied with the reason given, the lecturer may grant an extension without penalty.
            </Paragraph>
            <Title level={5}>Courses Duration</Title>
            <Paragraph>
            Our Diploma course takes 3 academic years with a total of 54 units and a 10 weeks internship
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Roll;
