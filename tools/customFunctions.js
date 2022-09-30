const fs = require("fs");
const os = require("os");
const rootDir = require('path').resolve('./');
const compress_images = require("compress-images")

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

const mediaHandler = (media, objectId, user_id, type) => {
    let pathArray = [];
    let uploadDir = type == 'post' ? "./media/"+user_id+"/"+objectId+"/" : "./media/"+user_id+"/chat/";


    (media.length >= 1 ? media: [media]).map((media, key) => {
        let extensionName = media.name.split('.').pop()
        let filename = objectId+'-'+key+"."+extensionName
        let filenamewebp = objectId+'-'+key+".webp"
        if(!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, {recursive: true});
          }
        media.mv(uploadDir+filename, (err) => {

            compress_images(uploadDir+filename, uploadDir, {compress_force: true, statistic: true, autoupdate: true}, false, 
                { jpg: { engine: "webp", command: false } },
                { png: { engine: "webp", command: false } },
                { svg: { engine: "svgo", command: false } },
                { gif: { engine: "gifsicle", command: false } },
                function () {
                  fs.unlinkSync(uploadDir+filename);
                }
            )
            
        })

        type == 'post' ? pathArray.push("/media/"+user_id+"/"+objectId+"/"+filenamewebp) : pathArray.push("/media/"+user_id+"/chat/"+filenamewebp)
        

    })

    return pathArray
}

module.exports = { feedOrderer, mediaHandler }