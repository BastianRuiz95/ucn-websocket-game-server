import { Test } from '@nestjs/testing';

import { PlayerListService } from '../../player-list/player-list.service';
import { MatchmakingService } from '../matchmaking.service';

import { GameException } from '../../config/game.exception';

import { EPlayerStatus } from '../../common/enums';
import { Player } from '../../common/entities';

import {
  PLAYER_AVAILABLE_MOCK_DATA,
  PLAYER_BUSY_MOCK_DATA,
  PLAYER_IN_MATCH_MOCK_DATA,
  PLAYER_SENDER_MOCK_DATA,
} from './matchmaking.service.mocks';

describe('#MatchmakingService', () => {
  let playerListService: PlayerListService;
  let service: MatchmakingService;

  let playerAvailable: Player;
  let playerBusy: Player;
  let playerInMatch: Player;
  let playerSender: Player;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PlayerListService, MatchmakingService],
    }).compile();

    playerListService = module.get(PlayerListService);
    service = module.get(MatchmakingService);

    playerAvailable = new Player(PLAYER_AVAILABLE_MOCK_DATA);
    playerBusy = new Player(PLAYER_BUSY_MOCK_DATA);
    playerInMatch = new Player(PLAYER_IN_MATCH_MOCK_DATA);
    playerSender = new Player(PLAYER_SENDER_MOCK_DATA);

    playerListService.addPlayer(playerAvailable);
    playerListService.addPlayer(playerBusy);
    playerListService.addPlayer(playerInMatch);
  });

  it('should be defined', () => {
    expect(playerListService).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('#sendMatchRequest', () => {
    it('should send an invitation, changing the state for both players to busy and assign a match', () => {
      const result = service.sendMatchRequest(playerSender, playerAvailable.id);

      expect(result).toBeDefined();

      expect(playerSender).toHaveProperty('status', EPlayerStatus.Busy);
      expect(playerAvailable).toHaveProperty('status', EPlayerStatus.Busy);

      expect(playerSender.match).toBeDefined();
      expect(playerAvailable.match).toBeDefined();
      expect(playerSender.match).toStrictEqual(playerAvailable.match);

      expect(playerSender.match.getPlayers()).toContainEqual(
        playerSender.getPlayerData(),
      );
      expect(playerSender.match.getPlayers()).toContainEqual(
        playerAvailable.getPlayerData(),
      );
      expect(playerSender.match).toHaveProperty('id', result.matchId);
    });

    it('should not send an invitation if destination player is busy or in match', () => {
      [playerBusy, playerInMatch].forEach((p) => {
        expect(() => service.sendMatchRequest(playerSender, p.id)).toThrow(
          GameException,
        );

        expect(playerSender.status).toBe(EPlayerStatus.Available);
        expect(playerSender.match).not.toBeDefined();
      });
    });

    it('should not send an invitation if player has a pending match request (received or sent)', () => {
      const playerMatchReceived = new Player({
        ...PLAYER_AVAILABLE_MOCK_DATA,
        id: 'new-player-one',
      });
      playerListService.addPlayer(playerMatchReceived);
      playerListService.addPlayer(
        new Player({ ...PLAYER_AVAILABLE_MOCK_DATA, id: 'new-player-two' }),
      );

      const { matchId } = service.sendMatchRequest(
        playerAvailable,
        playerMatchReceived.id,
      );

      expect(() =>
        service.sendMatchRequest(playerAvailable, 'new-player-two'),
      ).toThrow(GameException);

      expect(() =>
        service.sendMatchRequest(playerMatchReceived, playerAvailable.id),
      ).toThrow(GameException);

      expect(playerAvailable.status).toBe(EPlayerStatus.Busy);
      expect(playerAvailable.match).toBeDefined();
      expect(playerAvailable.match.id).toBe(matchId);
    });

    it('should not send an invitation to himself', () => {
      expect(() =>
        service.sendMatchRequest(playerAvailable, playerAvailable.id),
      ).toThrow(GameException);
    });
  });

  describe('#cancelMatchRequest', () => {
    it('should cancel the match if it has not started yet', () => {
      service.sendMatchRequest(playerSender, playerAvailable.id);

      const result = service.cancelMatchRequest(playerSender);

      expect(result).toBeDefined();

      expect(playerSender).toHaveProperty('status', EPlayerStatus.Available);
      expect(playerAvailable).toHaveProperty('status', EPlayerStatus.Available);

      expect(playerSender).toHaveProperty('match', null);
      expect(playerAvailable).toHaveProperty('match', null);
    });

    it('should not cancel the match if this not exists', () => {
      expect(() => service.cancelMatchRequest(playerSender)).toThrow(
        GameException,
      );
    });

    it('should not cancel the match if the destinator calls the event', () => {
      service.sendMatchRequest(playerSender, playerAvailable.id);
      expect(() => service.cancelMatchRequest(playerAvailable)).toThrow(
        GameException,
      );
    });

    // TODO: it('should throw an error if both players had accepted the match', () => {
    //   expect(() => service.cancelMatchRequest());
    // });
  });

  describe('#rejectMatchRequest', () => {
    it('should reject the match if it has not started yet', () => {
      service.sendMatchRequest(playerSender, playerAvailable.id);

      const result = service.rejectMatchRequest(playerAvailable);

      expect(result).toBeDefined();

      expect(playerSender).toHaveProperty('status', EPlayerStatus.Available);
      expect(playerAvailable).toHaveProperty('status', EPlayerStatus.Available);

      expect(playerSender).toHaveProperty('match', null);
      expect(playerAvailable).toHaveProperty('match', null);
    });

    it('should not reject the match if this not exists', () => {
      expect(() => service.rejectMatchRequest(playerAvailable)).toThrow(
        GameException,
      );
    });

    it('should not reject the match if the destinator calls the event', () => {
      service.sendMatchRequest(playerSender, playerAvailable.id);
      expect(() => service.rejectMatchRequest(playerSender)).toThrow(
        GameException,
      );
    });

    // TODO: it('should throw an error if both players had accepted the match', () => {
    //   expect(() => service.rejectMatchRequest());
    // });
  });
});
