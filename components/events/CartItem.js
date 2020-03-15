import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CartItem = props => {
    return (
        <View style={styles.cartItem}>
            <View style={{flex: 2, justifyContent: 'space-between', flexDirection: 'row'}}>
                <View styles={styles.itemData}>
                    <Text style={styles.mainText}>{props.quantity}</Text>
                </View>
                <View style={{ ...styles.itemData, paddingHorizontal: 5 }}>
                    <Text style={styles.mainText}>{props.title}</Text>
                </View>
            </View>
            <View style={{...styles.itemData,paddingHorizontal: 5}}>
                <Text style={styles.mainText}>KES. {props.amount.toFixed(2)}</Text>
                {props.deletable && (
                    <TouchableOpacity onPress={props.onRemove} style={styles.deleteButton}>
                        <Ionicons name='ios-trash' size={23} color='red' />
                    </TouchableOpacity>
                )}
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        padding: 10,
        width: '100%',
        borderBottomWidth: 1,
        borderColor: '#ccc'
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'space-between',
    },
    mainText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16,
        color: 'black',
    },
    deleteButton: {
        marginLeft: 20
    }
});

export default CartItem;