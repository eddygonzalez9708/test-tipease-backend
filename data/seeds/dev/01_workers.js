exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('workers')
    .truncate()
    .then(function() {
      // Inserts seed entries
      return knex('workers').insert([
        {
          photo: '',
          username: 'jesse',
          password: 'pass1',
          accountType: 'worker',
          fname: 'Jesse',
          lname: 'Anderson',
          jobTitle: 'back end dev',
          tagline: '',
          totalTips: 0
        },
        {
          photo: '',
          username: 'brett',
          password: 'pass2',
          accountType: 'worker',
          fname: 'Brett',
          lname: 'Madrid',
          jobTitle: 'front end dev',
          tagline: '',
          totalTips: 50
        },
        {
          photo: '',
          username: 'brandon',
          password: 'pass3',
          accountType: 'worker',
          fname: 'Brandon',
          lname: 'Desselle',
          jobTitle: 'UI dev',
          tagline: '',
          totalTips: 120
        }
      ]);
    });
};
