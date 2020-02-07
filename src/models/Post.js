export default class Post {
    constructor(id, ownerId, text, img, likes, likesCount) {
        this.id = id,
            this.ownerId = ownerId,
            this.text = text,
            this.img = img,
            this.likes = likes,
            this.likesCount = likesCount
    }
}