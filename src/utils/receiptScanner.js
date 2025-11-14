export const scanReceipt = async (file) => {
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not configured. Please add VITE_ANTHROPIC_API_KEY to your .env file');
    }
  
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: file.type,
                data: base64
              }
            },
            {
              type: 'text',
              text: 'Extract all grocery items from this receipt. Return ONLY a JSON array of objects with "name" and "quantity" fields. Example: [{"name":"Apples","quantity":"2 lbs"},{"name":"Milk","quantity":"1 gallon"}]. If you cannot read the receipt, return an empty array [].'
            }
          ]
        }]
      })
    });
  
    const data = await response.json();
    const text = data.content.map(item => item.text || '').join('').trim();
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned);
  };