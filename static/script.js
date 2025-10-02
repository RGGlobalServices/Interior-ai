let currentProjectId = 1; // later: dynamic project selection

// ------------------ PAGE NAVIGATION ------------------
function showSection(id) {
  document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

// ------------------ FILE UPLOAD ------------------
async function uploadFile() {
  const fileInput = document.getElementById("fileUpload");
  if (!fileInput.files.length) return alert("⚠️ Please select a file!");

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  const res = await fetch(`http://localhost:5001/api/projects/${currentProjectId}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  alert(data.success ? "✅ File uploaded!" : "❌ Upload failed");
}

// ------------------ ANNOTATIONS ------------------
let drawing = false;
let startX, startY;
let annotations = [];
const canvas = document.getElementById("annotationCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener("mousemove", (e) => {
  if (!drawing) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  redrawAnnotations();
  ctx.strokeStyle = "red";
  ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);
});

canvas.addEventListener("mouseup", (e) => {
  drawing = false;
  const rect = { x: startX, y: startY, w: e.offsetX - startX, h: e.offsetY - startY };
  annotations.push(rect);
  redrawAnnotations();
});

function redrawAnnotations() {
  annotations.forEach((a) => {
    ctx.strokeStyle = "blue";
    ctx.strokeRect(a.x, a.y, a.w, a.h);
  });
}

async function saveAnnotation() {
  if (!annotations.length) return alert("⚠️ No annotations!");

  const res = await fetch(`http://localhost:5001/api/projects/${currentProjectId}/annotations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_name: "design.png", data: annotations }),
  });

  const data = await res.json();
  alert(data.success ? "✅ Annotations saved!" : "❌ Failed to save");
}

// ------------------ CHAT ------------------
async function sendMessage() {
  const input = document.getElementById("chatInput");
  const message = input.value.trim();
  if (!message) return;

  const chatBox = document.getElementById("chat-messages");
  chatBox.innerHTML += `<div><b>You:</b> ${message}</div>`;

  input.value = "";

  const res = await fetch(`http://localhost:5001/api/projects/${currentProjectId}/discuss`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: "user", message }),
  });

  const data = await res.json();
  if (data.assistant) {
    chatBox.innerHTML += `<div><b>AI:</b> ${data.assistant}</div>`;
  }
}

// ------------------ REPORT PREVIEW ------------------
async function previewReport() {
  const res = await fetch(`http://localhost:5001/api/projects/${currentProjectId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes: "Preview generated report" }),
  });

  const data = await res.json();
  if (data.success) {
    document.getElementById("reportPreview").classList.remove("hidden");
    document.getElementById("pdfFrame").src = `http://localhost:5001/${data.path}`;
  }
}
function uploadFile() {
  const fileInput = document.getElementById("fileUpload");
  const file = fileInput.files[0];
  if (!file) {
    alert("Please select a file first!");
    return;
  }

  // Fake preview without backend just for UI
  const pdfURL = URL.createObjectURL(file);
  document.getElementById("pdfViewer").src = pdfURL;
  document.getElementById("pdfPreviewCard").classList.remove("hidden");

  // Backend API call (replace PROJECT_ID dynamically if needed)
  const formData = new FormData();
  formData.append("file", file);

  fetch(`/api/projects/1/upload`, {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      console.log("Upload success:", data);
    })
    .catch(err => console.error("Upload error:", err));
}
function previewReport() {
  const projectId = 1; // Replace with selected project id

  // Step 1: Ask backend to generate a report
  fetch(`/api/projects/${projectId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes: "Auto-generated report from frontend" })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const reportId = data.report_id;

        // Step 2: Load report in iframe
        const pdfUrl = `/api/projects/${projectId}/report/${reportId}`;
        document.getElementById("pdfFrame").src = pdfUrl;
        document.getElementById("reportPreview").classList.remove("hidden");
      } else {
        alert("Report generation failed");
      }
    })
    .catch(err => {
      console.error("Error generating report:", err);
    });
}
