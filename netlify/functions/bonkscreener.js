// netlify/functions/bonkscreener.js
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const url = 'https://launch-mint-v1.raydium.io/get/list?platformId=FfYek5vEz23cMkWsdJwG2oa6EphsvXSHrGpdALN4g6W1,BuM6KDpWiTcxvrpXywWFiw45R2RNH8WURdvqoTDV1BW4&sort=new&size=100&mintType=default&includeNsfw=false';
  const response = await fetch(url);
  const data = await response.json();

  // Optionally map/clean data here

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': '*', // Optional, for local dev
    },
  };
};