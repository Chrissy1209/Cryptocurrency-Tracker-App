import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ActionSheetIOS, Text, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import renderItem from './components/item';

export default function App() {
  const [coins, setCoins] = useState([]);
  const [order, setOrder] = useState("market_cap_desc")
  const per_page = 25
  const [page, setPage] = useState(1)

  const [myRefreshing, setMyRefreshing] = useState(false)
  const [myLoading, setMyLoading] = useState(false)
  const [enableLoad, setEnableLoad] = useState(true)
  const [toggle, setToggle] = useState(true)

  useEffect(() => {
    console.log("------------page = "+ page +"---------------")
    getCoinsAPI(false, order, page)
  }, [toggle]);

  const getCoinsAPI = async (refresh, ord, p) => {
    return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${ord}&per_page=${per_page}&page=${p}`)
      .then((response) => response.json())
      .then((myList) => {
        console.log(myList.map(item => item.symbol));
        if(myList.length < 25) setEnableLoad(false)

        if(refresh) setCoins(myList)
        else {
          setCoins((preData) => {
            // return [...preData, ...myList]
            return preData.concat(myList)
          })
        }
        setMyRefreshing(false)
        setMyLoading(false)
      })
      .catch((error) => {
        console.error(error);
      });
  };


//------------

  const renderIcon = () => (
    <MaterialIcons onPress={()=>{onPress()}} name="sort" size={24} color="black" />
  )
  const renderSort = (ord) => {
    let myName = "sort-" + ord
    return <FontAwesome5 name={myName} size={14} color="black" />
  }
  const renderFooter = () => (
    myLoading && enableLoad ?
    <View style={{marginTop: 5}}>
      <ActivityIndicator size="large"/>
    </View> : null
  )
  const renderEmpty = () => (
    <View style={{height:600, alignItems:'center', justifyContent:'center'}}>
      <Text style={{fontSize:18, fontWeight:'400', }}>Pull down to refreshing.</Text>
    </View>
  )

//------------

  const handleRefresh = () => {
    setMyRefreshing(true)
    setPage(1)
    getCoinsAPI(true, order, 1)
  }
  const handleLoad = () => {
    setMyLoading(true)
    if(enableLoad && !myLoading) {
      setToggle(!toggle)
      setPage(page+1)
    }
  }
  const handleOrder = (ord) => {
    setCoins([])
    setOrder(ord)
    setMyRefreshing(true)
    setPage(1)
    getCoinsAPI(true, ord, 1)
  }
  const handleColor = () => {
    const list = ['None', 'id_asc', 'id_desc', 'volume_desc', 'volume_asc', 'market_cap_desc', 'market_cap_asc']
    return list.indexOf(order)
  }
  const onPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "ID_A-Z", "ID_Z-A", "Volume_DESC", "Volume_ASC", "MCap_DESC", "MCap_ASC"],
        destructiveButtonIndex: handleColor(),
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
        // title: "Sort Cryptocurrencies By",
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } 
        else if (buttonIndex === 1) {
          handleOrder('id_asc')
        } 
        else if (buttonIndex === 2) {
          handleOrder('id_desc')
        } 
        else if (buttonIndex === 3) {
          handleOrder('volume_desc')
        }
        else if (buttonIndex === 4) {
          handleOrder('volume_asc')
        }
        else if (buttonIndex === 5) {
          handleOrder('market_cap_desc')
        }
        else if (buttonIndex === 6) {
          handleOrder('market_cap_asc')
        }
      }
    );
  }

//------------

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cryptocurrencies</Text>
        </View>
        <View>
          {renderIcon()}
        </View>
      </View>
      <View style={styles.sortBar}>
          <Text style={{flex: 2}}></Text>
          <Text style={{flex: 4}}>Name</Text>
          <Text style={{flex: 4, marginRight: 4}}>Price</Text>
          { 
            order != "volume_desc" ?
            order == "volume_asc" ? renderSort("up") :
            <Text style={{width:9}} /> 
            : 
            renderSort("down") 
          }
          <Text style={{flex: 2, paddingLeft: 4}}>Volume</Text>
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
        keyExtractor = {item => item.id}
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
    marginHorizontal: 13,
    flexDirection: "row", 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: 50,
  },
  title: {
    color: 'indigo', //darkslateblue, darkblue, 6495ed, indigo, darkmagenta
    fontSize: 20,
    fontWeight: '900',
    textShadowColor: "lightgray",
    textShadowOffset: {width: 4, height: 3},
    textShadowRadius: 2,
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
});
