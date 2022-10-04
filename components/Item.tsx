import React, { Component } from 'react'
import { Text, View } from 'react-native'

import ProductType from '../interfaces/Product'
import styles from '../styles/Item'

class Item extends Component {
  constructor(props: object) {
    super(props)
  }
  render() {
    const product: ProductType = this.props.route.params.data
    const { name, status } = product
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.status}>{status}</Text>
        </View>
      </View>
    )
  }
}

export default Item
