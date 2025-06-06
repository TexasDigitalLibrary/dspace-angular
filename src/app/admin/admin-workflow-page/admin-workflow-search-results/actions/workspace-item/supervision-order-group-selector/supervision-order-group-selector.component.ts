
import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { getFirstCompletedRemoteData } from 'src/app/core/shared/operators';
import { NotificationsService } from 'src/app/shared/notifications/notifications.service';

import { DSONameService } from '../../../../../../core/breadcrumbs/dso-name.service';
import { RemoteData } from '../../../../../../core/data/remote-data';
import { RequestEntryState } from '../../../../../../core/data/request-entry-state.model';
import { Group } from '../../../../../../core/eperson/models/group.model';
import { SupervisionOrder } from '../../../../../../core/supervision-order/models/supervision-order.model';
import { SupervisionOrderDataService } from '../../../../../../core/supervision-order/supervision-order-data.service';
import { EpersonGroupListComponent } from '../../../../../../shared/eperson-group-list/eperson-group-list.component';
import { ErrorComponent } from '../../../../../../shared/error/error.component';

/**
 * Component to wrap a dropdown - for type of order -
 * and a list of groups
 * inside a modal
 * Used to create a new supervision order
 */

@Component({
  selector: 'ds-supervision-group-selector',
  styleUrls: ['./supervision-order-group-selector.component.scss'],
  templateUrl: './supervision-order-group-selector.component.html',
  standalone: true,
  imports: [
    EpersonGroupListComponent,
    ErrorComponent,
    FormsModule,
    TranslateModule,
  ],
})
export class SupervisionOrderGroupSelectorComponent {

  /**
   * The item to perform the actions on
   */
  itemUUID: string;

  /**
   * The selected supervision order type
   */
  selectedOrderType: string;

  /**
   * selected group for supervision
   */
  selectedGroup: Group;

  /**
   * boolean flag for the validations
   */
  isSubmitted = false;

  /**
   * Event emitted when a new SupervisionOrder has been created
   */
  @Output() create: EventEmitter<SupervisionOrder> = new EventEmitter<SupervisionOrder>();

  constructor(
    public dsoNameService: DSONameService,
    private activeModal: NgbActiveModal,
    private supervisionOrderDataService: SupervisionOrderDataService,
    protected notificationsService: NotificationsService,
    protected translateService: TranslateService,
  ) { }

  /**
   * Close the modal
   */
  close() {
    this.activeModal.close();
  }

  /**
   * Assign the value of group on select
   */
  updateGroupObjectSelected(object) {
    this.selectedGroup = object;
  }

  /**
   * Save the supervision order
   */
  save() {
    this.isSubmitted = true;
    if (this.selectedOrderType && this.selectedGroup) {
      const supervisionDataObject = new SupervisionOrder();
      supervisionDataObject.ordertype = this.selectedOrderType;
      this.supervisionOrderDataService.create(supervisionDataObject, this.itemUUID, this.selectedGroup.uuid, this.selectedOrderType).pipe(
        getFirstCompletedRemoteData(),
      ).subscribe((rd: RemoteData<SupervisionOrder>) => {
        if (rd.state === RequestEntryState.Success) {
          this.notificationsService.success(this.translateService.get('supervision-group-selector.notification.create.success.title', { name: this.dsoNameService.getName(this.selectedGroup) }));
          this.create.emit(rd.payload);
          this.close();
        } else {
          this.notificationsService.error(
            this.translateService.get('supervision-group-selector.notification.create.failure.title'),
            rd.statusCode === 422 ? this.translateService.get('supervision-group-selector.notification.create.already-existing') : rd.errorMessage);
        }
      });
    }
  }

}
