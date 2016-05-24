import axios from 'axios';
import url from 'url';

const queries = {
  'status': 'Permit Issued',
  '$where': 'value > 1000000'
}

export function buildEndpoint() {

  const host = 'data.seattle.gov';
  const pathname = 'resource/i5jq-ms7b.json';
  const protocol = 'https';
  const href = url.format({
    protocol,
    host,
    pathname,
    query: queries
  })
  return {
    href,
    hostname: `${protocol}://${host}`,
    pathname,
    queries
  }
}


export function fetchAll() {
  const endpoint = buildEndpoint().href;
  return axios.get(endpoint)
    .then(response => {
      return response.data;
    })
}

export default {
  fetchAll
}
