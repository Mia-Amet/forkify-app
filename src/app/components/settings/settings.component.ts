import { Component, OnInit } from '@angular/core';
import { SaveHistoryService } from "../../services/save-history.service";
import { MatDialogRef } from "@angular/material";
import { SwitchLanguageService } from "../../services/switch-language.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  historyState: boolean = false;
  currentLanguage: string;
  langs: string[];

  constructor(
    private saveHistoryService: SaveHistoryService,
    public settingsRef: MatDialogRef<SettingsComponent>,
    private switchLanguageService: SwitchLanguageService
  ) { }

  ngOnInit() {
    this.saveHistoryService.historyStateExp.subscribe(res => this.historyState = res);
    this.switchLanguageService.currentLangExp.subscribe(lang => this.currentLanguage = lang);
    this.langs = this.switchLanguageService.getLanguages();
  }

  toggleHistoryState() {
    this.saveHistoryService.toggleStateExp(this.historyState);
  }

  onCloseSettings() {
    this.settingsRef.close();
  }

  switchLanguage(lang: string) {
    this.switchLanguageService.switchLanguage(lang);
  }
}
