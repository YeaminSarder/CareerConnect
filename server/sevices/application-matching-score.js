export const calculateMatchingScore = (profile, internship, cv) => {
    const weights = {
        skills: 0.35,
        interests: 0.25,
        department: 0.20,
        cvKeywords: 0.20
    }

    const breakdown = {
        skills: 0,
        interests: 0,
        department: 0,
        cvKeywords: 0
    }

    // --------------------
    // Skills
    // --------------------
    const requiredSkills = internship.requiredSkills ?? []
    const userSkills = profile?.skills?.map(skill => skill.name) ?? []

    if (requiredSkills.length > 0) {
        const matchedSkills = requiredSkills.filter(skill =>
            userSkills.some(userSkill =>
                userSkill.toLowerCase() === skill.toLowerCase()
            )
        )

        breakdown.skills =
            matchedSkills.length / requiredSkills.length
    } else {
        breakdown.skills = 1
    }

    // --------------------
    // Interests
    // --------------------
    const requiredInterests = internship.interests ?? []
    const userInterests = [
	...(profile?.careerInterests?.jobRoles ?? []),
	...(profile?.careerInterests?.industries ?? []),
	...(profile?.careerInterests?.workModes ?? []),
	...(profile?.careerInterests?.careerFields ?? [])
]

    if (requiredInterests.length > 0) {
        const matchedInterests = requiredInterests.filter(interest =>
            userInterests.some(userInterest =>
                userInterest.toLowerCase() === interest.toLowerCase()
            )
        )

        breakdown.interests =
            matchedInterests.length / requiredInterests.length
    } else {
        breakdown.interests = 1
    }

    // --------------------
    // Department
    // --------------------
    if (internship.department && profile?.department) {
        if (Array.isArray(internship.department)) {
            breakdown.department = internship.department.some(dept =>
                dept.toLowerCase() === profile.department.toLowerCase()
            ) ? 1 : 0
        } else {
            breakdown.department =
                internship.department.toLowerCase() ===
                    profile.department.toLowerCase()
                    ? 1
                    : 0
        }
    }

    // --------------------
    // CV Keywords
    // --------------------
    const keywords = internship.keywords ?? []

    if (keywords.length > 0 && cv) {
        const cvText = JSON.stringify(cv).toLowerCase()

        const matchedKeywords = keywords.filter(keyword =>
            cvText.includes(keyword.toLowerCase())
        )

        breakdown.cvKeywords =
            matchedKeywords.length / keywords.length
    } else {
        breakdown.cvKeywords = 1
    }

    // --------------------
    // Final score
    // --------------------
    const score = Object.entries(breakdown)
        .reduce(
            (total, [key, value]) =>
                total + weights[key] * value,
            0
        )

    return {
        score,
        breakdown
    }
}