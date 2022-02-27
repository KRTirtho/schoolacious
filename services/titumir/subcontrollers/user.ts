import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import {
  PostgrestMaybeSingleResponse,
  SupabaseClient,
  User,
} from '@supabase/supabase-js';
import { SchoolSchema, UserSchema } from '..';
import BaseController from './base';

export type SchoolAssociatedUserSchema = Omit<UserSchema, 'school_id'> & {
  school?: SchoolSchema | null;
};

export class TitumirUserController extends BaseController<UserSchema> {
  constructor(public supabase: SupabaseClient = supabaseClient) {
    super(supabase, 'user');
  }

  async me(
    user?: User | null
  ): Promise<PostgrestMaybeSingleResponse<SchoolAssociatedUserSchema> | null> {
    user ??= this.supabase.auth.user();
    if (user) {
      const response = await this.get(user.id, {
        columns: '*, school(*)',
      });
      if (response.error) throw response;
      return response;
    }
    return Promise.reject(null);
  }
}
