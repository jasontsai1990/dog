import React, { Component } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    Image
} from 'react-native'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/Ionicons'
import config from '../common/config'

let width = Dimensions.get('window').width


export default class Details extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rate: 1,
            videoProgress: 0, // 进度条
            videoLoading: false, // 小菊花 （加载）
            videoPlayed: false, // 播放结束 (重播)
            videoLoad: false, // 加载 （暂停）
            videoPause: false, // 恢复暂停
            videoError: false, // 错误
        }
    }

    _backToList() {
        this.props.navigator.pop()
    }

    _onLoadStart() {
        this.setState({
            videoLoading: true,
            videoLoad: true,
        })
    }

    _onLoad() {}

    _onProgress(data) {
        this.setState({
            videoLoading: false,
        })

        let duration = data.playableDuration //  总进度
        let currentTime = data.currentTime // 当前进度

        this.setState({
            videoProgress: currentTime / duration // 百分比
        })
    }

    _onEnd() {
        // 播放结束
        this.setState({
            videoProgress: 0,
            videoPlayed: true,
            videoLoad: false,
        })
    }

    _onError(e) {
        this.setState({
            videoProgress: 0,
            videoError: true,
            videoPlayed: false,
            videoLoading: false,
            videoLoad: false,

        })
    }

    // 重播
    _rePlay() {
        this.setState({
            videoPlayed: false,
            videoLoad: true,
        })
        this.player.seek(0) // 重播
        // this.player.presentFullscreenPlayer() // 全屏
    }

    // 暂停 & 恢复
    _paused() {
        this.setState({
            rate: this.state.rate === 0 ? 1 : 0,
            videoPause: !this.state.videoPause,
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backBox}
                        onPress={this._backToList.bind(this)}
                    >
                        <Icon
                            name='ios-arrow-back'
                            style={styles.backIcon}
                        />
                        <Text style={styles.backText}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle} numberOflines={1}>视频详情页</Text>
                </View>
                <View style={styles.videoBox}>
                    <Video
                        ref={(ref) => {
                            this.player = ref // 绑定节点
                        }}
                        source={{uri: this.props.rowData.video}}
                        style={styles.video}
                        pasued={false} // 默认打开播放
                        rate={this.state.rate} // 0暂停 1正常播放
                        repeat={false} // 重复播放
                        volume={5} // 音量
                        muted={true} // 静音
                        resizeMode="cover" // 裁剪效果
                        onLoadStart={this._onLoadStart.bind(this)} // 视频启动调用
                        onLoad={this._onLoad.bind(this)} // 加载时一直调用
                        onProgress={this._onProgress.bind(this)} // 每隔250毫秒一次
                        onEnd={this._onEnd.bind(this)} // 结束
                        onError={this._onError.bind(this)} // 错误
                    />
                    {
                        // 加载小菊花
                        this.state.videoLoading && <ActivityIndicator style={styles.loading}/>
                    }
                    {
                        // 可废除，剩下点击屏幕一个状态
                        // 重播
                        this.state.videoPlayed &&
                        <Icon
                            name='ios-play'
                            size={48}
                            onPress={this._rePlay.bind(this)}
                            style={styles.play}
                        />
                    }
                    {
                        // 暂停
                        this.state.videoLoad &&
                        <TouchableOpacity
                            onPress={this._paused.bind(this)}
                            style={styles.pauseBox}
                        >
                            { this.state.videoPause &&
                                <Icon
                                    name='ios-pause'
                                    size={48}
                                    style={styles.play}
                                />
                            }
                        </TouchableOpacity>
                    }
                    {
                        // 错误
                        this.state.videoError && <Text style={styles.errorText}>视频出错！！！</Text>
                    }
                    <View style={styles.progressBox}>
                        <View style={[styles.progressBar, {width: width * this.state.videoProgress}]} />
                    </View>
                </View>
                <ScrollView
                    enableEmptySections={true} // 空数据不报错
                    automaticallyAdjustContentInsets={false} // 顶部空行
                    showsVerticalScrollIndicator={false} // 滚动条
                    style={styles.scrollView}
                >
                    <View style={styles.infoBox}>
                        <Image
                            style={styles.avatar}
                            source={{url: this.props.rowData.author.avatar}}
                        />
                        <View style={styles.descBox}>
                            <Text style={styles.nickname}>{this.props.rowData.author.nickname}</Text>
                            <Text style={styles.title}>{this.props.rowData.title}</Text>
                        </View>
                    </View>
                </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 64,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderColor: 'transparent',
        backgroundColor: '#fff'
    },
    backBox: {
        position: 'absolute',
        left: 12,
        top: 32,
        width: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTitle: {
        width: width - 120,
        textAlign: 'center'
    },
    backIcon: {
        color: '#999',
        fontSize: 20,
        marginRight: 5,
    },
    backText: {
      color: '#999'
    },
    videoBox: {
        width: width,
        height: 360,
        backgroundColor: '#000'
    },
    video: {
        width: width,
        height: 360,
        backgroundColor: '#000'
    },
    loading: {
        position: 'absolute',
        left: 0,
        top: 140,
        width: width,
        alignSelf: 'center',
        backgroundColor: 'transparent',
    },
    errorText: {
        position: 'absolute',
        left: 0,
        top: 140,
        width: width,
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: '#fff',
        fontSize: 18,
    },
    play: {
        position: 'absolute',
        top: 140,
        left: width / 2 - 30,
        width: 60,
        height: 60,
        paddingTop: 7,
        paddingLeft: 18,
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 30,
        color: '#eb7b66'
    },
    progressBox: {
        width: width,
        height: 2,
        backgroundColor: '#ccc'
    },
    progressBar: {
        width: 1,
        height: 2,
        backgroundColor: '#ff6600'
    },
    pauseBox: {
        width: width,
        height: 360,
        position: 'absolute',
        top: 0,
        left: 0,
    },
    infoBox: {
        width: width,
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        marginRight: 10,
        marginLeft: 10,
        borderRadius: 30,
    },
    descBox: {
        flex: 1,
    },
    nickname: {
        fontSize: 18,
    },
    title: {
        marginTop: 8,
        fontSize: 16,
        color: '#666'
    },
})