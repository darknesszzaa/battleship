import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../app.module';



describe('Test scenarios', () => {
  let game;
  let server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    server = app.getHttpServer();
    await app.init();
  });

  it(`should create new game session`, () => {
    return request(server).post('/game/new-game').expect(201).expect(({ body }) => { game = body; });
  });

  it(`should get game status`, () => {
    return request(server).get('/game/status/' + game.gameId).expect(200);
  });

  it(`should updated battleship defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[0].shipId, x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should error 400 with updated Cruiser-1 because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[1].shipId, x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Cruiser-1 because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[1].shipId, x: 2, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Cruiser-1 because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[1].shipId, x: 10, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Cruiser-1 because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[1].shipId, x: 1, y: 10, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should updated Cruiser-1 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[1].shipId, x: 1, y: 3, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Cruiser-2 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[2].shipId, x: 2, y: 5, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Destroyer-1 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[3].shipId, x: 1, y: 7, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Destroyer-2 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[4].shipId, x: 1, y: 9, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Destroyer-3 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[5].shipId, x: 6, y: 1, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should error 400 with updated Submarine-1 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[6].shipId, x: 7, y: 1, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Submarine-1 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[6].shipId, x: 7, y: 2, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Submarine-1 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[6].shipId, x: 5, y: 1, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Submarine-1 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[6].shipId, x: 5, y: 2, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should updated Submarine-1 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[6].shipId, x: 8, y: 1, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated Submarine-2 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[7].shipId, x: 10, y: 1, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should error 400 with updated Submarine-3 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[8].shipId, x: 2, y: 5, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Submarine-3 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[8].shipId, x: 5, y: 4, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Submarine-3 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[8].shipId, x: 2, y: 6, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Submarine-3 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[8].shipId, x: 5, y: 6, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should updated Submarine-3 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[8].shipId, x: 6, y: 8, rotate: 2 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should error 400 with confirm defender ship placement because need to place all ship before confirmed`, () => {
    const data = { gameId: game.gameId };
    return request(server).put('/game/confirm-ship-placement').send(data).expect(400);
  });

  it(`should error 400 with  updated Submarine-4 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[9].shipId, x: 7, y: 7, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with  updated Submarine-4 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[9].shipId, x: 7, y: 10, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with  updated Submarine-4 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[9].shipId, x: 5, y: 7, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 with  updated Submarine-4 defender ship placement because location is already occupy`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[9].shipId, x: 5, y: 10, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should updated Submarine-4 defender ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[9].shipId, x: 7, y: 6, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(200);
  });

  it(`should updated confirm defender ship placement`, () => {
    const data = { gameId: game.gameId };
    return request(server).put('/game/confirm-ship-placement').send(data).expect(200);
  });

  it(`should error 400 with confirm defender ship placement because already confirm`, () => {
    const data = { gameId: game.gameId };
    return request(server).put('/game/confirm-ship-placement').send(data).expect(400);
  });

  it(`should error 400 with updated Cruiser-1 because Can\'t move after confirmed ship placement`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[1].shipId, x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should updated attack-1`, () => {
    const data = { gameId: game.gameId, x: 1, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should error 400 with updated attack-1 because attack same older location`, () => {
    const data = { gameId: game.gameId, x: 1, y: 1, };
    return request(server).put('/game/attack').send(data).expect(400);
  });

  it(`should error 404 with updated attack-1 because wrong game id`, () => {
    const data = { gameId: '1234', x: 1, y: 1 };
    return request(server).put('/game/attack').send(data).expect(404);
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
    const data = { gameId: game.gameId, x: 2, y: 5, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-9`, () => {
    const data = { gameId: game.gameId, x: 3, y: 5, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-10`, () => {
    const data = { gameId: game.gameId, x: 4, y: 5, };
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
    const data = { gameId: game.gameId, x: 6, y: 2, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-17`, () => {
    const data = { gameId: game.gameId, x: 8, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-18`, () => {
    const data = { gameId: game.gameId, x: 8, y: 2, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-19`, () => {
    const data = { gameId: game.gameId, x: 8, y: 3, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-20`, () => {
    const data = { gameId: game.gameId, x: 10, y: 1, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-21`, () => {
    const data = { gameId: game.gameId, x: 10, y: 2, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-22`, () => {
    const data = { gameId: game.gameId, x: 10, y: 3, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-23`, () => {
    const data = { gameId: game.gameId, x: 6, y: 8, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-24`, async () => {
    const data = { gameId: game.gameId, x: 6, y: 9, };
    const response = await request(server).put('/game/attack').send(data).expect(200);
    const expectedString = 'Hit';
    expect(response.body.message).toEqual(expectedString);
  });

  it(`should updated attack-25`, async () => {
    const data = { gameId: game.gameId, x: 6, y: 10, };
    const response = await request(server).put('/game/attack').send(data).expect(200);
    const expectedString = 'You just sank a Submarine';
    expect(response.body.message).toEqual(expectedString);
  });

  it(`should updated attack-26`, () => {
    const data = { gameId: game.gameId, x: 7, y: 6, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-27`, () => {
    const data = { gameId: game.gameId, x: 8, y: 6, };
    return request(server).put('/game/attack').send(data).expect(200);
  });

  it(`should updated attack-28 miss`, async () => {
    const data = { gameId: game.gameId, x: 10, y: 10, };
    const response = await request(server).put('/game/attack').send(data).expect(200);
    const expectedString = 'Miss';
    expect(response.body.message).toEqual(expectedString);
  });

  it(`should updated attack-29`, async () => {
    const data = { gameId: game.gameId, x: 9, y: 6, };
    const response = await request(server).put('/game/attack').send(data).expect(200);
    const expectedString = 'Win! You have completed the game in 29 moves';
    expect(response.body.message).toEqual(expectedString);
  });

  it(`should get game status`, () => {
    return request(server).get('/game/status/' + game.gameId).expect(200);
  });

  it(`should error 400 with updated attack-30 because game is ended`, () => {
    const data = { gameId: game.gameId, x: 8, y: 9, };
    return request(server).put('/game/attack').send(data).expect(400);
  });

  it(`should error 400 with updated battleship defender ship placement because game is ended`, () => {
    const data = { gameId: game.gameId, shipId: game.ship[0].shipId, x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 400 confirm defender ship placement because game is ended`, () => {
    const data = { gameId: game.gameId };
    return request(server).put('/game/confirm-ship-placement').send(data).expect(400);
  });

  afterEach(async () => {
    await app.close();
  });
});


describe('Test error', () => {
  let game;
  let server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    server = app.getHttpServer();
    await app.init();
  });

  it(`should create new game session`, () => {
    return request(server).post('/game/new-game').expect(201).expect(({ body }) => { game = body; });
  });

  it(`should error 400 with updated ship placement because invalid dto`, () => {
    const data = { test: "test" };
    return request(server).put('/game/ship-placement').send(data).expect(400);
  });

  it(`should error 404 with updated ship placement because wrong game id`, () => {
    const data = { gameId: '1234', shipId: game.ship[0].shipId, x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(404);
  });

  it(`should error 404 with updated ship placement because wrong ship id`, () => {
    const data = { gameId: game.gameId, shipId: '1234', x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(404);
  });

  it(`should error 404 with updated ship placement because wrong ship id`, () => {
    const data = { gameId: game.gameId, shipId: '5e4ffeaba8c886016c9a05fb', x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(404);
  });

  it(`should error 404 with updated ship placement because wrong game id`, () => {
    const data = { gameId: '5e4ffeaba8c886016c9a05fb', shipId: game.ship[0].shipId, x: 1, y: 1, rotate: 1 };
    return request(server).put('/game/ship-placement').send(data).expect(404);
  });

  it(`should error 400 with confirm defender ship placement because invalid dto`, () => {
    const data = {};
    return request(server).put('/game/confirm-ship-placement').send(data).expect(400);
  });

  it(`should error 400 with confirm defender ship placement but still not complete all ship placement`, () => {
    const data = { gameId: game.gameId };
    return request(server).put('/game/confirm-ship-placement').send(data).expect(400);
  });

  it(`should error 404 with confirm defender ship placement because wrong game id`, () => {
    const data = { gameId: '1234' };
    return request(server).put('/game/confirm-ship-placement').send(data).expect(404);
  });

  it(`should error 404 with confirm defender ship placement because wrong game id`, () => {
    const data = { gameId: '5e4ffeaba8c886016c9a05fb' };
    return request(server).put('/game/confirm-ship-placement').send(data).expect(404);
  });

  it(`should error 400 with updated attack-1 because invalid dto`, () => {
    const data = {};
    return request(server).put('/game/attack').send(data).expect(400);
  });

  it(`should error 400 with updated attack-1 because not confirm defender ship placement`, () => {
    const data = { gameId: game.gameId, x: 1, y: 1 };
    return request(server).put('/game/attack').send(data).expect(400);
  });

  it(`should error 404 with updated attack-1 because wrong game id`, () => {
    const data = { gameId: '1234', x: 1, y: 1 };
    return request(server).put('/game/attack').send(data).expect(404);
  });

  it(`should error 404 with updated attack-1 because wrong game id`, () => {
    const data = { gameId: '5e4ffeaba8c886016c9a05fb', x: 1, y: 1 };
    return request(server).put('/game/attack').send(data).expect(404);
  });

  it(`should error 404 with get game status because wrong game id`, () => {
    return request(server).get('/game/status/' + '1234').expect(404);
  });

  it(`should error 404 with get game status because wrong game id`, () => {
    return request(server).get('/game/status/' + '5e4ffeaba8c886016c9a05fb').expect(404);
  });

  afterEach(async () => {
    await app.close();
  });
});

