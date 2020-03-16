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

const CommentsScreen = props => {
    const eventId = props.navigation.getParam('eventId');
    //const comments = props.navigation.getParam('comments');

    const [commentsArray, setCommentsArray] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState();

    const { userId, token } = useSelector(state => state.auth);

    const fetchComments = useCallback(async () => {
        try {
            setCommentsError(null);
            setCommentsLoading(true);
            const commentsResponse = await fetch(`${BASE_URL}events/${eventId}/comments.json`);
            if (!commentsResponse.ok) {
                //console.log(commentsResponse);
                throw new Error('Something went wrong!');
            }
            const commentsResponseData = await commentsResponse.json();
            //console.log(commentsResponseData)
            if (commentsResponseData !== null) {
                const arr = Object.keys(commentsResponseData).map(key => {
                    return {
                        ...commentsResponseData[key],
                        commentId: key
                    }
                });
                setCommentsArray(arr);
            }
            setCommentsLoading(false);
        } catch (err) {
            setCommentsError(err.message);
            setCommentsLoading(false);
        }

    }, [eventId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        const WillFocusSub = props.navigation.addListener('willFocus', () => {
            fetchComments();
        });
        return () => {
            WillFocusSub.remove();
        }
    }, [fetchComments]);


    const addCommentHandler = async () => {
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
            const response = await fetch(`${BASE_URL}events/${eventId}/comments/.json?auth=${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    dateCreated,
                    userName,
                    body: newComment
                })
            });
            const responseData = await response.json();
            const updatedCommentsArray = commentsArray.concat({
                dateCreated,
                body: newComment,
                userName,
                commentId: responseData.name
            });
            setCommentsArray(updatedCommentsArray);
            setIsLoading(false);
            setNewComment('');
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
                <View style={{ height: "40%" }}>
                    <Text style={styles.text}>{item.body}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        color={Colors.accent}
                        title="VIEW REPLIES"
                    />
                </View>

            </Card>
        )
    }

    let content;
    if (commentsLoading) {
        content = <Spinner />
    } else if (commentsError) {
        console.log(commentsError)
        content = <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, textAlign: 'center' }}>Error getting comments. Try again later</Text>
    } else if (!commentsArray.length) {
        content = <Text style={{ fontFamily: 'open-sans-bold', fontSize: 18, textAlign: 'center' }}>No comments for this event yet!</Text>
    } else {
        content = (
            <FlatList
                data={commentsArray}
                keyExtractor={item => item.commentId}
                renderItem={renderItem}
                onRefresh={fetchComments}
                refreshing={commentsLoading}
                contentContainerStyle={{ padding: 15, width: "100%", alignItems: "center"}}
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
                <View style={styles.addCommentContainer}>
                    <TextInput
                        style={styles.input}
                        numberOfLines={5}
                        placeholder="Add Comment"
                        textAlignVertical="top"
                        multiline={true}
                        value={newComment}
                        onChangeText={text => setNewComment(text)}
                    />
                    <View style={styles.buttonContainer}>
                        {
                            isLoading ? <Spinner /> :
                                <Button
                                    title="Comment"
                                    color={Colors.primary}
                                    disabled={!newComment}
                                    onPress={addCommentHandler}
                                />
                        }

                    </View>
                </View>
            </View >
        </KeyboardAvoidingView>

    )
}

CommentsScreen.navigationOptions = navData => {
    //const numberOfComments = Object.keys(navData.navigation.getParam('comments').comments).length;
    return {
        headerTitle: `Comments` //(${numberOfComments})`
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
    addCommentContainer: {
        flex: 1,
        position: "absolute",
        paddingVertical: 5,
        paddingHorizontal: 10,
        bottom: 0,
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        /*borderTopColor: "#505050",
        borderTopWidth: 1*/
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
        alignItems: 'center',
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
        height: "30%"
    },
});

export default CommentsScreen;
