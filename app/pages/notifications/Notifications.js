import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Modal
} from 'react-native';
import { inject, observer } from 'mobx-react';

import Notification from '../../components/Notification';
import Login from '../../components/Login';
import ownerAction from '../../actions/Owner';
import notificationAction from '../../actions/Notification';
import { utils, module, color } from '../../styles';

@inject('owner', 'notification')
@observer
class Navigation extends Component {

  static propTypes = {
    owner: PropTypes.object.isRequired,
    notification: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired
  };

  componentWillMount() {
    const { owner } = this.props;
    if (owner.isLogin) {
      notificationAction.getCntx();
    }
    // clear icon badge number
    Notification.setApplicationIconBadgeNumber(0);
  }

  _goView = async (routerName, pathname, stackTitle) => {
    const { owner } = this.props;
    const isLogin = await ownerAction.isLogin();
    if (!isLogin) {
      owner.setShowLogin(true);
    } else {
      this.props.navigation.navigate(routerName, {
        stackTitle,
        pathname
      });
    }
  };

  render() {
    const { owner, notification } = this.props;
    return (
      <ScrollView style={[utils.statusBar, utils.flex]}>
        <Modal visible={owner.showLogin} onRequestClose={() => null}>
          <Login />
        </Modal>
        <View style={module.wrap}>
          <TouchableOpacity
            style={[module.list, utils.rowSpaceBetween]}
            onPress={() => {
              this._goView('List', 'notifications/commented', '收到的回帖');
            }}
          >
            <Text>收到的回帖</Text>
            {
              notification.unreadCommentedNotificationCnt === 0 ? null :
              <Text style={{ color: color.red }}>
                {notification.unreadCommentedNotificationCnt}
              </Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, utils.rowSpaceBetween]}
            onPress={() => {
              this._goView('List', 'notifications/reply', '收到的回复');
            }}
          >
            <Text>收到的回复</Text>
            {
              notification.unreadReplyNotificationCnt === 0 ? null :
              <Text style={{ color: color.red }}>
                {notification.unreadReplyNotificationCnt}
              </Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, utils.rowSpaceBetween]}
            onPress={() => {
              this._goView('List', 'notifications/at', '提及我的');
            }}
          >
            <Text>提及我的</Text>
            {
              notification.unreadAtNotificationCnt === 0 ? null :
              <Text style={{ color: color.red }}>
                {notification.unreadAtNotificationCnt}
              </Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, module.listLast, utils.rowSpaceBetween]}
            onPress={() => {
              this._goView('List', 'notifications/following', '我关注的');
            }}
          >
            <Text>我关注的</Text>
            {
              notification.unreadFollowingNotificationCnt === 0 ? null :
              <Text style={{ color: color.red }}>
                {notification.unreadFollowingNotificationCnt}
              </Text>
            }
          </TouchableOpacity>
        </View>
        <View style={module.wrap}>
          <TouchableOpacity
            style={[module.list, utils.rowSpaceBetween]}
            onPress={() => {
              this._goView('List', 'notifications/point', '积分');
            }}
          >
            <Text>积分</Text>
            {
              notification.unreadPointNotificationCnt === 0 ? null :
              <Text style={{ color: color.red }}>
                {notification.unreadPointNotificationCnt}
              </Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, utils.rowSpaceBetween]}
            onPress={() => {
              this._goView('List', 'notifications/broadcast', '同城');
            }}
          >
            <Text>同城</Text>
            {
              notification.unreadBroadcastNotificationCnt === 0 ? null :
              <Text style={{ color: color.red }}>
                {notification.unreadBroadcastNotificationCnt}
              </Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, utils.rowSpaceBetween]}
            onPress={() => {
              this._goView('List', 'notifications/sys-announce', '系统');
            }}
          >
            <Text>系统</Text>
            {
              notification.unreadSysAnnounceNotificationCnt === 0 ? null :
              <Text style={{ color: color.red }}>
                {notification.unreadSysAnnounceNotificationCnt}
              </Text>
            }
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, module.listLast, utils.rowSpaceBetween]}
            onPress={() => {
              this._goView('List', `user/${owner.name}/followers`, '关注者');
            }}
          >
            <Text>新增关注者</Text>
            {
              notification.unreadNewFollowerNotificationCnt === 0 ? null :
              <Text style={{ color: color.red }}>
                {notification.unreadNewFollowerNotificationCnt}
              </Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>);
  }
}

export default Navigation;
