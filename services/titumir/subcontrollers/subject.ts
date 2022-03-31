import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { SubjectSchema } from '../types';
import BaseController from './base';

export class TitumirSubjectController extends BaseController<SubjectSchema> {
  constructor(public supabase: SupabaseClient = supabaseClient) {
    super(supabase, 'subject');
  }
}
