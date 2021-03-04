export const DefaultRating = 1500
export const n = 400

export function WinProbability(a, b) {
    return Math.pow(10, a / n) / (
        Math.pow(10, a / n) +
        Math.pow(10, b / n)
    )
}

export function RatingPercentile(rating) {
    return WinProbability(rating, DefaultRating)
}

export function LinesMultiplier(rating) {
    return 1 / (1 - RatingPercentile(rating ?? DefaultRating))
}

export function RatingWithExpectedWinProb(b, probability) {
    return b - n * Math.log10(1 / probability - 1)
}

export function RatingWithExpectedWinProbAgainstDefault(probability) {
    return RatingWithExpectedWinProb(DefaultRating, probability)
}

export function Impact(lines, rating) {
    return lines * LinesMultiplier(rating)
}

export function GainedExperience(work) {
    return Impact(work.Additions, work.UsedRating)
}

export function RatingDelta(work) {
    return (work.NewRating ?? work.UsedRating ?? DefaultRating) - (work.UsedRating ?? DefaultRating)
}
