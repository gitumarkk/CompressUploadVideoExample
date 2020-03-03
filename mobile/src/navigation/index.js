import React, { PureComponent, Fragment }  from 'react';
import { Platform } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
// App
import {
  onChange as appOnChange,
  uploadVideoRequest,
} from '../store/app';
import Routes from './Routes';



const AppNavigator = createAppContainer(createSwitchNavigator(
  { Routes },
  { initialRouteName: 'Routes' },
));

class WrappedNavigator extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    this.props.uploadVideoRequest();
  }

  render() {
    return (
      <Fragment>
        <AppNavigator ref={(nav) => { this.navigator = nav; }} />
      </Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    appOnChange: (key, data) => dispatch(appOnChange(key, data)),
    uploadVideoRequest: () => dispatch(uploadVideoRequest()),
  };
};

const mapStateToProps = (state, props) => {
  return {
    ...createStructuredSelector({
    })(state, props),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WrappedNavigator);
