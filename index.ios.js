/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    TabBarIOS,
    Navigator
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import List from './app/creation/index'
import Edit from './app/edit/index'
import Account from './app/account/index'

export default class dog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedTab: 'videocam'
        }
    }

    render() {
        return (
            <TabBarIOS tintColor='#ee735c'>
                <Icon.TabBarItem
                    iconName="ios-videocam-outline"
                    selectedIconName="ios-videocam"
                    selected={this.state.selectedTab === 'videocam'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'videocam'
                        })
                    }}
                >
                    <Navigator
                        initialRoute={{
                            name: 'list',
                            component: List
                        }}
                        configureScene={(route) => {
                            return Navigator.SceneConfigs.FloatFromRight
                        }}
                        renderScene={(route, navigator) => {
                            let Component = route.component
                            return <Component {...route.params} navigator={navigator} />
                        }}
                    />
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    iconName="ios-recording-outline"
                    selectedIconName="ios-recording"
                    selected={this.state.selectedTab === 'recording'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'recording'
                        })
                    }}
                >
                    <Edit />
                </Icon.TabBarItem>
                <Icon.TabBarItem
                    iconName="ios-more-outline"
                    selectedIconName="ios-more"
                    selected={this.state.selectedTab === 'more'}
                    onPress={() => {
                        this.setState({
                            selectedTab: 'more'
                        })
                    }}
                >
                    <Account />
                </Icon.TabBarItem>
            </TabBarIOS>
        )
    }
}

const styles = StyleSheet.create({

})

AppRegistry.registerComponent('dog', () => dog)
