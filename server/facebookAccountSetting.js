Meteor.startup(function() {
  ServiceConfiguration.configurations.upsert(
    {
      service: "facebook",
    },
    {
      $set: {
        appId: Meteor.settings.private.FACEBOOK_APP_ID,
        secret: Meteor.settings.private.FACEBOOK_SECRET_KEY,
        loginStyle: "redirect",
      },
    },
  );
});
