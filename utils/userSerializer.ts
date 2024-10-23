const filterUser = (user) => {
    const { password: undefined, ...filteredUser } = user.toObject();
    return filteredUser;
};

module.exports = { filterUser };
