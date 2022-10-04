import React, { useState, useEffect } from 'react'
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

export default function Main(props) {
  const radioData = [
    {
      id: '1',
      label: 'Vegan',
      value: 'Vegan',
      onPress: () => {
        set_newProductStatus('Vegan')
      },
    },
    {
      id: '2',
      label: 'Not vegan',
      value: 'Not vegan',
      onPress: () => {
        set_newProductStatus('Not vegan')
      },
    },
  ]
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, set_filteredProducts] = useState([])
  const [searchString, set_searchString] = useState('')
  const [newProductName, set_newProductName] = useState('')
  const [newProductStatus, set_newProductStatus] = useState('')
  const [radioButtonsData, set_radioButtonsData] = useState(radioData)

  useEffect(() => {
    const fetchData = async () => {
      let storageData = await AsyncStorage.getItem('products_list')
      if (
        storageData == null ||
        storageData == undefined ||
        storageData == '[]'
      ) {
        setAllProducts([{ name: 'Cadbury', status: 'Vegan' }])
        AsyncStorage.setItem('products_list', JSON.stringify(allProducts))
      } else {
        setAllProducts(JSON.parse(storageData))
      }
      set_filteredProducts(allProducts)
    }
    fetchData().catch(console.error)
  }, [allProducts])

  const detailProduct = (item) => {
    props.navigation.navigate('Item', { data: item })
  }

  const onSearch = (searchString) => {
    set_searchString(searchString)
    let tempResult = []
    allProducts.map((product) => {
      if (product.name.toLowerCase().includes(searchString.toLowerCase()))
        tempResult.push(product)
    })
    set_filteredProducts(tempResult)
  }

  const onChangeProductName = (string) => {
    set_newProductName(string.trim())
  }

  const onClickNew = () => {
    if (newProductName == '' || newProductStatus == '') {
      Toast.show({
        type: 'error',
        text1: 'Hey. You should fill all fields to add new product',
        position: 'bottom',
      })
      return
    }
    setAllProducts([
      { name: newProductName, status: newProductStatus },
      ...allProducts,
    ])
    set_newProductName('')
    AsyncStorage.setItem('products_list', JSON.stringify(allProducts))
  }

  const onPressRadioButton = (radioButtonsArray) => {
    set_radioButtonsData(radioButtonsArray)
  }

  const onClickClear = () => {
    set_searchString('')
    set_filteredProducts(allProducts)
  }

  let listSection =
    filteredProducts.length == 0 ? (
      <Text style={styles.nothing}>Sorry. There is nothing.</Text>
    ) : (
      <FlatList
        data={filteredProducts}
        renderItem={(product) => (
          <Text
            style={styles.item}
            onPress={detailProduct.bind(this, product.item)}
          >
            {product.item.name}
          </Text>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    )

  return (
    <View>
      <View style={styles.container}>
        {/* <View style={styles.searchSection}>
          <View style={styles.searchInputSection}>
            <TextInput
              style={styles.input}
              placeholder="search by name"
              value={searchString}
              onChangeText={(searchString) => {
                onSearch(searchString)
              }}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.clearButtonSection}>
            <TouchableOpacity onPress={onClickClear} style={styles.button}>
              <Text>x</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.newInputSection}>
          <TextInput
            style={styles.input}
            placeholder="new product's name to add"
            value={newProductName}
            onChangeText={(name) => {
              onChangeProductName(name)
            }}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.newRadioSection}>
          <RadioGroup
            layout="row"
            radioButtons={radioButtonsData}
            onPress={onPressRadioButton}
          />
        </View>
        <View style={styles.newButtonSection}>
          <TouchableOpacity onPress={onClickNew} style={styles.button}>
            <Text>+</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.listSection}>{listSection}</View>
      </View>
    </View>
  )
}
