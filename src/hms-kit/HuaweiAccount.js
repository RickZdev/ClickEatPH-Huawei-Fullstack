import axios from "axios";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { HMSAccountAuthService, HMSAuthParamConstants, HMSAuthRequestOptionConstants, HMSAuthScopeListConstants } from "@hmscore/react-native-hms-account";
import { auth, loginUser } from "../database/authentication";
import { addUser } from "../database/db";
import { ToastShortComp } from "../function/ToastFunc";
import { Alert } from "react-native";

const huaweiSilentSignIn = (setAuthenticatedUser, setIsLoading) => {
  let silentSignInData = {
    accountAuthParams: HMSAuthParamConstants.DEFAULT_AUTH_REQUEST_PARAM,
    authRequestOption: [HMSAuthRequestOptionConstants.ID_TOKEN,
    HMSAuthRequestOptionConstants.ACCESS_TOKEN,
    HMSAuthRequestOptionConstants.CARRIERID,
    HMSAuthRequestOptionConstants.MOBILENUMBER,
    HMSAuthRequestOptionConstants.UID
    ],
    authScopeList: [HMSAuthScopeListConstants.EMAIL, HMSAuthScopeListConstants.PROFILE]
  };
  HMSAccountAuthService.silentSignIn(silentSignInData)
    .then((response) => {
      response.openId !== null ? setAuthenticatedUser(true) : setAuthenticatedUser(false);
      setIsLoading(false);
    })
    .catch((err) => {
      console.log(err)
      setIsLoading(false);
    });

}

const huaweiAuth = (navigation) => {
  let signInData = {
    accountAuthParams: HMSAuthParamConstants.DEFAULT_AUTH_REQUEST_PARAM,
    authRequestOption: [
      HMSAuthRequestOptionConstants.ID_TOKEN,
      HMSAuthRequestOptionConstants.ACCESS_TOKEN,
      HMSAuthRequestOptionConstants.CARRIERID,
      HMSAuthRequestOptionConstants.MOBILENUMBER,
      HMSAuthRequestOptionConstants.UID,
      HMSAuthRequestOptionConstants.EMAIL,
    ],
    authScopeList: [HMSAuthScopeListConstants.EMAIL, HMSAuthScopeListConstants.PROFILE]
  };

  HMSAccountAuthService.signIn(signInData)
    .then((response) => {
      axios.get(`https://huaweifoodappformyapi.herokuapp.com/api/user/id/huawei/${response.openId}`)
        .then(res => {
          if (response.email === '') {
            Alert.alert("Sorry", "Please provide your email address on your huawei id before using this feature.");
            huaweiSignOut();
          } else if (response.email === null) {
            Alert.alert("Sorry", "Please allow our app to obtain your email address to use this feature.");
            huaweiSignOut();
          } else if (res.data === null) {
            let data = {
              _id: response.openId,
              firstName: response.givenName,
              lastName: response.familyName,
              phoneNumber: "",
              password: response.unionId,
              email: response?.email || "",
              createdAt: new Date().toLocaleString(),
              photoUrl: response.avatarUriString,
            }
            addAuthenticatedHuaweiUser({ data })
            navigation.navigate('MenuDrawer');
          } else {
            loginUser(response.email, response.unionId, navigation)
          }
        })
        .catch(() => ToastShortComp('Error'))
    }).catch(() => ToastShortComp('Please login to your Huawei ID!'));
}

const huaweiSignOut = () => {
  HMSAccountAuthService.signOut()
    .then((_response) => console.log("Signed Out from Huawei Authorization"))
    .catch((err) => { console.log(err) });

  HMSAccountAuthService.cancelAuthorization()
    .then((_response) => {
      console.log("Cancelled Huawei Authorization")
    })
    .catch((err) => { console.log(err) });
}

const addAuthenticatedHuaweiUser = async ({ data }) => {
  try {
    const { firstName, lastName, email, phoneNumber, photoUrl, password, createdAt, _id } = data;
    const fullName = `${firstName} ${lastName}`;
    await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(auth.currentUser, {
      displayName: fullName,
      photoURL: photoUrl
    })
    const extraInfo = {
      _id: auth.currentUser.uid,
      huaweiId: _id,
      cart: [],
      createdAt: createdAt,
      photoURL: photoUrl,
      huaweiLogin: true
    }
    addUser({ firstName, lastName, email, phoneNumber, ...extraInfo });
    ToastShortComp('Account Created Successfully!')
  } catch (err) {
    ToastShortComp(err.message)
  }
}


export {
  huaweiAuth, huaweiSilentSignIn, huaweiSignOut
}