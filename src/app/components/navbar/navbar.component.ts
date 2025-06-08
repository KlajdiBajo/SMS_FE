import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

interface NavigationItem {
    name: string;
    href: string;
    icon: string;
}

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [CommonModule, RouterModule, IonicModule]
})
export class NavbarComponent {
    isMenuOpen = signal(false);

    navigation: NavigationItem[] = [
        { name: 'Teachers', href: '/teacher', icon: 'people' },
        { name: 'Students', href: '/student', icon: 'school' },
        { name: 'Courses', href: '/courses', icon: 'book' }
    ];

    toggleMenu() {
        this.isMenuOpen.update(value => !value);
    }

    closeMenu(event: Event) {
        this.isMenuOpen.set(false);
    }

    isActive(href: string): boolean {
        const currentPath = window.location.pathname;
        return currentPath === href || (href === '/teacher' && currentPath === '/');
    }
}