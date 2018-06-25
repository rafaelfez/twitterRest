const app = require('../../index');

const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);

const User = mongoose.model('User');

describe('Authentication', () => {
  beforeEach(async () => {
    await User.remove();
  });

  describe('Sign in', () => {
    it('it should be able to authenticate with valid credentials', async () => {
      const user = await User.create({
        name: 'Rafa',
        username: 'rfs',
        email: 'rfs@gmail.com',
        password: '123456',
      });

      const response = await chai.request(app)
        .post('/api/signin')
        .send({ email: user.email, password: '123456' });

      expect(response.body).to.have.property('user');
      expect(response.body).to.have.property('token');
    });

    it('it should not be able to signin with nonexistent user', async () => {
      const response = await chai.request(app)
        .post('/api/signin')
        .send({ email: 'a@b.com', password: '123456' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
    });

    it('no authenticate with different password', async () => {
      const user = await User.create({
        name: 'Rafa',
        username: 'rfs',
        email: 'rfs@gmail.com',
        password: '123456',
      });

      const response = await chai.request(app)
        .post('/api/signin')
        .send({ email: user.email, password: '123' });

      expect(response).to.have.status(400);
      expect(response.body).to.have.property('error');
    });
  });
});
