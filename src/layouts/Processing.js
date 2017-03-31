import React, { Component } from 'react';
import {
  Alert,
  TextInput,
  View,
  Text,
  TouchableHighlight,
  ListView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  BackgroundView,
  FAB,
  Button,
  Banner,
  TitleText,
  ColourText
} from '../components';
import { HEADER } from '../global/margins';
import {
  PRIMARY_HIGHLIGHT_COLOUR,
  CARD_BACKGROUND_COLOUR,
  SHADOW_COLOUR,
  BORDER_COLOUR,
  BRAND_COLOUR_GREEN
 } from '../global/colours';
import { searchTextChanged, loadAReceipt } from '../actions';

class Processing extends Component {

  constructor(props) {
    super(props);
    console.log('receipts', this.props.processingReceipts);
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
  }

  shouldComponentUpdate(nextProps) {
    if (this.props !== nextProps) {
      return true;
    } else if (this.props.searchQuery !== nextProps.searchQuery) {
			return true;
		}
    return false;
  }

  render() {
    if (this.props.processingCount < 1) {
      return (
        <BackgroundView style={styles.emptyContainer}>
          <Banner style={styles.banner}>
            Processing receipts are being verified for correctness
          </Banner>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <TitleText> No Receipts </TitleText>
          </View>
        </BackgroundView>
      );
    }
    return (
      <BackgroundView style={styles.background}>
      <View style={styles.search}>
          <View style={{ flexGrow: 1, height: 35, paddingTop: 5 }}>
            <View style={styles.searchStyle}>
              <View style={styles.searchbar}>
                <Icon
                  name="search"
                  size={15}
                  color="#ddd"
                />
                <TextInput
                  style={{ flexGrow: 1, width: null, paddingLeft: 5 }}
                  placeholder='search'
                  placeholderTextColor='lightgray'
                  onChangeText={this.onSearchChange.bind(this)}
                  value={this.props.searchQuery}
                  onFocus={() => console.log('hi')}
                />
              </View>
            </View>
          </View>
          <Button
            style={styles.button}
            //onPress={this.searchText()}
          >
            Search
          </Button>
        </View>
        <Banner style={styles.banner}>
          Processing receipts are being verified for correctness
        </Banner>
        <ListView
          dataSource={this.ds.cloneWithRows(this.props.processingReceipts)}
          renderRow={(data) => this.renderRow(data)}
        />
      </BackgroundView>
    );
  }

  renderRow(rowdata) {
    console.log('data', rowdata);
    return (
        <TouchableHighlight
          onPress={() => this.goToProcessingDetail(rowdata)}
          underlayColor={'#AAA'}
          style={styles.rowFront}
        >
          <View>
            <View style={{ justifyContent: 'space-between' }} >
              <TitleText style={{ color: BRAND_COLOUR_GREEN }}> Processing </TitleText>
              <Text> {this.renderDataDate(rowdata)} </Text>
              <Text> {this.renderDataCategories(rowdata)} </Text>
            </View>
          </View>
        </TouchableHighlight>
    );
  }

  renderDataDate(data) {
    let date = '';
    if (data.issued === undefined) {
      const formattedDate = new Date(data.uploaded).toString();
      let year = formattedDate.substring(11, 15);
      year = ', '.concat(year);
      date = formattedDate.substring(4, 10).concat(year);
    } else {
      const formattedDate = new Date(data.issued).toString();
      let year = formattedDate.substring(11, 15);
      year = ', '.concat(year);
      date = formattedDate.substring(4, 10).concat(year);
    }
    return date;
  }

  renderDataCategories(data) {
    let categories = '';
    if (data.categories === undefined || data.categories.length < 1) {
      return 'No categories';
    }
    categories = data.categories[0];
    for (let k = 1; k < data.categories.length; k++) {
        categories += ', '.concat(data.categories[k]);
    }
    console.log(categories);
    return categories;
  }

  renderDataVendor(name) {
    if (name === undefined) {
      return 'No Title';
    }
    return name;
  }

  renderDataTotal(cost) {
    if (cost === undefined) {
      return '$ unknown';
    }
    const currency = '$'.concat(cost.toFixed(2));
    return currency;
  }

  onSearchChange(text) {
    this.props.searchTextChanged(text);
  }

  goToProcessingDetail(data) {
    console.log('processData', data);
    const formattedDate = new Date(data.uploaded).toString();
    let year = formattedDate.substring(11, 15);
    year = ', '.concat(year);
    const date = formattedDate.substring(4, 10).concat(year);
    let categories = '';
    if (data.categories === undefined || data.categories.length < 1) {
      categories = 'No categories';
    } else {
      categories = data.categories[0];
      for (let k = 1; k < data.categories.length; k++) {
          categories += ', '.concat(data.categories[k]);
      }
    }
    let type = '';
    if (data.paymentType === undefined) {
      type = 'No payment type';
    } else {
      type = data.paymentType;
    }
    let myNotes = '';
    if (data.notes === undefined) {
      myNotes = 'No notes to show';
    } else {
      myNotes = data.notes;
    }
    const receiptObj = {
      id: data.id,
      vendor: 'Processing',
      date,
      paymentType: type,
      notes: myNotes,
      categories,
      imgURL: data.attachment.url
    };
    console.log('data.notes', data.notes);
    console.log('processingDetail', receiptObj);
    this.props.loadAReceipt(receiptObj);
    Actions.processingDetail();
  }

  onPressFAB() {
    console.log('FAB pressed');
    Alert.alert(
      'Choose Photo Source',
      null,
      [
        { text: 'Camera', onPress: () => Actions.camera() },
        { text: 'Photo Library', onPress: () => Actions.photos() },
        { text: 'Cancel', onPress: () => console.log('cancel'), style: 'cancel' }
      ]
    );
  }
}

const styles = {
  background: {
    padding: 0,
    justifyContent: 'center',
    paddingTop: HEADER.height,
    flex: 1
  },
  view: {
    flexDirection: 'row',
    padding: 10,
    height: 60,
    backgroundColor: PRIMARY_HIGHLIGHT_COLOUR
  },
  button: {
    marginTop: 0,
    height: 30,
    flexGrow: 0.3
  },
  banner: {
    height: 40,
    backgroundColor: 'green',
    margin: 0,
  },
  emptyContainer: {
    flex: 1,
    padding: 0,
    paddingTop: HEADER.height,
    justifyContent: 'center'
  },
  searchStyle: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: CARD_BACKGROUND_COLOUR,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    marginLeft: 5,
    marginRight: 5,
    shadowColor: SHADOW_COLOUR,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  search: {
    flexDirection: 'row',
    padding: 10,
    height: 60,
    backgroundColor: PRIMARY_HIGHLIGHT_COLOUR
  },
  searchbar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 5
  },
  container: {
    padding: 0,
    paddingTop: HEADER.height
  },
  rowFront: {
    //alignItems: 'center',
    padding: 10,
    backgroundColor: CARD_BACKGROUND_COLOUR,
    borderBottomColor: BORDER_COLOUR,
    borderBottomWidth: 1,
    justifyContent: 'center',
    //height: 100,
  }
};

const mapStateToProps = ({ receipts, searchIt }) => {
  const {
    searchQuery
  } = searchIt;
  const {
    processingCount,
    processingReceipts,
    receiptList
  } = receipts;
  return {
    searchQuery,
    processingCount,
    processingReceipts,
    receiptList
  };
};


export default connect(mapStateToProps, {
 searchTextChanged, loadAReceipt
})(Processing);
