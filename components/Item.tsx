import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
    width: '80%',
    margin: 'auto',
    textAlign: 'center',
    fontFamily: 'arial',
  },
  name: {
    fontSize: 30,
  },
  status: {
    color: 'grey',
    fontSize: 22,
  },
})

export default function Item(props: {
  route: { params: { data: { name: string; status: string } } }
}) {
  const { name, status } = props.route.params.data
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>
    </View>
  )
}
