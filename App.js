import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ActionSheetIOS, Text, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import _ from 'lodash'
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import renderItem from './components/item';

export default function App() {
  const [coins, setCoins] = useState([]);
  const [order, setOrder] = useState("Default")
  const per_page = 25
  const [page, setPage] = useState(1)
  const [myRefreshing, setMyRefreshing] = useState(false)
  const [myLoading, setMyLoading] = useState(false)
  const [enableLoad, setEnableLoad] = useState(true)
  useEffect(() => {
    // console.log("myRefreshing = " + myRefreshing)
    // console.log("myLoading = " + myLoading)
    console.log("------------page = "+ page +"---------------")
    // const finalPage = myRefreshing ? 1 : page;
    setMyLoading ? getCoinsAPI(order, page) : getCoinsAPI("market_cap_desc", 1)
  }, [page]);

  const getCoinsAPI = async (ord, p) => {
    return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${ord}&per_page=${per_page}&page=${p}`)
      .then((response) => response.json())
      .then((myList) => {
        console.log(myList.map(item => item.symbol));
        console.log("getCoinsAPI's myRefreshing = " + myRefreshing)
        console.log("getCoinsAPI's myLoading = " + myLoading)
        if(myList.length < 25) setEnableLoad(false)

        if(myRefreshing) {
          // setCoins(myList)

          // const mySet = new Set(coins)
          // console.log("mySet = " + mySet)
          // mySet.add(myList)
          // setCoins(Array.from(mySet))

          console.log("empty the list!!!")
          setCoins([])

          // setCoins(myList)
          // setCoins(() => {
          //   let test = _.uniq(myList)
          //   return test
          // })

          // let test = coins
          // test = _.uniq(myList)
          // setCoins(test)

        } else {
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
  const renderSort = () => (
    <FontAwesome5 name="sort-down" size={14} color="black" />
  )
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

  const handleRefreah = () => {
    setMyRefreshing(true)
    if(page!=1) setPage(1)
    else getCoinsAPI(order, 1)
  }
  const handleLoad = () => {
    setMyLoading(true)
    if(enableLoad && !myLoading) setPage(page+1)
  }
  const onPress = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Cancel", "ID", "Volume", "Market Cap"],
        destructiveButtonIndex: 3,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
        // title: "Sort Cryptocurrencies By",
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setOrder('id_desc')

          setMyRefreshing(true)// <------------
          console.log(myRefreshing)
          getCoinsAPI("id_desc", 1)

        } else if (buttonIndex === 2) {
          setOrder("volume_desc")

          setMyRefreshing(true)// <------------
          console.log(myRefreshing)
          getCoinsAPI("volume_desc", 1)
    
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
          {/* { order == "id_desc" ? renderIcon() : <Text style={{width:7}}/> }  
          { order == "id_desc" ? <Text onPress={() => handlePress("id_desc")} style={{fontWeight: "600", paddingLeft: 7, }}>Id</Text> : <Text onPress={() => handlePress("id_desc")} style={styles.selector}>Id</Text> }  

          { order == "gecko_desc" ? renderIcon() : <Text style={{width:7}}/> }
          { order == "gecko_desc" ? <Text onPress={() => handlePress("gecko_desc")} style={{fontWeight: "600", paddingLeft: 7, }}>Gecko</Text> : <Text onPress={() => handlePress("gecko_desc")} style={styles.selector}>Gecko</Text> }  

          { order == "volume_desc" ? renderIcon() : <Text style={{width:7}}/> }
          { order == "volume_desc" ? <Text onPress={() => handlePress("volume_desc")} style={{fontWeight: "600", paddingLeft: 7, }}>Volume</Text> : <Text onPress={() => handlePress("volume_desc")} style={styles.selector}>Volume</Text> }   */}
        </View>
      </View>
      <View style={styles.sortBar}>
          <Text style={{flex: 2, }}></Text>
          <Text style={{flex: 4, }}>Name</Text>
          <Text style={{flex: 4, marginRight:8 }}>Price</Text>
          {/* { order == "volume_desc" ? renderSort() : <Text style={{width:7}}/> } */}
          <Text style={{flex: 2, }}>Volume</Text>
      </View>
      <FlatList
        data={coins}
        renderItem={renderItem}
        refreshing={myRefreshing}
        onRefresh={handleRefreah}
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
    // alignItems: 'center',
    // backgroundColor: "lightblue",
    // justifyContent: 'center',
  },
  header: {
    marginHorizontal: 13,
    // backgroundColor: 'black',
    flexDirection: "row", 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: 50,
  },
  title: {
    color: 'indigo', //darkslateblue, darkblue, 6495ed, indigo, darkmagenta
    fontSize: 20,
    fontWeight: '900',
    // textShadowColor: "lightgray",
    // textShadowOffset: {width: 4, height: 3},
    // textShadowRadius: 2,
  },
  icon: {
    height: 12, 
    width: 7, //keep all same
    marginLeft: 4,
    marginRight: -4,
    // paddingLeft: 20
  },
  selector: {
    color: 'dimgray',
    fontWeight: "600",
    paddingLeft: 7, //keep all same
  },
  sortBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // borderTopWidth: 1,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
});
