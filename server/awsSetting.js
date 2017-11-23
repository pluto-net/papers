if (Meteor.settings.private.AWS_ACCESS_KEY_ID && Meteor.settings.private.AWS_SECRET_ACCESS_KEY) {
  Meteor.startup(() => {
    process.env.AWS_ACCESS_KEY_ID = Meteor.settings.private.AWS_ACCESS_KEY_ID;
    process.env.AWS_SECRET_ACCESS_KEY = Meteor.settings.private.AWS_SECRET_ACCESS_KEY;
  });
}
