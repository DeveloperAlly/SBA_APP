/*
* Main view
* TODO: put hardcoded strings into strings file
*/

import React, { Component } from 'react';
import {
  Alert,
  Platform,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Text
 } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Ionicons';
import Spinner from 'react-native-loading-spinner-overlay';
import ImagePicker from 'react-native-image-picker';

import {
  receiptsFetch,
  saveImageData,
  addReceiptFromImage,
  setFetching,
  setCurLocation
 } from '../actions';
import { layoutStyles } from './styles';
import { PRIMARY_HIGHLIGHT_COLOUR } from '../global/colours';

import {
  BackgroundView,
  CardSection,
  NavListSectionTools,
  ColourText,
  TitleText,
  FormText,
  FAB
} from '../components';

import {
  ProcessingStr,
  ReimburseStr,
  ReceiptsStr,
  TripsStr,
  ToolsStr
} from './strings';

let self;

class MainNavigationList extends Component {

  constructor(props) {
    super(props);
    self = this;
    console.log(this.props);
  }

  shouldComponentUpdate(nextProps) {
    if (this.props !== nextProps) {
      if (this.props.userName !== nextProps.userName) {
        return false;
      }
      return true;
    }
    return false;
  }

  render() {
    return (
      <BackgroundView style={layoutStyles.mainListView}>
        <View style={{ flexDirection: 'row', width: null }}>
          <TouchableHighlight
            onPress={this.processingPressed.bind(this)}
            style={{ flex: 1, width: null, height: 50 }}
          >
            <View style={{ flexGrow: 1 }}>
              {this.renderProcessingTab()}
            </View>
          </TouchableHighlight>

          <TouchableHighlight
            onPress={this.reimburseablePressed.bind(this)}
            style={{ flex: 1, width: null, height: 50 }}
          >
            <View style={{ flexGrow: 1 }}>
              {this.renderReimbursableTab()}
            </View>
          </TouchableHighlight>
        </View>

        <TouchableHighlight
          onPress={this.receiptsPressed}
        >
          {this.renderReceiptsBar()}
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.tripsPressed.bind(this)}
        >
          {this.renderTripsBar()}
        </TouchableHighlight>
        <TouchableHighlight
          onPress={this.toolsPressed}
        >
          {this.renderToolsBar()}
        </TouchableHighlight>
        <FAB
          onPress={this.onPressFAB}
        />
        <Spinner
          visible={this.props.isFetching}
          textContent={''}
          textStyle={{ color: 'white' }}
        />
      </BackgroundView>
    );
  }

  renderReceiptsBar() {
    if (this.props.numOfReceipts === this.props.myTrips.length) {
      return (
      <View>
        <CardSection style={mainStyles.cardSection}>
          <View style={{ justifyContent: 'space-around', paddingTop: 10, paddingLeft: 5 }}>
            <TitleText>{ReceiptsStr}</TitleText>
            {this.renderTripCost()}
            <ColourText style={mainStyles.text}>{this.props.tDate}</ColourText>
          </View>
          <View style={{ alignSelf: 'flex-end', paddingRight: 10 }} >
            <Icon name='ios-arrow-forward' size={50} />
          </View>
        </CardSection>
      </View>
      );
    } else if (this.props.numOfReceipts < 1) {
      return (
      <View>
        <CardSection style={mainStyles.cardSection}>
          <View style={{ justifyContent: 'space-around', paddingTop: 10, paddingLeft: 5 }}>
            <TitleText>{ReceiptsStr}</TitleText>
            <ColourText style={mainStyles.text}>No receipts</ColourText>
            <ColourText style={mainStyles.text}>Add a receipt!</ColourText>
          </View>
          <View style={{ alignSelf: 'flex-end', paddingRight: 10 }} >
            <Icon name='ios-arrow-forward' size={50} />
          </View>
        </CardSection>
      </View>
      );
    }
    return (
      <View>
        <CardSection style={mainStyles.cardSection}>
          <View style={{ justifyContent: 'space-around', paddingTop: 10, paddingLeft: 5 }}>
            <TitleText>{ReceiptsStr}</TitleText>
            {this.renderReceiptCost()}
            <ColourText style={mainStyles.text}>{this.props.latestReceipt.vendor}</ColourText>
          </View>
          <View style={{ alignSelf: 'flex-end', paddingRight: 10 }} >
            <Icon name='ios-arrow-forward' size={50} />
          </View>
        </CardSection>
      </View>
    );
  }

  renderTripsBar() {
    if (this.props.myTrips.length < 1) {
      return (
        <View>
          <CardSection style={mainStyles.cardSection}>
            <View style={{ justifyContent: 'space-around', paddingTop: 10, paddingLeft: 5 }}>
              <TitleText>{TripsStr}</TitleText>
              <ColourText style={mainStyles.text}>No Trips found</ColourText>
              <ColourText style={mainStyles.text}>Add your first trip</ColourText>
            </View>
            <View style={{ alignSelf: 'flex-end', paddingRight: 10 }} >
              <Icon name='ios-arrow-forward' size={50} />
            </View>
          </CardSection>
        </View>
      );
    }
    return (
      <View>
      <CardSection style={mainStyles.cardSection}>
        <View style={{ justifyContent: 'space-around', paddingTop: 10, paddingLeft: 5 }}>
          <TitleText>{TripsStr}</TitleText>
          {this.renderTripCost()}
          <ColourText style={mainStyles.text}>{this.props.tDate}</ColourText>
        </View>
        <View style={{ alignSelf: 'flex-end', paddingRight: 10 }} >
          <Icon name='ios-arrow-forward' size={50} />
        </View>
      </CardSection>
      </View>
    );
  }

  renderToolsBar() {
    return (
      <View>
        <NavListSectionTools title={ToolsStr} />
      </View>
    );
  }

  renderProcessingTab() {
    return (
      <CardSection style={tabStyles.cardContainer}>
        <FormText
          style={{ alignSelf: 'center', paddingRight: 10 }}
        >
          {this.props.processingCount}
        </FormText>
        <TouchableWithoutFeedback
          style={tabStyles.tabContainer}
        >
          <FormText> {ProcessingStr} </FormText>
        </TouchableWithoutFeedback>
      </CardSection>
    );
  }

  renderReimbursableTab() {
    return (
      <CardSection style={tabStyles.cardContainer}>
        <FormText
          style={{ alignSelf: 'center', paddingRight: 10 }}
        >
          {this.props.reimbursableCount}
        </FormText>
        <TouchableWithoutFeedback
          style={tabStyles.tabContainer}
        >
          <FormText> {ReimburseStr} </FormText>
        </TouchableWithoutFeedback>
      </CardSection>
    );
  }

  renderReceiptCost() {
    const data = this.props.latestReceipt;
    let currency = data.currency;
    let returnString = '';

    //case 1: currency & total are defined
    if (currency !== undefined && data.total !== undefined) {
      //case 1.1 currency is AUD
      if (currency === 'AUD') {
        returnString = ('$').concat(data.total.toFixed(2));
        return <Text style={mainStyles.text}> {returnString} </Text>;
      }
      //case 1.2 currency NOT au$
      currency = 'AUD$';
      returnString = currency.concat(data.totalInPreferredCurrency.toFixed(2));
      return (
              <Text style={mainStyles.textItalic}>
                {returnString}
              </Text>
            );
    } else if (currency === undefined) {
      //currency = 'AUD$';
      if ((data.total === undefined) || (data.total === '')) {
        returnString = ('$0.00');
        return <Text style={mainStyles.text}> {returnString} </Text>;
      }
      returnString = ('$').concat(data.total);
      return <Text style={mainStyles.text}> {returnString} </Text>;
    }
    returnString = ('$0.00');
    return <Text style={mainStyles.text}> {returnString} </Text>;
    }

    renderTripCost() {
        const data = this.props.latestTrip;
        let currency = data.currency;
        let returnString = '';

        //case 1: currency & total are defined
        if (currency !== undefined && data.total !== undefined) {
          //case 1.1 currency is AUD
          if (currency === 'AUD') {
            returnString = ('$').concat(data.total.toFixed(2));
            return <Text style={mainStyles.text}> {returnString} </Text>;
          }
          //case 1.2 currency NOT au$
          returnString = ('$').concat(data.totalInPreferredCurrency.toFixed(2));
          return (
                  <Text style={mainStyles.textItalic}>
                    {returnString}
                  </Text>
                );
        } else if (currency === undefined) {
          //currency = 'AUD$';
          if ((data.total === undefined) || (data.total === '')) {
            returnString = ('$0.00');
            return <Text style={mainStyles.text}> {returnString} </Text>;
          }
          returnString = ('$').concat(data.total);
          return <Text style={mainStyles.text}> {returnString} </Text>;
        }
        returnString = ('$0.00');
        return <Text style={mainStyles.text}> {returnString} </Text>;
  }

  onPressFAB() {
    const options = {
      title: 'Choose Photo Source',
      storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

    ImagePicker.showImagePicker(options, (response) => {
      //console.log('this.props.curAccountID', self.props.curAccountID);
      //console.log('response', response);
      if (response.didCancel) {
        //console.log('User cancelled image picker');
      } else if (response.error) {
        Alert('Error in ImagePicker', response.error);
      } else if (response.customButton) {
        //console.log('User tapped custom button: ', response.customButton);
      } else {
        let image = '';
        if (Platform.OS === 'ios') {
          image = response.origURL;
        } else {
          image = response.path;
        }
        //console.log('image', image);
        const source = { uri: response.uri };
        //self.props.addReceiptFromImage(self.props.curAccountID, response, image, source);
        self.props.saveImageData(response, image, source);
        Actions.save();
      }
    });
  }

  processingPressed() {
    //console.log('processingPressed');
    Actions.processing();
  }

  reimburseablePressed() {
    //console.log('reimburseablePressed');
    Actions.reimbursables();
  }

  receiptsPressed() {
    //console.log('receiptsPressed', this.props.receipts);
    Actions.receipts();
  }

  tripsPressed() {
    Actions.trips();
  }

  toolsPressed() {
    //console.log('toolsPressed');
    Actions.tools();
  }

}//end class

const mainStyles = {
  cardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  text: {
    alignSelf: 'flex-start',
    paddingLeft: 0
  },
  textItalic: {
    alignSelf: 'flex-start',
    paddingLeft: 0,
    fontStyle: 'italic'
  }
};

const tabStyles = {
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderLeftWidth: 1
  },
  tabContainer: {
    borderWidth: 1,
    borderColor: PRIMARY_HIGHLIGHT_COLOUR,
    justifyContent: 'space-around',
    padding: 10
  },
};

const mapStateToProps = ({ user, accounts, receipts, trips }) => {
  const {
    userName
  } = user;
  const {
    accountsArray,
    curAccountID
  } = accounts;
  const {
    isFetching,
    processingCount,
    reimbursableCount,
    latestReceipt,
    rCategory,
    rCost,
    numOfReceipts
  } = receipts;
  const {
    latestTrip,
    tVendor,
    tDate,
    tCost,
    myTrips
  } = trips;
  return {
    userName,
    accountsArray,
    curAccountID,
    isFetching,
    processingCount,
    reimbursableCount,
    latestReceipt,
    latestTrip,
    rCategory,
    rCost,
    tVendor,
    tDate,
    tCost,
    numOfReceipts,
    myTrips
  };
};

export default connect(mapStateToProps, {
  receiptsFetch, addReceiptFromImage, saveImageData, setFetching, setCurLocation
})(MainNavigationList);
