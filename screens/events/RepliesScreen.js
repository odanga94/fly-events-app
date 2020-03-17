import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    KeyboardAvoidingView,
    FlatList,
    Dimensions
} from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';

import Colors from '../../constants/Colors';
import { BASE_URL } from '../../constants/base-url';
import Spinner from '../../components/UI/Spinner';
import Card from '../../components/UI/Card';

const { height } = Dimensions.get('window');

const RepliesScreen = props => {
    const commentId = props.navigation.getParam('commentId');
    const eventId = props.navigation.getParam('eventId');
    //const replies = props.navigation.getParam('replies');

    const [repliesArray, setRepliesArray] = useState([]);
    const [newReply, setNewReply] = useState('');
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [repliesLoading, setRepliesLoading] = useState(false);
    const [repliesError, setRepliesError] = useState();

    const { userId, token } = useSelector(state => state.auth);

    const fetchReplies = useCallback(async () => {
        try {
            setRepliesError(null);
            setRepliesLoading(true);
            const repliesResponse = await fetch(`${BASE_URL}events/${eventId}/comments/${commentId}/replies.json`);
            if (!repliesResponse.ok) {
                //console.log(repliesResponse);
                throw new Error('Something went wrong!');
            }
            const repliesResponseData = await repliesResponse.json();
            //console.log(repliesResponseData)
            if (repliesResponseData !== null) {
                const arr = Object.keys(repliesResponseData).map(key => {
                    return {
                        ...repliesResponseData[key],
                        replyId: key
                    }
                });
                arr.sort((a, b) => a.dateCreated > b.dateCreated ? - 1 : 1);
                setRepliesArray(arr);
            }
            setRepliesLoading(false);
        } catch (err) {
            setRepliesError(err.message);
            setRepliesLoading(false);
        }

    }, [commentId, eventId]);

    useEffect(() => {
        fetchReplies();
    }, [fetchReplies]);

    useEffect(() => {
        const WillFocusSub = props.navigation.addListener('willFocus', () => {
            fetchReplies();
        });
        return () => {
            WillFocusSub.remove();
        }
    }, [fetchReplies]);


    const addReplyHandler = async () => {
        try {
            setError(null);
            setIsLoading(true);
            const userNameResponse = await fetch(`${BASE_URL}users/${userId}.json`);
            if (!userNameResponse.ok) {
                throw new Error('Something went wrong!');
            }

            const userNameResponseData = await userNameResponse.json();
            const userName = userNameResponseData.userName;
            const dateCreated = new Date().toISOString();
            const response = await fetch(`${BASE_URL}events/${eventId}/comments/${commentId}/replies.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dateCreated,
                    userName,
                    body: newReply
                })
            });
            const responseData = await response.json();
            const updatedRepliesArray = repliesArray.concat({
                dateCreated,
                body: newReply,
                userName,
                replyId: responseData.name
            });
            updatedRepliesArray.sort((a, b) => a.dateCreated > b.dateCreated ? -1 : 1);
            setRepliesArray(updatedRepliesArray);
            setIsLoading(false);
            setNewReply('');
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

    }

    const getReadableDate = (date) => {
        return moment(date).format('MMM Do')
    }

    const getTime = (date) => {
        return moment(date).format('h:mm a')
    }

    const renderItem = ({ item }) => {
        return (
            <Card style={styles.card}>
                <View style={styles.summary}>
                    <Text style={styles.boldText}>{item.userName}</Text>
                    <Text style={styles.text}>{getReadableDate(item.dateCreated)}, {getTime(item.dateCreated)}</Text>
                </View>
                <View style={{ height: "60%" }}>
                    <Text style={styles.text}>{item.body}</Text>
                </View>

            </Card>
        )
    }

    let content;
    if (repliesLoading) {
        content = <Spinner />
    } else if (repliesError) {
        console.log(repliesError)
        content = <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, textAlign: 'center' }}>Error getting replies. Try again later</Text>
    } else if (!repliesArray.length) {
        content = <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, textAlign: 'center' }}>No replies to this comment yet!</Text>
    } else {
        content = (
            <FlatList
                data={repliesArray}
                keyExtractor={item => item.replyId}
                renderItem={renderItem}
                onRefresh={fetchReplies}
                refreshing={repliesLoading}
                contentContainerStyle={{ padding: 15, width: "100%", alignItems: "center" }}
                style={{flex: 1}}
            />
        )
    }


    return (
        <KeyboardAvoidingView
            behavior="height"
            keyboardVerticalOffset={100}
            style={styles.screen}
        >
            < View style={styles.contentContainer} >
                {content}
                <View style={styles.addReplyContainer}>
                    <TextInput
                        style={styles.input}
                        numberOfLines={5}
                        placeholder="Add Reply"
                        textAlignVertical="top"
                        multiline={true}
                        value={newReply}
                        onChangeText={text => setNewReply(text)}
                    />
                    <View style={styles.buttonContainer}>
                        {
                            isLoading ? <Spinner /> :
                                <Button
                                    title="Reply"
                                    color={Colors.primary}
                                    disabled={!newReply}
                                    onPress={addReplyHandler}
                                />
                        }

                    </View>
                </View>
            </View >
        </KeyboardAvoidingView>

    )
}

RepliesScreen.navigationOptions = navData => {
    //const numberOfReplies = Object.keys(navData.navigation.getParam('replies').replies).length;
    return {
        headerTitle: `Replies` //(${numberOfReplies})`
    };
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 15,
        width: "100%",
        height: "100%"
    },
    addReplyContainer: {
        position: "absolute",
        paddingVertical: 10,
        paddingHorizontal: 10,
        bottom: 0,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        backgroundColor: "white"
    },
    input: {
        borderWidth: 1,
        borderColor: "#505050",
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        borderBottomLeftRadius: 5,
        padding: 5,
        width: "75%",
    },
    buttonContainer: {
        height: "30%",
        marginHorizontal: 5,
        alignSelf: "center"
    },
    card: {
        maxHeight: height / 4,
        margin: 20,
        padding: 10,
        paddingHorizontal: 5,
    },
    text: {
        fontFamily: "open-sans",
        marginVertical: 5,
        maxHeight: "95%"
    },
    boldText: {
        fontFamily: "open-sans-bold",
        fontSize: 14,
        color: Colors.accent
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        marginBottom: 5,
        height: "40%"
    },
});

export default RepliesScreen;
