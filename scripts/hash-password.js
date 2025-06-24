const { hash } = require('bcryptjs');

async function hashPassword() {
  const password = 'YourNewSecurePassword123!'; // Change this to your desired password
  const hashed = await hash(password, 12);
  console.log('Use this password to log in:', password);
  console.log('Hashed password (copy this to MongoDB):', hashed);
}

hashPassword().catch(console.error);
