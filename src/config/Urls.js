"use-strict";
//Base URL Local
//export const API_BASE_URL = 'http://192.168.102.128:8003';
//Base URL CodeBrew
//export const API_BASE_URL = 'http://45.232.252.47:8000';
// Base URL Client
//export const API_BASE_URL = 'http://52.36.194.95:8000'
// Base URL Testing
export const API_BASE_URL = "http://44.225.206.68:8000";

//Base Urls + Methods
export const API_REGISTER = API_BASE_URL + "/stylist/v1/register";
export const API_LOGIN = API_BASE_URL + "/stylist/v1/login";
export const API_LOGOUT = API_BASE_URL + "/stylist/v1/logout";
export const API_VERIFICATION = API_BASE_URL + "/stylist/v1/verification";
export const API_FORGOT_PASSWORD = API_BASE_URL + "/stylist/v1/forgotPassword";
export const API_GET_SERVICE_CATEGORY = API_BASE_URL + "/common/v1/service/category";
export const API_ADD_SERVICE = API_BASE_URL + "/stylist/v1/service";
export const API_DELETE_SERVICE = API_BASE_URL + "/stylist/v1/service";
export const API_STYLIST_SERVICE = API_BASE_URL + "/stylist/v1/service";
export const API_SETTINGS = API_BASE_URL + "/stylist/v1/settings";
export const API_GET_STYLIST_SERVICES = API_BASE_URL + "/stylist/v1/service";
export const API_MEMBERS = API_BASE_URL + "/stylist/v1/member";
export const API_STYLIST_PROFILE = API_BASE_URL + "/stylist/v1/profile";
export const API_UPLOAD_FILE = API_BASE_URL + "/common/v1/upload/file";
export const API_FOLLOW = API_BASE_URL + "/common/v1/follow";
export const API_GET_FOLLOWERS = API_BASE_URL + "/common/v1/listFollowersFollowing";
export const API_UNFOLLOW = API_BASE_URL + "/common/v1/unfollow";
export const API_POST = API_BASE_URL + "/common/v1/post";
export const API_STYLIST_LIST = API_BASE_URL + "/user/v1/stylist";
export const API_CREATE_POST = API_BASE_URL + "/common/v1/post";
export const API_POST_LIKE_UNLIKE = API_BASE_URL + "/common/v1/post/like";
export const API_POST_SAVE_UNSAVE = API_BASE_URL + "/common/v1/post/save";
export const API_REPORT_POST = API_BASE_URL + "/common/v1/post/report";
export const API_COMMON_POST = API_BASE_URL + "/common/v1/post";
export const API_USER_SEARCH = API_BASE_URL + "/common/v1/users/search";
export const API_HASHTAG_SEARCH = API_BASE_URL + "/common/v1/post/hashtag/search";
export const API_POST_DETAIL = API_BASE_URL + "/common/v1/post/detail";
export const API_COMMENT = API_BASE_URL + "/common/v1/post/comment";
export const API_USER_PROFILE = API_BASE_URL + "/stylist/v1/profile";
export const API_LIKED_POSTS_LISTING = API_BASE_URL + "/common/v1/post/like/list";
export const API_FAVORITED_POSTS_LISTING = API_BASE_URL + "/common/v1/post/save/list";
export const API_BOOKING_LISTING = API_BASE_URL + "/common/v1/booking";
export const API_UPDATE_BOOKING_STATUS = API_BASE_URL + "/stylist/v1/booking/status";
export const API_NOTIFICATIONS = API_BASE_URL + "/common/v1/notification";
export const API_RATING = API_BASE_URL + "/stylist/v1/booking/rate/user";
export const API_CUSTOMER_USER_PROFILE = API_BASE_URL + "user/v1/profile";
export const API_SOCKET_CONNECTION = API_BASE_URL + "/tracking";
export const API_CHANGE_PASSWORD = API_BASE_URL + "/stylist/v1/updateProfilePassword";
export const API_GET_SOCIAL_INFO = API_BASE_URL + "/common/v1/user/info";

// export const API_AVAILABILITY= API_BASE_URL + "/user/v1/available/stylist"
