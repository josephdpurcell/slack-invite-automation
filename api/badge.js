const request = require('request');
const { badge } = require('../lib/badge');
const config = require('../lib/config');

module.exports = (req, res) => {
  request.get({
    url: 'https://'+ config.slackUrl + '/api/users.list',
    qs: {
      token: config.slacktoken,
      presence: true
    }
  }, function(err, httpResponse, jsonBody) {
    try {
      body = JSON.parse(jsonBody);
    } catch(e) {
      return res.status(404).send('Unable to parse body ' + jsonBody);
    }
    if (!body.members) {
      return res.status(404).send('No members found ' + jsonBody);
    }

    const members = body.members.filter(function(m) {
      return !m.is_bot;
    });
    const total = members.length;
    const presence = members.filter(function(m) {
      return m.presence === 'active';
    }).length;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(badge(presence, total));
  });
};