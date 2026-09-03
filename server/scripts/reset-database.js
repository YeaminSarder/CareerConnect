import mongoose from 'mongoose'
import dotenv from 'dotenv'
import seedDatabase from '../seed.js'

dotenv.config()

const resetDatabase = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI)

		console.log('⚠️  Dropping database...')
		await mongoose.connection.dropDatabase()

		console.log('✅ Database dropped')

		console.log('🌱 Seeding database...')
		await seedDatabase()

		console.log('✅ Database reset completed')
	} catch (error) {
		console.error('❌ Database reset failed:', error)
		process.exitCode = 1
	} finally {
		await mongoose.disconnect()
	}
}

resetDatabase()