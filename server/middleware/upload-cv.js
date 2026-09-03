import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = 'uploads/cvs'

fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir)
	},

	filename: (req, file, cb) => {
		const extension = path.extname(file.originalname)
		const filename = `${req.cv._id}-${Date.now()}${extension}`

		cb(null, filename)
	}
})

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'application/pdf') {
		cb(null, true)
	} else {
		cb(new Error('Only PDF files are allowed'))
	}
}

const uploadCv = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024
	}
})

export default uploadCv