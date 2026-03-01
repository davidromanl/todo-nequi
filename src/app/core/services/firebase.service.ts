import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { initializeApp } from 'firebase/app';
import {
  getRemoteConfig,
  fetchAndActivate,
  getValue,
  RemoteConfig
} from 'firebase/remote-config';

export interface FeatureFlags {
  enableCategories: boolean;
  enableTaskStats: boolean;
  enableDarkMode: boolean;
}

const DEFAULT_FLAGS: FeatureFlags = {
  enableCategories: true,
  enableTaskStats: false,
  enableDarkMode: false,
};

const firebaseConfig = environment.firebase;

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private remoteConfig!: RemoteConfig;
  private flagsSubject = new BehaviorSubject<FeatureFlags>(DEFAULT_FLAGS);
  flags$ = this.flagsSubject.asObservable();

  async init(): Promise<void> {
    try {
      const app = initializeApp(firebaseConfig);
      this.remoteConfig = getRemoteConfig(app);

      this.remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

      this.remoteConfig.defaultConfig = {
        enable_categories: DEFAULT_FLAGS.enableCategories,
        enable_task_stats: DEFAULT_FLAGS.enableTaskStats,
        enable_dark_mode: DEFAULT_FLAGS.enableDarkMode,
      };

      await fetchAndActivate(this.remoteConfig);
      this.applyFlags();
    } catch (err) {
      console.warn('Firebase Remote Config unavailable, using defaults.', err);
      this.flagsSubject.next(DEFAULT_FLAGS);
    }
  }

  private applyFlags(): void {
    const flags: FeatureFlags = {
      enableCategories: getValue(this.remoteConfig, 'enable_categories').asBoolean(),
      enableTaskStats: getValue(this.remoteConfig, 'enable_task_stats').asBoolean(),
      enableDarkMode: getValue(this.remoteConfig, 'enable_dark_mode').asBoolean(),
    };
    this.flagsSubject.next(flags);
  }

  getFlag(key: keyof FeatureFlags): boolean {
    return this.flagsSubject.getValue()[key];
  }

}
