import React, {
    useReducer,
    useCallback,
    useState,
    useEffect
} from 'react';
import {
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    View,
    Button,
    Alert,
    Image,
    Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';
import Spinner from '../../components/UI/Spinner';

const { height } = Dimensions.get('window');
const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        let updatedFormIsValid = true;
        const updatedValues = {
            ...state.inputValues,
            [action.inputLabel]: action.value
        };
        const updatedInputValidities = {
            ...state.inputValidities,
            [action.inputLabel]: action.isValid
        };
        for (let key in updatedInputValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedInputValidities[key];
        }
        return {
            inputValues: updatedValues,
            inputValidities: updatedInputValidities,
            formIsValid: updatedFormIsValid
        }
    }
    return state;
}

const AuthScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [isSignUp, setIsSignUp] = useState(false);
    const dispatch = useDispatch();

    const [logInFormState, dispatchlogInFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
    });

    const [signUpFormState, dispatchSignUpFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: '',
            name: ''
        },
        inputValidities: {
            email: false,
            password: false,
            name: false
        },
        formIsValid: false
    });

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
        }
    }, [error]);

    const authHandler = async () => {
        if ((isSignUp && !signUpFormState.formIsValid) || (!isSignUp && !logInFormState.formIsValid)) {
            Alert.alert('Wrong Input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            if (isSignUp){
                await dispatch(authActions.signUp(signUpFormState.inputValues.email, signUpFormState.inputValues.password, signUpFormState.inputValues.name));
            } else {
                await dispatch(authActions.logIn(logInFormState.inputValues.email, logInFormState.inputValues.password));
            }  
            props.navigation.navigate('Events');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    const inputChangeHandler = useCallback((inputLabel, value, validity) => {
        if (isSignUp) {
            dispatchSignUpFormState({
                type: FORM_INPUT_UPDATE,
                value,
                isValid: validity,
                inputLabel
            })
        } else {
            dispatchlogInFormState({
                type: FORM_INPUT_UPDATE,
                value,
                isValid: validity,
                inputLabel
            })
        } 
    }, [dispatchlogInFormState, dispatchSignUpFormState, isSignUp]);


    return (
        <KeyboardAvoidingView
            behavior="position"
            keyboardVerticalOffset={5}
            style={styles.screen}
        >
            <LinearGradient colors={['#ccc', 'white']} style={styles.gradient}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../assets/company-logo.png')}
                        style={{ width: '100%', height: height / 4 }}
                        resizeMode="contain"
                    />
                </View>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-mail:"
                            keyboardType="email-address"
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input
                            id="password"
                            label="Password:"
                            keyboardType="default"
                            secureTextEntry
                            required
                            minLength={5}
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        {
                            isSignUp ?
                                <Input
                                    id="name"
                                    label="Name:"
                                    keyboardType="default"
                                    required
                                    minLength={3}
                                    autoCapitalize="words"
                                    errorText="Please enter a valid name."
                                    onInputChange={inputChangeHandler}
                                    initialValue=""
                                /> :
                                null
                        }
                        <View style={styles.buttonContainer}>
                            {isLoading ?
                                <Spinner /> :
                                <Button title={isSignUp ? "SIGN UP" : "LOG IN"} color={Colors.primary} onPress={authHandler} />
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button enabled={!isLoading} title={isSignUp ? "Switch to Log In" : "Switch to Sign Up"} color={Colors.accent} onPress={() => {
                                setIsSignUp(prevState => !prevState);
                            }} />
                        </View>


                    </ScrollView>

                </Card>

            </LinearGradient>
        </KeyboardAvoidingView>

    );
}

AuthScreen.navigationOptions = {
    headerTitle: "Authenticate"
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient: {
        width: '100%',
        height: '100%',
        paddingTop: 50,
        alignItems: "center"
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 15,
    },
    imageContainer: {
        width: '80%'
    }
});

export default AuthScreen;