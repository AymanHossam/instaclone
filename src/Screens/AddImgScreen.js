import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { useDispatch } from "react-redux";
import * as feedActions from "../store/actions/feedActions";


const AddImgScreen = (props) => {

    const dispatch = useDispatch()

    const img = props.navigation.getParam('img')

    const [text, setText] = useState('')

    const onSubmitHandler = useCallback(() => {
        dispatch(feedActions.addPost(text, img))
        props.navigation.navigate('Feed')
    }, [dispatch, text, img])

    useEffect(() => {
        props.navigation.setParams({ action: onSubmitHandler })
    }, [onSubmitHandler])

    return (
        <View style={ styles.container }>
            <View style={ styles.row }>
                <View style={ styles.imageContainer }>
                    { img && <Image source={ { uri: img } } style={ styles.image } /> }
                </View>
                <TextInput value={ text } placeholder='Write a caption...' onChangeText={ setText } />
            </View>
            <View style={ styles.line } />
        </View>
    )
}

AddImgScreen.navigationOptions = props => {
    const share = props.navigation.getParam('action')
    return {
        title: 'New Post',
        headerRight: () => {
            return <TouchableOpacity onPress={ share } style={ styles.headerButtonContainer }>
                <Text style={ styles.headerButton }>Share</Text>
            </TouchableOpacity>
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    row: {
        flexDirection: 'row',
        margin: 15

    },
    imageContainer: {
        height: 70,
        width: 70,
        marginRight: 15
    },
    image: {
        height: '100%',
        width: '100%'
    },
    line: {
        borderWidth: 0.5,
        borderColor: 'grey',
        width: '100%',
        marginBottom: 5
    },
    headerButtonContainer: {
        marginHorizontal: 10
    },
    headerButton: {
        color: 'black',
        fontSize: 20
    }

})




export default AddImgScreen