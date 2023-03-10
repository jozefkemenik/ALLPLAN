import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDocumentsComponent} from './documents.component';

describe('DocumentsComponent', () => {
  let component: ProjectDocumentsComponent;
  let fixture: ComponentFixture<ProjectDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDocumentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
