export async function sendContactEmail({ name, email, subject, message }) {
  const response = await fetch('/api/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, subject, message })
  });

  const data = await response.json().catch(() => ({ success: false }));

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Unable to send your message right now.');
  }

  return data;
}
