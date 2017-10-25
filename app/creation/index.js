import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableHighlight,
    Image,
    Dimensions,
    ActivityIndicator,
    RefreshControl
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import config from '../common/config'
import Details from './details'

// 宽度
let width = Dimensions.get('window').width

class Item extends Component {
    constructor(props) {
        super(props)
        this.state = {
            up: this.props.rowData.up
        }
    }

    async _up() {
        try {
            let response = await fetch(config.api.up + this.state.up)
            let responseText = await response.text()
            this.setState({
                up: parseInt(responseText)
            })
        }
        catch(error) {
            alert('点赞失败')
        }
    }

    render() {
        return (
            <TouchableHighlight onPress={this.props.loadPage}>
                <View style={styles.list}>
                    <Text style={styles.title}>{this.props.rowData.title}</Text>
                    <Image
                        style={styles.thumb}
                        source={{uri: this.props.rowData.thumb}}
                        resizeMode={Image.resizeMode.cover}
                    >
                        <Icon
                            name='ios-play'
                            style={styles.play}
                            size={28}
                        />
                    </Image>
                    <View style={styles.listFooter}>
                        <View style={styles.handleBox}>
                            <Icon
                                name={this.state.up ? 'ios-heart': 'ios-heart-outline'}
                                style={this.state.up ? styles.up : styles.down}
                                size={28}
                                onPress={this._up.bind(this)}
                            />
                            <Text
                                style={styles.handleText}
                                onPress={this._up.bind(this)}
                            >喜欢
                            </Text>
                        </View>
                        <View style={styles.handleBox}>
                            <Icon
                                name='ios-chatboxes-outline'
                                style={styles.commentIcon }
                                size={28}
                            />
                            <Text style={styles.handleText}>评论</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        )
    }
}

export default class List extends Component {
    constructor(props) {
        super(props)
        let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
        this.state = {
            dataSource: ds.cloneWithRows([]),
            Loading: false, // 加载中，小菊花
            refreshing: false, // 刷新中，小菊花
            hasMore: true, // 更多数据
            page: 1,
        }
    }

    // 加载数据
    async _fetchData(refresh = false) {
        try {
            // 加载更多
            if (!refresh) {
                // 数据加载中
                this.setState({Loading: true})
                let response = await fetch(config.api.list + this.state.page)
                let responseJson = await response.json()
                this.setState({Loading: false, page: this.state.page + 1}) // 翻页
                // 是否有数据
                if (responseJson.length === undefined) {
                    this.setState({
                        hasMore: false
                    })
                } else {
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(responseJson) // 数据装载
                    })
                }

            // 刷新
            } else {
                // 数据加载中
                this.setState({refreshing: true})
                let response = await fetch(config.api.list + '1')
                let responseJson = await response.json()
                this.setState({refreshing: false})
                // 是否有数据
                if (responseJson.length !== undefined) {
                    this.setState({
                        hasMore: true, // 重置更多加载
                        page: 2, // 重置分页
                        dataSource: this.state.dataSource.cloneWithRows(responseJson) // 数据装载
                    })
                }
            }

        } catch(error) {
            // 加载完毕
            this.setState({loading: false})
            this.setState({refreshing: false})
        }
    }

    // 加载更多
    _fetchMoreData() {
        if (!this.state.Loading && this.state.hasMore) {
            this._fetchData()
        }
    }

    // 刷新
    _onRefresh() {
        if (!this.state.refreshing) {
            this._fetchData(true)
        }
    }

    // loading icon
    _renderFooter() {
        if (!this.state.hasMore) {
            return (<View><Text style={styles.loadingMore}>没有更多了</Text></View>)
        }
        return (<ActivityIndicator  style={styles.loading} />)
    }

    _loadPage(rowData) {
        this.props.navigator.push({
            name: 'details',
            component: Details,
            params: {
                rowData: rowData
            }
        })
    }

    componentDidMount() {
        this._fetchData()
    }

    _renderRow(rowData) {
        return (<Item rowData={rowData} key={rowData.title} loadPage={this._loadPage.bind(this, rowData)} />)
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>列表页面</Text>
                </View>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow.bind(this)}
                    enableEmptySections={true} // 空数据不报错
                    automaticallyAdjustContentInsets={false} // 顶部空行
                    onEndReached={this._fetchMoreData.bind(this)} // 触底事件
                    onEndReachedThreshold={20} // 距离底部多高预先加载 20dp
                    renderFooter={this._renderFooter.bind(this)} // 菊花
                    showsVerticalScrollIndicator={false} // 滚动条

                    // 下拉刷新
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            tintColor="#eee"
                            // title="刷新..."
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5fcff'
    },
    header: {
        paddingTop: 25,
        paddingBottom: 12,
        backgroundColor: '#ee735c'
    },
    headerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
    list: {
        width: width,
        marginBottom: 10,
        backgroundColor: '#fff'
    },
    thumb: {
        width: width,
        height: width * 0.56
    },
    play: {
        position: 'absolute',
        bottom: 14,
        right: 14,
        width: 46,
        height: 46,
        paddingTop: 9,
        paddingLeft: 18,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 23,
        color: '#eb7b66'
    },
    title: {
        paddingTop: 10,
        fontSize: 18,
        color: '#333'
    },
    listFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee'
    },
    handleBox: {
        paddingTop: 10,
        flexDirection: 'row',
        width: width / 2,
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    handleText: {
        fontSize: 18,
        paddingLeft: 12,
        color: '#333',
    },
    up: {
       fontSize: 22,
       color: '#eb7b66'
    },
    down: {
        fontSize: 22,
        color: '#333'
    },
    CommentIcon: {
        fontSize: 22,
        color: '#333'
    },
    loadingMore: {
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 14,
        color: '#777'
    },
    loading: {
        paddingVertical: 20,
    }
})





