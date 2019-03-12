/* eslint-disable no-undef */
/* eslint-disable arrow-body-style */
const request = require('supertest');
const server = require('../server/server');

describe('homepage', () => {
  test('Should respond to the GET method', () => {
    return request(server)
      .get('/')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should return a list of pending shifts', () => {
    return request(server)
      .get('/')
      .then((response), () => {
        expect(response.type).toBe(/json/);
      });
  });
});

describe('login', () => {
  test('Users should be able to log in', () => {
    return request(server)
      .put('/login')
      .then((response), () => {
        expect(response.statusCode).toBe(201);
      });
  });
});

describe('logout', () => {
  test('Users should be able to log out', () => {
    return request(server)
      .get('/logout')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
});

describe('search for shifts', () => {
  test('Should respond to GET method', () => {
    return request(server)
      .get('/shifts?[terms]=[values]')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should respond with a list of shifts', () => {
    return request(server)
      .get('/shifts?[terms]=[values]')
      .then((response), () => {
        expect(response.type).toBe(/json/);
      });
  });
  test('Every returned shift should have a name property', () => {
    return request(server)
      .get('/shifts?[terms]=[values]')
      .then((response), () => {
        expect(response.body.shift).toHaveProperty('name');
      });
  });
  test('Every returned shift should not have an email property', () => {
    return request(server)
      .get('/shifts?[terms]=[values]')
      .then((response), () => {
        expect(response.body.shift).not.toHaveProperty('email');
      });
  });
});

describe('shift details', () => {
  test('Should respond to the GET method', () => {
    return request(server)
      .get('/shifts/:shiftId')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should return shift details', () => {
    return request(server)
      .get('/shifts/:shiftId')
      .then((response), () => {
        expect(response.type).toBe(/json/);
        expect(response.body.shift).toHaveProperty('duration');
      });
  });
});

describe('applying for a shift', () => {
  test('Should respond to the PUT method', () => {
    return request(server)
      .put('/shifts/:shiftId/application')
      .then((response), () => {
        expect(response.statusCode).toBe(201);
      });
  });
});

describe('accepting an invitation', () => {
  test('Should respond to the PATCH request', () => {
    return request(server)
      .patch('/shifts/:shiftId/application')
      .then((response), () => {
        expect(response.statusCode).toBe(204);
      });
  });
});

describe('getting notifications', () => {
  test('Should respond to the GET request', () => {
    return request(server)
      .get('/notifications')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('User should receive requests', () => {
    return request(server)
      .get('/notifications')
      .then((response), () => {
        expect(response.type).toBe(/json/);
        expect(response.body).toBe('array');
      });
  });
});

describe('profile', () => {
  test('Should respond to GET request', () => {
    return request(server)
      .get('/profile')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should return a profile', () => {
    return request(server)
      .get('/profile')
      .then((response), () => {
        expect(response.type).toBe(/json/);
        expect(response.body).toHaveProperty('name');
        expect(response.body).toHaveProperty('phone');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('URL_photo');
      });
  });
});

describe('settings menu', () => {
  test('Should respond to PATCH request', () => {
    return request(server)
      .patch('/settings')
      .then((response), () => {
        expect(response.statusCode).toBe(204);
      });
  });
});

describe('history', () => {
  test('Should respond to GET request', () => {
    return request(server)
      .get('/history')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should return a list of past shifts', () => {
    return request(server)
      .get('/history')
      .then((response), () => {
        expect(response.type).toBe(/json/);
        expect(response.body).toBe('array');
        expect(response.body[0].name).toBe('string');
      });
  });
});

describe('ratings', () => {
  test('Should respond to PUT request', () => {
    return request(server)
      .put('/shifts/:shiftId/rating')
      .then((response), () => {
        expect(response.statusCode).toBe(201);
      });
  });
});

describe('favorite user', () => {
  test('Should respond to PUT request', () => {
    return request(server)
      .put('/favorites')
      .then((response), () => {
        expect(response.statusCode).toBe(201);
      });
  });
});

describe('unfavorite user', () => {
  test('Should respond to DELETE request', () => {
    return request(server)
      .delete('/favorites')
      .then((response), () => {
        expect(response.statusCode).toBe(201);
      });
  });
});

describe('upcoming schedule', () => {
  test('Should respond to GET request', () => {
    return request(server)
      .get('/shifts/upcoming')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should return a list of upcoming shifts', () => {
    return request(server)
      .get('/shifts/upcoming')
      .then((response), () => {
        expect(response.type).toBe(/json/);
        expect(response.body).toBe('array');
      });
  });
});

describe('search for werkers by term', () => {
  test('Should respond to a GET request', () => {
    return request(server)
      .get('/werkers/:shiftId?[terms]=[values]')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should return a list of werkers', () => {
    return request(server)
      .get('/werkers/:shiftId?[terms]=[values]')
      .then((response), () => {
        expect(response.type).toBe(/json/);
        expect(response.body).toBe('array');
        expect(response.body[0]).toHaveProperty('name_first');
        expect(response.body[0]).toHaveProperty('name_last');
        expect(response.body[0]).toHaveProperty('email');
        expect(response.body[0]).toHaveProperty('bio');
      });
  });
});

describe('search for werker details', () => {
  test('Should respond to GET request', () => {
    return request(server)
      .get('/werkers/:werkerId')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should return a werker profile', () => {
    return request(server)
      .get('/werkers/:werkerId')
      .then((response), () => {
        expect(response.type).toBe(/json/);
        expect(response.body).toBe('object');
        expect(response.body).toHaveProperty('name_first');
        expect(response.body).toHaveProperty('name_last');
        expect(response.body).toHaveProperty('email');
        expect(response.body).toHaveProperty('bio');
        expect(response.body).toHaveProperty('URL_photo');
      });
  });
});

describe('inviting werkers', () => {
  test('Should respond to PUT request', () => {
    return request(server)
      .put('/shifts/:shiftId/invite')
      .then((response), () => {
        expect(response.statusCode).toBe(201);
      });
  });
});

describe('creating shifts', () => {
  test('Should respond to GET request', () => {
    return request(server)
      .get('/shifts')
      .then((response), () => {
        expect(response.statusCode).toBe(200);
      });
  });
  test('Should create a shift', () => {
    return request(server)
      .get('/shifts')
      .then((response), () => {
        expect(response.type).toBe(/json/);
        expect(response.body).toBe('object');
        expect(response.body.name).toBe('string');
        expect(response.body.address).toBe('string');
        expect(response.body.description).toBe('string');
        expect(response.body.longitude).toBe('string');
        expect(response.body.latitude).toBe('string');
        expect(response.body.duration).toBe('number');
        expect(response.body.payment_amnt).toBe('number');
        expect(response.body.time_date).toBe('date');
      });
  });
});
/*
    test('A werker should be able to apply for a shift', () => {
      return request(server)
      .put('/shifts/:shiftId/application')
      .then((response), () => {
        expect(response.body.message).toBe('Thanks for your application!')
        expect(response.body.status).toBe()
      })
    })
*/
