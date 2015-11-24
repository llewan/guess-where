var facebookSrv = (function () {

  var accessToken = null;
  var userId = null;

  function init() {
    FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }

  function login() {
    return FB.login(function (response) {
      // handle the response
    }, { scope: 'public_profile,email,user_photos' });
  }

  function logout() {
    return FB.logout(function (response) {
      // Person is now logged out
    });
  }
  
  
  /*
  *   It search over the FB albums array and return the profile album
  *   param:   Array
  *   return: Obj
  */
  function getProfileAlbumId(albums) {
    var albumId = {};
    var found = false;
    var index = 0;
    
    while (!found && index < albums.length) {
      if (albums[index].name === 'Profile Pictures') {
        !found;
        albumId = albums[index].id;
      }
      index++;
    }
    return albumId;
  }
  
  /*
  *   It make picture url based on picture Id and accessToken
  *   param:   String, String
  *   returns: String
  */
  function makeFacebookPhotoURL(id, accessToken) {
    return 'https://graph.facebook.com/' + id + '/picture?access_token=' + accessToken;
  }  
  
  
  /*
  *   It returns a Promise with an array of pictures
  *   param:   String
  *   returns: Promise
  */
  function getPicturesFromAlbum(profileAlbumId) {
    var deferred = Q.defer();
    FB.api(profileAlbumId + '/photos', function (response) {
      deferred.resolve(response.data);
    });
    return deferred.promise;
  }
  
  
  /*
  *  It returns an array of albums of the current logged user
  *   param:   
  *   returns: Promise
  */
  function getAlbums() {
    var deferred = Q.defer();
    FB.api(userId + '/albums?access_token=' + accessToken, function (response) {
      deferred.resolve(response.data);
    });
    return deferred.promise;
  }
	
  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      accessToken = response.authResponse.accessToken;
      userId = response.authResponse.userID;
      //testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
      'into this app.';
      login();
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
      'into Facebook.';
      login();
    }
  }
  
  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }
  

  
  /*
  *  It returns a Promise with array of facebook profile picture
  *  returns: Promise
  */
  function getProfilePictures() {
    var profile_pictures = [];
    var deferred = Q.defer();
    checkLoginState()
    
    return getAlbums()
      .then(function (albums) { 
        return getPicturesFromAlbum(getProfileAlbumId(albums))
          .then(function (pictures) {
            for (var index = 0; index < pictures.length; index++) {
              var picture = pictures[index];
              profile_pictures.push({
                id:           picture.id,
                url:          makeFacebookPhotoURL(picture.id, accessToken),
                created_time: picture.created_time,
                is_selected:  false
              })
            }
            deferred.resolve(profile_pictures);
            return deferred.promise;
          })
      })
  }

  return {
    init: init,
    logout: logout,
    checkLoginState: checkLoginState,
    getProfilePictures: getProfilePictures
  }

})()
