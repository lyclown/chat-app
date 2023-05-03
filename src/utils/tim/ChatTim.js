// 从v2.11.2起，SDK 支持了 WebSocket，推荐接入；v2.10.2及以下版本，使用 HTTP
// v2.24.0起，SDK 支持使用本地审核插件
import TIM from 'tim-js-sdk';
import TIMUploadPlugin from 'tim-upload-plugin';
import TIMProfanityFilterPlugin from 'tim-profanity-filter-plugin';
import { loginTim } from '@/apis/chat'
import SendMessage from './SendMessage';
class ChatTIM {
    constructor(options) {
        this.TIM = options.TIM;
        this.sdkAppID = null;
        this.userID = ''
        this.userSig = ''
    }
    // 初始化
    async loginTim(phone, password) {
        const { userID, userSig, sdkAppID } = await loginTim({ phone, password })
        this.SDKAppID = sdkAppID
        this.userSig = userSig
        this.userID = userID
        this.tim = this.TIM.create({
            SDKAppID: this.SDKAppID
        });
        this.tim.setLogLevel(0);
        this.tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin });
        this.tim.registerPlugin({ 'tim-profanity-filter-plugin': TIMProfanityFilterPlugin });
        this.emitEvent()
        return this.tim.login({ userID, userSig });
    }
    logoutTim() {
        return this.tim.logout()
    }
    destroyTim() {
        return this.tim.destroy()
    }
    emitEvent() {
        // SDK 进入 ready 状态时触发，接入侧监听此事件，然后可调用 SDK 发送消息等 API，使用 SDK 的各项功能
        this.tim.on(this.TIM.EVENT.SDK_READY, this.onSdkReady);
        // 收到新消息
        this.tim.on(this.TIM.EVENT.MESSAGE_RECEIVED, this.onMessageReceived);
        // 会话列表更新
        this.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated);
        // 群组列表更新
        this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onGroupListUpdated);
        // 收到群系统通知
        this.tim.on(this.TIM.EVENT.GROUP_SYSTEM_NOTICE_RECEIVED, this.onGroupSystemNoticeReceived);
        // 收到群提示消息
        this.tim.on(this.TIM.EVENT.GROUP_TIPS_EVENT, this.onGroupTipsEvent);
        // 用户属性更新
        this.tim.on(this.TIM.EVENT.USER_SIG_EXPIRED, this.onUserSigExpired);
        // SDK 进入 not ready 状态时触发，此时接入侧将无法使用 SDK 发送消息等功能。如果想恢复使用，接入侧需调用 login 接口，驱动 SDK 进入 ready 状态
        this.tim.on(this.TIM.EVENT.SDK_NOT_READY, this.onSdkNotReady);
        // SDK 收到消息被修改的通知，消息发送方可通过遍历 event.data 获取消息列表数据并更新页面上同 ID 消息的内容。
        this.tim.on(this.TIM.EVENT.MESSAGE_MODIFIED, this.onMessageModified);

        // SDK 收到消息被撤回的通知，可通过遍历 event.data 获取被撤回的消息列表数据并渲染到页面，如单聊会话内可展示为 "对方撤回了一条消息"；群聊会话内可展示为 "XXX撤回了一条消息"。

        this.tim.on(this.TIM.EVENT.MESSAGE_REVOKED, this.onMessageRevoked);

        // SDK 收到对端已读消息的通知，即已读回执。可通过遍历 event.data 获取对端已读的消息列表数据并渲染到页面，如单聊会话内可将己方发送的消息由“未读”状态改为“已读”。

        this.tim.on(this.TIM.EVENT.MESSAGE_READ_BY_PEER, this.onMessageReadByPeer);

        // SDK 收到了群消息的已读回执（v2.18.0起支持）
        this.tim.on(this.TIM.EVENT.MESSAGE_READ_RECEIPT_RECEIVED, this.onMessageReadReceiptReceived);

        // 会话列表更新，event.data 是包含 Conversation 对象的数组

        this.tim.on(this.TIM.EVENT.CONVERSATION_LIST_UPDATED, this.onConversationListUpdated);

        // SDK 群组列表更新时触发，可通过遍历 event.data 获取群组列表数据并渲染到页面

        this.tim.on(this.TIM.EVENT.GROUP_LIST_UPDATED, this.onGroupListUpdated);

        // 群属性更新时触发，可通过 event.data 获取到更新后的群属性数据（v2.14.0起支持）
        this.tim.on(this.TIM.EVENT.GROUP_ATTRIBUTES_UPDATED, this.onGroupAttributesUpdated);

        // 创建话题时触发（v2.19.1起支持）
        this.tim.on(this.TIM.EVENT.TOPIC_CREATED, this.onTopicCreated);

        // 删除话题时触发（v2.19.1起支持）

        this.tim.on(this.TIM.EVENT.TOPIC_DELETED, this.onTopicDeleted);

        // 话题资料更新时触发（v2.19.1起支持）

        this.tim.on(this.TIM.EVENT.TOPIC_UPDATED, this.onTopicUpdated);

        // 自己或好友的资料发生变更时触发，event.data 是包含 Profile 对象的数组

        this.tim.on(this.TIM.EVENT.PROFILE_UPDATED, this.onProfileUpdated);

        // SDK 黑名单列表更新时触发

        this.tim.on(this.TIM.EVENT.BLACKLIST_UPDATED, this.onBlacklistUpdated);

        // 好友列表更新时触发
        this.tim.on(this.TIM.EVENT.FRIEND_LIST_UPDATED, this.onFriendListUpdated);

        // 好友分组列表更新时触发

        this.tim.on(this.TIM.EVENT.FRIEND_GROUP_LIST_UPDATED, this.onFriendGroupListUpdated);

        // FRIEND_APPLICATION_LIST_UPDATED 好友申请列表更新时触发
        this.tim.on(this.TIM.EVENT.FRIEND_APPLICATION_LIST_UPDATED, this.onFriendApplicationListUpdated);

        // 用户被踢下线时触发
        this.tim.on(this.TIM.EVENT.KICKED_OUT, this.onKickedOut);

        // 网络状态发生改变
        this.tim.on(this.TIM.EVENT.NET_STATE_CHANGE, this.onNetStateChange);

    }
    // SDK 进入 ready 状态时触发，接入侧监听此事件，然后可调用 SDK 发送消息等 API，使用 SDK 的各项功能
    onSdkReady() {
        this.sendMessage = new SendMessage(this.tim, this.TIM)
        console.log('onSdkReady')
    }
    // 收到新消息
    onMessageReceived(event) {
        console.log('onMessageReceived')
        const messageList = event.data;
        messageList.forEach((message) => {
            if (message.type === TIM.TYPES.MSG_TEXT) {
                // 文本消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.TextPayload
            } else if (message.type === TIM.TYPES.MSG_IMAGE) {
                // 图片消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.ImagePayload
            } else if (message.type === TIM.TYPES.MSG_SOUND) {
                // 音频消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.AudioPayload
            } else if (message.type === TIM.TYPES.MSG_VIDEO) {
                // 视频消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.VideoPayload
            } else if (message.type === TIM.TYPES.MSG_FILE) {
                // 文件消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.FilePayload
            } else if (message.type === TIM.TYPES.MSG_CUSTOM) {
                // 自定义消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.CustomPayload
            } else if (message.type === TIM.TYPES.MSG_MERGER) {
                // 合并消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.MergerPayload
            } else if (message.type === TIM.TYPES.MSG_LOCATION) {
                // 地理位置消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.LocationPayload
            } else if (message.type === TIM.TYPES.MSG_GRP_TIP) {
                // 群提示消息 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.GroupTipPayload
            } else if (message.type === TIM.TYPES.MSG_GRP_SYS_NOTICE) {
                // 群系统通知 - https://web.sdk.qcloud.com/im/doc/zh-cn/Message.html#.GroupSystemNoticePayload
            }
        });
    }
    // 会话列表更新
    onConversationListUpdated(event) {
        console.log('onConversationListUpdated')
    }
    // 群组列表更新
    onGroupListUpdated(event) {
        console.log('onGroupListUpdated')
    }
    // 收到群系统通知
    onGroupSystemNoticeReceived(event) {
        console.log('onGroupSystemNoticeReceived')
    }
    // 收到群提示消息
    onGroupTipsEvent(event) {
        console.log('onGroupTipsEvent')
    }
    // 用户属性更新
    onUserSigExpired(event) {
        console.log('onUserSigExpired')
    }
    // SDK 进入 not ready 状态时触发，此时接入侧将无法使用 SDK 发送消息等功能。如果想恢复使用，接入侧需调用 login 接口，驱动 SDK 进入 ready 状态
    onSdkNotReady(event) {
        console.log('onSdkNotReady')
    }

    // SDK 收到消息被修改的通知，消息发送方可通过遍历 event.data 获取消息列表数据并更新页面上同 ID 消息的内容。
    onMessageModified(event) {
        console.log('onMessageModified')
    }
    // SDK 收到消息被撤回的通知，可通过遍历 event.data 获取被撤回的消息列表数据并渲染到页面，如单聊会话内可展示为 "对方撤回了一条消息"；群聊会话内可展示为 "XXX撤回了一条消息"。
    onMessageRevoked(event) {
        console.log('onMessageRevoked')
    }
    // SDK 收到对端已读消息的通知，即已读回执。可通过遍历 event.data 获取对端已读的消息列表数据并渲染到页面，如单聊会话内可将己方发送的消息由“未读”状态改为“已读”。

    onMessageReadByPeer(event) {
        console.log('onMessageReadByPeer')
    }
    // SDK 收到了群消息的已读回执（v2.18.0起支持）
    onMessageReadReceiptReceived(event) {
        // event.data - 存储消息已读回执信息的数组
        const readReceiptInfoList = event.data;
        readReceiptInfoList.forEach((item) => {
            const { groupID, messageID, readCount, unreadCount } = item;
            const message = tim.findMessage(messageID);
            if (message) {
                if (message.readReceiptInfo.unreadCount === 0) {
                    // 全部已读
                } else {
                    // message.readReceiptInfo.readCount - 消息最新的已读数
                    // 如果想要查询哪些群成员已读了此消息，请使用 [getGroupMessageReadMemberList] 接口
                }
            }
        });
    }
    // 群属性更新时触发，可通过 event.data 获取到更新后的群属性数据（v2.14.0起支持）
    onGroupAttributesUpdated(event) {
        console.log('onGroupAttributesUpdated')
    }
    // 创建话题时触发（v2.19.1起支持）
    onTopicCreated(event) {
        console.log('onTopicCreated')
    }
    // 删除话题时触发（v2.19.1起支持）
    onTopicDeleted(event) {
        console.log('onTopicDeleted')
    }
    // 话题资料更新时触发（v2.19.1起支持）
    onTopicUpdated(event) {
        console.log('onTopicUpdated')
    }
    // 自己或好友的资料发生变更时触发，event.data 是包含 Profile 对象的数组
    onProfileUpdated(event) {
        console.log('onProfileUpdated')
    }
    // SDK 黑名单列表更新时触发
    onBlacklistUpdated(event) {
        console.log('onBlacklistUpdated')
    }
    // 好友列表更新时触发
    onFriendListUpdated(event) {
        console.log('onFriendListUpdated')
    }
    // 好友分组列表更新时触发
    onFriendGroupListUpdated(event) {
        console.log('onFriendGroupListUpdated')
    }
    // FRIEND_APPLICATION_LIST_UPDATED 好友申请列表更新时触发
    onFriendApplicationListUpdated(event) {
        // friendApplicationList - 好友申请列表 - [FriendApplication]
        // unreadCount - 好友申请的未读数
        const { friendApplicationList, unreadCount } = event.data;
        // 发送给我的好友申请（即别人申请加我为好友）
        const applicationSentToMe = friendApplicationList.filter((friendApplication) => friendApplication.type === this.TIM.TYPES.SNS_APPLICATION_SENT_TO_ME);
        // 我发送出去的好友申请（即我申请加别人为好友）
        const applicationSentByMe = friendApplicationList.filter((friendApplication) => friendApplication.type === this.TIM.TYPES.SNS_APPLICATION_SENT_BY_ME);

    }
    // 用户被踢下线时触发
    onKickedOut(event) {
        console.log(event.data.type);
        // this.TIM.TYPES.KICKED_OUT_MULT_ACCOUNT(Web端，同一帐号，多页面登录被踢)
        // this.TIM.TYPES.KICKED_OUT_MULT_DEVICE(同一帐号，多端登录被踢)
        // this.TIM.TYPES.KICKED_OUT_USERSIG_EXPIRED(签名过期)
        // this.TIM.TYPES.KICKED_OUT_REST_API(REST API kick 接口踢出。v2.20.0起支持)
    }
    // 网络状态发生改变
    onNetStateChange(event) {
        // v2.5.0 起支持
        // event.data.state 当前网络状态，枚举值及说明如下：
        // this.TIM.TYPES.NET_STATE_CONNECTED - 已接入网络
        // this.TIM.TYPES.NET_STATE_CONNECTING - 连接中。很可能遇到网络抖动，SDK 在重试。接入侧可根据此状态提示“当前网络不稳定”或“连接中”
        // this.TIM.TYPES.NET_STATE_DISCONNECTED - 未接入网络。接入侧可根据此状态提示“当前网络不可用”。SDK 仍会继续重试，若用户网络恢复，SDK 会自动同步消息

        console.log('onNetStateChange')
    }
    //  清空单聊的本地及云端的消息
    async clearHistoryMessage() {
        try {
            return await tim.clearHistoryMessage('C2CExample');
        } catch (error) {
            return error
        }
    }
    // 会话列表更新时触发
}
export default ChatTIM