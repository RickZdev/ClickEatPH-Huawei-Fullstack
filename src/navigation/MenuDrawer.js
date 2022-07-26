import React from 'react'
import { StyleSheet, View } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import HomeStack from './HomeStack'
// import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
// import CustomDrawer from '../components/CustomDrawer'
// import BottomTab from './BottomTab'
// import OrdersDrawer from '../screens/OrdersDrawer'
// import OrderHistoryDrawer from '../screens/OrderHistoryDrawer'
import COLORS from '../global/COLORS'
import Entypo from 'react-native-vector-icons/Entypo';
import CustomDrawer from '../components/CustomDrawer'
// import FONTS from '../global/FONTS'

const Drawer = createDrawerNavigator();

const MenuDrawer = () => {
  return (
    <View style={styles.container}>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false,
          drawerPosition: "left",
          drawerType: 'front',
          drawerLabelStyle: { marginLeft: -20 },
          drawerActiveBackgroundColor: COLORS.primary,
          drawerActiveTintColor: COLORS.black,
        }}
        drawerContent={props => <CustomDrawer {...props} />}
      >
        <Drawer.Screen name="HomeStack" component={HomeStack}
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({ size, color }) => <Entypo name="home" size={size} color={color} />,
          }} />
        {/* <Drawer.Screen name="OrdersDrawer" component={OrdersDrawer}
          options={{
            drawerLabel: 'Track My Orders',
            drawerIcon: ({ size, color }) => <Feather name="package" size={size} color={color} />,
          }} /> */}
        {/* <Drawer.Screen name="OrderHistoryDrawer" component={OrderHistoryDrawer}
          options={{
            drawerLabel: 'Order History',
            drawerIcon: ({ size, color }) => <MaterialCommunityIcons name="history" size={size} color={color} />,
          }} /> */}
      </Drawer.Navigator>
    </View>
  )
}

export default MenuDrawer

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0, bottom: 0, right: 0, left: 0,
    zIndex: -1,
    backgroundColor: COLORS.white,
  }
})