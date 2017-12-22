import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addFavoriteLocations } from '../../../actions';

import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import {
  Text,
  SearchBar,
  List,
  ListItem,
  CheckBox,
  Button
} from 'react-native-elements';

import MiniHeader from '../../mini-header-view';
import colorScheme from '../../../config/colors';

class LocationFilter extends Component {
  state = {
    searchTerm: '',
    favoriteLocations: this.props.favoriteLocations,
  }

  search(locations, searchTerm) {
      return locations.filter(location => location.name.toUpperCase().includes(searchTerm.toUpperCase()));        
  }

  render() {
    const { locations, onBackPress, addFavoriteLocations } = this.props;
    
    return(
      <View style={styles.container}>
        <MiniHeader 
          title="Select Locations" 
          leftIconFunction={onBackPress}
          rightIconFunction={() => {
              addFavoriteLocations(this.state.favoriteLocations)
              onBackPress();
          }}
        />
        <View style={styles.containerRow}>
            <SearchBar 
            containerStyle = {styles.searchBarContainer}
            inputStyle = {{backgroundColor: colorScheme.primaryContainerColor}}
            lightTheme  
            placeholder='Search'
            placeholderTextColor = {colorScheme.tertiaryTextColor}
            onChangeText={text => this.setState({searchTerm: text})}
            textInputRef='textInput'
            />
            <Button
                title="Clear all"
                small
                containerViewStyle={styles.clearButtonContainer}
                textStyle={{ color: colorScheme.primaryTextColor }}
                buttonStyle={{ backgroundColor: colorScheme.primaryColor }}
                onPress={() => {
                    this.setState({favoriteLocations: []});
                }}
            />
        </View>
        <ScrollView>
          {(locations.length <= 0) && <ActivityIndicator animating={!locations} size="large" style={{alignSelf: 'center'}}/>}
          {(locations.length > 0) && <List>
            {this.search(locations, this.state.searchTerm).map(location => {
              return(
                <ListItem
                  key={location.URN}
                  title={location.name}
                  subtitle={`${location.locationType.replace(/_/g, " ")}`}
                  rightIcon={<CheckBox
                    checked={this.state.favoriteLocations.indexOf(location.URN) >= 0}
                    onPress={() => {
                      const indexOfLocation = this.state.favoriteLocations.indexOf(location.URN);

                      if(indexOfLocation < 0) {                       
                        this.setState({favoriteLocations: [...this.state.favoriteLocations, location.URN]});
                      } else {
                        this.setState({favoriteLocations: this.state.favoriteLocations.filter((item, index) => index !== indexOfLocation)});
                      }
                    }}
                  />}
                  subtitleStyle={styles.subtitle}
                />
              );
            })}
          </List>}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerRow: {
    flexDirection: 'row',
    alignItems:'center',
    paddingLeft: 15,
    paddingRight: 0,
    backgroundColor: colorScheme.primaryColor
  },
  searchBarContainer: {
    backgroundColor: colorScheme.primaryColor,
    marginRight: 0,
    borderBottomWidth: 0,
    borderTopWidth: 0,     
    flex: 4, 
  },
  subtitle: {
      fontSize: 10,
  },
  clearButtonContainer: {
    flex: 1,
    marginRight: 0,
    marginLeft: 0,
    alignSelf: 'stretch',
  },
});

function mapStateToProps(state) {
  return {
    locations: state.location.locations,
    locationsByType: state.location.locationsByType,
    loading: state.location.loading,
    favoriteLocations: state.favorites.locations
  }
}

export default connect(mapStateToProps, {
    addFavoriteLocations
})(LocationFilter);