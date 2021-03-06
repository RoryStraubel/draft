var fs = require('fs')
var ask = require('ask')
var {Cards} = require('../data')

var URL = 'http://aeosynth.iriscouch.com/draft/_design/draft/_view/score?group=true'

ask(URL, (err, data) => {
  if (err)
    throw err

  data = JSON.parse(data)
  for (var row of data.rows) {
    var {key, value} = row
    var lc = key.toLowerCase()
    // TODO scrub the db
    if (!(lc in Cards))
      continue

    Cards[lc].score = value.sum / value.count
  }

  fs.writeFileSync('data/cards.json', JSON.stringify(Cards, null, 2))
})
