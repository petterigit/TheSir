exports.getNicknameOrName = (message) => {
  if (message.member.nickname == null) {
    return message.member.user.username;
  }
  return message.member.nickname;
};
