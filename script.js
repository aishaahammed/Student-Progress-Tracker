// script.js

document.addEventListener('DOMContentLoaded', () => {
    const studentList = document.getElementById('studentList');
    const uploadForm = document.getElementById('uploadForm');
  
    // Fetch list of students and display on the main page
    fetch('/api/students')
      .then(response => response.json())
      .then(students => {
        students.forEach(student => {
          const listItem = document.createElement('li');
          const profileLink = document.createElement('a');
          profileLink.textContent = student.name;
          profileLink.href = `/student_profile.html?id=${student._id}`;
          listItem.appendChild(profileLink);
          studentList.appendChild(listItem);
        });
      })
      .catch(error => {
        console.error('Error fetching students:', error);
      });
  
    // Handle code upload form submission
    uploadForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const studentId = new URLSearchParams(window.location.search).get('id');
      const newCode = document.getElementById('newCode').value;
  
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, code: newCode })
      });
  
      if (response.ok) {
        console.log('Code uploaded successfully');
        // Optionally update the displayed code on the profile page
        // Fetch updated code and display it
      } else {
        console.error('Failed to upload code');
      }
    });
  
    // WebSocket connection for real-time updates
    const socket = io();
    socket.on('codeUploaded', (data) => {
      console.log('Code uploaded for student:', data.studentId);
      // Optionally update the displayed code on the profile page
      // Fetch updated code and display it
    });
  });
  