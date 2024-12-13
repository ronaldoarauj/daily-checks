'use client';

import { useEffect, useState } from 'react';

export default function TelegramPage() {
  const [updates, setUpdates] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [chatId, setChatId] = useState(null);
  const [messageId, setMessageId] = useState(null);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch('/api/telegram');
        const data = await res.json();
        if (res.ok) {
          setUpdates(data);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch updates');
      }
    };

    fetchUpdates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message) {
      alert('Please enter a message and select a chat');
      return;
    }

    try {
      const res = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chatId, message, messageId }),
      });

      const result = await res.json();
      if (res.ok) {
        alert('Message sent successfully');
      } else {
        alert('Failed to send message: ' + chatId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message');
    }
  };

  return (
    <div>
      <h1>Telegram Updates</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {updates.map((update) => (
          <li key={update.update_id}>
            <p>
              <strong>Chat ID:</strong> {update.chat_id}
            </p>
            <p>
              <strong>From:</strong> {update.from.username} ({update.from.first_name})
            </p>
            <p>
              <strong>Message:</strong> {update.text}
            </p>
            <p>
              <strong>Message ID:</strong> {update.message_id}
            </p>
            <button onClick={() => { setChatId(update.chat_id); setMessageId(update.message_id); }}>Reply</button>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <h2>Send a Reply</h2>
        <div>
          <label>Message: </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
