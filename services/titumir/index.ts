import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs';
import { SupabaseClient } from '@supabase/supabase-js';
import { TitumirSchoolController } from './subcontrollers';
import { TitumirGradeController } from './subcontrollers/grade';
import { TitumirPeriodController } from './subcontrollers/period';
import { TitumirSectionController } from './subcontrollers/section';
import { TitumirUserController } from './subcontrollers/user';

export default class Titumir {
  private _school: TitumirSchoolController;
  private _user: TitumirUserController;
  private _grade: TitumirGradeController;
  private _section: TitumirSectionController;
  private _period: TitumirPeriodController;
  constructor(public supabase: SupabaseClient = supabaseClient) {
    this._school = new TitumirSchoolController(supabase);
    this._user = new TitumirUserController(supabase);
    this._grade = new TitumirGradeController(supabase);
    this._section = new TitumirSectionController(supabase);
    this._period = new TitumirPeriodController(supabase);
  }

  get school(): TitumirSchoolController {
    return this._school;
  }
  get user(): TitumirUserController {
    return this._user;
  }

  get grade(): TitumirGradeController {
    return this._grade;
  }
  get section(): TitumirSectionController {
    return this._section;
  }
  get period(): TitumirPeriodController {
    return this._period;
  }
}

export const titumir = new Titumir(supabaseClient);
export * from './types';
