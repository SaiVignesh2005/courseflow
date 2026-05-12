require('dotenv').config();
const mongoose = require('mongoose');
const Course = require('./src/models/Course');

const departments = [
  { code: 'CSE', name: 'CSE' },
  { code: 'ECE', name: 'ECE' },
  { code: 'EEE', name: 'EEE' },
  { code: 'MECH', name: 'MECH' }
];

const semMap = [
  { sem: 2, yearCode: '1' },
  { sem: 4, yearCode: '2' },
  { sem: 6, yearCode: '3' },
  { sem: 8, yearCode: '4' }
];

const courseNames = {
  CSE: {
    2: [
      'Programming Fundamentals',
      'Problem Solving',
      'Digital Logic',
      'Computer Organization'
    ],
    4: [
      'Data Structures',
      'Database Management Systems',
      'Operating Systems',
      'Design and Analysis of Algorithms'
    ],
    6: [
      'Computer Networks',
      'Software Engineering',
      'Compiler Design',
      'Theory of Computation'
    ],
    8: [
      'Distributed Systems',
      'Cloud Computing',
      'Machine Learning',
      'Advanced Algorithms'
    ]
  },
  ECE: {
    2: [
      'Basic Electrical Engineering',
      'Digital Electronics',
      'Circuit Theory',
      'Signals Basics'
    ],
    4: [
      'Signals and Systems',
      'Analog Circuits',
      'Microprocessors',
      'Electronic Devices'
    ],
    6: [
      'Digital Communication',
      'VLSI Design',
      'Control Systems',
      'Embedded Systems'
    ],
    8: [
      'Wireless Communication',
      'Image Processing',
      'IoT Systems',
      'Advanced Signal Processing'
    ]
  },
  EEE: {
    2: [
      'Circuit Analysis',
      'Electrical Machines Basics',
      'Measurements',
      'Engineering Physics'
    ],
    4: [
      'Electrical Machines',
      'Power Systems',
      'Control Systems',
      'Power Electronics'
    ],
    6: [
      'Renewable Energy',
      'High Voltage Engineering',
      'Microgrids',
      'Industrial Drives'
    ],
    8: [
      'Smart Grids',
      'Power Quality',
      'Advanced Power Systems',
      'Electric Vehicles'
    ]
  },
  MECH: {
    2: [
      'Engineering Mechanics',
      'Workshop Practice',
      'Basic Thermodynamics',
      'Engineering Graphics'
    ],
    4: [
      'Thermodynamics',
      'Fluid Mechanics',
      'Material Science',
      'Manufacturing Technology'
    ],
    6: [
      'Machine Design',
      'Heat Transfer',
      'Dynamics of Machines',
      'Finite Element Methods'
    ],
    8: [
      'Robotics',
      'CAD/CAM',
      'Automobile Engineering',
      'Advanced Manufacturing'
    ]
  }
};

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Course.deleteMany({});

    const courses = [];

    for (const dept of departments) {
      for (const sm of semMap) {
        const names = courseNames[dept.code][sm.sem];

        for (let i = 0; i < 4; i++) {
          const n = i + 1;
          courses.push({
            courseCode: `${dept.code}${sm.sem}${n}01`,
            courseName: names[i],
            department: dept.name,
            credits: i === 1 ? 3 : 4,
            capacity: 50,
            allowedDepartments: [dept.name],
            allowedSemesters: [sm.sem],
            students: [],
            waitlist: []
          });
        }
      }
    }

    await Course.insertMany(courses);
    console.log(`Inserted ${courses.length} courses`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();