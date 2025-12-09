import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import * as readline from 'readline'

const prisma = new PrismaClient()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve)
  })
}

async function createAdmin() {
  console.log('\n🔐 Create Admin Account\n')

  const name = await question('Admin Name: ')
  const email = await question('Admin Email: ')
  const password = await question('Password: ')

  if (!name || !email || !password) {
    console.error('❌ All fields are required')
    process.exit(1)
  }

  // Check if admin already exists
  const existing = await prisma.admin.findUnique({
    where: { email },
  })

  if (existing) {
    console.error('❌ Admin with this email already exists')
    process.exit(1)
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'MODERATOR',
      isActive: true,
    },
  })

  console.log('\n✅ Admin created successfully!')
  console.log(`Name: ${admin.name}`)
  console.log(`Email: ${admin.email}`)
  console.log(`\nYou can now login at /admin/login\n`)

  rl.close()
  await prisma.$disconnect()
}

createAdmin().catch((error) => {
  console.error('❌ Error creating admin:', error)
  process.exit(1)
})
