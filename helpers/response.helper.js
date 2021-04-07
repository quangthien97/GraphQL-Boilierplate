class HelperResponse {
  static returnNotification (id, message, success, token = null) {
    return {
      id,
      message,
      success,
      token
    }
  }
  
  static authUser (user, message, token){
    return {
      user,
      message,
      token
    }
  }
}

export default HelperResponse;

