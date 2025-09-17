const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  origin: "bottom",
  distance: "50px",
  duration: 1000,
};

ScrollReveal().reveal(".header__image img", {
  ...scrollRevealOption,
  origin: "right",
});
ScrollReveal().reveal(".header__content p", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".header__btns", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".destination__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".showcase__image img", {
  ...scrollRevealOption,
  origin: "left",
});
ScrollReveal().reveal(".showcase__content h4", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".showcase__content p", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".showcase__btn", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".banner__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".discover__card", {
  ...scrollRevealOption,
  interval: 500,
});

const swiper = new Swiper(".swiper", {
  slidesPerView: 3,
  spaceBetween: 20,
  loop: true,
});

// === Gemini/PaLM API Configuration ===
// Replace with your actual Google API key
const GEMINI_API_KEY = ''; // <-- Your API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + GEMINI_API_KEY;

// You can customize the system prompt below
const SYSTEM_PROMPT = 'You are a helpful assistant for Jharkhand Tourism. Answer questions about travel, destinations, culture, and booking in Jharkhand.';

// Modular function to send message to Gemini and get response
async function sendMessageToAI(userMessage) {
  const payload = {
    contents: [
      { parts: [{ text: SYSTEM_PROMPT }] },
      { parts: [{ text: userMessage }] }
    ]
  };

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    // Parse the Gemini response
    return data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0].text
      ? data.candidates[0].content.parts[0].text.trim()
      : 'Sorry, I’m having trouble answering right now.';
  } catch (err) {
    return 'Sorry, I’m having trouble answering right now.';
  }
}

// === Chatbot UI Logic ===
document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('jt-chatbot-btn');
  const windowEl = document.getElementById('jt-chatbot-window');
  const closeBtn = document.getElementById('jt-chatbot-close');
  const sendBtn = document.getElementById('jt-chatbot-send');
  const micBtn = document.getElementById('jt-chatbot-mic');
  const inputEl = document.getElementById('jt-chatbot-text');
  const messagesEl = document.getElementById('jt-chatbot-messages');

  // Open chatbot
  if (openBtn && windowEl) {
    openBtn.addEventListener('click', function () {
      windowEl.classList.remove('jt-hidden');
      inputEl.focus();
      if (messagesEl.childElementCount === 0) {
        addBotMsg('Welcome to Jharkhand Tourism! How can I help you?');
      }
    });
  }

  // Close chatbot
  if (closeBtn && windowEl) {
    closeBtn.addEventListener('click', function () {
      windowEl.classList.add('jt-hidden');
    });
  }

  // Send message
  if (sendBtn && inputEl) {
    sendBtn.addEventListener('click', handleSendMsg);
    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleSendMsg();
    });
  }

  // Microphone button (placeholder)
  if (micBtn) {
    micBtn.addEventListener('click', function() {
      addBotMsg('Voice input is not enabled yet. Please type your message.');
    });
  }

  // Typing indicator
  let typingDiv = null;
  function showTypingIndicator() {
    typingDiv = document.createElement('div');
    typingDiv.className = 'jt-chatbot-msg bot';
    typingDiv.innerHTML = `<div class="jt-chatbot-bubble"><em>Typing…</em></div>`;
    messagesEl.appendChild(typingDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function removeTypingIndicator() {
    if (typingDiv && typingDiv.parentNode) {
      typingDiv.parentNode.removeChild(typingDiv);
      typingDiv = null;
    }
  }

  function addUserMsg(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'jt-chatbot-msg user';
    msgDiv.innerHTML = `<div class="jt-chatbot-bubble">${msg}</div>`;
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addBotMsg(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'jt-chatbot-msg bot';
    msgDiv.innerHTML = `<div class="jt-chatbot-bubble">${msg}</div>`;
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // Main handler for sending message and getting AI response
  async function handleSendMsg() {
    const text = inputEl.value.trim();
    if (!text) return;
    addUserMsg(text);
    inputEl.value = '';
    showTypingIndicator();

    const aiResponse = await sendMessageToAI(text);
    removeTypingIndicator();
    addBotMsg(aiResponse);
  }
});

// === Chatbot Frontend Logic for Jharkhand Tourism ===

// Change this to your production backend URL when deploying
const BACKEND_URL = 'http://localhost:3000/chat'; // Change if deploying

document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('jt-chatbot-btn');
  const windowEl = document.getElementById('jt-chatbot-window');
  const closeBtn = document.getElementById('jt-chatbot-close');
  const sendBtn = document.getElementById('jt-chatbot-send');
  const micBtn = document.getElementById('jt-chatbot-mic');
  const inputEl = document.getElementById('jt-chatbot-text');
  const messagesEl = document.getElementById('jt-chatbot-messages');

  // Open chatbot
  if (openBtn && windowEl) {
    openBtn.addEventListener('click', function () {
      windowEl.classList.remove('jt-hidden');
      inputEl.focus();
      if (messagesEl.childElementCount === 0) {
        addBotMsg('Welcome to Jharkhand Tourism! How can I help you?');
      }
    });
  }

  // Close chatbot
  if (closeBtn && windowEl) {
    closeBtn.addEventListener('click', function () {
      windowEl.classList.add('jt-hidden');
    });
  }

  // Send message
  if (sendBtn && inputEl) {
    sendBtn.addEventListener('click', handleSendMsg);
    inputEl.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleSendMsg();
    });
  }

  // Microphone button (placeholder)
  if (micBtn) {
    micBtn.addEventListener('click', function() {
      addBotMsg('Voice input is not enabled yet. Please type your message.');
    });
  }

  // Typing indicator
  let typingDiv = null;
  function showTypingIndicator() {
    typingDiv = document.createElement('div');
    typingDiv.className = 'jt-chatbot-msg bot';
    typingDiv.innerHTML = `<div class="jt-chatbot-bubble"><em>Typing…</em></div>`;
    messagesEl.appendChild(typingDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function removeTypingIndicator() {
    if (typingDiv && typingDiv.parentNode) {
      typingDiv.parentNode.removeChild(typingDiv);
      typingDiv = null;
    }
  }

  function addUserMsg(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'jt-chatbot-msg user';
    msgDiv.innerHTML = `<div class="jt-chatbot-bubble">${msg}</div>`;
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function addBotMsg(msg) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'jt-chatbot-msg bot';
    msgDiv.innerHTML = `<div class="jt-chatbot-bubble">${msg}</div>`;
    messagesEl.appendChild(msgDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // Main handler for sending message and getting AI response
  async function handleSendMsg() {
    const text = inputEl.value.trim();
    if (!text) return;
    addUserMsg(text);
    inputEl.value = '';
    showTypingIndicator();

    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await response.json();
      removeTypingIndicator();
      addBotMsg(data.reply || 'Sorry, I’m having trouble answering right now.');
    } catch (err) {
      removeTypingIndicator();
      addBotMsg('Sorry, I’m having trouble answering right now.');
    }
  }
});

/*
  === Customization Guide ===
  - Replace GEMINI_API_KEY with your actual Google API key.
  - Change SYSTEM_PROMPT to adjust the bot's personality and expertise.
  - If using a different AI provider, update sendMessageToAI() accordingly.
  - UI adjustments can be made in your CSS file.
  - Change BACKEND_URL to your deployed backend endpoint.
  - Change the API key in server.js (never expose it in frontend).
  - Adjust system prompt in server.js for bot personality.
  - Style bubbles in your CSS as needed.
*/

