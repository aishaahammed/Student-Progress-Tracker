// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb://localhost:27017';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const studentSchema = new mongoose.Schema({
  name: String,
  code: String
});

const Student = mongoose.model('Student', studentSchema);

app.use(bodyParser.json());

app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/upload', async (req, res) => {
  const { studentId, code } = req.body;

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.code = code;
    await student.save();

    // Emit a WebSocket event to notify connected clients
    io.emit('codeUploaded', { studentId });

    res.status(200).json({ message: 'Code uploaded successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
