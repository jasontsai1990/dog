import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
} from 'react-native'

export default class Edit extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>编辑页面</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})