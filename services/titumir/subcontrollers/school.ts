import {
  SupabaseClient,
  supabaseClient,
} from '@supabase/supabase-auth-helpers/nextjs';
import { SchoolSchema } from '../types';
import BaseController from './base';

export class TitumirSchoolController extends BaseController<SchoolSchema> {
  constructor(public supabase: SupabaseClient = supabaseClient) {
    super(supabase, 'school');
  }
}
