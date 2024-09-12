const toggleFollowUser = async (coeusUser, userId, followString) => {
  let result;
  const url = new URL(
    `http://localhost:1234/api/v1/users/${followString}/${userId}`
  );
  await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      authorisation: `Bearer ${localStorage.userToken}`,
    },
  })
    .then((response) => {      
      if (response.status !== 200) {
        throw new Error("No users found");
      }
      return response.json();
    })
    .then((data) => {
      result = { ...coeusUser };
      result.follows = data.user.follows;
    })
    .catch((err) => {
      result = err
    });
        
  return result;
};

export default toggleFollowUser;
