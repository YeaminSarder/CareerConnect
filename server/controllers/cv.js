import Cv from '../models/cv.js';

// Get all CVs
export const getAllCvs = async (req, res) => {
    try {
        const cvs = await Cv.find();
        res.json(cvs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single CV by ID
export const getCvById = async (req, res) => {
    try {
        const cv = await Cv.findById(req.params.id);
        if (!cv) {
            return res.status(404).json({ message: 'CV not found' });
        }
        res.json(cv);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new CV
export const createCv = async function createCv(req, res) {
    try {
        const cv = await Cv.user_create(req.user._id, req.body.title)
        res.status(201).json(cv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a CV
export const updateCv = async (req, res) => {
    try {
        const cv = await Cv.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cv) {
            return res.status(404).json({ message: 'CV not found' });
        }
        res.json(cv);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a CV
export const deleteCv = async (req, res) => {
    try {
        const cv = await Cv.findByIdAndDelete(req.params.id);
        if (!cv) {
            return res.status(404).json({ message: 'CV not found' });
        }
        res.json({ message: 'CV deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    getAllCvs,
    getCvById,
    createCv,
    updateCv,
    deleteCv
};
