export const MatchingScore = ({value}) => {
    if (!value) return "N/A"
    const {score, breakdown} = value
    return (
        <span>{score}</span>
    )
}