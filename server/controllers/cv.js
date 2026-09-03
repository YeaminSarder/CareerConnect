import Cv from '../models/cv.js';
import mongoose from 'mongoose';
import uploadCv from '../middleware/upload-cv.js';
import { extractTextFromPdf, extractDescription } from '../services/pdf-extraction.js';
import path from 'path';

export const validateCvId = async (req, res, next, id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid CV ID' });
    }
    const cv = await Cv.findById(id);
    if (!cv) {
        return res.status(404).json({ error: 'CV not found' });
    }
    if (cv.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized access to this CV' });
    }
    req.cv = cv;
    next();
}

// Get all CVs
export const getAllCvs = async (req, res) => {
    try {
        const cvs = await Cv.find();
        res.json(cvs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single CV by ID
export const getCvById = async (req, res) => {
    try {
        res.json(req.cv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new CV
export const createAndAttachEmptyCv = async (req, res, next) => {
    try {
        const cv = await Cv.user_create(req.user._id, { title: 'Untitled CV', description: 'Edit to add description' });
        if (!cv) {
            return res.status(400).json({ error: 'Failed to create Empty CV' });
        }
        req.cv = cv; // Attach the newly created CV to the request object
        next(); // Call the next middleware (e.g., file upload handler)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
async function noop() { } // No-operation function for middleware chaining
export const createCvFromFile = async (req, res) => {
    try {
        req.pipelineMode = true; // Indicate that this request is part of a pipeline
        await createAndAttachEmptyCv(req, res, noop) // Create an empty CV first
        await new Promise((resolve, reject) => { // Wrap the multer upload in a promise to handle errors
            uploadCv.single('file')(req, res, error => {
                if (error) {
                    reject(error)
                } else {
                    resolve()
                }
            })
        })
        await updateCvFile(req, res, noop) // Then update the CV with the uploaded file
        await renameCvFromFile(req, res, noop) // Finally, rename the CV based on the uploaded file
        await setDescriptionFromFile(req, res, noop) // Finally, set the description based on the uploaded file
        return res.status(201).json(req.cv)
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

// Update a CV
export const updateCv = async (req, res) => {
    try {
        console.log("updateCv", req.cv, req.body)
        const cv = await req.cv.updateOne(req.body, { new: true, runValidators: true });
        if (!cv) {
            return res.status(404).json({ error: 'CV not found' });
        }
        res.json(cv);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Set a CV as primary
export const setPrimaryCv = async (req, res) => {
    try {
        // First, unset the current primary CV
        await Cv.updateMany({ user: req.user._id, isPrimary: true }, { isPrimary: false });
        // Then set the new primary CV
        const cv = await req.cv.updateOne({ isPrimary: true }, { new: true, runValidators: true });
        if (!cv) {
            return res.status(404).json({ error: 'CV not found' });
        }
        res.json(cv);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


// Delete a CV
export const deleteCv = async (req, res) => {
    try {
        await req.cv.deleteOne();
        res.json({ message: 'CV deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getMyCvs = async (req, res) => {
    try {
        const id = req.user._id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({ "error": "invalid user", id: id })
        }

        const cvs = await Cv.find({ ...req.body, user: id }).sort({ isPrimary: -1, createdAt: -1 });

        if (!cvs) {
            return res.status(404).json({
                error: "No CVs found for this user",
            });
        }

        res.status(200).json(cvs);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const updateCvFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No PDF file uploaded'
            })
        }

        // Delete the previous file if one exists
        if (req.cv.file?.path) {
            const fs = await import('fs/promises')

            try {
                await fs.unlink(req.cv.file.path)
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error
                }
            }
        }

        req.cv.file = {
            path: req.file.path,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size
        }

        await req.cv.save()
        if (!req.pipelineMode) {
            res.json(req.cv)
        } else {
            // If in pipeline mode, just call next middleware
            return next()
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

export const renameCvFromFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded'
            })
        }

        req.cv.title = req.file.originalname.replace(/\.[^/.]+$/, "") // Remove file extension
        await req.cv.save()
        if (!req.pipelineMode) {
            res.json(req.cv)
        } else {
            // If in pipeline mode, just call next middleware
            return next()
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

export const setDescriptionFromFile = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'No file uploaded'
            })
        }

        const text = await extractTextFromPdf(req.file.path)
        const description = extractDescription(text)

        req.cv.description = description
        await req.cv.save()
        if (!req.pipelineMode) {
            res.json(req.cv)
        } else {
            // If in pipeline mode, just call next middleware
            return next()
        }
    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

export const getCvFile = async (req, res) => {

    try {
        const filePath = path.resolve(process.cwd(), req.cv.file.path)

        res.sendFile(filePath, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline'
            }
        })

    } catch (error) {
        res.status(404).json({
            error: 'CV file not found'
        })
    }
}

export default {
    getAllCvs,
    getCvById,
    createCvFromFile,
    createAndAttachEmptyCv,
    updateCv,
    setPrimaryCv,
    deleteCv,
    getMyCvs,
    setDescriptionFromFile,
    renameCvFromFile,
    validateCvId,
    updateCvFile,
    getCvFile
};
