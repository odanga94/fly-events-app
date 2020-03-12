import React, { useEffect, useState, useCallback, Fragment } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import EventItem from '../../components/events/EventItem';
import * as cartActions from '../../store/actions/cart';
import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import * as eventActions from '../../store/actions/events';
import Spinner from '../../components/UI/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import SearchBar from '../../components/SearchBar';

const EventsListScreen = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [ searchTerm, setSearchTerm ] = useState('');

  const events = useSelector(state => {
    return state.events.upComingEvents
  });
  const dispatch = useDispatch();

  const loadEvents = useCallback(async () => {
    setError(null);
    //setIsLoading(true);
    try {
      await dispatch(eventActions.fetchEvents());
    } catch (err) {
      setError(err.message);
    }
    setIsLoading(false);
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadEvents();
  }, [dispatch, loadEvents]);

  useEffect(() => {
    const WillFocusSub = props.navigation.addListener('willFocus', () => {
      loadEvents();
    });
    return () => {
      WillFocusSub.remove();
    }
  }, [loadEvents]);

  const selectItemHandler = (id, title) => {
    props.navigation.navigate('EventDetails', { eventId: id, eventTitle: title });
  }

  if (isLoading) {
    return (
      <Spinner />
    )
  }

  if (error) {
    return (
      <ErrorMessage
        error={error}
        retry={loadEvents}
      />
    )
  }

  if (!isLoading && events.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, textAlign: 'center' }}>No events found! Maybe start adding some.</Text>
      </View>
    )
  }

  let filteredEvents;
  if (searchTerm === ''){
    filteredEvents = events;
  } else {
    filteredEvents = events.filter(event => event.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  return (
    <Fragment>
      <SearchBar
        style={{marginHorizontal: 20, marginBottom: 5}}
        placeholder="Search by Title"
        onSearch={(text) => {
          setSearchTerm(text);
        }}
      />
      <FlatList
        onRefresh={loadEvents}
        refreshing={isLoading}
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={itemData => (
          <EventItem
            image={itemData.item.imageUri}
            title={itemData.item.title}
            price={itemData.item.price}
            date={itemData.item.readableDate}
            onSelect={() => {
              selectItemHandler(itemData.item.id, itemData.item.title);
            }}
          >
            <Button
              title="View Details"
              onPress={() => {
                selectItemHandler(itemData.item.id, itemData.item.title);
              }}
              color={Colors.primary}
            />
            <Button
              title="ADD TO CART"
              onPress={() => {
                dispatch(cartActions.addToCart(itemData.item));
              }}
              color={Colors.accent}
            />
          </EventItem>
        )}
      />
    </Fragment>

  );
};

EventsListScreen.navigationOptions = navData => {
  return {
    headerTitle: 'UpComing Events',
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
          title='Cart'
          iconName='ios-cart'
          onPress={() => {
            navData.navigation.navigate('Cart');
          }}
        />
      </HeaderButtons>
    )
  }
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20
  }
});



export default EventsListScreen;
