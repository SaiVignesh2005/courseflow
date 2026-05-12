require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Course = require('./src/models/Course'); // uncomment if you want to clear courses too

const depts = [
  { code: '106', department: 'CSE' },
  { code: '108', department: 'ECE' },
  { code: '107', department: 'EEE' },
  { code: '111', department: 'MECH' }
];

const batches = [
  { code: '123', semester: 8 },
  { code: '124', semester: 6 },
  { code: '125', semester: 4 },
  { code: '126', semester: 2 }
];

const pad3 = (n) => String(n).padStart(3, '0');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await User.deleteMany({});
    // await Course.deleteMany({});

    const hashedPassword = await bcrypt.hash('1234', 10);

    const users = [];

    for (const d of depts) {
      for (const b of batches) {
        for (let r = 1; r <= 140; r++) {
          const rollNumber = `${d.code}${b.code}${pad3(r)}`;
          const username = `user_${rollNumber}`;

          users.push({
            username,
            email: `${username}@gmail.com`,
            password: hashedPassword,
            role: 'student',
            department: d.department,
            semester: b.semester,
            rollNumber
          });
        }
      }
    }

    await User.insertMany(users);

    console.log(`Inserted ${users.length} users`);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();