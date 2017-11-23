Accounts.onCreateUser((options, user) => {
  // facebook only
  if (user.services && user.services.facebook) {
    const customUser = {
      ...user,
      ...{
        emails: [
          {
            address: user.services.facebook.email,
            verified: false,
          },
        ],
        username: user.services.facebook.name,
      },
      admin: false,
      profile: {
        username: user.services.facebook.name,
        profileImagePublicId: "",
      },
    };

    return customUser;
  } else {
    user.admin = false;
    user.profile = {
      username: user.username,
      profileImagePublicId: "",
    };
    return user;
  }
});
