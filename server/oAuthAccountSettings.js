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

  ServiceConfiguration.configurations.upsert(
    {
      service: "google",
    },
    {
      $set: {
        clientId: Meteor.settings.private.GOOGLE_APP_ID,
        secret: Meteor.settings.private.GOOGLE_SECRET_KEY
      },
    },
  );

  ServiceConfiguration.configurations.upsert(
    {
      service: "twitter",
    },
    {
      $set: {
        consumerKey: Meteor.settings.private.TWITTER_APP_ID,
        secret: Meteor.settings.private.TWITTER_SECRET_KEY
      },
    },
  );
});
