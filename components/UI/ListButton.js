import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import Colors from '../../constants/Colors';

const ListButton = props => {
    return (
        <TouchableOpacity onPress={props.pressed} style={styles.button}>
            <Text style={{ fontFamily: 'open-sans', color: Colors.accent }}>{props.info}</Text>
            <AntDesign name="right" size={18} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopColor: '#ccc',
        borderBottomColor: '#ccc',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 7.5
    }
});

export default ListButton;