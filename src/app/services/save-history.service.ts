import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SaveHistoryService {
  private historyState: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public historyStateExp = this.historyState.asObservable();

  constructor() { }

  toggleStateExp(state: boolean): void {
    this.historyState.next(state);
  }
}
