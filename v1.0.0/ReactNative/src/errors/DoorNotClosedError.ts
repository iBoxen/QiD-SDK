import iBoxenError from './iBoxenError';

export default class DoorNotClosedError extends iBoxenError {
  constructor() {
    super('Door is not closed.');
  }
}
