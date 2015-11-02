var facebookSrv = (function() {
	
	var accessToken = null;
	var userId = null;
  	
	function init() {
		FB.getLoginStatus(function(response) {
    	statusChangeCallback(response);
  	});	
	}	  
	  
	function getAlbums() {
    var deferred = Q.defer();
		var url = 'https://graph.facebook.com/' + userId + '/albums?access_token=' + accessToken;
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() { 
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        deferred.resolve(JSON.parse(xmlHttp.responseText));
		}
		xmlHttp.open("GET", url, true); // true for asynchronous 
		xmlHttp.send(null);
    return deferred.promise;		
	}

	function login() {
		return FB.login(function(response) {
			// handle the response
		}, {scope: 'public_profile,email, user_photos'});
	}	
	
	function logout() {
		return FB.logout(function(response) {
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
      testAPI();
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into Facebook.';
    }
  }
  
  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  
  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response);
	  
      document.getElementById("profile_picture").setAttribute("src", "http://graph.facebook.com/" + response.id + "/picture?type=large");
	  //document.getElementById("profile_picture").setAttribute("src", response.picture.data.url);
    });
  }
  
  return {
    init: init,
    getAlbums: getAlbums
    
  }
})()