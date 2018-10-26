import { JournalIssuePageFieldsComponent } from './journal-issue-page-fields.component';
import { Observable } from 'rxjs/Observable';
import { Item } from '../../../../core/shared/item.model';
import { RemoteData } from '../../../../core/data/remote-data';
import { PaginatedList } from '../../../../core/data/paginated-list';
import { PageInfo } from '../../../../core/shared/page-info.model';
import { getEntityPageFieldsTest } from '../shared/entity-page-fields.component.spec';

const mockItem: Item = Object.assign(new Item(), {
  bitstreams: Observable.of(new RemoteData(false, false, true, null, new PaginatedList(new PageInfo(), []))),
  metadata: [
    {
      key: 'journalissue.identifier.number',
      language: 'en_US',
      value: '1234'
    },
    {
      key: 'journalissue.issuedate',
      language: 'en_US',
      value: '2018'
    },
    {
      key: 'journalissue.identifier.description',
      language: 'en_US',
      value: 'desc'
    },
    {
      key: 'journalissue.identifier.keyword',
      language: 'en_US',
      value: 'keyword'
    }]
});

describe('JournalIssuePageFieldsComponent', getEntityPageFieldsTest(mockItem, JournalIssuePageFieldsComponent));
