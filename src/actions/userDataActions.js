'use-strict'
import * as type from '../actionTypes';

export const setUserData = (userData) => {
  return {
    type: type.USER_DATA,
    userData
  }
}

export const setUserLang = (appLang) => {
  return {
    type: type.USER_LANG,
    appLang
  }
}

export const currentProfileTab = (tabNumber) => {
  return {
    type: type.SELECTED_PROFILE_TAB_NUMBER,
    tabNumber,
  }
}

export const updateAvaiability = (availability) => {
  return {
    type: type.UPDATE_AVAILABILITY,
    availability,
  }
}

export const  updateWorkAsServiceProvider=(isServiceProvider)=>{
	return{
		type:type.UPDATE_IS_SERVICE_PROVIDER,
		isServiceProvider
	}
}

export const  updateServiceType=(serviceType)=>{
	return{
		type:type.UPDATE_SERVICE_TYPE,
		serviceType
	}
}

export const updateSavedServices= (savedServices)=>{

  return{
    type:type.SAVED_SERVICE_UPDATE,
    savedServices
  }
}

export const updateExpertiseList= (expertiseList)=>{

  return{
    type:type.EXPERTISE_LIST_UPDATE,
    expertiseList
  }
}

export const updateMembersList= (membersList)=>{

  return{
    type:type.MEMBERS_LIST_UPDATE,
    membersList
  }
}

export const updateProfileFollowing = profileFollowingList => {
	return {
		type: type.UPDATE_PROFILE_FOLLOWING,
		profileFollowingList
	};
};

export const updateProfileFollower = profileFollowerList => {
	return {
		type: type.UPDATE_PROFILE_FOLLOWER,
		profileFollowerList
	};
};




export const clearReduxValues = () => {
  return {
    type: type.CLEAR_REDUX_VALUES,
  }
}

export const setHomeFeedsList = homefeedsList => {
	return {
		type: type.HOME_FEEDS_LIST,
		homefeedsList
	};
};

export const updateHomeFeedsList = addHomeFeed => {
	return {
		type: type.UPDATE_HOME_FEEDS_LISTING,
		addHomeFeed
	};
};

export const savedUserAddress = savedAddresses => {
	return {
		type: type.SAVED_USER_ADDRESS,
		savedAddresses
	};
};

export const updatelikeUnlikePost = (postLikeId, postLikeVal, postLikeCount) => {
	return {
		type: type.UPDATE_LIKE_UNLIKE_POST,
		postLikeId,
		postLikeVal,
		postLikeCount
	};
};

export const updateFavoriteUnfavoritePost = (postFavoriteId, postFavoriteVal) => {
	return {
		type: type.UPDATE_FAVORITE_UNFAVORITE_POST,
		postFavoriteId,
		postFavoriteVal
	};
};

export const updateFollowUnFollowUserPost = (postFollowId, postFollowVal) => {
	return {
		type: type.UPDATE_FOLLOW_UNFOLLOW_USER_POST,
		postFollowId,
		postFollowVal
	};
};

export const updateShowHidePopUpStatus = (postId, isPopUpVisible) => {
	return {
		type: type.UPDATE_SHOW_HIDE_POPUP_STATUS,
		postId,
		isPopUpVisible
	};
};

export const updateReportedPosts = (postId, isReported) => {
	return {
		type: type.UPDATE_REPORT_POST,
		postId,
		isReported
	};
};


export const updateSearchArtist = searchArtistList => {
	return {
		type: type.UPDATE_SEARCH_ARTIST,
		searchArtistList
	};
};

export const updateSearchUser = searchUserList => {
	return {
		type: type.UPDATE_SEARCH_USER,
		searchUserList
	};
};

export const updateCommentsListingCount = (postId, commentCount) => {
	return {
		type: type.UPDATE_PARTICULAR_POST_COMMENTS_COUNT,
		postId,
		commentCount
	};
};

export const commentsListing = (commentsList) => {
	return {
		type: type.PARTICULAR_POST_COMMENTS,
		commentsList
	};
};

export const setMyPostsData = (myPostsData) => {
	return {
		type: type.SET_MY_POSTS_DATA,
		myPostsData
	};
};

export const updateMyPostsData = (myPostsData) => {
	return {
		type: type.UPDATE_MY_POSTS_DATA,
		myPostsData
	}
}

export const setMyLikedPostsData = (myLikedPostsData) => {
	return {
		type: type.SET_MY_LIKED_POSTS_DATA,
		myLikedPostsData
	};
};

export const updateMyLikedPostsData = (myLikedPostsData) => {
	return {
		type: type.UPDATE_MY_LIKED_POSTS_DATA,
		myLikedPostsData
	}
}

export const setMyFavoritedPostsData = (myFavoritedPostsData) => {
	return {
		type: type.SET_MY_FAVORITED_POSTS_DATA,
		myFavoritedPostsData
	};
};

export const updateMyFavoritedPostsData = (myFavoritedPostsData) => {
	return {
		type: type.UPDATE_MY_FAVORITED_POSTS_DATA,
		myFavoritedPostsData
	}
}