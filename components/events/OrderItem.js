import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

import CartItem from './CartItem';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const OrderItem = props => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>KES. {props.amount.toFixed(2)}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button
                color={Colors.primary}
                title={showDetails ? "Hide Details" : "Show Details"}
                onPress={() => {
                    setShowDetails(currentShowDetails => !currentShowDetails);
                }}
            />
            {
                showDetails && (
                    <View style={{width: '100%'}}>
                        {props.items.map(cartItem => {
                            return (
                                <CartItem
                                    key={cartItem.eventId}
                                    quantity={cartItem.quantity}
                                    title={cartItem.eventTitle}
                                    amount={cartItem.sum}
                                />
                            )
                        })}
                    </View>

                )
            }
        </Card>

    )
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    date: {
        fontSize: 16,
        fontFamily: 'open-sans',
        color: '#888'
    }
});

export default OrderItem;