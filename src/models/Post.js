export default class Post {
    constructor(id, ownerId, text, imageUrl, likes, likesCount, date) {
        this.id = id,
            this.ownerId = ownerId,
            this.text = text,
            this.imageUrl = imageUrl,
            this.likes = likes,
            this.likesCount = likesCount,
            this.date = date
    }
}