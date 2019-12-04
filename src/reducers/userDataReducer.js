import * as type from "../actionTypes";

const initialState = {
	userData: {},
	appLang: "en",
	flexDirection: "row",
	textAlign: "left",
	tabNumber: 1,
	savedServices: [],
	expertiseList: [],
	membersList: [],
	profileFollowingList: [],
	profileFollowerList: [],
	homefeedsList: [],
	addHomeFeed: [],
	savedAddresses: [],
	searchArtistList: [],
	searchUserList: [],
	commentsList: [],
	myPostsData: [],
	myLikedPostsData: [],
	myFavoritedPostsData: []
};

const userDataReducer = (state = initialState, action) => {
	switch (action.type) {
		case type.USER_DATA:
			return {
				...state,
				userData: action.userData
			};
		case type.USER_LANG:
			return {
				...state,
				appLang: action.appLang,
				flexDirection: action.appLang != "ar" ? "row" : "row-reverse",
				textAlign: action.appLang != "ar" ? "left" : "right"
			};
		case type.SELECTED_PROFILE_TAB_NUMBER:
			return {
				...state,
				tabNumber: action.tabNumber
			};
		case type.UPDATE_AVAILABILITY:
			const userData = { ...state.userData };
			userData.availabilitySlots = action.availability;
			console.log(userData, "hte use data value");
			return {
				...state,
				userData
			};

		case type.UPDATE_IS_SERVICE_PROVIDER:{
			const userDataUpdate = { ...state.userData };
			userDataUpdate.isServiceProvider = action.isServiceProvider;
			console.log(userData, "hte use data value");
			return {
				...state,
				userData: userDataUpdate
			};
		}
		case type.UPDATE_SERVICE_TYPE:{
			const userDataUpdate = { ...state.userData };
			userDataUpdate.serviceType = action.serviceType;
			console.log(userDataUpdate, "hte use data value");
			return {
				...state,
				userData: userDataUpdate
			};
		}
		case type.SAVED_SERVICE_UPDATE:
			return {
				...state,
				savedServices: action.savedServices
			};

		case type.EXPERTISE_LIST_UPDATE:
			return {
				...state,
				expertiseList: action.expertiseList
			};
		case type.MEMBERS_LIST_UPDATE:
			return {
				...state,
				membersList: action.membersList
			};

		case type.UPDATE_PROFILE_FOLLOWING:
			return {
				...state,
				profileFollowingList: action.profileFollowingList
			};
		case type.UPDATE_PROFILE_FOLLOWER:
			return {
				...state,
				profileFollowerList: action.profileFollowerList
			};
		case type.CLEAR_REDUX_VALUES:
			return {
				userData: {},
				appLang: "en",
				flexDirection: "row",
				textAlign: "left",
				tabNumber: 1,
				savedServices: [],
				expertiseList: [],
				membersList: [],
				profileFollowingList: [],
				profileFollowerList: [],
				homefeedsList: [],
				addHomeFeed: [],
				commentsList: [],
				myPostsData: [],
				myLikedPostsData: [],
				myFavoritedPostsData: []
			};
		case type.HOME_FEEDS_LIST:
			return {
				...state,
				homefeedsList: action.homefeedsList
			};
		case type.UPDATE_HOME_FEEDS_LISTING:
			return {
				...state,
				homefeedsList:
					action.addHomeFeed != null
						? [...state.homefeedsList, action.addHomeFeed]
						: state.homefeedsList
			};
		case type.PARTICULAR_POST_COMMENTS:
			return {
				...state,
				commentsList: action.commentsList
			};
		case type.UPDATE_PARTICULAR_POST_COMMENTS_COUNT:
			return {
				...state,
				homefeedsList: state.homefeedsList.length
					? state.homefeedsList.map(homefeedsList =>
							homefeedsList._id === action.postId
								? { ...homefeedsList, commentCount: action.commentCount }
								: homefeedsList
					  )
					: state.homefeedsList
			};
		case type.SAVED_USER_ADDRESS:
			return {
				...state,
				savedAddresses: action.savedAddresses
			};
		case type.CLEAR_REDUX_VALUES:
			return {
				...state,
				userData: [],
				tabNumber: 1,
				homefeedsList: [],
				addHomeFeed: [],
				commentsList: [],
				myPostsData: []
			};
		case type.UPDATE_LIKE_UNLIKE_POST:
			return {
				...state,
				homefeedsList: state.homefeedsList.length
					? state.homefeedsList.map(homefeedsList =>
							homefeedsList._id === action.postLikeId
								? { ...homefeedsList, isLiked: action.postLikeVal, likeCount: action.postLikeCount }
								: homefeedsList
					  )
					: state.homefeedsList
			};
		case type.UPDATE_FAVORITE_UNFAVORITE_POST:
			return {
				...state,
				homefeedsList: state.homefeedsList.length
					? state.homefeedsList.map(homefeedsList =>
							homefeedsList._id === action.postFavoriteId
								? { ...homefeedsList, isSaved: action.postFavoriteVal }
								: homefeedsList
					  )
					: state.homefeedsList
			};
		case type.UPDATE_FOLLOW_UNFOLLOW_USER_POST:
			return {
				...state,
				homefeedsList: state.homefeedsList.length
					? state.homefeedsList.map(homefeedsList =>
							homefeedsList.postBy._id === action.postFollowId
								? { ...homefeedsList, isFollow: action.postFollowVal }
								: homefeedsList
					  )
					: state.homefeedsList
			};
		case type.UPDATE_REPORT_POST:
			return {
				...state,
				homefeedsList: state.homefeedsList.length
					? state.homefeedsList.map(homefeedsList =>
							homefeedsList._id === action.postId
								? { ...homefeedsList, isReported: action.isReported }
								: homefeedsList
					  )
					: state.homefeedsList
			};
		case type.UPDATE_SHOW_HIDE_POPUP_STATUS:
			return {
				...state,
				homefeedsList: state.homefeedsList.length
					? state.homefeedsList.map(homefeedsList =>
							homefeedsList._id === action.postId
								? { ...homefeedsList, select: action.isPopUpVisible }
								: homefeedsList
					  )
					: state.homefeedsList
			};
		case type.UPDATE_SEARCH_USER:
			return {
				...state,
				searchUserList: action.searchUserList
			};
		case type.UPDATE_SEARCH_ARTIST:
			return {
				...state,
				searchArtistList: action.searchArtistList
			};
		case type.SET_MY_POSTS_DATA:
			return {
				...state,
				myPostsData: action.myPostsData
			};
		case type.UPDATE_MY_POSTS_DATA:
			return {
				...state,
				myPostsData:
					action.myPostsData != null
						? [...state.myPostsData, action.myPostsData]
						: state.myPostsData
			};
		case type.SET_MY_LIKED_POSTS_DATA:
			return {
				...state,
				myLikedPostsData: action.myLikedPostsData
			};
		case type.UPDATE_MY_LIKED_POSTS_DATA:
			return {
				...state,
				myLikedPostsData:
					action.myLikedPostsData != null
						? [...state.myLikedPostsData, action.myLikedPostsData]
						: state.myLikedPostsData
			};
		case type.SET_MY_FAVORITED_POSTS_DATA:
			return {
				...state,
				myFavoritedPostsData: action.myFavoritedPostsData
			};
		case type.UPDATE_MY_FAVORITED_POSTS_DATA:
			return {
				...state,
				myFavoritedPostsData:
					action.myFavoritedPostsData != null
						? [...state.myFavoritedPostsData, action.myFavoritedPostsData]
						: state.myFavoritedPostsData
			};
		default:
			return state;
	}
};
export default userDataReducer;
