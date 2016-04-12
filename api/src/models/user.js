import modelFactory from './base';

const userModel = modelFactory('users');

userModel.create = function(user) {
  const query = `
    INSERT INTO ${this.tablename}
    (id, name, email)
    VALUE (
      $/id/,
      $/email/,
      $/address/
    )
    RETURNING ID
  `;
  const response = this.db.one(query, user)
    .finally(this.close());
  return response;
}

export default userModel;
