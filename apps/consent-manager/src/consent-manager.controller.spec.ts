import { Test, TestingModule } from '@nestjs/testing';
import { ConsentManagerController } from './consent-manager.controller';
import { ConsentManagerService } from './consent-manager.service';

describe('ConsentManagerController', () => {
  let consentManagerController: ConsentManagerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ConsentManagerController],
      providers: [ConsentManagerService],
    }).compile();

    consentManagerController = app.get<ConsentManagerController>(ConsentManagerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(consentManagerController.getHello()).toBe('Hello World!');
    });
  });
});
