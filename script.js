// Job search + region filter
const searchInput = document.getElementById("jobSearch");
const regionFilter = document.getElementById("regionFilter");
const jobList = document.getElementById("jobList");
const jobCards = jobList.getElementsByClassName("job-card");

// Filter jobs by search + region
function filterJobs() {
  const searchText = searchInput.value.toLowerCase();
  const region = regionFilter.value;

  for (let card of jobCards) {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const cardRegion = card.getAttribute("data-region");

    if (
      (title.includes(searchText) || searchText === "") &&
      (region === "" || cardRegion === region)
    ) {
      card.style.display = "block";
    } else {
      card.style.display = "none";
    }
  }
}

searchInput.addEventListener("keyup", filterJobs);
regionFilter.addEventListener("change", filterJobs);
// Handle Job Posting Form
const jobForm = document.getElementById("jobForm");

if (jobForm) {
  jobForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const region = document.getElementById("region").value;
    const salary = document.getElementById("salary").value;
    const deadline = document.getElementById("deadline").value;
    const requirements = document.getElementById("requirements").value;
    const contact = document.getElementById("contact").value;

    alert(
      `✅ Job Posted Successfully!\n\n` +
      `Title: ${title}\nRegion: ${region}\nSalary: GHS ${salary}\nDeadline: ${deadline}\nContact: ${contact}`
    );

    // In the future → save this job to a database
    jobForm.reset();
  });
}
// ====== SAVE JOBS TO LOCALSTORAGE ======

    // Get existing jobs from storage or empty array
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    // Create job object
    const newJob = {
      title,
      region,
      salary,
      deadline,
      requirements,
      contact,
    };

    // Save to array
    jobs.push(newJob);

    // Store updated jobs list
    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("✅ Job Posted Successfully!");
    jobForm.reset();

// ====== CHAT SYSTEM ======
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

if (chatBox && messageInput && sendBtn) {
  // Load saved messages
  let messages = JSON.parse(localStorage.getItem("chatMessages")) || [];

  function displayMessages() {
    chatBox.innerHTML = messages
      .map(
        (msg) => `
        <div class="message ${msg.sender}">
          ${msg.text}
        </div>
      `
      )
      .join("");

    chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to latest
  }

  // Initial load
  displayMessages();

  // Send message
  sendBtn.addEventListener("click", () => {
    const text = messageInput.value.trim();
    if (text === "") return;

    // Alternate sender/receiver for demo
    const sender = messages.length % 2 === 0 ? "sender" : "receiver";

    messages.push({ sender, text });

    localStorage.setItem("chatMessages", JSON.stringify(messages));

    messageInput.value = "";
    displayMessages();
  });

  // Allow Enter key to send
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });
}
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all for now
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("✅ A user connected");

  // Receive chat messages
  socket.on("chatMessage", (msg) => {
    // Send message to all connected clients
    io.emit("chatMessage", msg);5000
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected");
  });
});

server.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:");
});