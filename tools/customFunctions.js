

const feedOrderer = (concatArray) => {
    let uniqId = []
    concatArray.sort((prev, next) => {
        if(prev.sortDate > next.sortDate ) {
            return -1
        }

        if(prev.sortDate < next.sortDate ) {
            return 1
        }
        return 0
    })
    finalArray = concatArray.filter(post => {
        if (!uniqId.includes(post._id.toString())) {
            uniqId.push(post._id.toString())
            return post
        }
    })
    return finalArray
}

module.exports = { feedOrderer }