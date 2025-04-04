// Webhook event listener
window.addEventListener('message', function(event) {
    if (event.origin !== window.location.origin) return;
    if (event.data.type === 'webhook') {
        console.log('Webhook received:', event.data);
    }
});

// Initialize Lucide icons
lucide.createIcons();

// Admin authentication
const ADMIN_PASSWORD = 'obsidiantech123';
let isAuthenticated = false;

// Chat state
let messages = [];
let isRecording = false;
let isPaused = false;
let mediaRecorder = null;

function handleLogin() {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        isAuthenticated = true;
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('chatContainer').style.display = 'flex';
        // Add welcome message
        addMessage('Welcome back, Admin! How can I assist you today?', 'bot');
    } else {
        alert('Invalid password');
    }
}

async function toggleRecording() {
    if (!isRecording) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            
            mediaRecorder.ondataavailable = async (event) => {
                addMessage("Voice message recorded (Speech-to-text conversion would happen here)", 'user');
            };

            mediaRecorder.start();
            isRecording = true;
            document.getElementById('micBtn').innerHTML = '<i data-lucide="mic-off"></i>';
            document.getElementById('pauseBtn').style.display = 'block';
            lucide.createIcons();
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    } else {
        mediaRecorder.stop();
        isRecording = false;
        document.getElementById('micBtn').innerHTML = '<i data-lucide="mic"></i>';
        document.getElementById('pauseBtn').style.display = 'none';
        lucide.createIcons();
    }
}

function togglePause() {
    if (!isRecording) return;
    
    isPaused = !isPaused;
    if (isPaused) {
        mediaRecorder.pause();
        document.getElementById('pauseBtn').innerHTML = '<i data-lucide="play"></i>';
    } else {
        mediaRecorder.resume();
        document.getElementById('pauseBtn').innerHTML = '<i data-lucide="pause"></i>';
    }
    lucide.createIcons();
}

function addMessage(text, sender) {
    const message = {
        text,
        sender,
        timestamp: new Date()
    };
    messages.push(message);
    updateMessages();
}

function updateMessages() {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = messages.map(message => `
        <div class="message ${message.sender}">
            <div class="message-content">
                ${message.text}
                <div class="timestamp">${message.timestamp.toLocaleTimeString()}</div>
            </div>
        </div>
    `).join('');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function clearChat() {
    messages = [];
    updateMessages();
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (text) {
        addMessage(text, 'user');
        input.value = '';
        
        // Simulate bot response
        setTimeout(() => {
            addMessage('This is a simulated response from the chatbot.', 'bot');
        }, 1000);
    }
}

// Initialize icons after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
});