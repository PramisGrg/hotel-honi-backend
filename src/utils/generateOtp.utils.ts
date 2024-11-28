export default function generateOtp() {
  if (String(process.env.NODE_ENV).toLowerCase() == 'beta') {
    return 888888;
  } else {
    return Math.floor(100000 + Math.random() * 900000)
  }
}
