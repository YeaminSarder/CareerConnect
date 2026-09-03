export const MatchingScore = ({value}) => {
    if (!value) return "N/A"
    const {score, breakdown} = value
	const labels = {
		skills: 'Skills',
		interests: 'Career Interests',
		department: 'Department',
		cvKeywords: 'CV Keywords'
 	}

	return (
		<div className="relative inline-block group">
			{/* Overall score */}
			<div className="rounded-lg bg-green-100 px-3 py-2 font-semibold text-green-700 cursor-pointer">
				{Math.round(score*100)}% Match
			</div>

			{/* Breakdown popup */}
			<div className="
				hidden translate-y-1
				group-hover:block
				absolute right-0 top-full z-50 mt-2 w-72
				rounded-lg border border-gray-200 bg-white p-4
				shadow-lg
				transition-all duration-150
			">
				<h6 className="mb-4 font-semibold text-gray-800">
					Matching Breakdown
				</h6>

				{Object.entries(breakdown).map(([key, value]) => (
					<div key={key} className="mb-3 last:mb-0">
						<div className="mb-1 flex justify-between text-sm">
							<span className="text-gray-600">
								{labels[key] || key}
							</span>

							<span className="font-medium text-gray-800">
								{Math.round(value*100)}%
							</span>
						</div>

						<div className="h-2 overflow-hidden rounded-full bg-gray-200">
							<div
								className="h-full rounded-full bg-blue-500 transition-all duration-300"
								style={{ width: `${value*100}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}