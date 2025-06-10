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

      expect(playerSender.status).toBe(EPlayerStatus.Busy);
      expect(playerAvailable.status).toBe(EPlayerStatus.Busy);

      expect(playerSender.match).toBeDefined();
      expect(playerAvailable.match).toBeDefined();
      expect(playerSender.match).toStrictEqual(playerAvailable.match);

      expect(playerSender.match.getPlayers()).toContainEqual(
        playerSender.getPlayerData(),
      );
      expect(playerSender.match.getPlayers()).toContainEqual(
        playerAvailable.getPlayerData(),
      );
      expect(playerSender.match.id).toBe(result.matchId);
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

    it('should not send an invitation if sender player is busy', () => {
      playerListService.addPlayer(
        new Player({ ...PLAYER_AVAILABLE_MOCK_DATA, id: 'new-player-one' }),
      );
      playerListService.addPlayer(
        new Player({ ...PLAYER_AVAILABLE_MOCK_DATA, id: 'new-player-two' }),
      );

      const { matchId } = service.sendMatchRequest(
        playerAvailable,
        'new-player-one',
      );

      expect(() =>
        service.sendMatchRequest(playerAvailable, 'new-player-two'),
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
});
