export default class Post {
    constructor(id, ownerId, text, img, likes, likesCount, date) {
        this.id = id,
            this.ownerId = ownerId,
            this.text = text,
            this.img = img,
            this.likes = likes,
            this.likesCount = likesCount,
            this.date = date
    }
}