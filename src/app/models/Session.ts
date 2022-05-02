// import {User} from "./user";
import { Tokens } from './Tokens';
import { cmbService } from './cmbService';
import { User } from './user';

export interface Session {
  user: User;
  tokens: Tokens;
  serviceSelected: cmbService;
}
