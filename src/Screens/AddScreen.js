import React, { useState } from 'react'
import { View, Button, StyleSheet } from "react-native";
import * as ImagePicker from 'expo-image-picker';


const AddScreen = (props) => {



    const [img, setImg] = useState()

    const _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5
        });

        if (!result.cancelled) {
            setImg(result.uri);
            props.navigation.navigate('addImg', { img: result.uri })
        }
    };

    return (
        <View>
            <Button title='Pick Image' onPress={ () => { _pickImage() } } />
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        height: 300,
        width: 400
    }
})




export default AddScreen