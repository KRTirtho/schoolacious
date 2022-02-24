import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import {
  PostgrestMaybeSingleResponse,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { UserSchema } from '..';
import BaseController from './base';

export class TitumirUserController extends BaseController<UserSchema> {
  constructor(public supabase: SupabaseClient = supabaseClient) {
    super(supabase, 'user');
  }

  async me(
    user?: User | null
  ): Promise<PostgrestMaybeSingleResponse<UserSchema> | null> {
    user ??= this.supabase.auth.user();
    if (user) return await this.get(user.id);
    return null;
  }
}
