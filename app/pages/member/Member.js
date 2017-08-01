import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Modal,
  Image
} from 'react-native';
import { inject, observer } from 'mobx-react';

import Login from '../../components/Login';
import ownerAction from '../../actions/Owner';
import memberAction from '../../actions/Member';
import logoPng from '../../images/logo.png';
import { utils, module, member as memberStyle, common } from '../../styles';

@inject('owner')
@observer
class Member extends Component {

  static propTypes = {
    navigation: PropTypes.object.isRequired,
    owner: PropTypes.object.isRequired
  };

  static navigationOptions = ({ navigation }) => {
    if (navigation.state.params) {
      return {
        title: navigation.state.params.name,
        tabBarVisible: false
      };
    }
    return {
      header: null,
      tabBarVisible: true
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isOwner: !this.props.navigation.state.params,
      name: '',
      intro: '',
      avatarURL: '',
      isLoading: true,
      nickname: ''
    };
  }

  async componentWillMount() {
    await ownerAction.isLogin();
    const { owner } = this.props;
    const name = this.state.isOwner
      ? owner.name : this.props.navigation.state.params.name;
    if (name !== '') {
      const response = await memberAction.getDetail(name);
      this.setState({
        name,
        intro: response.intro,
        avatarURL: response.avatarURL,
        nickname: response.nickname === '' ? name : response.nickname,
        isLoading: true
      });
    }
  }

  _goView = async (routerName, pathname, stackTitle) => {
    const { owner } = this.props;
    const isLogin = await ownerAction.isLogin();
    if (isLogin) {
      this.props.navigation.navigate(routerName, {
        stackTitle,
        pathname
      });
    } else {
      owner.setShowLogin(true);
    }
  };

  render() {
    const { owner } = this.props;

    // process first login, reload owner info
    if (owner.isLogin && this.state.name === '') {
      memberAction.getDetail(owner.name).then((response) => {
        this.setState({
          name: owner.name,
          intro: response.intro,
          avatarURL: response.avatarURL,
          nickname: response.nickname === '' ? owner.name : response.nickname,
          isLoading: true
        });
      });
    }

    let avatarURL = { uri: this.state.avatarURL };

    if (this.state.avatarURL === '') {
      avatarURL = logoPng;
    }

    let loginButton = null;
    if (!this.props.navigation.state.params) {
      loginButton = (<View style={module.wrap}><TouchableOpacity
        style={[module.list, module.listLast]}
        onPress={() => this.props.navigation.navigate('Setting')}
      >
        <Text>设置</Text>
      </TouchableOpacity></View>);

      if (!owner.isLogin) {
        loginButton = (<View style={module.wrap}><TouchableOpacity
          style={[module.list, module.listLast]}
          onPress={() => owner.setShowLogin(true)}
        >
          <Text>登录</Text>
        </TouchableOpacity></View>);
      }
    }

    return (
      <ScrollView style={this.state.isOwner ? [utils.statusBar, utils.flex] : {}}>
        <Modal visible={owner.showLogin} onRequestClose={() => null}>
          <Login />
        </Modal>
        <View style={memberStyle.infoWrap}>
          <Image style={common.avatarBigger} source={avatarURL} />
          <View style={utils.flex}>
            <Text style={[memberStyle.introText, memberStyle.introName]}>
              {this.state.nickname}
            </Text>
            <Text style={memberStyle.introText}>{this.state.intro}</Text>
          </View>
        </View>
        <View style={module.wrap}>
          <TouchableOpacity
            style={module.list}
            onPress={() => {
              this._goView('List', `user/${this.state.name}/articles`, '帖子');
            }}
          >
            <Text>帖子</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={module.list}
            onPress={() => {
              this._goView('List', `user/${this.state.name}/comments`, '回帖');
            }}
          >
            <Text>回帖</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={module.list}
            onPress={() => {
              this.props.navigation.navigate('WebView', {
                path: `member/${this.state.name}/articles/anonymous`,
                injectJS: `$('body').html($('.list').html()).addClass('list');
                $('html').css({
                  'background-color': '#fff'
                });`,
                stackTitle: '匿贴'
              });
            }}
          >
            <Text>匿贴</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, module.listLast]}
            onPress={() => {
              this.props.navigation.navigate('WebView', {
                path: `member/${this.state.name}/comments/anonymous`,
                injectJS: `$('body').html($('.list').html()).addClass('list');
                $('html').css({
                  'background-color': '#fff'
                });`,
                stackTitle: '匿回'
              });
            }}
          >
            <Text>匿回</Text>
          </TouchableOpacity>
        </View>
        <View style={module.wrap}>
          <TouchableOpacity
            style={module.list}
            onPress={() => {
              this._goView('List', `user/${this.state.name}/watching/articles`, '关注帖子');
            }}
          >
            <Text>关注帖子</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={module.list}
            onPress={() => {
              this._goView('List', `user/${this.state.name}/following/users`, '关注用户');
            }}
          >
            <Text>关注用户</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={module.list}
            onPress={() => {
              this._goView('List', `user/${this.state.name}/following/tags`, '关注标签');
            }}
          >
            <Text>关注标签</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={module.list}
            onPress={() => {
              this._goView('List', `user/${this.state.name}/following/articles`, '收藏帖子');
            }}
          >
            <Text>收藏帖子</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, module.listLast]}
            onPress={() => {
              this._goView('List', `user/${this.state.name}/followers`, '关注者');
            }}
          >
            <Text>关注者</Text>
          </TouchableOpacity>
        </View>
        <View style={module.wrap}>
          <TouchableOpacity
            style={module.list}
            onPress={() => {
              this.props.navigation.navigate('WebView', {
                path: `member/${this.state.name}/points`,
                injectJS: `$('body').html($('.tab-current').next().html());
                $('.ranking').remove();
                $('html').css({
                  'background-color': '#fff'
                });`,
                stackTitle: '积分'
              });
            }}
          >
            <Text>积分</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[module.list, module.listLast]}
            onPress={() => {
              this.props.navigation.navigate('WebView', {
                path: `member/${this.state.name}/forge/link`,
                injectJS: `$('body').html($('.link-forge').html()).addClass('link-forge');
                $('html').css({
                  'background-color': '#fff',
                  'padding': '10px'
                });`,
                stackTitle: '链接熔炉'
              });
            }}
          >
            <Text>链接熔炉</Text>
          </TouchableOpacity>
        </View>
        {loginButton}
      </ScrollView>);
  }
}

export default Member;
