import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import _ from 'lodash'

export default function App() {
  const [coins, setCoins] = useState([]);
  const [order, setOrder] = useState("Default")
  const [PER_PAGE, setPER_PAGE] = useState(25);
  const [page, setPage] = useState(1)
  const [myRefreshing, setMyRefreshing] = useState(false)
  const [myLoading, setMyLoading] = useState(false)
  const [enableLoad, setEnableLoad] = useState(true)
  useEffect(() => {
    console.log("myRefreshing = " + myRefreshing)
    console.log("------------page = "+ page +"---------------")
    // const finalPage = myRefreshing ? 1 : page;
    // setMyLoading ? getCoinsAPI(order, page) : getCoinsAPI("market_cap_desc", 1)
  }, [page]);

  const getCoinsAPI = async (ord, p) => {
    return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${ord}&per_page=${PER_PAGE}&page=${p}`)
      .then((response) => response.json())
      .then((myList) => {
        console.log("p="+p)
        console.log(myList.map(item => item.symbol));
        console.log("myList.length = " + myList.length)
        console.log("myRefreshing = " + myRefreshing)
        if(myList.length < 25) setEnableLoad(false)

        if(myRefreshing) {
          // setCoins(myList)

          // const mySet = new Set(coins)
          // console.log("mySet = " + mySet)
          // mySet.add(myList)
          // setCoins(Array.from(mySet))
          setCoins([])
          setCoins(myList)
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

  const renderItem = ({ item }) => (
    <View style={styles.listContainer}>
      <View style={styles.coinImage}>
        <Image style={{width:40, height:40}} source={{uri: item.image}}/>
      </View>
      <View style={{flex: 1, paddingLeft: 10, justifyContent: 'center'}}>
        <Text style={styles.coinName}>{item.name}</Text> 
        <Text style={styles.coinSymbol}>{item.symbol.toUpperCase()}</Text>
      </View>
      <View style={{alignItems: 'flex-end', justifyContent: 'center'}}>
        <Text style={styles.coinPrice}>US${item.current_price}</Text>
        <Text>${item.total_volume}</Text>
      </View>
    </View>
  )
  const renderIcon = () => (
      <Image style={styles.icon} source={require("./assets/icon.png")} />
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

  const handlePress = (e) => {
    if(e=="id_desc") {
      setOrder('id_desc')

      setMyRefreshing(true)// <------------
      console.log(myRefreshing)
      getCoinsAPI("id_desc", 1)
    } else if(e=="gecko_desc") {
      setOrder('gecko_desc')

      setMyRefreshing(true)// <------------
      console.log(myRefreshing)
      getCoinsAPI("gecko_desc", 1)
    } else {
      setOrder("Volume_desc")

    }

    console.log(e) 
  }

  //------------

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Cryptocurrencies</Text>
        </View>
        <View style={{flexDirection: "row", alignItems:'center'}}>
          { order == "id_desc" ? renderIcon() : <Text style={{width:7}}/> }  
          { order == "id_desc" ? <Text onPress={() => handlePress("id_desc")} style={{fontWeight: "600", paddingLeft: 7, }}>Id</Text> : <Text onPress={() => handlePress("id_desc")} style={styles.selector}>Id</Text> }  

          { order == "gecko_desc" ? renderIcon() : <Text style={{width:7}}/> }
          { order == "gecko_desc" ? <Text onPress={() => handlePress("gecko_desc")} style={{fontWeight: "600", paddingLeft: 7, }}>Gecko</Text> : <Text onPress={() => handlePress("gecko_desc")} style={styles.selector}>Gecko</Text> }  

          { order == "volume_desc" ? renderIcon() : <Text style={{width:7}}/> }
          { order == "volume_desc" ? <Text onPress={() => handlePress("volume_desc")} style={{fontWeight: "600", paddingLeft: 7, }}>Volume</Text> : <Text onPress={() => handlePress("volume_desc")} style={styles.selector}>Volume</Text> }  
        </View>
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
    // margin: 13,
    // alignItems: 'center',
    // backgroundColor: "lightblue",
    // justifyContent: 'center',
  },
  header: {
    // backgroundColor: 'green',
    marginHorizontal: 13,
    // backgroundColor: 'black',
    flexDirection: "row", 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    height: 55,
  },
  title: {
    // marginLeft: 13,
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
  listContainer: {
    // backgroundColor: "lightgray", 
    flexDirection: "row",
    marginVertical: 10,
    marginHorizontal: 13
  },
  coinImage: {
  },
  coinName: {
    fontWeight: "600",
    fontSize: 16
  },
  coinSymbol: {
    fontSize: 12
  },
  coinPrice: {
    // paddingTop:
  }
});

