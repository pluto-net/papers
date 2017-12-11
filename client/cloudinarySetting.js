Meteor.startup(() => {
  if (Meteor.settings.public.CLOUDINARY_API_NAME) {
    $.cloudinary.config({
      cloud_name: Meteor.settings.public.CLOUDINARY_API_NAME,
    });
  }
})
