import React from 'react';
import {Link} from 'react-router';

export default function Leaderboard({leaders}) {
  return (
    <section className="c-leaderboard">
      <h1 className="header">User leaderboard</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.points}</td>
              <td>
                <Link to={`/user/${user.id}`}>
                  <img className="avatar" src={user.image_url} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
