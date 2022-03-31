import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { GradeSchema } from '../types';
import BaseController from './base';

export class TitumirInvitationController extends BaseController<GradeSchema> {
  constructor(public supabase: SupabaseClient = supabaseClient) {
    super(supabase, 'invitation');
  }
}
