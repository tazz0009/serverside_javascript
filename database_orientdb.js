var OrientDB = require('orientjs');

var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: '!234qwer'
});

var db = server.use('o2');

// CREATE

topic.property.create({
  title:'Nodejs',
  description:'Nodejs is ...'
}).then(function() {
  console.log('property created.');
});
