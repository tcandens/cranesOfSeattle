import axios from 'axios';
import querystring from 'querystring';

const baseUri = 'https://data.seattle.gov/resource/i5jq-ms7b.json';
const queries = {
  'status': 'Permit Issued',
  '$where': 'value > 1000000'
}

export function buildEndpoint() {
  let q;
  try {
    q = querystring.stringify(queries);
  } catch(error) {
    throw new Error(error);
  }
  const uri = `${baseUri}?${q}`;
  return uri;
}

export function fetchAll() {
  return axios.get(buildEndpoint())
    .then(response => {
      return response.data;
    })
}

export default {
  fetchAll
}
