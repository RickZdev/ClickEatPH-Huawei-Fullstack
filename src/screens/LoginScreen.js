import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Formik } from 'formik';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { CustomPasswordInput, CustomTextInput } from '../components/CustomInput'
import COLORS from '../global/COLORS';
import { loginUser } from '../database/authentication';
import { huaweiAuth } from '../hms-kit/HuaweiAccount'
import HMSAccount, { HMSAuthButton } from '@hmscore/react-native-hms-account'

const LoginScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AntDesign name="arrowleft" size={32} color="white" style={{ marginTop: 15 }} onPress={() => navigation.goBack()} />
      <View style={styles.contentContainer}>
        <View style={{ marginTop: 30, paddingLeft: 20, }}>
          <Text style={{ fontSize: 25, fontWeight: 'bold', color: COLORS.black }}>Let's get something</Text>
          <Text style={{ fontSize: 16, color: COLORS.black }}>Good  to see you back!</Text>
        </View>
        <LoginForm navigation={navigation} />
      </View>
    </ScrollView>
  )
}

const LoginForm = ({ navigation }) => {
  const [isRemember, setIsRemember] = useState(false);
  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      onSubmit={(values) => {
        loginUser(values.email, values.password, navigation);
      }}
    >
      {(formikProps) => (
        <View style={styles.formContainer}>
          <CustomTextInput placeholder={'Email Adress'} icon={"envelope"} value={formikProps.values.email} keyboardType={'email-address'} onchangeValue={formikProps.handleChange('email')} />
          <CustomPasswordInput placeholder={'Password'} icon={"lock"} value={formikProps.values.password} keyboardType={'default'} onchangeValue={formikProps.handleChange('password')} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 22, paddingRight: 10, marginTop: 10, marginBottom: 15 }}>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: COLORS.black }}>Remember me </Text>
            <Switch value={isRemember} onValueChange={() => setIsRemember(!isRemember)} />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity style={styles.button} onPress={formikProps.handleSubmit}>
              <Text style={{ fontSize: 22, fontWeight: 'bold', color: COLORS.white }}>SIGN IN</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: COLORS.black, }}>or</Text>
          </View>
          <HMSAuthButton
            style={{ paddingVertical: 23, marginHorizontal: 35, marginVertical: 20 }}
            colorPolicy={HMSAccount.HUAWEI_ID_AUTH_BUTTON_COLOR_POLICY_RED}
            enabled={true}
            theme={HMSAccount.HUAWEI_ID_AUTH_BUTTON_THEME_FULL_TITLE}
            cornerRadius={HMSAccount.HUAWEI_ID_AUTH_BUTTON_CORNER_RADIUS_LARGE}
            onPress={() => huaweiAuth(navigation)}
          />
          <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginBottom: 20, }} onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={{ fontWeight: 'bold', color: COLORS.black }}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>

        </View>
      )}
    </Formik>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  contentContainer: {
    backgroundColor: COLORS.white,
    elevation: 15,
    borderTopStartRadius: 50,
    borderTopEndRadius: 50,
    marginTop: 30,
    paddingBottom: 150
  },
  formContainer: {
    marginTop: 40,
    marginBottom: 20,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 60,
    marginBottom: 15,
    borderRadius: 20,
  }
})