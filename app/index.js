(function (document) {
	var photoListBtn = document.getElementById('photoListBtn');
	photoListBtn.addEventListener('click', getProfilePictures);

	var loginBtn = document.getElementById('loginBtn');
	loginBtn.addEventListener('click', facebookSrv.init);

	var logoutBtn = document.getElementById('logoutBtn');
	logoutBtn.addEventListener('click', facebookSrv.logout);

	function getProfilePictures() {
		return facebookSrv.getProfilePictures().then(function (res) {
			console.log('profile pictures -> ' + JSON.stringify(res));
		});
	}

})(document)

