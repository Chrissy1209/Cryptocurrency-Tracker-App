import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, ActionSheetIOS, Text, View, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
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
        } 
        else if (buttonIndex === 1) 
        {
          setOrder('id_desc')
          setMyRefreshing(true)
          setPage(1)
          getCoinsAPI(true, "id_desc", 1)
        } 
        else if (buttonIndex === 2) 
        {
          setOrder("volume_desc")
          setMyRefreshing(true)
          setPage(1)
          getCoinsAPI(true, "volume_desc", 1)
        }
        else if (buttonIndex === 3)
        {
          setOrder("market_cap_desc")
          setMyRefreshing(true)
          setPage(1)
          getCoinsAPI(true, "market_cap_desc", 1)
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
        onRefresh={handleRefresh}
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
