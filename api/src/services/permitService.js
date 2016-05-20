import axios from 'axios';
import Promise from 'bluebird';
import geolib from 'geolib';
import querystring from 'querystring';

/**
 * A service factory for querying permitting API.
 * todo: eventually cache permit records with Redis and schedule
 * 	refreshing of cache on interval.
 */

export default function PermitService(options) {

  const baseUri = 'https://data.seattle.gov/resource/i5jq-ms7b.json';
  /* Available fields for query */
  const values = {
    applicationNumber: 'application_permit_number',
    permitType: 'permit_type',
    address: 'address',
    description: 'description',
    category: 'category',
    actionType: 'action_type',
    workType: 'work_type',
    applicantName: 'applicant_name',
    applicationDate: 'application_date',
    issueDate: 'issue_date',
    finalDate: 'final_date',
    expirationDate: 'expiration_date',
    status: 'status',
    contractor: 'contractor',
    masterPermit: 'master_use_permit',
    latitude: 'latitude',
    longitude: 'longitude',
    location: 'location'
  }
  function getEndpoint() {
    let q;
    try {
      q = querystring.stringify({
        '$where': 'value > 1000000'
      });
    } catch(e) {
      throw new Error(e);
    }
    const uri = `${baseUri}?${q}`;
    return uri;
  }

  function getAll() {
    return axios.get(getEndpoint())
      .then(response => {
        const permits = response.data;
        console.log('All permits:', permits.length)
        return permits;
      })
  }

  function near({longitude, latitude}) {
    return getAll().then(permits => {
      const filtered = permits.filter(permit => {
        console.log(permit.longitude, permit.latitude)
        return geolib.isPointInCircle(
          {latitude: permit.latitude, longitude: permit.longitude},
          {latitude, longitude},
          100
        )
      });
      console.log('Filtered:', filtered.length)
      return filtered;
    })
  }

  return {
    near: near,
    getAll: getAll
  }
}
