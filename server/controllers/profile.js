import Profile from "../models/profile.js";
import mongoose from 'mongoose'
// GET /api/profiles
const getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find({})
            .sort({ createdAt: -1 });

        res.status(200).json(profiles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /api/profiles/:id
const getProfile = async (req, res) => {
	try {
        const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({"error":"No such profile"})
		}

        const profile = await Profile.findById(id);

        if (!profile) {
            return res.status(404).json({
                error: "Profile not found",
            });
        }

        const completion = typeof profile.getCompletionScore === 'function' 
            ? profile.getCompletionScore() 
            : { completionPercentage: 0, missingFields: [] };

        res.status(200).json({
            ...profile.toObject(),
            completionPercentage: completion.completionPercentage,
            missingFields: completion.missingFields
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /api/profiles
const createProfile = async (req, res) => {
    try {
        const { name, age } = req.body;

        const profile = await Profile.create({
            name,
            age,
        });
        if (!profile) {
            return res.status(400).json({
                error: "Profile not created",
            });
        }
        res.status(201).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PATCH /api/profiles/:id
const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({"error":"No such profile"})
		}
        const profile = await Profile.findByIdAndUpdate(
            id,
            req.body,
            {
                returnDocument: 'after', // Return the updated document
                runValidators: true // Validate the update
            }
        );

        if (!profile) {
            return res.status(404).json({
                error: "Profile not found",
            });
        }

        res.status(200).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /api/profiles/:id
const deleteProfile = async (req, res) => {
    try {
        const { id } = req.params;
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res.status(404).json({"error":"No such profile"})
		}
        const profile = await Profile.findByIdAndDelete(id);

        if (!profile) {
            return res.status(404).json({
                error: "Profile not found",
            });
        }

        res.status(200).json(profile);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /api/profile/projects - Add project to logged in user's profile
const addProject = async (req, res) => {
    try {
        const profileId = req.user.profile;
        const { title, description, projectType, githubLink, liveLink, toolsUsed, imageUrl, featured } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ error: "Project title is required" });
        }

        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const newProject = {
            title: title.trim(),
            description: description || '',
            projectType: projectType || 'Academic Project',
            githubLink: githubLink || '',
            liveLink: liveLink || '',
            toolsUsed: Array.isArray(toolsUsed) ? toolsUsed : (toolsUsed ? toolsUsed.split(',').map(t => t.trim()) : []),
            imageUrl: imageUrl || '',
            featured: Boolean(featured)
        };

        profile.projects.unshift(newProject);
        await profile.save();

        const completion = typeof profile.getCompletionScore === 'function'
            ? profile.getCompletionScore()
            : { completionPercentage: 0, missingFields: [] };

        res.status(201).json({
            ...profile.toObject(),
            completionPercentage: completion.completionPercentage,
            missingFields: completion.missingFields
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /api/profile/projects/:projectId - Update specific project
const updateProject = async (req, res) => {
    try {
        const profileId = req.user.profile;
        const { projectId } = req.params;
        const { title, description, projectType, githubLink, liveLink, toolsUsed, imageUrl, featured } = req.body;

        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const project = profile.projects.id(projectId);
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }

        if (title !== undefined) project.title = title.trim();
        if (description !== undefined) project.description = description;
        if (projectType !== undefined) project.projectType = projectType;
        if (githubLink !== undefined) project.githubLink = githubLink;
        if (liveLink !== undefined) project.liveLink = liveLink;
        if (toolsUsed !== undefined) {
            project.toolsUsed = Array.isArray(toolsUsed) ? toolsUsed : toolsUsed.split(',').map(t => t.trim());
        }
        if (imageUrl !== undefined) project.imageUrl = imageUrl;
        if (featured !== undefined) project.featured = Boolean(featured);

        await profile.save();

        const completion = typeof profile.getCompletionScore === 'function'
            ? profile.getCompletionScore()
            : { completionPercentage: 0, missingFields: [] };

        res.status(200).json({
            ...profile.toObject(),
            completionPercentage: completion.completionPercentage,
            missingFields: completion.missingFields
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /api/profile/projects/:projectId - Delete specific project
const deleteProject = async (req, res) => {
    try {
        const profileId = req.user.profile;
        const { projectId } = req.params;

        const profile = await Profile.findById(profileId);
        if (!profile) {
            return res.status(404).json({ error: "Profile not found" });
        }

        profile.projects = profile.projects.filter(p => p._id.toString() !== projectId);
        await profile.save();

        const completion = typeof profile.getCompletionScore === 'function'
            ? profile.getCompletionScore()
            : { completionPercentage: 0, missingFields: [] };

        res.status(200).json({
            ...profile.toObject(),
            completionPercentage: completion.completionPercentage,
            missingFields: completion.missingFields
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export default {
    getProfiles,
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    addProject,
    updateProject,
    deleteProject
};
