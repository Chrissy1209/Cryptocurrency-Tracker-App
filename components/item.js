import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const handleVolume = (e) => {
  if (e > 1_000_000_000_000) return `${Math.floor(e / 1_000_000_000_000)} T`
  else if (e > 1_000_000_000) return `${Math.floor(e / 1_000_000_000)} B`
  else if (e > 1_000_000) return `${Math.floor(e / 1_000_000)} M`
  else if (e > 1_000) return `${Math.floor(e / 1_000)} K`
  return e
}

const renderItem = ({ item }) => (
  <View style={styles.listContainer}>
    <View style={styles.coinImage}>
      <Image style={styles.Image} source={{ uri: item.image }} />
    </View>
    <View style={styles.coinNameCtner}>
      <Text style={styles.coinName}>{item.name}</Text>
      <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
    </View>
    <View style={styles.coinPrice}>
      <Text style={styles.fontSize}>$ {item.current_price}</Text>
    </View>
    <View style={styles.coinVolume}>
      <Text style={styles.fontSize}>$ {handleVolume(item.total_volume)}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row',
    marginVertical: 10,
    marginHorizontal: 13,
  },
  coinImage: {
    flex: 1,
    marginRight: 15,
  },
  Image: {
    width: 40,
    height: 40,
  },
  coinNameCtner: {
    flex: 4,
    justifyContent: 'center',
    marginLeft: 5,
  },
  coinName: {
    fontWeight: '600',
    fontSize: 16,
    paddingBottom: 4,
  },
  coinSymbol: {
    fontSize: 12,
  },
  coinPrice: {
    flex: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  coinVolume: {
    flex: 2,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  fontSize: {
    fontSize: 13,
  },
});

export default renderItem;
