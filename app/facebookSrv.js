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
    }, { scope: 'public_profile,email, user_photos' });
  }

  function logout() {
    return FB.logout(function (response) {
      // Person is now logged out
    });
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
  
  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function getProfilePictures() {
    var deferred = Q.defer();
    var profile_pictures = [];
    FB.api('/me/albums', function (response) {
      
      // @todo get profileAlbumId from profile album
      var profileAlbumId = response.data[0].id;

      FB.api(profileAlbumId + '/photos', function (response) {
        for (var index = 0; index < response.data.length; index++) {
          FB.api(response.data[index].id + '/picture', function (response) {
            if (!response.data.is_silhouette) {
              response.data.isSelected = false;
              profile_pictures.push(response.data);
            }
          })
        }
        deferred.resolve(profile_pictures);
      })
    });
    return deferred.promise;
  }

  return {
    init: init,
    logout: logout,
    checkLoginState : checkLoginState,
    getProfilePictures: getProfilePictures
  }
  
})()
