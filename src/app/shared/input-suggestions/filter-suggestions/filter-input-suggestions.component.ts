import {
  AsyncPipe,
  NgClass,
  NgTemplateOutlet,
} from '@angular/common';
import {
  Component,
  forwardRef,
  Input,
} from '@angular/core';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ClickOutsideDirective } from '../../utils/click-outside.directive';
import { DebounceDirective } from '../../utils/debounce.directive';
import { InputSuggestionsComponent } from '../input-suggestions.component';
import { InputSuggestion } from '../input-suggestions.model';

@Component({
  selector: 'ds-filter-input-suggestions',
  styleUrls: ['./../input-suggestions.component.scss'],
  templateUrl: './filter-input-suggestions.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      // Usage of forwardRef necessary https://github.com/angular/angular.io/issues/1151
      // eslint-disable-next-line @angular-eslint/no-forward-ref
      useExisting: forwardRef(() => FilterInputSuggestionsComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    AsyncPipe,
    ClickOutsideDirective,
    DebounceDirective,
    FormsModule,
    NgClass,
    NgTemplateOutlet,
    TranslateModule,
  ],
})

/**
 * Component representing a form with a autocomplete functionality
 */
export class FilterInputSuggestionsComponent extends InputSuggestionsComponent {
  /**
   * The suggestions that should be shown
   */
  @Input() suggestions: InputSuggestion[] = [];

  onSubmit(data) {
    this.value = data;
    this.submitSuggestion.emit(data);
  }

  onClickSuggestion(data: InputSuggestion) {
    this.value = data.value;
    this.clickSuggestion.emit(data);
    this.close();
    this.blockReopen = true;
    this.queryInput.nativeElement.focus();
    return false;
  }
}
