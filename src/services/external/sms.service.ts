export async function sendSMS(phoneNumber: string | string[], message: string) {
  if (String(process.env.NODE_ENV).toLowerCase() == "beta") {
    return true;
  }
  try {
    const request = await fetch(process.env.NP_SMS_SERVER_ENDPOINT ?? '', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.NP_SMS_SERVER_TOKEN ?? ''}`
      },
      method: 'POST',
      body: JSON.stringify({
        mobile: phoneNumber,
        message: message
      })
    })

    if (request.status == 200 || request.status === 201) {
      return true
    }
    return false
  } catch (error) {
    return false
  }
}
