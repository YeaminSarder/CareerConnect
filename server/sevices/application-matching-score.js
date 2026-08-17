export const calculateMatchingScore = (profile, internship, cv) => {
    let breakdown = {
        skills: 0,
        interests: 0.90,
        department: 1.00,
        cvKeywords: 0.75
    }
    const weights = {
        skills: 0.35,
        interests: 0.25,
        department: 0.2,
        cvKeywords: 0.2
    }

    const requiredSkills = internship.requiredSkills
    let userSkills = []
    if (profile) {
        userSkills = profile.skills.map(v => v.name)
    }
    const matchedSkills = requiredSkills.filter(v=>userSkills.includes(v))
    breakdown.skills = matchedSkills.length / requiredSkills.length

    const score = Object.entries(breakdown)
        .reduce((a, [k, v]) => a + weights[k] * v, 0)
    
    return { score, breakdown };
};