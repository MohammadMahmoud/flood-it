import server from '../../bootstrap/server';
import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;
const app = server.init();

describe('API Request', () => {
  it('Request "/" it should return 200', async () => {
    return chai
      .request(app)
      .get('/')
      .then((res) => {
        expect(res.status).equal(200);
      });
  });

  it('Request Should Create Game', async () => {
    return chai
      .request(app)
      .get('/api/game')
      .then((res) => {
        expect(res.status).equal(200);
      });
  });
  it('Request Should Move On With One Move', async () => {
    return chai
      .request(app)
      .put('/api/game/:id')
      .then((res) => {
        expect(res.status).equal(200);
      });
  });
  
  it('Request Should Solved By Computer', async () => {
    return chai
      .request(app)
      .get('/api/game/:id/solve')
      .then((res) => {
        expect(res.status).equal(200);
      });
  });
});
