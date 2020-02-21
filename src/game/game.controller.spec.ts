import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';

let game;

describe('Test scenarios', () => {
  let server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    await app.init();
  });

  it(`should return initial game data`, () => {
    return request(server).post('/game/new-game').expect(201).expect(({ body }) => { game = body; });
  });

  it(`should updated battleship placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[0].shipId, x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Cruiser-1 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[1].shipId, x: 1, y: 3, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Cruiser-2 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[2].shipId, x: 1, y: 5, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Destroyer-1 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[3].shipId, x: 1, y: 7, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Destroyer-2 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[4].shipId, x: 1, y: 9, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Destroyer-3 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[5].shipId, x: 6, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Submarine-1 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[6].shipId, x: 6, y: 3, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Submarine-2 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[7].shipId, x: 6, y: 5, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Submarine-3 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[8].shipId, x: 6, y: 7, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Submarine-4 placement data`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[9].shipId, x: 6, y: 9, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated confirm ship placement`, () => {
    const data = { gameId: game.gameId };
    return request(server).put('/game/confirm-ship-placement').send(data).expect(200);
  });

  it(`should updated attack-1`, () => {
    const data = { gameId: game.gameId, x: 1, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-2`, () => {
    const data = { gameId: game.gameId, x: 2, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-3`, () => {
    const data = { gameId: game.gameId, x: 3, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-4`, () => {
    const data = { gameId: game.gameId, x: 4, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-5`, () => {
    const data = { gameId: game.gameId, x: 1, y: 3, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-6`, () => {
    const data = { gameId: game.gameId, x: 2, y: 3, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-7`, () => {
    const data = { gameId: game.gameId, x: 3, y: 3, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-8`, () => {
    const data = { gameId: game.gameId, x: 1, y: 5, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-9`, () => {
    const data = { gameId: game.gameId, x: 2, y: 5, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-10`, () => {
    const data = { gameId: game.gameId, x: 3, y: 5, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-11`, () => {
    const data = { gameId: game.gameId, x: 1, y: 7, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-12`, () => {
    const data = { gameId: game.gameId, x: 2, y: 7, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-13`, () => {
    const data = { gameId: game.gameId, x: 1, y: 9, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-14`, () => {
    const data = { gameId: game.gameId, x: 2, y: 9, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-15`, () => {
    const data = { gameId: game.gameId, x: 6, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-16`, () => {
    const data = { gameId: game.gameId, x: 7, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-17`, () => {
    const data = { gameId: game.gameId, x: 6, y: 3, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-18`, () => {
    const data = { gameId: game.gameId, x: 7, y: 3, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-19`, () => {
    const data = { gameId: game.gameId, x: 8, y: 3, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-20`, () => {
    const data = { gameId: game.gameId, x: 6, y: 5, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-21`, () => {
    const data = { gameId: game.gameId, x: 7, y: 5, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-22`, () => {
    const data = { gameId: game.gameId, x: 8, y: 5, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-23`, () => {
    const data = { gameId: game.gameId, x: 6, y: 7, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-24`, () => {
    const data = { gameId: game.gameId, x: 7, y: 7, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-25`, () => {
    const data = { gameId: game.gameId, x: 8, y: 7, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-26`, () => {
    const data = { gameId: game.gameId, x: 6, y: 9, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-27`, () => {
    const data = { gameId: game.gameId, x: 7, y: 9, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-28`, () => {
    const data = { gameId: game.gameId, x: 8, y: 9, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should game status`, () => {
    return request(server).get('/game/status/' + game.gameId).expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});