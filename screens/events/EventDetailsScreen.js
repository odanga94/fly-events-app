import React, { useState, useEffect, useCallback } from 'react';
import {
    ScrollView,
    Button,
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, Entypo } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import { BASE_URL } from '../../constants/base-url';
import * as cartActions from '../../store/actions/cart';
import Colors from '../../constants/Colors';
import Card from '../../components/UI/Card'
import ListButton from '../../components/UI/ListButton';

const { height } = Dimensions.get('window');

const EventDetailsScreen = props => {
    const [eventOwnerName, setEventOwnerName] = useState('');
    const eventId = props.navigation.getParam('eventId');
    const selectedEvent = useSelector(state => state.events.upComingEvents.find(event => event.id === eventId));
    const dispatch = useDispatch();

    const fetchEventOwnerName = useCallback(async (ownerId) => {
        try {
            const response = await fetch(`${BASE_URL}users/${ownerId}.json`);
            const resData = await response.json();
            setEventOwnerName(resData.userName);
        } catch (err) {
            console.log(err);
        }
    }, [selectedEvent]);

    useEffect(() => {
        fetchEventOwnerName(selectedEvent.ownerId);
    }, [fetchEventOwnerName]);

    return (
        <ScrollView>
            <View style={styles.imageContainer}>
                <Image source={{ uri: selectedEvent.imageUri }} style={styles.image} resizeMode={"contain"} />
            </View>
            <View style={styles.infoContainer}>
                <Text style={styles.price}>KES. {selectedEvent.price.toFixed(2)}</Text>
                <Card style={{ width: '100%', marginVertical: 5, padding: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <MaterialCommunityIcons name="calendar" color={Colors.primary} size={23} />
                            <Text style={{ ...styles.text, marginHorizontal: 5 }}>{selectedEvent.readableDate}</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                            <Ionicons name="md-time" color={Colors.primary} size={23} />
                            <Text style={{ ...styles.text, marginHorizontal: 5 }}>{selectedEvent.eventTime}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: "row", maxWidth: '95%' }}>
                        <Entypo name="location-pin" color={Colors.primary} size={23} />
                        <Text style={{ ...styles.text, marginHorizontal: 5 }}>{selectedEvent.location}</Text>
                    </View>
                </Card>
                <Text style={styles.text}>posted by <Text style={{ ...styles.text, color: Colors.accent, fontWeight: 'bold' }}>{eventOwnerName}</Text></Text>
                <Text style={styles.title}>ABOUT:</Text>
                <ScrollView style={{ maxHeight: height / 4, marginBottom: 15 }}>
                    <Text style={styles.text}>{selectedEvent.description}</Text>
                </ScrollView>
                <ListButton
                    info="View Attendees"
                    pressed={() => props.navigation.navigate('Attendees', { selectedEvent })}
                />
                <ListButton
                    info="View Comments"
                    pressed={() => props.navigation.navigate('Comments', { eventId, /*comments: selectedEvent.comments*/ })}
                />
                <View style={styles.action}>
                    <Button color={Colors.accent} title="Add to Cart" onPress={() => {
                        dispatch(cartActions.addToCart(selectedEvent))
                    }} />
                </View>
            </View>

        </ScrollView>
    )
}

EventDetailsScreen.navigationOptions = (navData) => {
    //console.log('Nav Data:', navData)
    return {
        headerTitle: navData.navigation.getParam('eventTitle')
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 300
    },
    image: {
        width: '100%',
        height: 300,
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 10,
        fontFamily: 'open-sans-bold'
    },
    infoContainer: {
        marginHorizontal: 20,
    },
    title: {
        fontSize: 18,
        color: Colors.accent,
        fontFamily: 'open-sans-bold'
    },
    text: {
        fontSize: 14,
        fontFamily: 'open-sans',
        marginVertical: 5
    },
    action: {
        marginVertical: 15,
        alignItems: 'center'
    }
});

export default EventDetailsScreen;