import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Image, ActivityIndicator } from 'react-native';

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
    getCoinsAPIbyMarketCap(page);
  }, [page]);

  const getCoinsAPIbyMarketCap = async (p) => {
    // try {
    //   const res = await fetch(
    //     // "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd"
    //     "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false"
    //   );  
    //   const data = await res.json();
    //   // setCoins(data['bitcoin']['usd']);
    //   console.log(data)
    // } catch (error){
    //   console.error(error)
    // }
    return fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${PER_PAGE}&page=${p}`)
      .then((response) => response.json())
      .then((myList) => {
        console.log("myList.length = " + myList.length)
        setPER_PAGE(myList.length)
        if(PER_PAGE < 25) setEnableLoad(false)

        if(myRefreshing) setCoins(myList)
        else {
          setCoins((preData) => {
            // return [...preData, ...myList]
            return preData.concat(myList)
          })
        }

        setMyRefreshing(false)
        setMyLoading(false)
        console.log("Refreshing")
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
        {/* <Text>{item.market_cap}</Text> */}
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
    else getCoinsAPIbyMarketCap(page)
  }
  const handleLoad = () => {
    if(enableLoad && !myLoading) setPage(page+1)
    setMyLoading(true)
  }
  const handlePress = (e) => {
    if(e=="Name") {
      setOrder('Name')
      // setPage(1)
      // getCoinsAPIbyMarketCapbyName(page)
    } else if(e=="Price") {
      setOrder('Price')
    } else {
      setOrder("None")
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
          { order == "Name" ? renderIcon() : <Text style={{width:7}}/> }  
          { order == "Name" ? <Text onPress={() => handlePress("Name")} style={{fontWeight: "600", paddingLeft: 7, }}>Name</Text> : <Text onPress={() => handlePress("Name")} style={styles.selector}>Name</Text> }  

          { order == "Price" ? renderIcon() : <Text style={{width:7}}/> }
          { order == "Price" ? <Text onPress={() => handlePress("Price")} style={{fontWeight: "600", paddingLeft: 7, }}>Price</Text> : <Text onPress={() => handlePress("Price")} style={styles.selector}>Price</Text> }  

          { order == "None" ? renderIcon() : <Text style={{width:7}}/> }
          { order == "None" ? <Text onPress={() => handlePress("None")} style={{fontWeight: "600", paddingLeft: 7, }}>None</Text> : <Text onPress={() => handlePress("None")} style={styles.selector}>None</Text> }  
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
        // keyExtractor = {item => item.id}
        ListEmptyComponent={renderEmpty}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 13,
    // alignItems: 'center',
    // backgroundColor: "lightblue",
    // justifyContent: 'center',
  },
  header: {
    // backgroundColor: 'green',
    // marginHorizontal: -13,
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
    paddingVertical: 10
  },
  coinImage: {
  },
  coinName: {
    fontWeight: "500",
    fontSize: 16
  },
  coinSymbol: {
    fontSize: 12
  },
  coinPrice: {
    // paddingTop:
  }
});
