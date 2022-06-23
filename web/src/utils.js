export const getRingByCredibility = (credibility) => {
    if (credibility < 70) return 'ring-red-600'
    else if (credibility < 75) return 'ring-orange-500'
    else if (credibility < 80) return 'ring-yellow-400'
    else if (credibility < 85) return 'ring-lime-400'
    else if (credibility < 90) return 'ring-green-600'
    else return 'ring-blue-700'
}