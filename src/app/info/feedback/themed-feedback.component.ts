import { Component } from '@angular/core';

import { ThemedComponent } from '../../shared/theme-support/themed.component';
import { FeedbackComponent } from './feedback.component';

/**
 * Themed wrapper for FeedbackComponent
 */
@Component({
  selector: 'ds-feedback',
  styleUrls: [],
  templateUrl: '../../shared/theme-support/themed.component.html',
  standalone: true,
  imports: [
    FeedbackComponent,
  ],
})
export class ThemedFeedbackComponent extends ThemedComponent<FeedbackComponent> {
  protected getComponentName(): string {
    return 'FeedbackComponent';
  }

  protected importThemedComponent(themeName: string): Promise<any> {
    return import(`../../../themes/${themeName}/app/info/feedback/feedback.component`);
  }

  protected importUnthemedComponent(): Promise<any> {
    return import(`./feedback.component`);
  }

}
