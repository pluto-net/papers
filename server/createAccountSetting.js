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
      profile: {
        username: user.services.facebook.name,
        profileImagePublicId: "",
      },
    };

    return customUser;
  } else {
    return user;
  }
});
