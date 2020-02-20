import { InternalServerErrorException } from '@nestjs/common';
import { Exclude } from 'class-transformer';
import * as _ from 'lodash';
import * as mapper from 'object-mapper';
export class BaseDto {
    protected _mapper: object;
    protected _message: string;

    @Exclude()
    public toResponse(model: object): object {
        try {
            return mapper(model, Object.create(this), _.invert(this._mapper));
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }
}
