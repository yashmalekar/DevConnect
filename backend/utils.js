const uploadToCloudinary = async (file,uid) =>{
  try {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('userId',uid);
    const res = await fetch('http://localhost:5000/upload-profile', {
      method:'POST',
      body:formData,
    })

    const data = await res.json();
    return data.url;
  } catch (error) {
    console.log()
  }
}

const deleteProfileImage = async (uid) => {
  const res = await fetch('http://localhost:5000/delete-profile', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({'public_id':uid}),
  })
}

const handleFollow = async (targetUid, followerUid, alreadyFollowing) => {

  const res = await fetch('http://localhost:5000/follow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targetUid,
      followerUid,
      following: alreadyFollowing
    })
  });
  return res;
};

const uploadPostImage = async (files,uid) =>{
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images',file);
    })
    formData.append('userId',uid);
    const res = await fetch('http://localhost:5000/upload-post-image', {
      method:'POST',
      body:formData,
    })

    const data = await res.json();
    return data.uploads;
  } catch (error) {
    console.log(error)
  }
}

const deletePostImage = async (uid) => {
  const res = await fetch('http://localhost:5000/delete-profile', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    
    body:JSON.stringify({'public_id':`  posts/image_${uid}`}),
  })
}

const getProfileData = async (username) =>{
  const users = await fetch('http://localhost:5000/get-users').then(res=>res.json());
  const user = users.find(user=>user.username===username);
  return user;
}

export {uploadToCloudinary, deleteProfileImage, handleFollow, uploadPostImage, deletePostImage, getProfileData};