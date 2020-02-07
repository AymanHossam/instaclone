export default class User {
    constructor(id, email, username, picture, bio, postsCount, followers, following) {
        this.id = id,
            this.email = email,
            this.username = username,
            this.picture = picture,
            this.bio = bio,
            this.postsCount = postsCount,
            this.followers = followers,
            this.following = following
    }
}