import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, IonicModule]
})
export class SearchBarComponent {
    @Input() placeholder: string = 'Search...';
    @Input() value: string = '';
    @Output() valueChange = new EventEmitter<string>();

    onSearchChange(event: any) {
        this.value = event.target.value;
        this.valueChange.emit(this.value);
    }
} 