require('dotenv').config();
require('../lib/utils/connect')();
const request = require('supertest');
const app = require('../lib/app');
const mongoose = require('mongoose');

const createActor = (name) => {
  return request(app)
    .post('/actors')
    .send({ 
      name: name,
      dob: '1958-10-20T08:00:00.000Z',
      pob: 'some place'
    })
    .then(res => res.body);
};

describe('actors', () => {
  beforeEach(done => {
    return mongoose.connection.dropDatabase(() => {
      done();
    });
  });

  it('creates a new actor', () => {
    return request(app)
      .post('/actors')
      .send({
        name: 'nick offerman',
        dob: '10/20/1958',
        pob: 'some place'
      })
      .then(res => {
        expect(res.body).toEqual({
          name: 'nick offerman',
          dob: '1958-10-20T08:00:00.000Z',
          pob: 'some place',
          _id: expect.any(String),
          __v: 0
        });
      });
  });
});

it('can list all the actors in the database', () => {
  const names = ['chris1', 'chris2', 'chris3'];
  return Promise.all(names.map(createActor))
    .then(() => {
      return request(app)
        .get('/actors');
    })
    .then(({ body }) => {
      expect(body).toHaveLength(4);
    });
});

// it('gets a tweet by id', () => {
//   return createTweet('kristin1')
//     .then(createdTweet => {
//       return request(app) 
//         .get(`/tweets/${createdTweet._id}`)
//         .then(res => {
//           expect(res.body).toEqual({
//             handle: expect.any(Object),
//             text: 'some text',
//             tag: 'code',
//             _id: expect.any(String)
//           });
//         });
//     });
// });

// it('updates a tweet with :id and returns the update', () => {
//   return createTweet('kristin1')
//     .then(createdTweet => {
//       createdTweet.text = 'new text';
//       return request(app)
//         .patch(`/tweets/${createdTweet._id}`)
//         .send(createdTweet);
//     })
//     .then(res => {
//       expect(res.body).toEqual({
//         handle: expect.any(Object),
//         text: 'new text',
//         tag: 'code',
//         _id: expect.any(String)
//       });
//     });
// });

// it('deletes a tweet with :id and returns the delete count', () => {
//   return createTweet('baller for lyfe')
//     .then((createdTweet) => {
//       const id = createdTweet._id;
//       return request(app)
//         .delete(`/tweets/${id}`)
//         .then(res => {
//           expect(res.body).toEqual({ 'deleted': 1 });
//         });
//     });
// });