import Post from '../models/Post'

// export default posts = {
//     '1': new Post("1", "2", 'Hi I\'m user 2 and this is my First post', '../../assets/postImages/1.jpg', [], 0),
//     '2': new Post("2", "3", 'Hi I\'m user 3 and this is my First post', '../../assets/postImages/2.jpg', [], 0),
//     '3': new Post("3", "4", 'Hi I\'m user 4 and this is my First post', '../../assets/postImages/3.jpg', [], 0),
// }

const posts = {
    '2': {
        '1': new Post("1", "2", 'Hi I\'m user 2 and this is my First post', '../../assets/postImages/1.jpg', [], 0),
        '12': new Post("12", "2", 'Hi I\'m user 2 and this is my Second post', '../../assets/postImages/1.jpg', [], 0),
        '13': new Post("13", "2", 'Hi I\'m user 2 and this is my Third post', '../../assets/postImages/1.jpg', [], 0),
    },
    '3': {
        '2': new Post("2", "3", 'Hi I\'m user 3 and this is my First post', '../../assets/postImages/2.jpg', [], 0),
    },
    '4': {
        '3': new Post("3", "4", 'Hi I\'m user 4 and this is my First post', '../../assets/postImages/3.jpg', [], 0),
    }

}
export default posts