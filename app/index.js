(function(document){
	var photoListBtn = document.getElementById('photoListBtn');
	photoListBtn.addEventListener('click', getAl);
	facebookSrv.init();
	
	function getProfilePicturesAlbum(albums) {
		var profileObj = {};
		var album;
		for (var i = 0; i < albums.length; i++) {
			album = albums[i];
			if (album.name === 'Profile Pictures') {
				profileObj = album;
			}
		}	
		return profileObj
	}
	function getAl() {
		return facebookSrv.getAlbums().then(function(res) {
			var a = getProfilePicturesAlbum(res.data);
			console.log(a);
		});	
	}
  	
})(document)