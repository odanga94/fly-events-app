import React from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import EventItem from '../../components/events/EventItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import { deleteEvent } from '../../store/actions/events'

const UserEventsScreen = props => {
    const userEvents = useSelector(state => state.events.userEvents);
    const dispatch = useDispatch();

    const editEventHandler = (eid) => {
        props.navigation.navigate('EditEvent', { eventId: eid })
    }

    const deleteHandler = (eid) => {
        Alert.alert('Are you sure', 'Do you really want to delete this event?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(deleteEvent(eid));
            }}
        ])
    }

    if (userEvents.length === 0){
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontFamily: 'open-sans-bold', textAlign: "center", marginHorizontal: 5}}>You haven't added any event. Maybe start adding some.</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={userEvents}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <EventItem
                    title={itemData.item.title}
                    price={itemData.item.price}
                    image={itemData.item.imageUri}
                    date={itemData.item.readableDate}
                    onSelect={() => {
                        editEventHandler(itemData.item.id);
                    }}
                >
                    <Button
                        title="Edit"
                        onPress={() => {
                            editEventHandler(itemData.item.id);
                        }}
                        color={Colors.primary}
                    />
                    <Button
                        title="Delete"
                        onPress={() => {
                            deleteHandler(itemData.item.id);
                        }}
                        color={Colors.primary}
                    />
                </EventItem>
            )}
        />
    );
}

UserEventsScreen.navigationOptions = navData => {
    return {
        headerTitle: 'My Events',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item
                    title='Menu'
                    iconName='ios-menu'
                    onPress={() => {
                        navData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton} >
                <Item
                    title='Add'
                    iconName='ios-create'
                    onPress={() => {
                        navData.navigation.navigate('EditEvent');
                    }}
                />
            </HeaderButtons>
        ),
    }
}

export default UserEventsScreen;