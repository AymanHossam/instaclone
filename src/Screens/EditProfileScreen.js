import React, { useState, useReducer, useCallback } from 'react'
import { View, Button, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import { useSelector, useDispatch } from "react-redux";

import * as usersActions from "../store/actions/usersActions";

import Input from "../components/Input";

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        return {
            inputValues: updatedValues
        };
    }
    return state;
};

const EditProfileScreen = (props) => {

    const dispatch = useDispatch()
    const mainUserId = useSelector(state => state.auth.userId)
    const mainUser = useSelector(state => state.users.users[mainUserId])


    const [profilePic, setProfilePic] = useState(mainUser.picture)


    const _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if (!result.cancelled) {
            setProfilePic(result.uri);
            //dispatch(usersActions.updateProfilePic(result.uri))
        }
    };

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            username: mainUser.username,
            bio: mainUser.bio,
        }
    });

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );


    return (
        <View style={ styles.container }>
            <View style={ styles.imagePicker }>
                <TouchableOpacity onPress={ _pickImage } style={ styles.imageContainer }>
                    { profilePic && <Image source={ { uri: profilePic } } style={ styles.image } /> }

                </TouchableOpacity>
                <Text style={ styles.cyanText }>Change Profile Photo</Text>
            </View>
            <View style={ styles.input }>
                <Input
                    id="username"
                    placeholder="Username"
                    label="Username"
                    required
                    onInputChange={ inputChangeHandler }
                    initialValue={ mainUser.username } />
                <Input
                    id="bio"
                    placeholder="Bio"
                    label="Bio"
                    onInputChange={ inputChangeHandler }
                    initialValue={ mainUser.bio } />
            </View>
            <Button title='Update' onPress={ () => { dispatch(usersActions.updateUserInfo(profilePic, formState.inputValues.username, formState.inputValues.bio)) } } />
        </View>
    )

}

EditProfileScreen.navigationOptions = props => {
    return {
        headerTitle: 'Edit your info'
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    imagePicker: {
        alignItems: 'center'
    },
    imageContainer: {
        height: 95,
        width: 95,
        borderRadius: 100 / 2,
        borderWidth: 1,
        borderColor: 'grey',
        margin: 15,
        overflow: 'hidden'
    },
    image: {
        height: '100%',
        width: '100%'
    },
    cyanText: {
        color: 'blue',
        fontSize: 18
    },
    input: {
        marginTop: 15,
        marginHorizontal: 10
    }
})


export default EditProfileScreen