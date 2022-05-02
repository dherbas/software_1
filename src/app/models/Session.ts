import { User } from 'src/app/models/user';
// import {User} from "./user";
import { Tokens } from './Tokens';
import { cmbService } from './cmbService';

export interface Session {
  user: User;
  tokens: Tokens;
  serviceSelected: cmbService;
}
