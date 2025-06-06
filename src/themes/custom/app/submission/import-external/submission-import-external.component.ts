import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AlertComponent } from '../../../../../app/shared/alert/alert.component';
import { fadeIn } from '../../../../../app/shared/animations/fade';
import { ThemedLoadingComponent } from '../../../../../app/shared/loading/themed-loading.component';
import { ObjectCollectionComponent } from '../../../../../app/shared/object-collection/object-collection.component';
import { VarDirective } from '../../../../../app/shared/utils/var.directive';
import { SubmissionImportExternalSearchbarComponent } from '../../../../../app/submission/import-external/import-external-searchbar/submission-import-external-searchbar.component';
import { SubmissionImportExternalComponent as BaseComponent } from '../../../../../app/submission/import-external/submission-import-external.component';

@Component({
  selector: 'ds-themed-submission-import-external',
  // styleUrls: ['./submission-import-external.component.scss'],
  styleUrls: ['../../../../../app/submission/import-external/submission-import-external.component.scss'],
  // templateUrl: './submission-import-external.component.html',
  templateUrl: '../../../../../app/submission/import-external/submission-import-external.component.html',
  animations: [fadeIn],
  standalone: true,
  imports: [
    AlertComponent,
    AsyncPipe,
    ObjectCollectionComponent,
    RouterLink,
    SubmissionImportExternalSearchbarComponent,
    ThemedLoadingComponent,
    TranslateModule,
    VarDirective,
  ],
})
export class SubmissionImportExternalComponent extends BaseComponent {
}
