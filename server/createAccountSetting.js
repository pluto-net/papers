Accounts.onCreateUser((options, user) => {
  const defaultUser = {
    admin: false,
    profile: user.username,
    profileImagePublicId: "",
  }

  // Facebook
  if (user.services && user.services.facebook) {
    const customUser = {
      ...defaultUser,
      ...user,
      ...{ // Information from Facebook
        emails: [
          {
            address: user.services.facebook.email,
            verified: false,
          },
        ],
        username: user.services.facebook.name,
      },
    };

    return customUser;
  } else if (user.services && user.services.google) { // Google
    const customUser = {
      ...defaultUser,
      ...user,
      ...{ // Information from Google
        emails: [
          {
            address: user.services.google.email,
            verified: false,
          },
        ],
        username: user.services.google.name,
      },
    };

    return customUser;
  } else {
    const normalUser = {...defaultUser, ...user }
    return normalUser;
  }
});
