import { UserService } from './services/user.service';
import { InviteUserService } from './services/invite-user.service';

export const userProviders = [UserService, InviteUserService];
