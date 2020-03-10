import React from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import EventItem from '../../components/events/EventItem';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import { deleteProduct } from '../../store/actions/events'

const UserEventsScreen = props => {
    const userEvents = useSelector(state => state.events.userEvents);
    const dispatch = useDispatch();

    const editProductHandler = (productId) => {
        props.navigation.navigate('EditProduct', {productId: productId})
    }

    const deleteHandler = (pid) => {
        Alert.alert('Are you sure', 'Do you really want to delete this product?', [
            {text: 'No', style: 'default'},
            {text: 'Yes', style: 'destructive', onPress: () => {
                dispatch(deleteProduct(pid));
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
                        editProductHandler(itemData.item.id);
                    }}
                >
                    <Button
                        title="Edit"
                        onPress={() => {
                            editProductHandler(itemData.item.id);
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