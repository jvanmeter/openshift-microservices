var express = require('express')
var router = express.Router()
var moment = require('moment')
var request = require('request-promise')

/* Show users profile page or login/create account */
router.get('/', function(req, res, next) {
  var user = res.locals.user

  // TODO: lookup profile for my user ID
  // TODO: get my profile image

  var fakeme = {
    aboutMe: 'I know that I am intelligent, because I know that I know nothing',
    emailAddress: 'jdudash@redhat.com',
    firstName: 'Jason',
    lastName: 'Dudash'
  }

  res.render('profile', { title: "Jason's Profile", profile: fakeme, isMyProfile: true, errorWithProfile: false })
})

/* GET a user's page. */
router.get('/:userId', function(req, res, next) {
  var user = res.locals.user
  const profileGetURI = req.HTTP_PROTOCOL + req.PROFILE_SVC_HOST + ':' + req.PROFILE_SVC_PORT + '/users/' + req.params.userId 
  req.debug('GET from profile SVC at: ' + profileGetURI)
  var request_get_options = {
      method: 'GET',
      uri: profileGetURI,
      headers: {
          'user-agent': req.header('user-agent'),
          'x-request-id': req.header('x-request-id'),
          'x-b3-traceid': req.header('x-b3-traceid'),
          'x-b3-spanid': req.header('x-b3-spanid'),
          'x-b3-parentspanid': req.header('x-b3-parentspanid'),
          'x-b3-sampled': req.header('x-b3-sampled'),
          'x-b3-flags': req.header('x-b3-flags'),
          'x-ot-span-context': req.header('x-ot-span-context'),
          'b3': req.header('b3')
      },
      json: true // Automatically parses the JSON string in the response
  }
  var profileData = []
  var profileImage = []
  request(request_get_options)
  .then(function (getresult) {
      req.debug(getresult)  // uncomment to show JSON
      let title = getresult.firstName + "\'s Profile"

      // TODO: get the profile image

      res.render('profile', { title: title, profile: getresult, isMyProfile: false, errorWithProfile: false })
  })
  .catch(function (err) {
      req.debug('ERROR GETTING DATA FROM PROFILE SERVICE')
      req.debug(err)
      res.render('profile', { title: 'Unknown User', errorWithProfile: true })
  })
})

module.exports = router
