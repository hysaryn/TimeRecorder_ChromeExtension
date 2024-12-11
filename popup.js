document.getElementById('recordEvents').addEventListener('click', async () => {
    const textInput = document.getElementById('textInput').value;
    
    const userConfig = await chrome.storage.sync.get(['keywordsConfig']);
    const keywordsConfig = userConfig.keywordsConfig || [];
    
    const token = await getAuthToken();
    const events = parseEvents(textInput, keywordsConfig);
    events.forEach(event => {
      createGoogleCalendarEvent(event, token);
    });
  });
  
  async function getAuthToken() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(token);
        }
      });
    });
  }
  
  function parseEvents(textInput, keywordsConfig) {
    // Similar parsing logic as your Apps Script
    // Use keywordsConfig to assign colors
  }
  
  function createGoogleCalendarEvent(event, token) {
    fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Event created:', data);
      })
      .catch(error => console.error('Error creating event:', error));
  }
  