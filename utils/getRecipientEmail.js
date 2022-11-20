const getRecipientEmail = (users, userLoggedIn) =>
  // filter the email == userLoggedIn email
  users?.filter((userToFilter) => userToFilter !== userLoggedIn?.email)[0];

export default getRecipientEmail;