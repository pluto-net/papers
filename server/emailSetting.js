if (Meteor.settings.private.SMTP_EMAIL) {
  Meteor.startup(() => {
    process.env.MAIL_URL = Meteor.settings.private.SMTP_EMAIL;
  });
}
