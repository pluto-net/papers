import { User } from "../../both/model/user";

export interface IUpdateUserInformationParams {
  username: string;
  email: string;
}

User.extend({
  meteorMethods: {
    changeProfileImagePublicId(publicId: string) {
      this.profile.profileImagePublicId = publicId;
      return this.save();
    },

    updateUserInformation({ username, email }: IUpdateUserInformationParams) {
      if (username) {
        this.username = username;
      }
      if (email) {
        this.emails[0].address = email;
      }

      return this.save();
    },
  },
});
