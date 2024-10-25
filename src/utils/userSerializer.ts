import { UserModelType, UserSchema } from "../interfaces/models/user";

const filterUser = (user: UserModelType) => {
    const { password: undefined, ...filteredUser } = user;
    return filteredUser;
};

module.exports = { filterUser };
