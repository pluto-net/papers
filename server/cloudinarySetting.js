if (
  Meteor.settings.private &&
  Meteor.settings.private.CLOUDINARY_API_NAME &&
  Meteor.settings.private.CLOUDINARY_API_KEY &&
  Meteor.settings.private.CLOUDINARY_API_SECRET
) {
  Cloudinary.config({
    cloud_name: Meteor.settings.private.CLOUDINARY_API_NAME,
    api_key: Meteor.settings.private.CLOUDINARY_API_KEY,
    api_secret: Meteor.settings.private.CLOUDINARY_API_SECRET,
  });
}
