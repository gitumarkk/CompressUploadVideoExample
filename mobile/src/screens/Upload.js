import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  View, StyleSheet, Button
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

class UploadScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  showImagePicker = () => {
    const options = {
      mediaType: "video",
      videoQuality: "low",
      durationLimit: 180
    };

    /**
     * The first arg is the options object for customization (it can also be null or omitted for default options),
     * The second arg is the callback which sends object: response (more info in the API Reference)
     */
    ImagePicker.launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        console.log(response.path)
      }
    });
  }

  render() {
    return (
      <View contentContainerStyle={styles.cards}>
        <Button
          title="Select Video to Upload"
          onPress={this.showImagePicker}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
});

const mapDispatchToProps = (dispatch, props, state) => {
  return {
}};

const mapStateToProps = (state, props) => {
  return {
    ...createStructuredSelector({
    })(state, props),

  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UploadScreen);
