import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { APP_CONFIG } from '../../../../../../config/app-config.interface';
import { environment } from '../../../../../../environments/environment';
import { DSONameService } from '../../../../../core/breadcrumbs/dso-name.service';
import { LinkService } from '../../../../../core/cache/builders/link.service';
import { Item } from '../../../../../core/shared/item.model';
import { WorkflowItem } from '../../../../../core/submission/models/workflowitem.model';
import { ClaimedTask } from '../../../../../core/tasks/models/claimed-task-object.model';
import { DSONameServiceMock } from '../../../../mocks/dso-name.service.mock';
import { getMockLinkService } from '../../../../mocks/link-service.mock';
import { mockTruncatableService } from '../../../../mocks/mock-trucatable.service';
import { getMockThemeService } from '../../../../mocks/theme-service.mock';
import { ClaimedDeclinedTaskTaskSearchResult } from '../../../../object-collection/shared/claimed-declined-task-task-search-result.model';
import { createSuccessfulRemoteDataObject } from '../../../../remote-data.utils';
import { ThemeService } from '../../../../theme-support/theme.service';
import { TruncatableService } from '../../../../truncatable/truncatable.service';
import { VarDirective } from '../../../../utils/var.directive';
import { ClaimedDeclinedTaskSearchResultListElementComponent } from './claimed-declined-task-search-result-list-element.component';

let component: ClaimedDeclinedTaskSearchResultListElementComponent;
let fixture: ComponentFixture<ClaimedDeclinedTaskSearchResultListElementComponent>;

const mockResultObject: ClaimedDeclinedTaskTaskSearchResult = new ClaimedDeclinedTaskTaskSearchResult();
mockResultObject.hitHighlights = {};

const item = Object.assign(new Item(), {
  bundles: of({}),
  metadata: {
    'dc.title': [
      {
        language: 'en_US',
        value: 'This is just another title',
      },
    ],
    'dc.type': [
      {
        language: null,
        value: 'Article',
      },
    ],
    'dc.contributor.author': [
      {
        language: 'en_US',
        value: 'Smith, Donald',
      },
    ],
    'dc.date.issued': [
      {
        language: null,
        value: '2015-06-26',
      },
    ],
  },
});
const rdItem = createSuccessfulRemoteDataObject(item);
const workflowitem = Object.assign(new WorkflowItem(), { item: of(rdItem) });
const rdWorkflowitem = createSuccessfulRemoteDataObject(workflowitem);
mockResultObject.indexableObject = Object.assign(new ClaimedTask(), { workflowitem: of(rdWorkflowitem) });
const linkService = getMockLinkService();

describe('ClaimedDeclinedTaskSearchResultListElementComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        VarDirective,
        ClaimedDeclinedTaskSearchResultListElementComponent,
      ],
      providers: [
        { provide: TruncatableService, useValue: mockTruncatableService },
        { provide: ThemeService, useValue: getMockThemeService() },
        { provide: LinkService, useValue: linkService },
        { provide: DSONameService, useClass: DSONameServiceMock },
        { provide: APP_CONFIG, useValue: environment },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ClaimedDeclinedTaskSearchResultListElementComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ClaimedDeclinedTaskSearchResultListElementComponent);
    component = fixture.componentInstance;
  }));

  beforeEach(() => {
    component.dso = mockResultObject.indexableObject;
    fixture.detectChanges();
  });

  it('should init workflowitem properly', (done) => {
    component.workflowitemRD$.subscribe((workflowitemRD) => {
      expect(linkService.resolveLinks).toHaveBeenCalledWith(
        component.dso,
        jasmine.objectContaining({ name: 'workflowitem' }),
        jasmine.objectContaining({ name: 'action' }),
      );
      expect(workflowitemRD.payload).toEqual(workflowitem);
      done();
    });
  });

});
