import { User } from "../../both/model/user";

User.extend({
  meteorMethods: {
    changeProfileImagePublicId(publicId: string) {
      this.profile.profileImagePublicId = publicId;
      return this.save();
    },
  },
});
