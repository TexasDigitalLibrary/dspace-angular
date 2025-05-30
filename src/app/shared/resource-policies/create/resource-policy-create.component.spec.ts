import {
  ChangeDetectorRef,
  Component,
  Injector,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  inject,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  cold,
  getTestScheduler,
} from 'jasmine-marbles';
import { of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

import { LinkService } from '../../../core/cache/builders/link.service';
import { ActionType } from '../../../core/resource-policy/models/action-type.model';
import { PolicyType } from '../../../core/resource-policy/models/policy-type.model';
import { ResourcePolicyDataService } from '../../../core/resource-policy/resource-policy-data.service';
import { Item } from '../../../core/shared/item.model';
import { getMockLinkService } from '../../mocks/link-service.mock';
import { getMockResourcePolicyService } from '../../mocks/mock-resource-policy-service';
import { NotificationsService } from '../../notifications/notifications.service';
import {
  createFailedRemoteDataObject,
  createSuccessfulRemoteDataObject,
  createSuccessfulRemoteDataObject$,
} from '../../remote-data.utils';
import { EPersonMock } from '../../testing/eperson.mock';
import { GroupMock } from '../../testing/group-mock';
import { NotificationsServiceStub } from '../../testing/notifications-service.stub';
import { RouterStub } from '../../testing/router.stub';
import {
  createPaginatedList,
  createTestComponent,
} from '../../testing/utils.test';
import {
  ResourcePolicyEvent,
  ResourcePolicyFormComponent,
} from '../form/resource-policy-form.component';
import { submittedResourcePolicy } from '../form/resource-policy-form.component.spec';
import { ResourcePolicyCreateComponent } from './resource-policy-create.component';

describe('ResourcePolicyCreateComponent test suite', () => {
  let comp: ResourcePolicyCreateComponent;
  let compAsAny: any;
  let fixture: ComponentFixture<ResourcePolicyCreateComponent>;
  let de;
  let scheduler: TestScheduler;
  let eventPayload: ResourcePolicyEvent;

  const resourcePolicy: any = {
    id: '1',
    name: null,
    description: null,
    policyType: PolicyType.TYPE_SUBMISSION,
    action: ActionType.READ,
    startDate: null,
    endDate: null,
    type: 'resourcepolicy',
    uuid: 'resource-policy-1',
    _links: {
      eperson: {
        href: 'https://rest.api/rest/api/eperson',
      },
      group: {
        href: 'https://rest.api/rest/api/group',
      },
      self: {
        href: 'https://rest.api/rest/api/resourcepolicies/1',
      },
    },
    eperson: of(createSuccessfulRemoteDataObject({})),
    group: of(createSuccessfulRemoteDataObject(GroupMock)),
  };

  const item = Object.assign(new Item(), {
    uuid: 'itemUUID',
    id: 'itemUUID',
    metadata: {
      'dc.title': [{
        value: 'test item',
      }],
    },
    _links: {
      self: { href: 'item-selflink' },
    },
    bundles: createSuccessfulRemoteDataObject$(createPaginatedList([])),
  });

  const resourcePolicyService: any = getMockResourcePolicyService();
  const linkService: any = getMockLinkService();
  const routeStub = {
    data: of({
      resourcePolicyTarget: createSuccessfulRemoteDataObject(item),
    }),
  };
  const routerStub = Object.assign(new RouterStub(), {
    url: `url/edit`,
  });

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ResourcePolicyCreateComponent,
        TestComponent,
      ],
      providers: [
        { provide: LinkService, useValue: linkService },
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: NotificationsService, useValue: new NotificationsServiceStub() },
        { provide: ResourcePolicyDataService, useValue: resourcePolicyService },
        { provide: Router, useValue: routerStub },
        ResourcePolicyCreateComponent,
        ChangeDetectorRef,
        Injector,
      ],
      schemas: [
        NO_ERRORS_SCHEMA,
      ],
    })
      .overrideComponent(ResourcePolicyCreateComponent, {
        remove: {
          imports: [ResourcePolicyFormComponent],
        },
      })
      .compileComponents();
  }));

  describe('', () => {
    let testComp: TestComponent;
    let testFixture: ComponentFixture<TestComponent>;

    // synchronous beforeEach
    beforeEach(() => {
      const html = `
        <ds-resource-policy-create></ds-resource-policy-create>`;

      testFixture = createTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;
      testComp = testFixture.componentInstance;
    });

    afterEach(() => {
      testFixture.destroy();
    });

    it('should create ResourcePolicyCreateComponent', inject([ResourcePolicyCreateComponent], (app: ResourcePolicyCreateComponent) => {

      expect(app).toBeDefined();

    }));
  });

  describe('', () => {

    beforeEach(() => {
      // initTestScheduler();
      fixture = TestBed.createComponent(ResourcePolicyCreateComponent);
      comp = fixture.componentInstance;
      compAsAny = fixture.componentInstance;
    });

    afterEach(() => {
      comp = null;
      compAsAny = null;
      de = null;
      fixture.destroy();
    });

    it('should init component properly', (done) => {
      fixture.detectChanges();
      expect(compAsAny.targetResourceUUID).toBe('itemUUID');
      expect(compAsAny.targetResourceName).toBe('test item');
      done();
    });

    it('should redirect to authorizations page', (done) => {
      comp.redirectToAuthorizationsPage();
      expect(compAsAny.router.navigate).toHaveBeenCalled();
      done();
    });

    it('should return true when is Processing', (done) => {
      compAsAny.processing$.next(true);
      expect(comp.isProcessing()).toBeObservable(cold('a', {
        a: true,
      }));
      done();
    });

    it('should return false when is not Processing', (done) => {
      compAsAny.processing$.next(false);
      expect(comp.isProcessing()).toBeObservable(cold('a', {
        a: false,
      }));
      done();
    });

    describe('when target type is group', () => {
      beforeEach(() => {
        spyOn(comp, 'redirectToAuthorizationsPage').and.callThrough();

        compAsAny.targetResourceUUID = 'itemUUID';

        eventPayload = Object.create({});
        eventPayload.object = submittedResourcePolicy;
        eventPayload.target = {
          type: 'group',
          uuid: GroupMock.id,
        };
      });

      it('should notify success when creation is successful', () => {
        compAsAny.resourcePolicyService.create.and.returnValue(of(createSuccessfulRemoteDataObject(resourcePolicy)));

        scheduler = getTestScheduler();
        scheduler.schedule(() => comp.createResourcePolicy(eventPayload));
        scheduler.flush();

        expect(compAsAny.resourcePolicyService.create).toHaveBeenCalledWith(eventPayload.object, 'itemUUID', null, eventPayload.target.uuid);
        expect(comp.redirectToAuthorizationsPage).toHaveBeenCalled();
      });

      it('should notify error when creation is not successful', () => {
        compAsAny.resourcePolicyService.create.and.returnValue(of(createFailedRemoteDataObject()));

        scheduler = getTestScheduler();
        scheduler.schedule(() => comp.createResourcePolicy(eventPayload));
        scheduler.flush();

        expect(compAsAny.resourcePolicyService.create).toHaveBeenCalledWith(eventPayload.object, 'itemUUID', null, eventPayload.target.uuid);
        expect(comp.redirectToAuthorizationsPage).not.toHaveBeenCalled();
      });
    });

    describe('when target type of created policy is eperson', () => {

      beforeEach(() => {
        spyOn(comp, 'redirectToAuthorizationsPage').and.callThrough();

        compAsAny.targetResourceUUID = 'itemUUID';

        eventPayload = Object.create({});
        eventPayload.object = submittedResourcePolicy;
        eventPayload.target = {
          type: 'eperson',
          uuid: EPersonMock.id,
        };
      });

      it('should notify success when creation is successful', () => {
        compAsAny.resourcePolicyService.create.and.returnValue(of(createSuccessfulRemoteDataObject(resourcePolicy)));

        scheduler = getTestScheduler();
        scheduler.schedule(() => comp.createResourcePolicy(eventPayload));
        scheduler.flush();

        expect(compAsAny.resourcePolicyService.create).toHaveBeenCalledWith(eventPayload.object, 'itemUUID', eventPayload.target.uuid);
        expect(comp.redirectToAuthorizationsPage).toHaveBeenCalled();
      });

      it('should notify error when creation is not successful', () => {
        compAsAny.resourcePolicyService.create.and.returnValue(of(createFailedRemoteDataObject()));

        scheduler = getTestScheduler();
        scheduler.schedule(() => comp.createResourcePolicy(eventPayload));
        scheduler.flush();

        expect(compAsAny.resourcePolicyService.create).toHaveBeenCalledWith(eventPayload.object, 'itemUUID', eventPayload.target.uuid);
        expect(comp.redirectToAuthorizationsPage).not.toHaveBeenCalled();
      });
    });
  });

});

// declare a test component
@Component({
  selector: 'ds-test-cmp',
  template: ``,
  standalone: true,
})
class TestComponent {

}
