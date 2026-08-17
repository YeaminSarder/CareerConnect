export const calculateMatchingScore = (profile, internship, cv) => {
  let score = {
	score: 0.01,
	breakdown: {
		skills: 0.25,
		interests: 1.00,
		department: 1.00,
		cvKeywords: 0.75
	}
};
  console.log(profile,internship,cv)

  return score;
};