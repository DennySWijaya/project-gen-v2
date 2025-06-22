const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

//How can I add custom CSS to style the rendered Markdown, like code blocks and headings?

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = ''; // Clear input immediately

  // Show a "thinking" message while waiting for the API response
  const thinkingMessageElement = appendMessage('bot', 'Gemini is thinking...');

  // Make the actual API call to your backend
  fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ Message: userMessage }), // Send the user's message
  })
  .then(response => response.json())
  .then(data => {
    // Remove the "thinking" message
    thinkingMessageElement.remove();
    // Append the actual reply from the bot
    appendMessage('bot', data.reply);
  })
  .catch(error => {
    console.error('Error:', error);
    thinkingMessageElement.remove(); // Remove thinking message even on error
    appendMessage('bot', 'Oops! Something went wrong. Please try again.');
  });
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);

  if (sender === 'bot') {
    // For bot messages, parse Markdown and sanitize the resulting HTML
    // This uses the 'marked' and 'DOMPurify' libraries you added to index.html
    const dirtyHtml = marked.parse(text);
    msg.innerHTML = DOMPurify.sanitize(dirtyHtml);
  } else {
    // For user messages, always use textContent to prevent XSS vulnerabilities
    msg.textContent = text;
  }

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight; // Scroll to bottom
  return msg; // Return the created message element
}
