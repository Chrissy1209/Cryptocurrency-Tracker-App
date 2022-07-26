  import { StyleSheet, Text, View, Image } from 'react-native';

  const handleVolume = (e) => {
    if(e > 1_000_000_000_000) return `${Math.floor(e/1_000_000_000_000)} T`
    else if(e > 1_000_000_000) return `${Math.floor(e/1_000_000_000)} B`
    else if(e > 1_000_000) return `${Math.floor(e/1_000_000)} M`
    else if(e > 1_000) return `${Math.floor(e/1_000)} K`
    else return e
  }

  const renderItem = ({ item }) => (
    <View style={styles.listContainer}>
      <View style={styles.coinImage}>
        <Image style={{width:40, height:40}} source={{uri: item.image}}/>
      </View>
      <View style={{ flex:4, justifyContent: 'center', marginLeft: 5}}>
        <Text style={styles.coinName}>{item.name}</Text> 
        <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
      </View>
      <View style={{flex: 4, alignItems: 'flex-start', justifyContent: 'center'}}>
        <Text style={{fontSize: 13}}>$ {item.current_price}</Text>
      </View>
      <View style={{flex: 2, alignItems: 'flex-end', justifyContent: 'center'}}>
        <Text style={{fontSize: 13}}>$ {handleVolume(item.total_volume)}</Text>
      </View>
    </View>
  )

  const styles = StyleSheet.create({
    listContainer: {
      flexDirection: "row",
      marginVertical: 10,
      marginHorizontal: 13
    },
    coinImage: {
      flex: 1,
      marginRight: 15
    },
    coinName: {
      fontWeight: "600",
      fontSize: 16,
      paddingBottom: 4,
    },
    coinSymbol: {
      fontSize: 12
    },
  });

  export default renderItem;
