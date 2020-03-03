import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  ScrollView, StyleSheet, FlatList
} from 'react-native';


class ListScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.cards}>

      </ScrollView>
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
)(ListScreen);
