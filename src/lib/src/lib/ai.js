export async function analyzePaintLabel(base64Image) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Image } },
          { type: 'text', text: `Extract info from this paint label. Return ONLY valid JSON, no markdown:
{"brand":"","colorName":"","colorCode":"","finish":"","hex":"#hex_color_approx","notes":""}
If a field is not visible use null. hex should be your best approximation of the actual paint color.` }
        ]
      }]
    })
  })
  const data = await res.json()
  const text = data.content?.map(b => b.text || '').join('') || '{}'
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}

export async function analyzeAppliancePlate(base64Image) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64Image } },
          { type: 'text', text: `Extract info from this appliance data plate. Return ONLY valid JSON, no markdown:
{"brand":"","model":"","modelNumber":"","serialNumber":"","voltage":"","wattage":"","manufactureDate":"","notes":""}
If a field is not visible use null.` }
        ]
      }]
    })
  })
  const data = await res.json()
  const text = data.content?.map(b => b.text || '').join('') || '{}'
  return JSON.parse(text.replace(/```json|```/g, '').trim())
}
