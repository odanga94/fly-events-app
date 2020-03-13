import React, {
    useState,
    useEffect,
    useCallback,
    Fragment
} from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Entypo } from '@expo/vector-icons';
import _ from 'lodash';

import HeaderButton from '../components/UI/HeaderButton';
import Card from '../components/UI/Card';
import SearchBar from '../components/SearchBar';
import Colors from '../constants/Colors';
import ENV from '../env';

const PickLocationScreen = props => {
    const initialLocation = props.navigation.getParam('initialLocation');
    const readOnly = props.navigation.getParam('readOnly');
    const [selectedLocation, setSelectedLocation] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [selectedLocationAddress, setSelectedLocationAddress] = useState('');

    let mapRegion = {
        latitude: initialLocation ? initialLocation.lat : -1.2855641,
        longitude: initialLocation ? initialLocation.lng : 36.8148359,
        latitudeDelta: 0.1922,
        longitudeDelta: 0.1421
    }

    const selectLocationHandler = event => {
        if (readOnly) {
            return;
        }
        setSelectedLocation({
            lat: event.nativeEvent.coordinate.latitude,
            lng: event.nativeEvent.coordinate.longitude
        });
    }

    const fetchAddressOnMapPress = useCallback(async () => {
        if(selectedLocation){
            try {
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${selectedLocation.lat},${selectedLocation.lng}&key=${ENV.googleApiKey}`);
                if (!response.ok) {
                    throw new Error('Unable to get your location. Try again later.');
                }
                const resData = await response.json();
                //console.log('resData', resData)
                if (!resData.results) {
                    throw new Error('Something went wrong');
                }
                setSelectedLocationAddress(resData.results[0].formatted_address);
            } catch (err) {
                console.log(err);
            }
    
        }  
    }, [selectedLocation]);

    useEffect(() => {
        fetchAddressOnMapPress();
    }, [fetchAddressOnMapPress]);


    const onSearchHandler = useCallback(async () => {
        const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${ENV.googleApiKey}&input=${searchTerm}&location=${-1.2855641},${36.8148359}&radius=5000`;
        try {
            const result = await fetch(apiUrl);
            const json = await result.json();
            //console.log(json);
            setPredictions(json.predictions);
        } catch (err) {
            console.error(err);
        }
    }, [searchTerm]);

    const onSearchHandlerDebounced = _.debounce(onSearchHandler, 500);

    useEffect(() => {
        onSearchHandlerDebounced();
    }, [onSearchHandler]);

    const savePickedLocationHandler = useCallback(() => {
        if (!selectedLocationAddress) {
            //could show an alert
            return;
        }
        props.navigation.navigate('EditEvent', { pickedLocation: selectedLocationAddress });
    }, [selectedLocationAddress]);

    useEffect(() => {
        props.navigation.setParams({
            saveLocation: savePickedLocationHandler
        });
    }, [savePickedLocationHandler]);


    let markerCoordinate;
    if (selectedLocation) {
        markerCoordinate = {
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng
        }
        //console.log(markerCoordinate);
    }

    return (
        <Fragment>
            <MapView
                style={{ flex: 1 }}
                region={mapRegion}
                onPress={selectLocationHandler}
            >

                {markerCoordinate && <Marker title="Picked Location" coordinate={markerCoordinate}></Marker>}
            </MapView>
            <Card style={styles.searchBarCard}>
                <SearchBar
                    placeholder="Search Location"
                    searchTerm={searchTerm}
                    onSearch={setSearchTerm}
                />
                {
                    predictions ?
                        predictions.map((prediction) => {
                            return (
                                <TouchableWithoutFeedback
                                    key={prediction.id}
                                    onPress={() => {
                                        setSelectedLocationAddress(prediction.description);
                                        setPredictions([]);
                                    }}
                                >
                                    <View style={styles.suggestionContainer}>
                                        <Text style={styles.suggestion}>{prediction.description}</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        }) : null
                }
                {
                    selectedLocationAddress ?
                        <View style={styles.selectedLocationContainer}>
                            <Entypo name="location-pin" color={Colors.primary} size={23} />
                            <Text style={styles.selectedLocation}>{selectedLocationAddress}</Text>
                        </View> : null
                }

            </Card>
        </Fragment >

    );
}

const styles = StyleSheet.create({
    searchBarCard: {
        position: "absolute",
        top: 0,
        alignSelf: 'center',
        margin: 5,
        width: '95%'
    },
    selectedLocationContainer: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginVertical: 5
    },
    suggestionContainer: {
        marginHorizontal: 10,
        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        paddingHorizontal: 5,
        paddingVertical: 10
    },
    selectedLocation: {
        color: Colors.primary,
        fontFamily: 'open-sans-bold',
        marginLeft: 5
    },
    suggestion: {
        fontFamily: 'open-sans',
    }
})

PickLocationScreen.navigationOptions = navData => {
    const saveFn = navData.navigation.getParam('saveLocation');
    const readOnly = navData.navigation.getParam('readOnly');
    if (readOnly) {
        return {

        };
    }
    return {
        headerTitle: 'Pick a Location',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Save"
                    iconName="ios-save"
                    onPress={saveFn}
                />
            </HeaderButtons>
        )
    }
}


export default PickLocationScreen