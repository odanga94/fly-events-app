import React, {
    useEffect,
    useCallback,
    useReducer,
    useState
} from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Text,
    Picker
} from 'react-native';
import { DatePicker } from 'native-base';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as eventActions from '../../store/actions/events';
import Input from '../../components/UI/Input';
import Spinner from '../../components/UI/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import Colors from '../../constants/Colors';

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
let timeRange = [''];
for (let i = 1; i <= 12; i++){
    timeRange.push(i + 'pm');
}
for (let i = 1; i <= 12; i++){
    timeRange.push(i + 'am');
}

const EditEventScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const prodId = props.navigation.getParam('productId');
    const editingEvent = /*useSelector(state => state.products.userEvents.find(prod => prod.id === prodId));*/ null;

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: editingEvent ? editingEvent.title : '',
            imageUrl: editingEvent ? editingEvent.imageUrl : '',
            price: '',
            description: editingEvent ? editingEvent.description : '',
            date: editingEvent ? editingEvent.date : '',
            startsAt: editingEvent ? editingEvent.startsAt : '',
            endsAt: editingEvent ? editingEvent.endsAt : '',
        },
        inputValidities: {
            title: editingEvent ? true : false,
            imageUrl: editingEvent ? true : false,
            price: editingEvent ? true : false,
            description: editingEvent ? true : false,
            date: editingEvent ? true : false,
            startsAt: editingEvent ? true : false,
            endsAt: editingEvent ? true : false,
        },
        formIsValid: editingEvent ? true : false
    });

    const dispatch = useDispatch();

    const submitHandler = useCallback(async () => {
        //console.log('Submitting...');
        if (!formState.formIsValid) {
            Alert.alert('Wrong or Missing Input!', 'Please check the errors in the form.', [{ text: 'Okay' }]);
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            editingEvent ?
                await dispatch(
                    eventActions.updateEvent(
                        prodId,
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl
                    )) :
                await dispatch(
                    eventActions.createEvent(
                        formState.inputValues.title,
                        formState.inputValues.description,
                        formState.inputValues.imageUrl,
                        +formState.inputValues.price,
                        formState.inputValues.date,
                        `${formState.inputValues.startsAt} - ${formState.inputValues.endsAt}`,
                    ));
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, formState, prodId]);

    useEffect(() => {
        props.navigation.setParams({ 'submit': submitHandler });
    }, [submitHandler]);

    const inputChangeHandler = useCallback((inputLabel, value, validity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value,
            isValid: validity,
            inputLabel
        })
    }, [dispatchFormState]);


    if (isLoading) {
        return <Spinner />
    }

    if (error) {
        return (
            <ErrorMessage
                error={error}
                retry={submitHandler}
            />
        )
    }

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={100} style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.form}>
                    <Input
                        id="title"
                        label='Title:'
                        errorText='Please enter a valid title.'
                        autoCapitalize='sentences'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editingEvent ? editingEvent.title : ''}
                        initiallyValid={!!editingEvent}
                        required
                    />
                    <Input
                        id="imageUrl"
                        label='Image URL:'
                        errorText='Please enter a valid Image URL.'
                        autoCapitalize='sentences'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={editingEvent ? editingEvent.imageUrl : ''}
                        initiallyValid={!!editingEvent}
                        required
                    />
                    <Input
                        id="price"
                        label='Price'
                        errorText='Please enter a numeric value.'
                        autoCapitalize='sentences'
                        returnKeyType='next'
                        keyboardType='decimal-pad'
                        onInputChange={inputChangeHandler}
                        required
                        min={0.1}
                    />
                    <Input
                        id="description"
                        label='Description'
                        errorText='Please enter a valid description'
                        autoCapitalize='sentences'
                        returnKeyType='done'
                        multiline
                        numberOfLines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={editingEvent ? editingEvent.description : ''}
                        initiallyValid={!!editingEvent}
                        required
                        minLength={5}
                    />
                    <Text style={styles.label}>Date:</Text>
                    <DatePicker
                        defaultDate={new Date()}
                        minimumDate={new Date()}
                        maximumDate={new Date(2020, 12, 31)}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        placeHolderText="Select date"
                        textStyle={{ color: Colors.accent }}
                        placeHolderTextStyle={{ color: "#505050" }}
                        onDateChange={(newDate) => {
                            inputChangeHandler("date", newDate, true)
                        }}
                        disabled={false}
                    />
                    <View style={styles.timeContainer}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <Text style={styles.label}>Starts At:</Text>
                            <Picker
                                selectedValue={formState.inputValues.startsAt}
                                style={{ height: 30, width: 100, color: Colors.accent }}
                                onValueChange={(itemValue, itemIndex) => {
                                    inputChangeHandler("startsAt", itemValue, true)
                                }}
                            >
                                {
                                    timeRange.map(time => {
                                        return <Picker.Item label={time} value={time} key={time}/>
                                    })
                                }
                            </Picker>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <Text style={styles.label}>Ends At:</Text>
                            <Picker
                                selectedValue={formState.inputValues.endsAt}
                                style={{ height: 30, width: 100, color: Colors.accent}}
                                onValueChange={(itemValue, itemIndex) =>
                                    inputChangeHandler("endsAt", itemValue, true)
                                }
                            >
                                {
                                    timeRange.map(time => {
                                        return <Picker.Item label={time} value={time} key={time}/>
                                    })
                                }
                            </Picker>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

}

EditEventScreen.navigationOptions = navData => {
    const submitFn = navData.navigation.getParam('submit');
    return {
        headerTitle: navData.navigation.getParam('productId') ? 'Edit Event' : 'Add Event',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item
                    title='Save'
                    iconName='ios-save'
                    onPress={() => {
                        submitFn();
                    }}
                />
            </HeaderButtons>
        ),
    }
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    label: {
        fontFamily: 'open-sans-bold',
        marginVertical: 8
    },
    timeContainer: {
        flexDirection: 'row',
        width: '100%'
    }
});

export default EditEventScreen;