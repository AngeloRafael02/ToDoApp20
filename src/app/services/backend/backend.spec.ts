import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { BackendService } from './backend';
import { taskInterface } from '../../interfaces/task.interface';

describe('BackendService', () => {
  let service: BackendService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        BackendService
      ]
    });
    service = TestBed.inject(BackendService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- GET REQUEST TESTS ---
  it('should fetch dropdown options and return data on success', () => {
    const mockResponse = { status: 'success', data: ['Option 1', 'Option 2'] };
    const option = 'categories';

    service.getDropdownOptions<string[]>(option).subscribe(res => {
      expect(res.status).toBe('success');
      expect(res.data.length).toBe(2);
      expect(res.data).toEqual(['Option 1', 'Option 2']);
    });

    const req = httpMock.expectOne(`/utils/${option}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should handle error in getTableTasks and return fallback data', () => {
    const id = 1;
    const status = 0;

    service.getTableTasks(id, status).subscribe(res => {
      expect(res.status).toBe('error');
      expect(res.data).toEqual([]);
    });

    const req = httpMock.expectOne(`/tasks/all/${status}/${id}`);
    // Simulate a 404 error
    req.flush('Invalid Request', { status: 404, statusText: 'Not Found' });
  });

  // --- POST/PUT/DELETE TESTS ---

  it('should add a new task (POST)', () => {
    const mockTask: taskInterface = { id: 101, title: 'New Task' } as any;

    service.addTask(mockTask).subscribe(res => {
      expect(res).toEqual(mockTask);
    });

    const req = httpMock.expectOne(`/tasks/new`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ task: mockTask });
    req.flush(mockTask);
  });

  it('should delete a task using HttpParams', () => {
    const taskId = 55;

    service.deleteOneTask(taskId).subscribe();

    // Note the trailing slash or exact match based on your service code
    const req = httpMock.expectOne(request =>
      request.url === 'tasks/delete/' && request.params.get('id') === '55'
    );

    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should call finishOneTask with correct body (PUT)', () => {
    const taskId = 12;

    service.finishOneTask(taskId).subscribe();

    const req = httpMock.expectOne(`tasks/finish`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ id: taskId });
    req.flush({ status: 'success' });
  });
});
