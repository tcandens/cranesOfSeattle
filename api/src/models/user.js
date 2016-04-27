import modelFactory from './base';

const userModel = modelFactory('users');

userModel.create = function(user) {
  const query = `
    INSERT INTO ${this.tableName}
    (google_id, name, email, image_url)
    VALUES (
      $/google_id/,
      $/name/,
      $/email/,
      $/image_url/
    )
    RETURNING ID
  `;
  const response = this.db.one(query, user)
    .finally(this.close());
  return response;
}

export default userModel;
