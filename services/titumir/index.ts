import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { TitumirSchoolController } from './subcontrollers';
import { TitumirUserController } from './subcontrollers/user';

export default class Titumir {
  private _school: TitumirSchoolController;
  private _user: TitumirUserController;
  constructor(public supabase: SupabaseClient = supabaseClient) {
    this._school = new TitumirSchoolController(supabase);
    this._user = new TitumirUserController(supabase);
  }

  get school(): TitumirSchoolController {
    return this._school;
  }
  get user(): TitumirUserController {
    return this._user;
  }
}

export const titumir = new Titumir(supabaseClient);
export * from './types';
