import React from 'react'
import { View, StyleSheet, FlatList } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import UserCard from '../components/UserCard';

const ViewFollowScreen = (props) => {

    const dispatch = useDispatch()
    const mainUserId = useSelector(state => state.auth.userId)
    const users = useSelector(state => state.users.users)
    const mainUser = users[mainUserId]
    const list = props.navigation.getParam('list')
    const isFollowing = []



    return (
        <View style={ styles.container }>
            <FlatList
                data={ list }
                keyExtractor={ id => id }
                renderItem={ ({ item }) => {
                    return <View>
                        <UserCard id={ item } />
                    </View>
                } } />
        </View>
    )
}

ViewFollowScreen.navigationOptions = props => {
    const titleKey = props.navigation.getParam('followSwitch')
    console.log(titleKey)
    const title = titleKey ? ((titleKey === 1) ? 'Followers' : 'Following') : 'Likes'
    return {
        headerTitle: title
    }
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    userCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
        borderBottomWidth: 0.2,
        borderBottomColor: 'grey',
        paddingBottom: 15
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    imageContainer: {
        height: 80,
        width: 80,
        borderRadius: 100 / 2,
        borderWidth: 0.5,
        borderColor: 'grey',
        overflow: 'hidden',
        marginRight: 10
    },
    image: {
        height: '100%',
        width: '100%'
    },
    button: {
        borderRadius: 10,
        overflow: 'hidden'
    }
})


export default ViewFollowScreen