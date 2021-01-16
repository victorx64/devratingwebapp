export const DefaultRating = 1500;
export const n = 400;

export function WinProbability(a, b) {
    return Math.pow(10, a / n) / (
        Math.pow(10, a / n) +
        Math.pow(10, b / n)
    );
}

export function RatingPercentile(rating) {
    return WinProbability(rating, DefaultRating);
}

export function LinesMultiplier(rating) {
    return 1 / (1 - RatingPercentile(rating));
}

export function WorkLinesMultiplier(work) {
    const rating = work.UsedRatingId ? work.UsedRating : DefaultRating;
    return LinesMultiplier(rating);
}

export function RatingWithExpectedWinProb(b, probability) {
    return b - n * Math.log10(1 / probability - 1);
}

export function RatingWithExpectedWinProbAgainstDefault(probability) {
    return RatingWithExpectedWinProb(DefaultRating, probability);
}