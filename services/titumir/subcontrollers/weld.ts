import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { WeldSchema } from '../types';
import BaseController from './base';

export class TitumirWeldController extends BaseController<WeldSchema> {
  constructor(public supabase: SupabaseClient = supabaseClient) {
    super(supabase, 'weld');
  }
}
