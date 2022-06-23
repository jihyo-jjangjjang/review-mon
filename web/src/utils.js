export const getColorByCredibility = (credibility) => {
    if (credibility < 70) return 'red-600'
    else if (credibility < 75) return 'orange-500'
    else if (credibility < 80) return 'yellow-400'
    else if (credibility < 85) return 'lime-400'
    else if (credibility < 90) return 'green-600'
    else return 'blue-700'
}