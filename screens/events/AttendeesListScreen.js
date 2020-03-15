import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';

import { useSelector } from 'react-redux';
import Colors from '../../constants/Colors';

const AttendeesListScreen = props => {
    const selectedEvent = props.navigation.getParam('selectedEvent');
    const attendees = Object.keys(selectedEvent.attendees).map(key => {
        return {
            ...selectedEvent.attendees[key],
            attendeeId: key
        }
    });

    const renderItem = ({item}) => {
        return (
            <View style={styles.itemContainer}>
                <View>
                    <Text style={styles.text}>{item.userName} ({item.userEmail})</Text>
                </View>
                <View>
                    <Text style={styles.tickets}><Text>{item.noOfTickets} </Text>{item.noOfTickets > 1 ? 'tickets' : 'ticket'}</Text>
                </View>
            </View>
        )
    }

    if (!attendees.length) {
        return (
            < View style={styles.centered} >
                <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, textAlign: 'center' }}>No attendees for this event yet! Maybe start marketing it.</Text>
            </View >
        )
    }
    return (
        <FlatList
            data={attendees}
            renderItem={renderItem}
            keyExtractor={item => item.attendeeId}
            style={{margin: 20}}
        />
    )

}

AttendeesListScreen.navigationOptions = navData => {
    const numberOfAttendees = Object.keys(navData.navigation.getParam('selectedEvent').attendees).length;
    return {
        headerTitle: `Confirmed Attendees (${numberOfAttendees})`
    };
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20
    },
    itemContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        width: '100%',
        justifyContent: 'space-between'
    },
    text: {
        fontFamily: 'open-sans'
    },
    tickets: {
        fontFamily: 'open-sans-bold',
        color: Colors.accent
    }
});

export default AttendeesListScreen;