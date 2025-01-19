import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConsentChange } from '../schemas/user_consent.schema';
import { Model } from 'mongoose';
import { EventRegister } from './types';
import { RpcException } from '@nestjs/microservices';
import { randomUUID } from 'crypto';

@Injectable()
export class LogManagerService {
  constructor(
    @InjectModel(ConsentChange.name) private model: Model<ConsentChange>,
  ) {}
  async registerConsentChange(input: EventRegister): Promise<ConsentChange> {
    const data = {
      consents: JSON.stringify(input.data.consents),
      eventTime: input.updatedAt,
      requestedBy: input.requestedBy,
    };
    try {
      const newReg = new this.model(data);
      return newReg.save();
    } catch (err) {
      throw new RpcException(err.message);
    }
  }
}
