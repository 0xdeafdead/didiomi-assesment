import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConsentChangeDoc = HydratedDocument<ConsentChange>;

@Schema()
export class ConsentChange {
  @Prop({
    type: String,
    name: 'requestedBy',
  })
  requestedBy: string;
  @Prop({
    type: Date,
    name: 'eventTime',
  })
  eventTime: Date;
  @Prop({
    type: String,
    name: 'consents',
  })
  consents: String;
}

export const ConsentSchema = SchemaFactory.createForClass(ConsentChange);
