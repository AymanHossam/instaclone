import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Button,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from "../constants/Colors";
import Input from '../components/Input';
import * as authActions from '../store/actions/authActions';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        };
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        };
        let updatedFormIsValid = true;
        for (const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues
        };
    }
    return state;
};

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            userName: '',
            email: '',
            password: ''
        },
        inputValidities: {
            userName: false,
            email: false,
            password: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = authActions.signup(
                formState.inputValues.userName,
                formState.inputValues.email,
                formState.inputValues.password
            );
        } else {
            action = authActions.login(
                formState.inputValues.email,
                formState.inputValues.password
            );
        }
        setError(null);
        setIsLoading(true);
        try {
            await dispatch(action);
            props.navigation.navigate('Main');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

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
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={ 50 }
            style={ styles.screen }
        >
            <View style={ styles.authContainer }>
                <ScrollView>
                    { isSignup && <Input
                        id="userName"
                        label="Username"
                        required
                        autoCapitalize="none"
                        errorText="Please enter a valid email address."
                        onInputChange={ inputChangeHandler }
                        initialValue=""
                    /> }
                    <Input
                        id="email"
                        label="E-Mail"
                        keyboardType="email-address"
                        required
                        email
                        autoCapitalize="none"
                        errorText="Please enter a valid email address."
                        onInputChange={ inputChangeHandler }
                        initialValue=""
                    />
                    <Input
                        id="password"
                        label="Password"
                        keyboardType="default"
                        secureTextEntry
                        required
                        minLength={ 5 }
                        autoCapitalize="none"
                        errorText="Please enter a valid password."
                        onInputChange={ inputChangeHandler }
                        onSubmitEditing={ authHandler }
                        initialValue=""
                    />
                    <View style={ styles.buttonContainer }>
                        { isLoading ? (
                            <ActivityIndicator size="small" color={ Colors.primary } />
                        ) : (
                                <Button
                                    title={ isSignup ? 'Sign Up' : 'Login' }
                                    color={ Colors.primary }
                                    onPress={ authHandler }
                                />
                            ) }
                    </View>
                    <View style={ styles.buttonContainer }>
                        <Button
                            title={ `Switch to ${isSignup ? 'Login' : 'Sign Up'}` }
                            color={ Colors.primary }
                            onPress={ () => {
                                setIsSignup(prevState => !prevState);
                            } }
                        />
                    </View>
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
};

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },

    authContainer: {
        flex: 1,
        marginTop: 100,
        width: '100%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20,

    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;
