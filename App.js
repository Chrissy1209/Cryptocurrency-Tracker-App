import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ActionSheetIOS, Text, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import renderItem from './components/item';

const renderEmpty = React.memo(() => (
  <View style={styles.emptyBox}>
    <Text style={styles.emptyText}>Pull down to refreshing.</Text>
  </View>
))

export default function App() {
  const perPage = 25
  const [coins, setCoins] = useState([])
  const [order, setOrder] = useState('market_cap_desc')
  const [page, setPage] = useState(1)

  const [myRefreshing, setMyRefreshing] = useState(false)
  const [myLoading, setMyLoading] = useState(false)
  const [enableLoad, setEnableLoad] = useState(true)
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    console.log(`------------page = ${page}---------------`)
    getCoinsAPI(false, order, page)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggle]);

  //------------

  const getCoinsAPI = useCallback((refresh, ord, p) => {
    const getingCoinsAPI = async () => (
      fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${ord}&per_page=${perPage}&page=${p}`)
        .then((response) => response.json())
        .then((myList) => {
          console.log(myList.map((item) => item.symbol))
          if (myList.length < 25) setEnableLoad(false)

          if (refresh) setCoins(myList)
          else {
            setCoins((preData) => preData.concat(myList)) // [...preData, ...myList]
          }
          setMyRefreshing(false)
          setMyLoading(false)
        })
        .catch((error) => console.error(error))
    )
    getingCoinsAPI()
  }, [])

  //------------

  const renderSort = useCallback((ord) => {
    const Myname = `sort-${ord}`
    return <FontAwesome5 name={Myname} size={14} color="black" />
  }, [])
  const renderFooter = useCallback(() => (
    myLoading && enableLoad ? (
      <View style={styles.footer}>
        <ActivityIndicator size="large" />
      </View>
    ) : null
  ), [myLoading, enableLoad])

  //------------

  const handleRefresh = useCallback(() => {
    setMyRefreshing(true)
    setPage(1)
    getCoinsAPI(true, order, 1)
  }, [order, getCoinsAPI])
  const handleLoad = useCallback(() => {
    setMyLoading(true)
    if (enableLoad && !myLoading) {
      setToggle(!toggle)
      setPage(page + 1)
    }
  }, [page, toggle, enableLoad, myLoading])
  const handleOrder = useCallback((ord) => {
    setCoins([])
    setOrder(ord)
    setMyRefreshing(true)
    setPage(1)
    getCoinsAPI(true, ord, 1)
  }, [getCoinsAPI])
  const handleColor = useCallback(() => {
    const list = ['None', 'id_asc', 'id_desc', 'volume_desc', 'volume_asc', 'market_cap_desc', 'market_cap_asc']
    return list.indexOf(order)
  }, [order])
  const handleOnPress = useCallback(() => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'ID_A-Z', 'ID_Z-A', 'Volume_DESC', 'Volume_ASC', 'MCap_DESC', 'MCap_ASC'],
        destructiveButtonIndex: handleColor(),
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
        title: 'Sort cryptocurrencies by',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          handleOrder('id_asc')
        } else if (buttonIndex === 2) {
          handleOrder('id_desc')
        } else if (buttonIndex === 3) {
          handleOrder('volume_desc')
        } else if (buttonIndex === 4) {
          handleOrder('volume_asc')
        } else if (buttonIndex === 5) {
          handleOrder('market_cap_desc')
        } else if (buttonIndex === 6) {
          handleOrder('market_cap_asc')
        }
      },
    )
  }, [handleColor, handleOrder])
  const handleTitleOnPress = useCallback(() => {
    if (order === 'volume_desc') handleOrder('volume_asc')
    else handleOrder('volume_desc')
  }, [order, handleOrder])

  //------------

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cryptocurrencies</Text>
        </View>
        <View>
          <MaterialIcons onPress={() => handleOnPress()} name="sort" size={24} color="gray" />
        </View>
      </View>
      <View style={styles.sortBar}>
        <Text style={styles.emptyTitle} />
        <Text style={styles.sortBar_Name}>Name</Text>
        <Text style={styles.sortBar_Price}>Price</Text>
        {
          order !== 'volume_desc'
            ? order === 'volume_asc' ? renderSort('up')
              : <FontAwesome5 name="sort-up" size={14} color="#fff" />
            : renderSort('down')
        }
        <Text
          onPress={handleTitleOnPress}
          style={styles.sortBar_Volume}
        >Volume
        </Text>
      </View>
      <FlatList
        data={coins}
        renderItem={renderItem}
        refreshing={myRefreshing}
        onRefresh={handleRefresh}
        scrollsToTop={myRefreshing}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoad}
        onEndReachedThreshold={0.1}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  title: {
    width: 220,
    height: '60%',
    color: 'indigo', // darkslateblue, darkblue, 6495ed, indigo, darkmagenta
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: 'lightgray',
    textShadowOffset: { width: 4, height: 3 },
    textShadowRadius: 2,
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: 'gray',
  },
  sortBar_Name: {
    flex: 4,
    marginRight: -6,
  },
  sortBar_Price: {
    flex: 4,
    marginRight: -10,
  },
  sortBar_Volume: {
    flex: 2,
    paddingHorizontal: 3,
  },
  emptyTitle: {
    flex: 2,
  },
  emptyBox: {
    height: 600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '400',
  },
  footer: {
    marginTop: 5,
  },
});
