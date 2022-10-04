import React, { Component } from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import Toast from 'react-native-toast-message'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RadioGroup from 'react-native-radio-buttons-group'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    padding: 2,
  },
  newInputSection: {
    flex: 1,
    padding: 2,
  },
  newRadioSection: {
    flex: 1,
    padding: 2,
    fontSize: 10,
  },
  newButtonSection: {
    flex: 1,
    padding: 2,
  },
  listSection: {
    flex: 15,
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#000',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  searchInputSection: {
    flex: 5,
    padding: 2,
  },
  clearButtonSection: {
    flex: 1,
    padding: 2,
  },
  input: {
    padding: 5,
    backgroundColor: '#fff',
    color: '#424242',
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: 'oldlace',
    textAlign: 'center',
  },
  nothing: {
    margin: 'auto',
  },
})

type Product = {
  name: string
  status: string
}

const defaultProduct: Product = {
  name: 'Cadbury',
  status: 'Vegan',
}

class Main extends Component {
  constructor(
    props: object,
  ): {
    super(props)
  }

  async componentDidMount() {
    let storageData: string = await AsyncStorage.getItem('products_list')
    if (storageData == '[]') {
      this.setState({ allProducts: [defaultProduct] })
      AsyncStorage.setItem(
        'products_list',
        JSON.stringify(this.state.allProducts),
      )
    } else {
      this.setState({ allProducts: JSON.parse(storageData) })
    }
    this.setState({ filteredProducts: this.state.allProducts })
  }

  state = {
    searchString: '',
    filteredProducts: [],
    newProductName: '',
    newProductState: '',
    radioButtonsData: [
      {
        id: '1',
        label: 'Vegan',
        value: 'Vegan',
        onPress: () => {
          this.setProductStatus('Vegan')
        },
      },
      {
        id: '2',
        label: 'Not vegan',
        value: 'Not vegan',
        onPress: () => {
          this.setProductStatus('Not vegan')
        },
      },
    ],
  }

  detailProduct = (item) => {
    this.props.navigation.navigate('Item', { data: item })
  }

  onSearch = (searchString) => {
    this.setState({ searchString: searchString })
    let tempResult = []
    this.state.allProducts.map((product) => {
      if (product.name.toLowerCase().includes(searchString.toLowerCase()))
        tempResult.push(product)
    })
    this.setState({ filteredProducts: tempResult })
  }

  onChangeProductName = (string) => {
    this.setState({ newProductName: string.trim() })
  }

  setProductStatus = (status) => {
    this.setState({ newProductState: status })
  }

  onClickNew = () => {
    if (this.state.newProductName == '' || this.state.newProductState == '') {
      Toast.show({
        type: 'error',
        text1: 'Hey. You should fill all fields to add new product',
        position: 'bottom',
      })
      return
    }
    this.setState({
      allProducts: [
        { name: this.state.newProductName, status: this.state.newProductState },
        ...this.state.allProducts,
      ],
    })
    this.state.allProducts.unshift({
      name: this.state.newProductName,
      status: this.state.newProductState,
    })
    this.setState({ allProducts: this.state.allProducts })
    this.setState({ newProductName: '' })
    AsyncStorage.setItem(
      'products_list',
      JSON.stringify(this.state.allProducts),
    )
  }

  onPressRadioButton = (radioButtonsArray) => {
    this.setState({ radioButtonsData: radioButtonsArray })
  }

  onClickClear = () => {
    this.setState({
      searchString: '',
      filteredProducts: this.state.allProducts,
    })
  }

  render() {
    let listSection =
      this.state.filteredProducts.length == 0 ? (
        <Text style={styles.nothing}>Sorry. There is nothing.</Text>
      ) : (
        <FlatList
          data={this.state.filteredProducts}
          renderItem={(product) => (
            <Text
              style={styles.item}
              onPress={this.detailProduct.bind(this, product.item)}
            >
              {product.item.name}
            </Text>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )
    return (
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <View style={styles.searchInputSection}>
            <TextInput
              style={styles.input}
              placeholder="search by name"
              value={this.state.searchString}
              onChangeText={(searchString) => {
                this.onSearch(searchString)
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.clearButtonSection}>
            <TouchableOpacity
              onPress={() => this.onClickClear()}
              style={styles.button}
            >
              <Text>x</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.newInputSection}>
          <TextInput
            style={styles.input}
            placeholder="new product's name to add"
            value={this.state.newProductName}
            onChangeText={(name) => {
              this.onChangeProductName(name)
            }}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.newRadioSection}>
          <RadioGroup
            layout="row"
            radioButtons={this.state.radioButtonsData}
            onPress={this.onPressRadioButton}
          />
        </View>
        <View style={styles.newButtonSection}>
          <TouchableOpacity
            onPress={() => this.onClickNew()}
            style={styles.button}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.listSection}>{listSection}</View>
      </View>
    )
  }
}

export default Main
