export const DefaultRating = 1500;

export function WinProbability(a, b) {
    return Math.pow(10, a / 400) / (
        Math.pow(10, a / 400) +
        Math.pow(10, b / 400)
    );
}

export function LinesMultiplier(rating) {
    return 1 / (1 - WinProbability(rating, DefaultRating));
}

export function WorkLinesMultiplier(work) {
    const rating = work.UsedRatingId ? work.UsedRating : DefaultRating;
    return LinesMultiplier(rating);
}