import React from "react";
import AsyncStorage from '@react-native-community/async-storage';

import {
	createAppContainer,
	createSwitchNavigator
} from "react-navigation";

import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
//import { fromLeft, fromBottom, fromRight } from "react-navigation-transitions";

import Welcome from "../src/screens/WelcomeScreen/WelcomeScreen";
 import ChooseAccountType from "../src/screens/ChooseAccountType/ChooseAccountType";
import Login from "../src/screens/LoginScreen/LoginScreen";
import ForgotPassword from "../src/screens/ForgotPasswordScreen/ForgotPasswordScreen";
import Register from "../src/screens/RegisterScreen/RegisterScreen";
import SetPassword from "../src/screens/SetPasswordScreen/SetPasswordScreen";
import ChooseYourCategoryScreenLogin from "../src/screens/ChooseYourCategoryScreen/ChooseYourCategoryScreen";
import PhoneNumberVerification from "../src/screens/PhoneNumberVerification/PhoneNumberVerification";
import Settings from "../src/screens/Settings/Settings";
import AddCategoryService from "../src/screens/AddCategoryService/AddCategoryService";
import Availability from "./screens/Availability/Availability";
import AddMember from "./screens/AddMember/AddMember";
import AddExpertise from "./screens/AddExpertise/AddExpertise";
// import Followers from "./screens/Followers/Followers";
// import Following from "./screens/Following/Following";
import EditProfile from "./screens/EditProfile/EditProfile";
import EditLocationPicker from "./components/LocationPicker";
// import FollowProfile from "./screens/FollowProfile/FollowProfile";
// import ReportPost from "../src/components/SocialModule/screens/ReportPost/ReportPost";
// import HomeSearch from "../src/components/SocialModule/screens/HomeSearch/HomeSearch";
// import SocialFollowProfile from "./components/SocialModule/screens/FollowProfile/FollowProfile";
// import PostDetail from "../src/components/SocialModule/screens/PostDetail/PostDetailScreen";
// import CommentScreen from "../src/components/SocialModule/screens/CommentScreen/CommentScreen";
// import HomeFeeds from "../src/components/SocialModule/screens/HomeFeeds/HomeFeeds";
// import ChooseYourCategoryScreen from "../src/components/SocialModule/screens/ChooseYourCategoryScreen/ChooseYourCategoryScreen";
// import SelectServices from "../src/components/SocialModule/screens/SelectServices/SelectServices";
// import CreatePost from "../src/components/SocialModule/screens/CreatePostScreen/CreatePostView";
// import LocationPicker from "../src/components/SocialModule/screens/LocationPicker";
// import SocialFollowers from "../src/components/SocialModule/screens/Followers/Followers";
// import SocialFollowing from "../src/components/SocialModule/screens/Following/Following";
// import OtherFollowProfile from "../src/components/SocialModule/screens/OtherFollowProfile/OtherFollowProfile";
// import TagUsersListing from "../src/components/SocialModule/screens/TagUsersListing/TagUsersListing";
// import ArtistListing from "../src/components/SocialModule/screens/ArtistListing/ArtistListing";
// import CommentReply from "../src/components/SocialModule/screens/CommentReply/CommentReply";
// import VideoScreen from "../src/components/SocialModule/screens/Video/VideoScreen";
// import SwiperFullScreen from "../src/components/SocialModule/screens/SwiperFullScreen/SwiperFullScreen";
import NotificationsListing from './screens/NotificationsListing/NotificationsListing'
import Rating from './screens/Rating/Rating';
import ContactUs from "./screens/ContactUs/ContactUs";
import Expertise from "./screens/Expertise/Expertise";
import BookingsNotificationsListing from './screens/NotificationsListing/NotificationsListing'
import BookingsRating from './screens/Rating/Rating'
import BookingDetails from './screens/BookingDetails/BookingDetails'
import ServiceLocation from "./screens/ServiceLocation/ServiceLocation";
import ChangePassword from "./screens/ChangePassword/ChangePassword";
import ServicesRating from './screens/Rating/Rating'

//Tabs
// import Home from "../src/screens/HomeTab/Home";
import Members from "../src/screens/MembersTab/Members";
import MyBookings from "../src/screens/MyBookingsTab/MyBookings";
import Profile from "../src/screens/MyProfileTab/Profile";
import NewBooking from './screens/NewBookings/NewBooking'

//Component
import TabComponent from "../src/components/TabComponent";



// const handleCustomTransition = ({ scenes }) => {
// 	const prevScene = scenes[scenes.length - 2];
// 	const nextScene = scenes[scenes.length - 1];

// 	// Custom transitions go there
// 	if (
// 		prevScene &&
// 		prevScene.route.routeName === "home" &&
// 		nextScene.route.routeName === "createPost"
// 	) {
// 		return fromBottom();
// 	} else if (
// 		prevScene &&
// 		prevScene.route.routeName === "createPost" &&
// 		nextScene.route.routeName === "locationPicker"
// 	) {
// 		return fromBottom();
// 	} else if (
// 		prevScene &&
// 		prevScene.route.routeName === "createPost" &&
// 		nextScene.route.routeName === "tagUsersListing"
// 	) {
// 		return fromBottom();
// 	} else if (
// 		prevScene &&
// 		prevScene.route.routeName === "createPost" &&
// 		nextScene.route.routeName === "chooseYourCategoryScreen"
// 	) {
// 		return fromBottom();
// 	} else if (
// 		prevScene &&
// 		prevScene.route.routeName === "createPost" &&
// 		nextScene.route.routeName === "selectServices"
// 	) {
// 		return fromBottom();
// 	}
// 	return fromRight();
// };

// const HomeStack = createStackNavigator(
// 	{
// 		home: {
// 			screen:({navigation})=>{
// 				console.log(navigation)
// 			return <Home navigation={navigation} />
// 			}
// 		},
// 		homeFeeds: HomeFeeds,
// 		createPost: CreatePost,
// 		locationPicker: LocationPicker,
// 		tagUsersListing: TagUsersListing,
// 		chooseYourCategoryScreen: ChooseYourCategoryScreen,
// 		selectServices: SelectServices,
// 		artistListing: ArtistListing,
// 		reportPost: ReportPost,
// 		homeSearch: HomeSearch,
// 		postDetail: PostDetail,
// 		socialFollowProfile: SocialFollowProfile,
// 		postDetail: PostDetail,
// 		commentScreen: CommentScreen,
// 		commentReply: CommentReply,
// 		videoScreen: VideoScreen,
// 		swiperFullScreen: SwiperFullScreen,
// 		notificationsListing:NotificationsListing,
// 		socialFollowers:SocialFollowers,
// 		socialFollowing:SocialFollowing,
// 		otherFollowProfile:OtherFollowProfile
// 	},
// 	{
// 		navigationOptions: {
// 			headerVisible: false
// 		},
// 		headerMode: "none",
// 		transitionConfig: nav => handleCustomTransition(nav)
// 	}
// );

const NewBookingsStack = createStackNavigator(
	{
		newBooking:NewBooking,
	},
	{
		navigationOptions: {
			headerVisible: false,
			tabBarVisible: true
		},
		headerMode: "none"
	}
);

NewBookingsStack.navigationOptions = ({ navigation }) => {
	let tabBarVisible = true;
	if (navigation.state.index > 0) {
		tabBarVisible = false;
	}

	return {
		tabBarVisible
	};
};

const ProfileStack = createStackNavigator(
	{
		profile: Profile,
		settings: Settings,
		profileChooseYourCategoryScreen: ChooseYourCategoryScreenLogin,
		profileAddCategoryService: AddCategoryService,
		availability: Availability,
		//followers: Followers,
		//following: Following,
		editProfile: EditProfile,
		//followProfile: FollowProfile,
		editLocationPicker: EditLocationPicker,
		contactUs: ContactUs,
		expertise: Expertise,
		changePassword: ChangePassword,
		serviceLocation: ServiceLocation
	},
	{
		navigationOptions: {
			headerVisible: false,
			tabBarVisible: true
		},
		headerMode: "none"
	}
);

const MembersStack = createStackNavigator(
	{
		members: Members,
		addMember: AddMember,
		addExpertise: AddExpertise,
		notificationsListingMember: NotificationsListing
	},
	{
		navigationOptions: {
			headerVisible: false,
			tabBarVisible: true
		},
		headerMode: "none"
	}
);

const MyBookingsStack = createStackNavigator(
	{
		myBookings: MyBookings,
		bookingsNotificationsListing: BookingsNotificationsListing,
		bookingDetails: BookingDetails,
		bookingsRating: BookingsRating
	},
	{
		navigationOptions: {
			headerVisible: false,
			tabBarVisible: true
		},
		headerMode: "none"
	}
);

// HomeStack.navigationOptions = ({ navigation }) => {
// 	let tabBarVisible = true;
// 	if (navigation.state.index > 0) {
// 		tabBarVisible = false;
// 	}

// 	return {
// 		tabBarVisible
// 	};
// };

ProfileStack.navigationOptions = ({ navigation }) => {
	let tabBarVisible = true;
	if (navigation.state.index > 0) {
		tabBarVisible = false;
	}

	return {
		tabBarVisible
	};
};

MembersStack.navigationOptions = ({ navigation }) => {
	let tabBarVisible = true;
	if (navigation.state.index > 0) {
		tabBarVisible = false;
	}

	return {
		tabBarVisible
	};
};

MyBookingsStack.navigationOptions = ({ navigation }) => {
	let tabBarVisible = true;
	if (navigation.state.index > 0) {
		tabBarVisible = false;
	}

	return {
		tabBarVisible
	};
};

const TabbarNavigation = createBottomTabNavigator(
	{
		//homeStack: HomeStack,
		newBookingsStack:NewBookingsStack,
		membersStack: MembersStack,
		myBookingsStack: MyBookingsStack,
		profile: ProfileStack
	},
	{
		initialRouteName: "newBookingsStack",
		tabBarComponent: props => (
			<TabComponent tabNameArray={["Home","Members", "My Bookings", "Profile"]} {...props} />
		)
	},
	{
		navigationOptions: {
			header: null
		}
	}
);

const TabbarNavigationWithoutMember = createBottomTabNavigator(
	{
		//homeStack: HomeStack,
		newBookingsStack:NewBookingsStack,
		myBookingsStack: MyBookingsStack,
		profile: ProfileStack
	},
	{
		initialRouteName: "newBookingsStack",
		tabBarComponent: props => <TabComponent tabNameArray={["Home","Bookings", "Account"]} {...props} />
	},
	{
		navigationOptions: {
			header: null
		}
	}
);

const AppNavigator = createStackNavigator(
	{
		welcome: Welcome,
		chooseAccountType: ChooseAccountType,
		login: Login,
		forgotPassword: ForgotPassword,
		register: Register,
		setPassword: SetPassword,
		phoneNumberVerification: PhoneNumberVerification,
		//homeChooseYourCategoryScreen: ChooseYourCategoryScreenLogin,
		//homeAddCategoryService: AddCategoryService
	},
	{
		initialRouteName: "welcome"
	},
	{
		navigationOptions: {
			headerVisible: false
			// headerStyle: {
			//     backgroundColor: 'transparent',
			//     position: 'absolute',
			//     top: 0,
			//     left: 0,
			//     right: 0,
			//     borderBottomWidth: 0 // removes the border on the bottom
			//   }
		},
		headerMode: "none"
	}
);

export const AppContainer = (loginStatus,userType) => {
	console.log(userType, 'the userType value is as follow');
	let initialRouteName = "tabbarNavigation";
	if (userType !== "AGENCY") {
		initialRouteName = "tabbarNavigationWithoutMember"
	}

	return createAppContainer(
		createSwitchNavigator(
			{
				signOut: AppNavigator,
				//tabBar: TabbarNavigationWithoutMember,
				tabbarNavigationWithoutMember: TabbarNavigationWithoutMember,
				tabbarNavigation: TabbarNavigation
			},
			{
				initialRouteName: loginStatus ? initialRouteName : "signOut"
			}
		)
	);

};
