const { hash } = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function createAdminUser() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lacasita';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    const adminEmail = 'admin@lacasita.com';
    const adminPassword = 'admin123'; // Change this to a secure password
    const hashedPassword = await hash(adminPassword, 12);

    // Check if admin user already exists
    const existingAdmin = await db.collection('users').findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    await db.collection('users').insertOne({
      email: adminEmail,
      name: 'Admin User',
      password: hashedPassword,
      role: 'admin',
      points: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Admin user created successfully!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Please change the password after first login.');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.close();
  }
}

createAdminUser();