/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RevisionService } from './revision.service';

describe('Service: Revision', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevisionService]
    });
  });

  it('should ...', inject([RevisionService], (service: RevisionService) => {
    expect(service).toBeTruthy();
  }));
});
