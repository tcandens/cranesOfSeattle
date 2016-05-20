import axios from 'axios';
import querystring from 'querystring';

const baseUri = 'https://data.seattle.gov/resource/i5jq-ms7b.json';
const queries = {
  '$where': 'value > 1000000'
}

function buildEndpoint() {
  let q;
  try {
    q = querystring.stringify(queries);
  } catch(error) {
    throw new Error(error);
  }
  const uri = `${baseUri}?${q}`;
  return uri;
}

function fetchAll() {
  return axios.get(buildEndpoint())
    .then(response => {
      return response.data;
    })
}

export default {
  fetchAll: fetchAll
}
