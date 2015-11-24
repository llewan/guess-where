(function (document) {
	var photoListBtn = document.getElementById('photoListBtn');
	photoListBtn.addEventListener('click', getProfilePictures);

	var loginBtn = document.getElementById('loginBtn');
	loginBtn.addEventListener('click', facebookSrv.init);

	var logoutBtn = document.getElementById('logoutBtn');
	logoutBtn.addEventListener('click', facebookSrv.logout);

	function getProfilePictures() {
		return facebookSrv.getProfilePictures().then(function (res) {
			var imageSection = document.getElementById('photoImageSelector');
			var element = null;
			
			for (var index = 0; index < res.length; index++) {
				element = res[index];
				var li = document.createElement("li");
				var img = document.createElement("img");
				img.className = "photo";
				img.src = element.url;
				li.appendChild(img);
				imageSection.appendChild(li);
			}
			
			console.log('profile pictures -> ' + JSON.stringify(res));
		});
	}

})(document)

