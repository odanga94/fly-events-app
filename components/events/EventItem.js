import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableNativeFeedback,
    Platform
} from 'react-native';

import Card from '../UI/Card';

const EventItem = props => {
    const TouchableCmp = Platform.OS === 'android' && Platform.Version >= 21 ? TouchableNativeFeedback : TouchableOpacity;
    return (
        <TouchableCmp onPress={props.onSelect} useForeground>
            <Card style={styles.product}>
                <View style={styles.imageContainer}>
                    <Image source={{ uri: props.image }} style={styles.image} />
                </View>
                <View style={styles.details}>
                    <Text style={styles.title}>{props.title}</Text>
                    <Text style={styles.date}>{props.date}</Text>
                    <Text style={styles.price}>KES. {props.price.toFixed(2)}</Text>
                </View>
                <View style={styles.actions} >
                    {props.children}
                </View>
            </Card>
        </TouchableCmp>

    )
}

const styles = StyleSheet.create({
    product: {
        height: 300,
        margin: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    title: {
        fontSize: 18,
        marginVertical: 2,
        fontFamily: 'open-sans-bold'
    },
    date: {
        fontSize: 16,
        marginBottom: 2,
        fontFamily: 'open-sans-bold'
    },
    price: {
        fontSize: 14,
        color: '#505050',
        fontFamily: 'open-sans'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '23%',
        paddingHorizontal: 20
    },
    details: {
        alignItems: 'center',
        height: '27%',
        padding: 10
    },
    imageContainer: {
        width: '100%',
        height: '50%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: "hidden"
    }
})

export default EventItem;